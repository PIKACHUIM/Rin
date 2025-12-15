import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { client } from "../main";

type Hashtag = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    feeds: number;
};

export function TagList({ selectedTag, onTagSelect }: { 
    selectedTag?: string;
    onTagSelect?: (tag: string) => void;
}) {
    const { t } = useTranslation();
    const [hashtags, setHashtags] = useState<Hashtag[]>([]);
    const ref = useRef(false);

    useEffect(() => {
        if (ref.current) return;
        client.tag.index.get().then(({ data }) => {
            if (data && typeof data !== 'string') {
                setHashtags(data);
            }
        });
        ref.current = true;
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center mb-3">
                <i className="ri-price-tag-3-line mr-2" style={{ color: 'var(--text-accent)' }}></i>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-bright)' }}>
                    {t('hashtags')}
                </h3>
            </div>
            
            <div className="flex flex-col gap-2">
                {hashtags
                    .filter(({ feeds }) => feeds > 0)
                    .sort((a, b) => b.feeds - a.feeds)
                    .map((hashtag) => (
                        <Link 
                            key={hashtag.id} 
                            href={`/hashtag/${hashtag.name}`}
                            className="flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                            style={{
                                backgroundColor: selectedTag === hashtag.name 
                                    ? 'var(--bg-accent-55)' 
                                    : 'var(--bg-accent-05)',
                                border: '1px solid var(--background-trans)',
                                color: selectedTag === hashtag.name 
                                    ? 'var(--text-accent)' 
                                    : 'var(--text-normal)'
                            }}
                            onClick={() => onTagSelect?.(hashtag.name)}
                        >
                            <span className="flex items-center gap-2">
                                <i className="ri-hashtag text-sm"></i>
                                <span className="text-sm font-medium">{hashtag.name}</span>
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full" 
                                style={{ 
                                    backgroundColor: 'var(--background-primary)',
                                    color: 'var(--text-dim)'
                                }}>
                                {hashtag.feeds}
                            </span>
                        </Link>
                    ))}
            </div>
        </div>
    );
}