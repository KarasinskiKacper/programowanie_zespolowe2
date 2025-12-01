type InfoIconProps = {
    className?: string;
};

const Icon = ({ className = "" }: InfoIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
<path d="M3.5 21H21.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.5 13.36V17H9.1585L19.5 6.654L15.8475 3L5.5 13.36Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
</svg>

);

export default Icon;
