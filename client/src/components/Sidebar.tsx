export function Sidebar() {

    return (
        <div className="w-full">
            {/* 头像 */}
            <div className="relative mx-auto mb-4 w-16 h-16 overflow-hidden rounded-xl group">
                <div className="absolute transition pointer-events-none group-hover:bg-black/30 group-active:bg-black/50 w-full h-full z-50 flex items-center justify-center">
                    <i className="ri-user-line text-white text-5xl transition opacity-0 scale-90 group-hover:scale-100 group-hover:opacity-100"></i>
                </div>
                <img 
                    src={process.env.AVATAR} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 名字 */}
            <div className="px-2">
                <div className="font-bold text-xl text-center mb-2 transition" 
                    style={{ color: 'var(--text-bright)' }}>
                    {process.env.NAME}
                </div>
                <div className="h-1 w-5 rounded-full mb-3 mx-auto transition" 
                    style={{ background: 'var(--main-gradient)' }}>
                </div>

                {/* 介绍 */}
                <div className="text-center mb-4 transition" 
                    style={{ color: 'var(--text-dim)' }}>
                    {process.env.DESCRIPTION}
                </div>

                {/* 社交链接 */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {process.env.GITHUB_URL && (
                        <a 
                            href={process.env.GITHUB_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="rounded-lg h-10 w-10 flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105"
                            style={{
                                backgroundColor: 'var(--bg-accent-05)',
                                border: '1px solid var(--background-trans)',
                                color: 'var(--text-normal)'
                            }}
                        >
                            <i className="ri-github-fill text-xl"></i>
                        </a>
                    )}
                    {process.env.BILIBILI_URL && (
                        <a 
                            href={process.env.BILIBILI_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Bilibili"
                            className="rounded-lg h-10 w-10 flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105"
                            style={{
                                backgroundColor: 'var(--bg-accent-05)',
                                border: '1px solid var(--background-trans)',
                                color: 'var(--text-normal)'
                            }}
                        >
                            <i className="ri-bilibili-fill text-xl"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}