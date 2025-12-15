import { useContext, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { ClientConfigContext } from '../state/config';
import { Helmet } from "react-helmet-async";
import { siteName } from '../utils/constants';
import { useTranslation } from "react-i18next";
import { useLoginModal } from '../hooks/useLoginModal';

type ThemeMode = 'light' | 'dark' | 'system';
function Footer() {
    const { t } = useTranslation()
    const [modeState, setModeState] = useState<ThemeMode>('system');
    const config = useContext(ClientConfigContext);
    const footerHtml = config.get<string>('footer');
    const loginEnabled = config.get<boolean>('login.enabled');
    const [doubleClickTimes, setDoubleClickTimes] = useState(0);
    const { LoginModal, setIsOpened } = useLoginModal()
    useEffect(() => {
        const mode = localStorage.getItem('theme') as ThemeMode || 'system';
        setModeState(mode);
        setMode(mode);
    }, [])

    const setMode = (mode: ThemeMode) => {
        setModeState(mode);
        localStorage.setItem('theme', mode);


        if (mode !== 'system' || (!('theme' in localStorage) && window.matchMedia(`(prefers-color-scheme: ${mode})`).matches)) {
            document.documentElement.setAttribute('data-color-mode', mode);
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            if (mediaQuery.matches) {
                document.documentElement.setAttribute('data-color-mode', 'dark');
            } else {
                document.documentElement.setAttribute('data-color-mode', 'light');
            }
        }
        window.dispatchEvent(new Event("colorSchemeChange"));
    };

    return (
        <footer>
            <Helmet>
                <link rel="alternate" type="application/rss+xml" title={siteName} href="/sub/rss.xml" />
                <link rel="alternate" type="application/atom+xml" title={siteName} href="/sub/atom.xml" />
                <link rel="alternate" type="application/json" title={siteName} href="/sub/rss.json" />
            </Helmet>
            <div className="flex flex-col mb-8 space-y-3 justify-center items-center ani-show" style={{ color: 'var(--text-normal)' }}>
                {footerHtml && <div dangerouslySetInnerHTML={{ __html: footerHtml }} />}
                <p className='text-sm font-normal link-line' style={{ color: 'var(--text-dim)' }}>
                    <span onDoubleClick={() => {
                        if(doubleClickTimes >= 2){ // actually need 3 times doubleClick
                            setDoubleClickTimes(0)
                            if(!loginEnabled) {
                                setIsOpened(true)
                            }
                        } else {
                            setDoubleClickTimes(doubleClickTimes + 1)
                        }
                    }}>
                        © 2024 Powered by <a className='hover:underline' href="https://github.com/openRin/Rin" target="_blank">Rin</a>
                    </span>
                    {config.get<boolean>('rss') && <>
                        <Spliter />
                        <Popup trigger={
                            <button className="hover:underline transition-colors duration-300" type="button"
                                style={{ color: 'var(--text-dim)' }}>
                                RSS
                            </button>
                        }
                            position="top center"
                            arrow={false}
                            closeOnDocumentClick>
                            <div className="rounded-xl p-4 shadow-aurora"
                                style={{
                                    backgroundColor: 'var(--background-secondary)',
                                    border: '1px solid var(--background-trans)'
                                }}>
                                <p className='font-bold mb-2' style={{ color: 'var(--text-bright)' }}>
                                    {t('footer.rss')}
                                </p>
                                <p className='space-x-2' style={{ color: 'var(--text-normal)' }}>
                                    <a href='/sub/rss.xml' className='hover:underline transition-colors duration-300'
                                        style={{ color: 'var(--text-accent)' }}>
                                        RSS
                                    </a> <Spliter />
                                    <a href='/sub/atom.xml' className='hover:underline transition-colors duration-300'
                                        style={{ color: 'var(--text-accent)' }}>
                                        Atom
                                    </a> <Spliter />
                                    <a href='/sub/rss.json' className='hover:underline transition-colors duration-300'
                                        style={{ color: 'var(--text-accent)' }}>
                                        JSON
                                    </a>
                                </p>
                            </div>
                        </Popup>
                    </>}
                </p>
                <div className="w-fit-content inline-flex rounded-full p-1 shadow-aurora"
                    style={{
                        backgroundColor: 'var(--background-secondary)',
                        border: '1px solid var(--background-trans)'
                    }}>
                    <ThemeButton mode='light' current={modeState} label="Toggle light mode" icon="ri-sun-line" onClick={setMode} />
                    <ThemeButton mode='system' current={modeState} label="Toggle system mode" icon="ri-computer-line" onClick={setMode} />
                    <ThemeButton mode='dark' current={modeState} label="Toggle dark mode" icon="ri-moon-line" onClick={setMode} />
                </div>
            </div>
            <LoginModal />
        </footer>
    );
}

function Spliter() {
    return (<span className='px-1'>
        |
    </span>
    )
}

function ThemeButton({ current, mode, label, icon, onClick }: { current: ThemeMode, label: string, mode: ThemeMode, icon: string, onClick: (mode: ThemeMode) => void }) {
    const isActive = current === mode;
    return (<button aria-label={label} type="button" onClick={() => onClick(mode)}
        className="inline-flex h-[36px] w-[36px] items-center justify-center border-0 rounded-full transition-all duration-300 hover:scale-110"
        style={isActive ? {
            background: 'var(--main-gradient)',
            color: 'white',
            boxShadow: 'var(--accent-shadow)'
        } : {
            backgroundColor: 'transparent',
            color: 'var(--text-dim)'
        }}>
        <i className={`${icon} text-lg`} />
    </button>)
}

export default Footer;