import { useContext, useEffect, useRef, useState } from "react"
import { Helmet } from 'react-helmet-async'
import { Link, useSearch } from "wouter"
import { FeedCard } from "../components/feed_card"
import { Waiting } from "../components/loading"
import { client } from "../main"
import { ProfileContext } from "../state/profile"
import { headersWithAuth } from "../utils/auth"
import { siteName } from "../utils/constants"
import { tryInt } from "../utils/int"
import { useTranslation } from "react-i18next"
import { Sidebar } from "../components/Sidebar"
import { TagList } from "../components/TagList"

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
    const limit = tryInt(10, query.get("limit"), process.env.PAGE_SIZE)
    const ref = useRef("")
    function fetchFeeds(type: FeedType) {
        client.feed.index.get({
            query: {
                page: page,
                limit: limit,
                type: type
            },
            headers: headersWithAuth()
        }).then(({ data }) => {
            if (data && typeof data !== 'string') {
                setFeeds({
                    ...feeds,
                    [type]: data
                })
                setStatus('idle')
            }
        })
    }
    useEffect(() => {
        const key = `${query.get("page")} ${query.get("type")}`
        if (ref.current == key) return
        const type = query.get("type") as FeedType || 'normal'
        if (type !== listState) {
            _setListState(type)
        }
        setStatus('loading')
        fetchFeeds(type)
        ref.current = key
    }, [query.get("page"), query.get("type")])
    return (
        <>
            <Helmet>
                <title>{`${t('article.title')} - ${process.env.NAME}`}</title>
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={t('article.title')} />
                <meta property="og:image" content={process.env.AVATAR} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={document.URL} />
            </Helmet>
            <Waiting for={feeds.draft.size + feeds.normal.size + feeds.unlisted.size > 0 || status === 'idle'}>
                <div className="w-full flex justify-center mb-8" style={{ marginTop: '10rem' }}>
                    {/* 左侧边栏 - 桌面端显示 */}
                    <aside className="hidden xl:block flex-shrink-0 sticky top-24 h-fit mr-8" style={{ width: '10rem' }}>
                        <div className="flex flex-col gap-4 rounded-2xl p-4" style={{
                            background: 'linear-gradient(135deg, rgba(var(--background-secondary-rgb), 0.75), rgba(var(--background-primary-rgb), 0.8))',
                            boxShadow: 'var(--card-shadow)',
                            border: '1px solid rgba(var(--background-trans-rgb), 0.3)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Sidebar />
                            <TagList />
                        </div>
                    </aside>
                    
                    {/* 主内容区域 */}
                    <main className="flex-1 max-w-5xl">
                    {/* 文章标题部分已删除 */}
                    <div className="w-full text-start">
                        <div className="flex flex-row justify-between items-center">
                            {profile?.permission &&
                                <div className="flex flex-row space-x-3">
                                    <Link href={listState === 'draft' ? '/?type=normal' : '/?type=draft'} 
                                        className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300"
                                        style={{
                                            backgroundColor: listState === 'draft' ? 'var(--bg-accent-55)' : 'var(--bg-accent-05)',
                                            color: listState === 'draft' ? 'white' : 'var(--text-accent)'
                                        }}>
                                        <i className="ri-draft-line mr-1"></i>
                                        {t('draft_bin')}
                                    </Link>
                                    <Link href={listState === 'unlisted' ? '/?type=normal' : '/?type=unlisted'} 
                                        className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300"
                                        style={{
                                            backgroundColor: listState === 'unlisted' ? 'var(--bg-accent-55)' : 'var(--bg-accent-05)',
                                            color: listState === 'unlisted' ? 'white' : 'var(--text-accent)'
                                        }}>
                                        <i className="ri-eye-off-line mr-1"></i>
                                        {t('unlisted')}
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                    <Waiting for={status === 'idle'}>
                        <div className="w-full ani-show">
                            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {feeds[listState].data.map(({ id, ...feed }: any) => (
                                    <li key={id}>
                                        <FeedCard id={id} {...feed} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full flex flex-row items-center justify-center mt-8 ani-show gap-4">
                            {page > 1 &&
                                <Link href={`/?type=${listState}&page=${(page - 1)}`}
                                    className="text-sm font-medium rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                                    style={{
                                        background: 'var(--main-gradient)',
                                        color: 'white',
                                        boxShadow: 'var(--accent-shadow)'
                                    }}>
                                    <i className="ri-arrow-left-line"></i>
                                    {t('previous')}
                                </Link>
                            }
                            {feeds[listState]?.hasNext &&
                                <Link href={`/?type=${listState}&page=${(page + 1)}`}
                                    className="text-sm font-medium rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                                    style={{
                                        background: 'var(--main-gradient)',
                                        color: 'white',
                                        boxShadow: 'var(--accent-shadow)'
                                    }}>
                                    {t('next')}
                                    <i className="ri-arrow-right-line"></i>
                                </Link>
                            }
                        </div>
                    </Waiting>
                    </main>
                </div>
            </Waiting>
        </>
    )
}
