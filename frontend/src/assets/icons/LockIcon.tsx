type IconProps = {
    className?: string;
};

const Icon = ({ className = "" }: IconProps) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
<path d="M17.5 8H16.5V6C16.5 3.24 14.26 1 11.5 1C8.74 1 6.5 3.24 6.5 6V8H5.5C4.4 8 3.5 8.9 3.5 10V18C3.5 19.1 4.4 20 5.5 20H17.5C18.6 20 19.5 19.1 19.5 18V10C19.5 8.9 18.6 8 17.5 8ZM11.5 16C10.4 16 9.5 15.1 9.5 14C9.5 12.9 10.4 12 11.5 12C12.6 12 13.5 12.9 13.5 14C13.5 15.1 12.6 16 11.5 16ZM14.6 8H8.4V6C8.4 4.29 9.79 2.9 11.5 2.9C13.21 2.9 14.6 4.29 14.6 6V8Z" fill="currentColor"/>


    </svg>
);

export default Icon;
