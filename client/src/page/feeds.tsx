import { useContext, useEffect, useRef, useState } from "react"
import { Helmet } from 'react-helmet'
import { Link, useSearch } from "wouter"
import { FeedCard } from "../components/feed_card"
import { FeedViewSwitcher } from "../components/feed-view-switcher"
import {
    feedListClassName,
    readStoredFeedLayout,
    storeFeedLayout,
    type FeedLayout,
} from "../components/feed-layout-options"
import { Waiting } from "../components/loading"
import { client } from "../app/runtime"
import { ProfileContext } from "../state/profile"

import { useSiteConfig } from "../hooks/useSiteConfig";
import { siteName } from "../utils/constants"
import { tryInt } from "../utils/int"
import { useTranslation } from "react-i18next";

type FeedsData = {
    size: number,
    data: any[],
    hasNext: boolean
}

type FeedType = 'draft' | 'unlisted' | 'normal'

type FeedsMap = {
    [key in FeedType]: FeedsData
}

export function FeedsPage() {
    const { t } = useTranslation()
    const siteConfig = useSiteConfig();
    const query = new URLSearchParams(useSearch());
    const profile = useContext(ProfileContext);
    const [listState, _setListState] = useState<FeedType>(query.get("type") as FeedType || 'normal')
    const [status, setStatus] = useState<'loading' | 'idle'>('idle')
    const [feeds, setFeeds] = useState<FeedsMap>({
        draft: { size: 0, data: [], hasNext: false },
        unlisted: { size: 0, data: [], hasNext: false },
        normal: { size: 0, data: [], hasNext: false }
    })
    const page = tryInt(1, query.get("page"))
    const limit = tryInt(siteConfig.pageSize, query.get("limit"))
    const [layoutOverride, setLayoutOverride] = useState<FeedLayout | null>(() => readStoredFeedLayout())
    const feedLayout = layoutOverride ?? siteConfig.feedLayout
    const feedListClass = feedListClassName(feedLayout)
    const currentFeeds = feeds[listState] ?? { size: 0, data: [], hasNext: false };
    const currentFeedData = Array.isArray(currentFeeds.data) ? currentFeeds.data : [];
    const ref = useRef("")
    function fetchFeeds(type: FeedType) {
        client.feed.list({
            page: page,
            limit: limit,
            type: type
        }).then(({ data }) => {
            if (data) {
                setFeeds({
                    ...feeds,
                    [type]: data
                })
                setStatus('idle')
            }
        })
    }
    useEffect(() => {
        const key = `${query.get("page")} ${query.get("type")} ${limit}`
        if (ref.current == key) return
        const type = query.get("type") as FeedType || 'normal'
        if (type !== listState) {
            _setListState(type)
        }
        setStatus('loading')
        fetchFeeds(type)
        ref.current = key
    }, [limit, query.get("page"), query.get("type")])
    return (
        <>
            <Helmet>
                <title>{`${t('article.title')} - ${siteConfig.name}`}</title>
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={t('article.title')} />
                <meta property="og:image" content={siteConfig.avatar} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={document.URL} />
            </Helmet>
            <Waiting for={feeds.draft.size + feeds.normal.size + feeds.unlisted.size > 0 || status === 'idle'}>
                <main className="rin-home w-full mb-16">
                    <div className="rin-page px-4 md:px-8">
                        <header className="rin-home-intro">
                            <div className="rin-home-intro-copy">
                                <h1>{siteConfig.name}</h1>
                                {siteConfig.description ? <p>{siteConfig.description}</p> : null}
                            </div>
                            <div className="rin-home-count">
                                <span className="rin-home-count-value">{currentFeeds.size}</span>
                                <span>{t('article.total$count', { count: currentFeeds.size })}</span>
                            </div>
                        </header>
                        <section className="rin-home-articles" aria-labelledby="rin-home-list-title">
                            <div className="rin-home-list-header">
                                <h2 id="rin-home-list-title">
                                    {listState === 'draft' ? t('draft_bin') : listState === 'normal' ? t('article.title') : t('unlisted')}
                                </h2>
                                <div className="rin-home-list-actions">
                                    {profile?.permission &&
                                        <div className="rin-feed-filters">
                                            <Link href={listState === 'draft' ? '/?type=normal' : '/?type=draft'} className={`rin-feed-filter ${listState === 'draft' ? "is-active" : ""}`}>
                                                {t('draft_bin')}
                                            </Link>
                                            <Link href={listState === 'unlisted' ? '/?type=normal' : '/?type=unlisted'} className={`rin-feed-filter ${listState === 'unlisted' ? "is-active" : ""}`}>
                                                {t('unlisted')}
                                            </Link>
                                        </div>
                                    }
                                    <FeedViewSwitcher
                                        value={feedLayout}
                                        onChange={(layout) => {
                                            setLayoutOverride(layout)
                                            storeFeedLayout(layout)
                                        }}
                                    />
                                </div>
                            </div>
                            <Waiting for={status === 'idle'}>
                                <div className={feedListClass}>
                                    {currentFeedData.map(({ id, ...feed }: any) => (
                                        <FeedCard key={id} id={id} {...feed} />
                                    ))}
                                </div>
                                {currentFeedData.length === 0 ? (
                                    <p className="rin-feed-empty">{t('settings.feed_layout.empty')}</p>
                                ) : null}
                                <nav className="rin-pagination" aria-label="Pagination">
                                    {page > 1 ? (
                                        <Link href={`/?type=${listState}&page=${page - 1}`} className="rin-pagination-link">
                                            {t('previous')}
                                        </Link>
                                    ) : <span />}
                                    {currentFeeds.hasNext ? (
                                        <Link href={`/?type=${listState}&page=${page + 1}`} className="rin-pagination-link">
                                            {t('next')}
                                        </Link>
                                    ) : null}
                                </nav>
                            </Waiting>
                        </section>
                    </div>
                </main>
            </Waiting>
        </>
    )
}
