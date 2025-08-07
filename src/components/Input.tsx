import { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

type InputProps = {
  type: string;
  placeholder: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  passwordIcon?: string;
  classname?: string;
  phone?: boolean;
};

export default function Input({
  type,
  placeholder,
  passwordIcon,
  classname,
  icon: Icon,
  phone,
}: InputProps) {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const inputType = type === "password" && passwordToggle ? "text" : type;
  const phoneClass = type === "tel" ? "border-l-2 border-[#E8E8E9] dark:border-[#222224] placeholder:pl-1 pl-2" : "";

  return (
    <div
      className={`relative bg-[#F9F9FB] dark:bg-[#0D0D0D] flex rounded-full px-2.5 py-2 items-center gap-x-3 ${classname}`}
    >
      <div className="rounded-full w-11 h-11 bg-[#E8E8E9] dark:bg-[#222224] flex items-center justify-center">
        <Icon />
      </div>

      {phone && (
        <PhoneInput
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={setPhoneNumber}
          defaultCountry="NG"
          className="w-full input-phone-number my-phone-input-container"
        />
      )}

      {!phone && (
        <input
          type={inputType}
          placeholder={placeholder}
          className={`py-2 h-full w-full focus:outline-none text-black focus-visible:outline-none bg-[#F9F9FB] dark:bg-[#0D0D0D] dark:text-white placeholder:text-light-grey ${phoneClass}`}
        />
      )}

      {passwordIcon && (
        <div
          className="w-4.5 h-4.5 absolute right-4 cursor-pointer"
          onClick={() => setPasswordToggle(!passwordToggle)}
        >
          <img
            src={passwordIcon}
            alt="see-password"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
