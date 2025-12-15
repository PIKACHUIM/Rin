import ReactLoading from "react-loading";

export function Button({ title, onClick, secondary = false }: { title: string, secondary?: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick} 
            className="text-nowrap rounded-full px-5 py-2.5 h-min font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={secondary ? {
                backgroundColor: 'var(--background-secondary)',
                color: 'var(--text-normal)',
                border: '1px solid var(--background-trans)',
                boxShadow: 'var(--card-shadow)'
            } : {
                background: 'var(--main-gradient)',
                color: 'white',
                border: 'none',
                boxShadow: 'var(--accent-shadow)'
            }}>
            {title}
        </button>
    );
}

export function ButtonWithLoading({ title, onClick, loading, secondary = false }: { title: string, secondary?: boolean, loading: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick} 
            className="text-nowrap rounded-full px-5 py-2.5 h-min space-x-2 flex flex-row items-center font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={secondary ? {
                backgroundColor: 'var(--background-secondary)',
                color: 'var(--text-normal)',
                border: '1px solid var(--background-trans)',
                boxShadow: 'var(--card-shadow)'
            } : {
                background: 'var(--main-gradient)',
                color: 'white',
                border: 'none',
                boxShadow: 'var(--accent-shadow)'
            }}>
            {loading && <ReactLoading width="1em" height="1em" type="spin" color="#FFF" />}
            <span>
                {title}
            </span>
        </button>
    );
}