type IconProps = {
    className?: string;
};

const Icon = ({ className = "" }: IconProps) => (
    <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
<rect width="64" height="64" rx="32" fill="#ACD266"/>
<path d="M32 32C36.4188 32 40 28.4187 40 24C40 19.5813 36.4188 16 32 16C27.5813 16 24 19.5813 24 24C24 28.4187 27.5813 32 32 32ZM37.6 34H36.5562C35.1687 34.6375 33.625 35 32 35C30.375 35 28.8375 34.6375 27.4438 34H26.4C21.7625 34 18 37.7625 18 42.4V45C18 46.6562 19.3438 48 21 48H43C44.6562 48 46 46.6562 46 45V42.4C46 37.7625 42.2375 34 37.6 34Z" fill="white"/>

    </svg>
);

export default Icon;
