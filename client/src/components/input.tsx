
export function Input({ autofocus, value, setValue, className, placeholder, onSubmit }:
    { autofocus?: boolean, value: string, className?: string, placeholder: string, id?: number, setValue: (v: string) => void, onSubmit?: () => void }) {
    return (<input
        autoFocus={autofocus}
        placeholder={placeholder}
        value={value}
        onKeyDown={(event) => {
            if (event.key === 'Enter' && onSubmit) {
                onSubmit()
            }
        }}
        onChange={(event) => {
            setValue(event.target.value)
        }}
        className={'w-full py-2.5 px-4 rounded-xl transition-all duration-300 ' + className}
        style={{
            backgroundColor: 'var(--background-secondary)',
            color: 'var(--text-normal)',
            border: '1px solid var(--background-trans)',
            outline: 'none'
        }}
        onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-accent)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--bg-accent-05)';
        }}
        onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--background-trans)';
            e.currentTarget.style.boxShadow = 'none';
        }} />
    )
}
export function Checkbox({ value, setValue, className, placeholder }:
    { value: boolean, className?: string, placeholder: string, id: string, setValue: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (<input type='checkbox'
        placeholder={placeholder}
        checked={value}
        onChange={(event) => {
            setValue(event.target.checked)
        }}
        className={'w-5 h-5 rounded transition-all duration-300 cursor-pointer ' + className}
        style={{
            accentColor: 'var(--text-accent)'
        }} />
    )
}