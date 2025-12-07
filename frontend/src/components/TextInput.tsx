import Image from "next/image";

const TextInput = ({
  label,
  placeholder,
  value,
  setValue,
  isPassword = false,
  error = "",
  success = "",
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: any;
  isPassword?: boolean;
  error?: string;
  success?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-2">
      <div className="self-stretch flex flex-col justify-start items-start">
        <div className="justify-start text-black text-2xl font-normal font-['Inter']">{label}</div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={isPassword ? "password" : "text"}
          className="focus:outline-none focus:ring-0 self-stretch py-1 border-b-4 border-[#6D66D2] flex flex-col justify-start items-start gap-2.5 overflow-hidden text-2xl "
          disabled={disabled}
        />
      </div>
      {error && (
        <div className="justify-start text-red-600 text-xl font-normal font-['Inter']">{error}</div>
      )}
      {success && (
        <div className="justify-start text-green-600 text-xl font-normal font-['Inter']">
          {success}
        </div>
      )}
    </div>
  );
};

export default TextInput;
