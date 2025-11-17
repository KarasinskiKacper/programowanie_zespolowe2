const Button = ({
    label,
	onClick,
	type = "base",
	size = "medium",
}: {
    label: string;
    onClick: any;
    type?: "base" | "outline";
    size?: "small" | "medium" | "large";
}) => {
	const style = {
		button: {
			base: "self-stretch py-4 bg-[#6D66D2] inline-flex justify-center items-center gap-2.5 overflow-hidden",
			outline: "self-stretch py-4 outline outline-4 outline-offset-[-4px] outline-[#6D66D2] inline-flex justify-center items-center gap-2.5 overflow-hidden"
		},
		text: {
			base: "justify-start text-white text-3xl font-normal font-['Inter']",
			outline: "justify-start text-black font-normal font-['Inter']"
		}
	}

	style.text.outline += size === "small" ? " text-xl" : size === "large" ? " text-4xl" : " text-3xl";
	style.text.base += size === "small" ? " text-xl" : size === "large" ? " text-4xl" : " text-3xl";

    return (
       <div data-property-1="Default" className={style.button[type]} onClick={onClick}>
			<div className={style.text[type]}>{label}</div>
		</div>
    );
};

export default Button;
