import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import Popup from "reactjs-popup";
import { removeCookie } from "typescript-cookie";
import { Link, useLocation } from "wouter";
import { useLoginModal } from "../hooks/useLoginModal";
import { Profile, ProfileContext } from "../state/profile";
import { Button } from "./button";
import { IconSmall } from "./icon";
import { Input } from "./input";
import { Padding } from "./padding";
import { ClientConfigContext } from "../state/config";
import { Sidebar } from "./Sidebar";
import { TagList } from "./TagList";


export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation()
    const [location] = useLocation()

    return useMemo(() => (
        <>
            {/* 顶部背景图片 */}
            {process.env.BACKGROUND_URL && !location.startsWith("/writing") && (
                <div className="fixed top-0 left-0 w-full h-96 z-0 overflow-hidden">
                    <div 
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ 
                            backgroundImage: `url(${process.env.BACKGROUND_URL})`,
                            filter: 'brightness(0.7)'
                        }}
                    />
                    <div 
                        className="absolute bottom-0 left-0 w-full h-48"
                        style={{
                            background: 'linear-gradient(to bottom, transparent, var(--background-primary))'
                        }}
                    />
                </div>
            )}
            
            <div className="fixed z-40 w-full">
                <div className="w-screen backdrop-blur-md" style={{ 
                    background: 'linear-gradient(135deg, rgba(var(--background-primary-rgb), 0.75), rgba(var(--background-secondary-rgb), 0.8))',
                    borderBottom: '1px solid rgba(var(--background-trans-rgb), 0.3)'
                }}>
                    <Padding className="mx-4 py-3">
                        <div className="w-full flex justify-between items-center">
                            <Link aria-label={t('home')} href="/"
                                className="hidden opacity-0 md:opacity-100 duration-300 mr-auto md:flex flex-row items-center group">
                                <div className="relative">
                                    <img src={process.env.AVATAR} alt="Avatar" 
                                        className="w-12 h-12 rounded-2xl border-2 transition-all duration-300 group-hover:scale-105" 
                                        style={{ borderColor: 'var(--text-accent)' }} />
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
                                        style={{ background: 'var(--main-gradient)' }}></div>
                                </div>
                                <div className="flex flex-col justify-center items-start mx-4">
                                    <p className="text-xl font-bold transition-colors duration-300" style={{ color: 'var(--text-bright)' }}>
                                        {process.env.NAME}
                                    </p>
                                    <p className="text-xs transition-colors duration-300" style={{ color: 'var(--text-dim)' }}>
                                        {process.env.DESCRIPTION}
                                    </p>
                                </div>
                            </Link>
                            <div
                                className="w-full md:w-max transition-all duration-500 md:absolute md:left-1/2 md:translate-x-[-50%] flex-row justify-center items-center">
                                <div
                                    className="flex flex-row items-center rounded-full px-2 shadow-aurora"
                                    style={{ 
                                        background: 'linear-gradient(135deg, rgba(var(--background-secondary-rgb), 0.75), rgba(var(--background-primary-rgb), 0.8))',
                                        border: '1px solid rgba(var(--background-trans-rgb), 0.3)',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                    <Link aria-label={t('home')} href="/"
                                        className="visible opacity-100 md:hidden md:opacity-0 duration-300 mr-auto flex flex-row items-center py-2 group">
                                        <img src={process.env.AVATAR} alt="Avatar"
                                            className="w-10 h-10 rounded-full border-2 transition-all duration-300 group-hover:scale-105"
                                            style={{ borderColor: 'var(--text-accent)' }} />
                                        <div className="flex flex-col justify-center items-start mx-2">
                                            <p className="text-sm font-bold" style={{ color: 'var(--text-bright)' }}>
                                                {process.env.NAME}
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                                                {process.env.DESCRIPTION}
                                            </p>
                                        </div>
                                    </Link>
                                    <NavBar menu={false} />
                                    {children}
                                    <Menu />
                                </div>
                            </div>
                            <div className="ml-auto hidden opacity-0 md:opacity-100 duration-300 md:flex flex-row items-center space-x-3">
                                <SearchButton />
                                <LanguageSwitch />
                                <UserAvatar profile={profile} />
                            </div>
                        </div>
                    </Padding>
                </div>
            </div>
            <div className="h-20"></div>
        </>
    ), [profile, children, location])
}

function NavItem({ menu, title, selected, href, when = true, onClick }: {
    title: string,
    selected: boolean,
    href: string,
    menu?: boolean,
    when?: boolean,
    onClick?: () => void
}) {
    return (
        <>
            {when &&
                <Link href={href}
                    className={`${menu ? "" : "hidden"} md:block cursor-pointer duration-300 px-2 py-4 md:p-4 text-sm font-medium relative group`}
                    style={{ 
                        color: selected ? 'var(--text-accent)' : 'var(--text-normal)'
                    }}
                    state={{ animate: true }}
                    onClick={onClick}
                >
                    {title}
                    {selected && (
                        <span className="absolute bottom-2 left-2 right-2 h-0.5 rounded-full" 
                            style={{ background: 'var(--main-gradient)' }}></span>
                    )}
                    {!selected && (
                        <span className="absolute bottom-2 left-2 right-2 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                            style={{ background: 'var(--main-gradient)' }}></span>
                    )}
                </Link>}
        </>
    )
}

function Menu() {
    const profile = useContext(ProfileContext);
    const [isOpen, setOpen] = useState(false)

    function onClose() {
        document.body.style.overflow = "auto"
        setOpen(false)
    }

    return (
        <div className="visible md:hidden flex flex-row items-center">
            <button onClick={() => setOpen(true)}
                className="w-10 h-10 rounded-full flex flex-row items-center justify-center">
                <i className="ri-menu-line ri-lg" />
            </button>
            
            {/* 全屏弹出层 */}
            {isOpen && (
                <div className="fixed inset-0 z-[100]">
                    {/* 遮罩层 */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    {/* 内容区域 */}
                    <div className="absolute inset-0 flex items-start justify-center pt-20 px-4 overflow-y-auto">
                        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl mb-8 relative">
                            {/* 左侧栏 */}
                            <div className="w-full lg:w-80 flex-shrink-0">
                                <div className="flex flex-col gap-4">
                                    <Sidebar />
                                    <TagList />
                                </div>
                            </div>
                            
                            {/* 右侧菜单 */}
                            <div className="flex flex-col rounded-2xl p-4 shadow-aurora flex-1"
                                style={{ 
                                    backgroundColor: 'var(--background-secondary)',
                                    border: '1px solid var(--background-trans)'
                                }}>
                                <div className="flex flex-row justify-end space-x-2 mb-4">
                                    <SearchButton onClose={onClose} />
                                    <LanguageSwitch />
                                    <UserAvatar profile={profile} onClose={onClose} />
                                </div>
                                <NavBar menu={true} onClick={onClose} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function NavBar({ menu, onClick }: { menu: boolean, onClick?: () => void }) {
    const profile = useContext(ProfileContext);
    const [location] = useLocation();
    const { t } = useTranslation()
    return (
        <>
            <NavItem menu={menu} onClick={onClick} title={t('article.title')}
                selected={location === "/" || location.startsWith('/feed')} href="/" />
            <NavItem menu={menu} onClick={onClick} title={t('timeline')} selected={location === "/timeline"} href="/timeline" />
            <NavItem menu={menu} onClick={onClick} title={t('hashtags')} selected={location === "/hashtags"} href="/hashtags" />
            <NavItem menu={menu} onClick={onClick} when={profile?.permission == true} title={t('writing')}
                selected={location.startsWith("/writing")} href="/writing" />
            <NavItem menu={menu} onClick={onClick} title={t('friends.title')} selected={location === "/friends"} href="/friends" />
            <NavItem menu={menu} onClick={onClick} title={t('about.title')} selected={location === "/about"} href="/about" />
            <NavItem menu={menu} onClick={onClick} when={profile?.permission == true} title={t('settings.title')}
                selected={location === "/settings"}
                href="/settings" />
        </>
    )
}

function LanguageSwitch({ className }: { className?: string }) {
    const { i18n } = useTranslation()
    const label = 'Languages'
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'zh-CN', name: '简体中文' },
        { code: 'zh-TW', name: '繁體中文' },
        { code: 'ja', name: '日本語' }
    ]
    return (
        <div className={className + " flex flex-row items-center"}>
            <Popup trigger={
                <button title={label} aria-label={label}
                    className="flex rounded-full px-3 py-2 aspect-square items-center justify-center transition-all duration-300 hover:scale-105"
                    style={{
                        backgroundColor: 'var(--background-secondary)',
                        border: '1px solid var(--background-trans)',
                        color: 'var(--text-normal)',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                    <i className="ri-translate-2"></i>
                </button>
            }
                position="bottom right"
                arrow={false}
                closeOnDocumentClick
            >
                <div className="rounded-xl p-3 shadow-aurora"
                    style={{
                        backgroundColor: 'var(--background-secondary)',
                        border: '1px solid var(--background-trans)'
                    }}>
                    <p className='font-bold mb-2' style={{ color: 'var(--text-bright)' }}>
                        Languages
                    </p>
                    {languages.map(({ code, name }) => (
                        <button key={code} 
                            onClick={() => i18n.changeLanguage(code)}
                            className="block w-full text-left px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                            style={{
                                color: 'var(--text-normal)',
                                backgroundColor: i18n.language === code ? 'var(--bg-accent-05)' : 'transparent'
                            }}>
                            {name}
                        </button>
                    ))}
                </div>
            </Popup>
        </div>
    )
}

function SearchButton({ className, onClose }: { className?: string, onClose?: () => void }) {
    const { t } = useTranslation()
    const [isOpened, setIsOpened] = useState(false);
    const [, setLocation] = useLocation()
    const [value, setValue] = useState('')
    const label = t('article.search.title')
    const onSearch = () => {
        const key = `${encodeURIComponent(value)}`
        setTimeout(() => {
            setIsOpened(false)
            if (value.length !== 0)
                onClose?.()
        }, 100)
        if (value.length !== 0)
            setLocation(`/search/${key}`)
    }
    return (<div className={className + " flex flex-row items-center"}>
        <button onClick={() => setIsOpened(true)} title={label} aria-label={label}
            className="flex rounded-full px-3 py-2 aspect-square items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--background-trans)',
                color: 'var(--text-normal)',
                boxShadow: 'var(--card-shadow)'
            }}>
            <i className="ri-search-line"></i>
        </button>
        <ReactModal
            isOpen={isOpened}
            style={{
                content: {
                    top: "20%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    padding: "0",
                    border: "none",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "none",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                },
            }}
            onRequestClose={() => setIsOpened(false)}
        >
            <div className="w-full flex flex-row items-center justify-between p-4 space-x-4 rounded-2xl shadow-aurora"
                style={{
                    backgroundColor: 'var(--background-secondary)',
                    border: '1px solid var(--background-trans)'
                }}>
                <Input value={value} setValue={setValue} placeholder={t('article.search.placeholder')}
                    autofocus
                    onSubmit={onSearch} />
                <Button title={value.length === 0 ? t("close") : label} onClick={onSearch} />
            </div>
        </ReactModal>
    </div>
    )
}


function UserAvatar({ className, profile, onClose }: { className?: string, profile?: Profile, onClose?: () => void }) {
    const { t } = useTranslation()
    const { LoginModal, setIsOpened } = useLoginModal(onClose)
    const label = t('github_login')
    const config = useContext(ClientConfigContext);


    return (
        <> {config.get<boolean>('login.enabled') && <div className={className + " flex flex-row items-center"}>
            {profile?.avatar ? <>
                <div className="w-10 h-10 relative group">
                    <img src={profile.avatar} alt="Avatar" 
                        className="w-10 h-10 rounded-full border-2 transition-all duration-300 group-hover:scale-105" 
                        style={{ borderColor: 'var(--text-accent)' }} />
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
                        style={{ background: 'var(--main-gradient)' }}></div>
                    <div className="z-50 absolute left-0 top-0 w-10 h-10 opacity-0 hover:opacity-100 duration-300 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <IconSmall label={t('logout')} name="ri-logout-circle-line" onClick={() => {
                            removeCookie("token")
                            window.location.reload()
                        }} hover={false} />
                    </div>
                </div>
            </> : <>
                <button onClick={() => setIsOpened(true)} title={label} aria-label={label}
                    className="flex rounded-full px-3 py-2 aspect-square items-center justify-center transition-all duration-300 hover:scale-105"
                    style={{
                        backgroundColor: 'var(--background-secondary)',
                        border: '1px solid var(--background-trans)',
                        color: 'var(--text-normal)',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                    <i className="ri-user-received-line"></i>
                </button>
            </>}
            <LoginModal />
        </div>
        }</>)
}