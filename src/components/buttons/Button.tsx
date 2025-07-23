import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  className?: string;
  children: ReactNode;
  path: string;
};

export default function Button({ children, className, path }: ButtonProps) {
  return (
    <Link to={path}>
      <button
        className={`${className} flex justify-center items-center rounded-full w-[245px] h-[49px] py-3.5 px-8 cursor-pointer`}
      >
        {children}
      </button>
    </Link>
  );
}
