const Button = ({
    label,
	onClick,
	type = "base",
	size = "medium",
	color = "primary",
	className = "",
	classNameT = ""
}: {
    label: string;
    onClick: any;
    type?: "base" | "outline";
    size?: "small" | "medium" | "large";
	color?: "primary" | "secondary" | "red";
	className?: string;
	classNameT?: string;
}) => {
	const c = {primary: "#6D66D2", secondary: "#ACD266", red: "#F35454"}[color];
	const style = {
		button: {
			base: `self-stretch py-4 bg-[${c}] inline-flex justify-center items-center gap-2.5 overflow-hidden`,
			outline: `self-stretch py-4 outline outline-4 outline-offset-[-4px] outline-[${c}] inline-flex justify-center items-center gap-2.5 overflow-hidden`
		},
		text: {
			base: "justify-start text-white text-3xl font-normal font-['Inter']",
			outline: "justify-start text-black font-normal font-['Inter']"
		}
	}

	style.text.outline += size === "small" ? " text-xl" : size === "large" ? " text-4xl" : " text-3xl";
	style.text.base += size === "small" ? " text-xl" : size === "large" ? " text-4xl" : " text-3xl";

    return (
       <div className={style.button[type] + " " + className} onClick={onClick}>
			<div className={style.text[type] + " " + classNameT}>{label}</div>
		</div>
    );
};

export default Button;
