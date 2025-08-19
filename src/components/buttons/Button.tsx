import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

type ButtonProps = {
  className?: string
  children: ReactNode
  path?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  className,
  path,
  ...props
}: ButtonProps) {
  const CompButton = (
    <button
      className={`${className} flex justify-center items-center rounded-full w-[245px] h-[49px] py-3.5 px-8 cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  )
  if (path) {
    return <Link to={path}>{CompButton}</Link>
  }
  return CompButton
}
