import { useController } from 'react-hook-form'

import type { Control } from 'react-hook-form'

import ArrowDown from '@/assets/icons/arrow-down.svg?react'

type SelectProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  placeholder: string
  classname?: string
  options: { label: string; value: string }[]
  name: string
  control?: Control<any>
  error?: string
}

export default function Select({
  icon: Icon,
  classname,
  placeholder,
  options,
  name,
  control,
  error,
}: SelectProps) {
  const { field } = useController({
    name: name,
    control,
  })
  return (
    <div className="mb-4 w-full relative">
      <div
        className={`relative w-full bg-[#F9F9FB] dark:bg-[#0D0D0D] flex rounded-full px-2.5 py-2 items-center gap-x-3 ${classname}`}
      >
        <div className="rounded-full w-11 h-11 bg-[#E8E8E9] dark:bg-[#222224] flex items-center justify-center">
          <Icon />
        </div>

        <select
          name={name}
          value={field.value}
          onChange={field.onChange}
          className="text-light-grey appearance-none w-full bg-transparent outline-none pr-8"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-[12px]">
          <ArrowDown />
        </div>
      </div>
      {error && (
        <div className=" absolute bottom-[-35%]">
          <small className="text-[#dd0000]">{error}</small>
        </div>
      )}
    </div>
  )
}
