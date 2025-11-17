type IconProps = {
    className?: string;
};

const Icon = ({ className = "" }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21.409 9.353C21.8893 9.60841 22.291 9.98969 22.5712 10.456C22.8514 10.9223 22.9994 11.456 22.9994 12C22.9994 12.544 22.8514 13.0777 22.5712 13.544C22.291 14.0103 21.8893 14.3916 21.409 14.647L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033C4 2.723 6.534 1.264 8.597 2.385L21.409 9.353Z" fill="currentColor"/>
    </svg>  
);

export default Icon;
