import { useLocation } from "wouter"

export function HashTag({ name }: { name: string }) {
    const [_, setLocation] = useLocation()
    return (
        <button 
            onClick={(e) => { e.preventDefault(); setLocation(`/hashtag/${name}`) }}
            className="text-sm px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
                backgroundColor: 'var(--bg-accent-05)',
                color: 'var(--text-accent)',
                border: '1px solid var(--bg-accent-55)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-accent-55)';
                e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-accent-05)';
                e.currentTarget.style.color = 'var(--text-accent)';
            }}>
            <span className="flex items-center gap-1">
                <span className="font-bold">#</span>
                <span className="font-medium">{name}</span>
            </span>
        </button>
    )
}