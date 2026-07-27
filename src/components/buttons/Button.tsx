import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type ButtonProps = {
  className?: string
  children: ReactNode
  path?: string
  isLoading?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  className,
  path,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  const CompButton = (
    <button
      className={cn(
        'flex justify-center items-center gap-2 rounded-full w-full h-[49px] py-3.5 px-8 cursor-pointer',
        'brightness-100 transition-[transform,opacity,filter,background-color,color,box-shadow] duration-200 ease-out',
        'hover:brightness-95 hover:scale-[1.02] active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAD645]/60 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100',
        'motion-reduce:transition-none motion-reduce:active:scale-100',
        className,
      )}
      {...props}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
    >
      {isLoading && (
        <span
          className="size-4 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden
        />
      )}
      {children}
    </button>
  )
  if (path) {
    return <Link to={path}>{CompButton}</Link>
  }
  return CompButton
}
