import ReactLoading from "react-loading";
import { useEffect, useState } from "react";

export function Waiting({ for: wait, children }: { for?: any, children?: React.ReactNode }) {
    const [accentColor, setAccentColor] = useState('#e93796');
    
    useEffect(() => {
        // 获取当前主题的accent颜色
        const updateColor = () => {
            const isDark = document.documentElement.getAttribute('data-color-mode') === 'dark';
            setAccentColor(isDark ? '#0fb6d6' : '#e93796');
        };
        
        updateColor();
        window.addEventListener('colorSchemeChange', updateColor);
        
        return () => window.removeEventListener('colorSchemeChange', updateColor);
    }, []);
    
    return (
        <>
            {!wait ?
                <div className="w-full h-96 flex flex-col justify-center items-center mb-8 ani-show-fast">
                    <div className="relative">
                        <ReactLoading type="cylon" color={accentColor} />
                        <div className="absolute inset-0 blur-xl opacity-30" 
                            style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}></div>
                    </div>
                </div>
                : children}
        </>
    )
}