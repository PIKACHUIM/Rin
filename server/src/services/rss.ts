import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import type { AppContext } from "../core/hono-types";
import { profileAsync } from "../core/server-timing";
import { feeds, users } from "../db/schema";
import { extractImage } from "../utils/image";
import { path_join } from "../utils/path";
import { getStoragePublicUrl, headStorageObject } from "../utils/storage";
import { FAVICON_ALLOWED_TYPES, getFaviconKey } from "./favicon";
import type { DB } from "../core/hono-types";

// Lazy-loaded modules for RSS generation
let Feed: any;
let unified: any;
let remarkParse: any;
let remarkGfm: any;
let remarkRehype: any;
let rehypeStringify: any;

async function initRSSModules() {
    if (!Feed) {
        const feed = await import("feed");
        Feed = feed.Feed;
    }
    if (!unified) {
        const unifiedMod = await import("unified");
        const remarkParseMod = await import("remark-parse");
        const remarkGfmMod = await import("remark-gfm");
        const remarkRehypeMod = await import("remark-rehype");
        const rehypeStringifyMod = await import("rehype-stringify");
        
        unified = unifiedMod.unified;
        remarkParse = remarkParseMod.default;
        remarkGfm = remarkGfmMod.default;
        remarkRehype = remarkRehypeMod.default;
        rehypeStringify = rehypeStringifyMod.default;
    }
}

export function RSSService(): Hono {
    const app = new Hono();

    // GET /rss.xml
    app.get('/rss.xml', async (c: AppContext) => {
        return handleFeed(c, 'rss.xml');
    });

    // GET /atom.xml
    app.get('/atom.xml', async (c: AppContext) => {
        return handleFeed(c, 'atom.xml');
    });

    // GET /rss.json
    app.get('/rss.json', async (c: AppContext) => {
        return handleFeed(c, 'rss.json');
    });

    // GET /feed.json
    app.get('/feed.json', async (c: AppContext) => {
        return handleFeed(c, 'feed.json');
    });

    // Support legacy feed.xml - redirect to rss.xml
    app.get('/feed.xml', async (c: AppContext) => {
        return c.redirect('/rss.xml', 301);
    });

    return app;
}

async function handleFeed(c: AppContext, fileName: string) {
    const env = c.get('env');
    const db = c.get('db');

    // Map file extensions to proper MIME types
    const contentTypeMap: Record<string, string> = {
        'rss.xml': 'application/rss+xml; charset=UTF-8',
        'atom.xml': 'application/atom+xml; charset=UTF-8',
        'rss.json': 'application/feed+json; charset=UTF-8',
        'feed.json': 'application/feed+json; charset=UTF-8',
    };
    const contentType = contentTypeMap[fileName] || 'application/xml';

    // 不再使用共享存储缓存：缓存没有 host 维度，会串域名。
    // 始终按当前请求的 origin 生成，多域名部署各自正确。
    try {
        const frontendUrl = new URL(c.req.url).origin;
        const feed = await profileAsync(c, 'rss_generate_feed', () => generateFeed(env, db, frontendUrl, c));
        
        let content: string;
        switch (fileName) {
            case 'rss.xml':
                content = await profileAsync(c, 'rss_render_rss2', () => Promise.resolve(feed.rss2()));
                break;
            case 'atom.xml':
                content = await profileAsync(c, 'rss_render_atom', () => Promise.resolve(feed.atom1()));
                break;
            case 'rss.json':
            case 'feed.json':
                content = await profileAsync(c, 'rss_render_json', () => Promise.resolve(feed.json1()));
                break;
            default:
                content = await profileAsync(c, 'rss_render_default', () => Promise.resolve(feed.rss2()));
        }
        
        return c.text(content, 200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=300', // Shorter cache for real-time
        });
    } catch (genError: any) {
        console.error('[RSS] Generation failed:', genError);
        return c.text(`RSS generation failed: ${genError.message}`, 500);
    }
}

// Extract feed generation logic for reuse
async function generateFeed(env: Env, db: DB, frontendUrl: string, c?: AppContext) {
    if (c) {
        await profileAsync(c, 'rss_init_modules', () => initRSSModules());
    } else {
        await initRSSModules();
    }
    const faviconKey = getFaviconKey(env);
    const publicBaseUrl = frontendUrl || undefined;

    let feedConfig: any = {
        title: env.RSS_TITLE,
        description: env.RSS_DESCRIPTION || "Feed from Rin",
        id: frontendUrl,
        link: frontendUrl,
        copyright: "All rights reserved 2024",
        updated: new Date(),
        generator: "Feed from Rin",
        feedLinks: {
            // Native RSS support - feeds are now served from root path
            rss: `${frontendUrl}/rss.xml`,
            json: `${frontendUrl}/rss.json`,
            atom: `${frontendUrl}/atom.xml`,
        },
    };

    if (!feedConfig.title) {
        const user = c
            ? await profileAsync(c, 'rss_user_lookup', () => db.query.users.findFirst({ where: eq(users.id, 1) }))
            : await db.query.users.findFirst({ where: eq(users.id, 1) });
        if (user) {
            feedConfig.title = user.username;
        }
    }

    // Try to discover stored favicon assets.
    for (const [_mimeType, ext] of Object.entries(FAVICON_ALLOWED_TYPES)) {
        const originFaviconKey = path_join(env.S3_FOLDER || "", `originFavicon${ext}`);
        try {
            const response = c
                ? await profileAsync(c, 'rss_origin_favicon_fetch', () => headStorageObject(env, originFaviconKey))
                : await headStorageObject(env, originFaviconKey);
            if (response) {
                feedConfig.image = getStoragePublicUrl(env, originFaviconKey, publicBaseUrl);
                break;
            }
        } catch (error) {
            continue;
        }
    }

    try {
        const response = c
            ? await profileAsync(c, 'rss_favicon_fetch', () => headStorageObject(env, faviconKey))
            : await headStorageObject(env, faviconKey);
        if (response) {
            feedConfig.favicon = getStoragePublicUrl(env, faviconKey, publicBaseUrl);
        }
    } catch (error) { }

    const feed = new Feed(feedConfig);

    // Get published feeds
    const feed_list = c
        ? await profileAsync(c, 'rss_feed_list', () => db.query.feeds.findMany({
            where: and(eq(feeds.draft, 0), eq(feeds.listed, 1)),
            orderBy: [desc(feeds.createdAt), desc(feeds.updatedAt)],
            limit: 20,
            with: {
                user: { columns: { id: true, username: true, avatar: true } },
            },
        }))
        : await db.query.feeds.findMany({
        where: and(eq(feeds.draft, 0), eq(feeds.listed, 1)),
        orderBy: [desc(feeds.createdAt), desc(feeds.updatedAt)],
        limit: 20,
        with: {
            user: { columns: { id: true, username: true, avatar: true } },
        },
    });

    for (const f of feed_list) {
        const { summary, content, user, ...other } = f;
        
        // Convert markdown to HTML
        let contentHtml = '';
        if (content) {
            try {
                const file = await unified()
                    .use(remarkParse)
                    .use(remarkGfm)
                    .use(remarkRehype)
                    .use(rehypeStringify)
                    .process(content);
                contentHtml = file.toString();
            } catch (e) {
                console.error('[RSS] Markdown conversion error:', e);
                contentHtml = content;
            }
        }

        feed.addItem({
            title: other.title || "No title",
            id: other.id?.toString() || "0",
            link: `${frontendUrl}/feed/${other.id}`,
            date: other.createdAt,
            description: summary.length > 0
                ? summary
                : content.length > 100
                    ? content.slice(0, 100)
                    : content,
            content: contentHtml,
            author: user ? [{ name: user.username }] : undefined,
            image: extractImage(content),
        });
    }
    
    return feed;
}
