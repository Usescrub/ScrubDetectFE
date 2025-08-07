import ArrowDown from "@/assets/icons/components/ArrowDown";

type SelectProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  placeholder: string;
  classname?: string;
};

export default function Select({
  icon: Icon,
  classname,
  placeholder,
}: SelectProps) {
  return (
    <div
      className={`relative bg-[#F9F9FB] dark:bg-[#0D0D0D] flex rounded-full px-2.5 py-2 items-center gap-x-3 ${classname}`}
    >
      <div className="rounded-full w-11 h-11 bg-[#E8E8E9] dark:bg-[#222224] flex items-center justify-center">
        <Icon />
      </div>

      <select
        name="country"
        id="country"
        className="text-light-grey appearance-none w-full bg-transparent outline-none pr-8"
      >
        <option value="" disabled selected>
          {placeholder}
        </option>
      </select>

      <ArrowDown classname="absolute right-5 pointer-events-none" />
    </div>
  );
}
