import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { timeago } from "../utils/timeago";
import { HashTag } from "./hashtag";
import { useMemo } from "react";
export function FeedCard({ id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt }:
    {
        id: string, avatar?: string,
        draft?: number, listed?: number, top?: number,
        title: string, summary: string,
        hashtags: { id: number, name: string }[],
        createdAt: Date, updatedAt: Date
    }) {
    const { t } = useTranslation()
    return useMemo(() => (
        <>
            <Link href={`/feed/${id}`} target="_blank" 
                className="block w-full rounded-2xl my-3 p-6 group relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(var(--background-secondary-rgb), 0.75), rgba(var(--background-primary-rgb), 0.8))',
                    boxShadow: 'var(--card-shadow)',
                    transition: 'all 300ms ease',
                    border: '1px solid rgba(var(--background-trans-rgb), 0.3)',
                    backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}>
                {/* 渐变装饰 */}
                <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'var(--main-gradient)' }}></div>
                
                {avatar &&
                    <div className="flex flex-row items-center mb-4 rounded-xl overflow-hidden relative">
                        <img src={avatar} alt=""
                            className="object-cover object-center w-full max-h-96 transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                            style={{ background: 'var(--main-gradient)' }}></div>
                    </div>}
                
                <h1 className="text-xl font-bold text-pretty overflow-hidden mb-2 transition-colors duration-300"
                    style={{ color: 'var(--text-bright)' }}>
                    {title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    <span className="text-sm flex items-center transition-colors duration-300" 
                        style={{ color: 'var(--text-dim)' }}
                        title={new Date(createdAt).toLocaleString()}>
                        <i className="ri-time-line mr-1"></i>
                        {createdAt === updatedAt ? timeago(createdAt) : t('feed_card.published$time', { time: timeago(createdAt) })}
                    </span>
                    {createdAt !== updatedAt &&
                        <span className="text-sm flex items-center transition-colors duration-300" 
                            style={{ color: 'var(--text-dim)' }}
                            title={new Date(updatedAt).toLocaleString()}>
                            <i className="ri-edit-line mr-1"></i>
                            {t('feed_card.updated$time', { time: timeago(updatedAt) })}
                        </span>
                    }
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {draft === 1 && 
                        <span className="text-xs px-2 py-1 rounded-full" 
                            style={{ 
                                backgroundColor: 'var(--bg-accent-05)', 
                                color: 'var(--text-dim)' 
                            }}>
                            <i className="ri-draft-line mr-1"></i>草稿
                        </span>}
                    {listed === 0 && 
                        <span className="text-xs px-2 py-1 rounded-full" 
                            style={{ 
                                backgroundColor: 'var(--bg-accent-05)', 
                                color: 'var(--text-dim)' 
                            }}>
                            <i className="ri-eye-off-line mr-1"></i>未列出
                        </span>}
                    {top === 1 && 
                        <span className="text-xs px-2 py-1 rounded-full font-medium" 
                            style={{ 
                                background: 'var(--main-gradient)', 
                                color: 'white' 
                            }}>
                            <i className="ri-pushpin-line mr-1"></i>置顶
                        </span>}
                </div>
                
                <p className="text-pretty overflow-hidden mb-3 line-clamp-3 transition-colors duration-300"
                    style={{ color: 'var(--text-normal)' }}>
                    {summary}
                </p>
                
                {hashtags.length > 0 &&
                    <div className="mt-3 flex flex-row flex-wrap justify-start gap-2">
                        {hashtags.map(({ name }, index) => (
                            <HashTag key={index} name={name} />
                        ))}
                    </div>
                }
            </Link>
        </>
    ), [id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt])
}