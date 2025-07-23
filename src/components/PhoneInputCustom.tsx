import "react-phone-input-2/lib/style.css";
import ArrowDown from "./icons/ArrowDown";
import NigeriaFlag from '../assets/icons/NG.svg'

type PhoneInputProps = {
  type: string;
  placeholder: string;
  classname?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export default function PhoneInputCustom({
  type,
  placeholder,
  classname,
  icon: Icon,
}: PhoneInputProps) {
  return (
    <div
      className={`relative bg-[#F9F9FB] dark:bg-[#0D0D0D] flex rounded-full px-2.5 py-2 items-center gap-x-3 ${classname}`}
    >
      <div className="flex">
        <div className="rounded-full w-11 h-11 bg-[#E8E8E9] dark:bg-[#222224] flex items-center justify-center mr-5">
          <Icon />
        </div>
        <div className="flex w-[90px] items-center justify-center gap-1">
          <img src={NigeriaFlag} alt="nigerian-flag" />
          <div className="flex justify-center gap-1 items-center w-14.5">
            <span className="text-light-grey">+234</span>
            <ArrowDown/>
          </div>
        </div>
      </div>

      <input
        type={type}
        placeholder={placeholder}
        className="py-2 basis-[50%] h-full w-full focus:outline-none text-black focus-visible:outline-none bg-[#F9F9FB] dark:bg-[#0D0D0D] dark:text-white placeholder:text-light-grey border-l-2 border-[#E8E8E9] dark:border-[#222224] placeholder:pl-3 pl-3"
      />
    </div>
  );
}
