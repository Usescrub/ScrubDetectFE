import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Input from '@/components/Input'
import Button from '@/components/buttons/Button'

import userIcon from '@/assets/icons/components/User'
import MailIcon from '@/assets/icons/components/MailIcon'
import PhoneIcon from '@/assets/icons/components/PhoneIcon'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z
      .string()
      .regex(/^\+[0-9]{1,3}[0-9]{10}$/, 'Invalid Phone number')
      .min(1, 'Phone number is required'),
    email: z.email('Invalid email address'),
  })
  .required({
    firstName: true,
  })
type JoinUsFormType = z.infer<typeof formSchema>

export default function JoinUs() {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinUsFormType>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  })

  const onSubmit = (data: JoinUsFormType) => {
    console.log(data)
    navigate('/signup/details')
  }

  return (
    <div className="max-w-[508px] w-full h-[425px]">
      <div className="mb-7 text">
        <h2 className="font-semibold text-[2rem] mb-2">Join Us</h2>
        <p className="text-light-grey font-normal">
          Sign up and start securing your transactions with AI-powered fraud
          prevention.
        </p>
      </div>
      <form className="flex flex-col justify-center items-center gap-5">
        <div className="w-full flex gap-x-3 justify-between items-center">
          <Input
            type="text"
            placeholder="First Name"
            icon={userIcon}
            name="firstName"
            control={control}
            error={errors.firstName?.message}
          />
          <Input
            type="text"
            placeholder="Last Name"
            icon={userIcon}
            name="lastName"
            control={control}
            error={errors.lastName?.message}
          />
        </div>
        <Input
          type="email"
          placeholder="Enter your work email"
          icon={MailIcon}
          classname="w-full"
          name="email"
          control={control}
          error={errors.email?.message}
        />
        <Input
          phone
          type="tel"
          placeholder="Enter your phone number"
          icon={PhoneIcon}
          name="phone"
          control={control}
          classname="w-full overflow-visible z-50"
          error={errors.phone?.message}
        />
        <div className="controls flex justify-between items-center w-full">
          <Button className="bg-btn-lightGray dark:bg-[#232323]" path="/login">
            Back To Log In
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
