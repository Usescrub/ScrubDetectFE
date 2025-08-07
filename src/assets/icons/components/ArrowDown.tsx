type ArrowDownProps = {
  classname?: string;
};

export default function ArrowDown({ classname }: ArrowDownProps) {
  return (
    <svg
      className={`text-[#595959] ${classname}`}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.94 6.7124L10.05 11.6024C9.4725 12.1799 8.5275 12.1799 7.95 11.6024L3.06 6.7124"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
