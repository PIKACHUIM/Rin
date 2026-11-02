import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { RSSService } from '../rss';
import { Hono } from "hono";
import type { Variables } from "../../core/hono-types";
import { createMockEnv, setupTestApp, cleanupTestDB } from '../../../tests/fixtures';
import type { Database } from 'bun:sqlite';

describe('RSSService', () => {
    let db: any;
    let sqlite: Database;
    let env: Env;
    let app: Hono<{ Bindings: Env; Variables: Variables }>;

    beforeEach(async () => {
        const ctx = await setupTestApp(RSSService);
        db = ctx.db;
        sqlite = ctx.sqlite;
        env = ctx.env;
        app = ctx.app;
        
        // Seed test data
        await seedTestData(sqlite);
    });

    afterEach(() => {
        cleanupTestDB(sqlite);
    });

    async function seedTestData(sqlite: Database) {
        sqlite.exec(`
            INSERT INTO users (id, username, avatar, openid) VALUES (1, 'testuser', 'avatar.png', 'gh_test')
        `);
        sqlite.exec(`
            INSERT INTO feeds (id, title, content, summary, uid, draft, listed, created_at, updated_at) VALUES 
                (1, 'Test Feed 1', '# Hello\n\nThis is content', 'Summary 1', 1, 0, 1, unixepoch(), unixepoch()),
                (2, 'Test Feed 2', '![image](https://example.com/img.png)', 'Summary 2', 1, 0, 1, unixepoch(), unixepoch()),
                (3, 'Draft Feed', 'Draft content', '', 1, 1, 1, unixepoch(), unixepoch())
        `);
    }

    describe('GET /:name - RSS feed endpoints', () => {
        it('should serve rss.xml', async () => {
            const res = await app.request('/rss.xml', { method: 'GET' }, env);
            
            expect(res.status).toBe(200);
            expect(res.headers.get('Content-Type')).toBe('application/rss+xml; charset=UTF-8');
            
            const text = await res.text();
            expect(text).toContain('<?xml');
            expect(text).toContain('<rss');
            expect(text).toContain('Test Feed 1');
            expect(text).toContain('Test Feed 2');
            expect(text).not.toContain('Draft Feed');
        });

        it('should serve atom.xml', async () => {
            const res = await app.request('/atom.xml', { method: 'GET' }, env);
            
            expect(res.status).toBe(200);
            expect(res.headers.get('Content-Type')).toBe('application/atom+xml; charset=UTF-8');
            
            const text = await res.text();
            expect(text).toContain('<?xml');
            expect(text).toContain('<feed');
            expect(text).toContain('Test Feed 1');
        });

        it('should serve rss.json', async () => {
            const res = await app.request('/rss.json', { method: 'GET' }, env);
            
            expect(res.status).toBe(200);
            expect(res.headers.get('Content-Type')).toBe('application/feed+json; charset=UTF-8');
            
            const data = await res.json() as any;
            expect(data).toHaveProperty('items');
            expect(data.items.length).toBe(2);
        });

        it('should serve feed.json (alias)', async () => {
            const res = await app.request('/feed.json', { method: 'GET' }, env);
            
            expect(res.status).toBe(200);
            expect(res.headers.get('Content-Type')).toBe('application/feed+json; charset=UTF-8');
        });

        it('should redirect feed.xml to rss.xml', async () => {
            const res = await app.request('/feed.xml', { method: 'GET' }, env);
            
            expect(res.status).toBe(301);
            expect(res.headers.get('Location')).toBe('/rss.xml');
        });

        it('should return 404 for unknown feed names', async () => {
            const res = await app.request('/unknown.xml', { method: 'GET' }, env);
            
            expect(res.status).toBe(404);
        });

        it('should convert markdown to HTML in content', async () => {
            const res = await app.request('/rss.xml', { method: 'GET' }, env);
            
            const text = await res.text();
            expect(text).toContain('<h1>Hello</h1>');
            expect(text).not.toContain('# Hello');
        });

        it('should include feed metadata', async () => {
            const res = await app.request('/rss.xml', { method: 'GET' }, env);
            
            const text = await res.text();
            expect(text).toContain('Test Blog');
            expect(text).toContain('Test Environment');
        });

        it('should limit to 20 items', async () => {
            for (let i = 4; i <= 25; i++) {
                sqlite.exec(`
                    INSERT INTO feeds (id, title, content, uid, draft, listed, created_at) 
                    VALUES (${i}, 'Feed ${i}', 'Content', 1, 0, 1, unixepoch())
                `);
            }
            
            const res = await app.request('/rss.xml', { method: 'GET' }, env);
            
            const text = await res.text();
            const itemCount = (text.match(/<item>/g) || []).length;
            expect(itemCount).toBeLessThanOrEqual(20);
        });

        it('always generates feed links from the request origin', async () => {
            let getCalls = 0;
            const originEnv = createMockEnv({
                R2_BUCKET: {
                    get: async () => {
                        getCalls += 1;
                        return null;
                    },
                    head: async () => null,
                } as unknown as R2Bucket,
            });
            const ctx = await setupTestApp(RSSService, originEnv);
            ctx.sqlite.exec(`INSERT INTO users (id, username, openid) VALUES (1, 'testuser', 'gh_test')`);
            ctx.sqlite.exec(`INSERT INTO feeds (id, title, content, uid, draft, listed) VALUES (1, 'Feed', 'Content', 1, 0, 1)`);

            const res = await ctx.app.request('https://origin.example/rss.xml', { method: 'GET' }, originEnv);

            expect(res.status).toBe(200);
            expect(await res.text()).toContain('https://origin.example/feed/1');
            expect(getCalls).toBe(0);

            cleanupTestDB(ctx.sqlite);
        });

    });
});

