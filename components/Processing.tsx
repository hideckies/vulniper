interface ProcessingProps {
    active: boolean;
    darkMode: boolean;
}

export function Processing(props: ProcessingProps) {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke={props.darkMode ? 'white' : 'black'}
                class={`w-7 h-7 ${props.active ? 'animate-spin' : null}`}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        </div>
    )
}