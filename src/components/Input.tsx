type InputProps = {
  type: string;
  placeholder: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  passwordIcon?: string;
  classname?: string
};

export default function Input({
  type,
  placeholder,
  passwordIcon,
  classname,
  icon: Icon
}: InputProps) {
  return (
    <div className={`relative bg-[#F9F9FB] dark:bg-[#0D0D0D] flex rounded-full px-2.5 py-2 items-center gap-x-3 ${classname}`}>
      <div className="rounded-full w-11 h-11 bg-[#E8E8E9] dark:bg-[#222224] flex items-center justify-center">
        <Icon/>
      </div>

      <input
        type={type}
        placeholder={placeholder}
        className="py-2 basis-[50%] h-full w-full focus:outline-none text-black focus-visible:outline-none bg-[#F9F9FB] dark:bg-[#0D0D0D] dark:text-white placeholder:text-light-grey"
      />

      {passwordIcon && (
        <div className="w-4.5 h-4.5 absolute right-4">
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
