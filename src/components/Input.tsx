import { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import { useController } from 'react-hook-form'

import type { Control } from 'react-hook-form'

import EyeIcon from '@/assets/icons/eye.svg?react'

import 'react-phone-number-input/style.css'

type InputProps = {
  type: string
  placeholder: string
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  classname?: string
  phone?: boolean
  name: string
  defaultValue?: string
  control?: Control<any>
  error?: string
}

export default function Input({
  type,
  placeholder,
  classname,
  name,
  control,
  defaultValue,
  icon: Icon,
  phone,
  error,
}: InputProps) {
  const { field } = useController({
    name: name,
    control,
    defaultValue,
  })

  const [passwordToggle, setPasswordToggle] = useState(false)
  const inputType = type === 'password' && passwordToggle ? 'text' : type
  const phoneClass =
    type === 'tel'
      ? 'border-l-2 border-[#E8E8E9] dark:border-[#222224] placeholder:pl-1 pl-2'
      : ''

  return (
    <div className="mb-4 w-full relative">
      <div
        className={`relative bg-[#F9F9FB] dark:bg-[#0D0D0D] flex rounded-full px-2.5 py-2 items-center gap-x-3 w-full ${classname}`}
      >
        {Icon && (
          <div className="rounded-full w-11 h-11 bg-[#E8E8E9] dark:bg-[#222224] flex items-center justify-center">
            <Icon />
          </div>
        )}

        {phone ? (
          <PhoneInput
            placeholder="Enter your phone number"
            value={field.value}
            onChange={field.onChange}
            defaultCountry="NG"
            className="w-full input-phone-number my-phone-input-container"
          />
        ) : (
          <input
            type={inputType}
            value={field.value}
            onChange={field.onChange}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={`py-2 h-full w-full focus:outline-none text-black focus-visible:outline-none bg-[#F9F9FB] dark:bg-[#0D0D0D] dark:text-white placeholder:text-light-grey ${phoneClass}`}
          />
        )}

        {type === 'password' && (
          <div
            className="w-4.5 h-4.5 absolute right-4 cursor-pointer"
            onClick={() => setPasswordToggle(!passwordToggle)}
          >
            <EyeIcon />
          </div>
        )}
      </div>
      {error && (
        <div className=" absolute bottom-[-35%]">
          <small className="text-[#dd0000]">{error}</small>
        </div>
      )}
    </div>
  )
}
