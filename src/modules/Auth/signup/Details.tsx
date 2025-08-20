import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/buttons/Button'

import CompanyIcon from '@/assets/icons/components/CompanyIcon'
import FlagIcon from '@/assets/icons/components/FlagIcon'
import GroupIcon from '@/assets/icons/components/GroupIcon'
import IndustryIcon from '@/assets/icons/components/IndustryIcon'
import RoleIcon from '@/assets/icons/components/RoleIcon'

const formSchema = z
  .object({
    company: z.string().min(1, 'Company name is required'),
    size: z.string().min(1, 'Specify company size'),
    industry: z.string().min(1, 'Select your Industry'),
    role: z.string().min(1, 'Select your role'),
    country: z.string().min(1, 'Select your country'),
  })
  .required()
type DetailsFormType = z.infer<typeof formSchema>

export default function Details() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DetailsFormType>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      company: '',
      size: '',
      industry: '',
      country: '',
    },
  })
  console.log(watch(), errors)

  const onSubmit = (data: DetailsFormType) => {
    console.log(data)
    // path = '/signup/verification'
  }

  return (
    <div className="max-w-[508px] w-full h-[425px]">
      <div className="mb-7 text">
        <h2 className="font-semibold text-[2rem] mb-2">
          Company & Role Details
        </h2>
        <p className="text-light-grey font-normal">
          Tell Us About Your Business & Role
        </p>
      </div>
      <form className="flex flex-col justify-center items-center gap-5">
        <Input
          name="company"
          type="text"
          placeholder="Enter your company name"
          icon={CompanyIcon}
          classname="w-full"
          control={control}
          error={errors.company?.message}
        />
        <Select
          name="country"
          options={[]}
          placeholder="Select your country"
          icon={FlagIcon}
          control={control}
          error={errors.country?.message}
        />
        <Select
          name="industry"
          options={[]}
          placeholder="Select your industry"
          icon={IndustryIcon}
          control={control}
          error={errors.industry?.message}
        />
        <div className="w-full flex justify-between gap-x-2 items-center">
          <Select
            name="role"
            options={[]}
            placeholder="Select Role"
            control={control}
            icon={RoleIcon}
            error={errors.role?.message}
          />
          <Select
            name="size"
            options={[]}
            placeholder="Company Size"
            icon={GroupIcon}
            control={control}
            error={errors.size?.message}
          />
        </div>
        <div className="controls flex justify-between items-center w-full">
          <Button
            className="bg-btn-lightGray dark:bg-[#232323]"
            path="/signup/join-us"
          >
            Go Back
          </Button>
          <Button
            className="bg-yellow dark:text-black"
            onClick={handleSubmit(onSubmit)}
          >
            Proceed
          </Button>
        </div>
      </form>
    </div>
  )
}
