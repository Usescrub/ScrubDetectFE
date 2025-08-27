import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Input from '@/components/Input'
import Button from '@/components/buttons/Button'

import userIcon from '@/assets/icons/components/User'
import MailIcon from '@/assets/icons/components/MailIcon'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
  })
  .required()
type ContactUsFormType = z.infer<typeof formSchema>

export default function JoinUs() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactUsFormType>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
  })

  const onSubmit = (data: ContactUsFormType) => {
    console.log(data)
    window.location.href = 'https://calendly.com/pajayi-usescrub/30min'
  }

  return (
    <div className="max-w-[508px] w-full h-[425px]">
      <div className="mb-7 text">
        <h2 className="font-semibold text-[2rem] mb-2">Contact Us</h2>
        <p className="text-light-grey font-normal">
          Get in touch with our sales team to learn how we can help your business prevent fraud.
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
        <div className="controls w-full">
          <Button
            className="bg-yellow dark:text-black"
            onClick={handleSubmit(onSubmit)}
          >
            Contact Us
          </Button>
        </div>
      </form>
    </div>
  )
}
