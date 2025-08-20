import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Input from '@/components/Input'

import keyIcon from '@/assets/icons/components/KeyIcon'
import Button from '@/components/buttons/Button'

type PasswordProps = {
  title: string
}

const formSchema = z
  .object({
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Rewrite password'),
  })
  .required()
type JoinUsFormType = z.infer<typeof formSchema>

export default function Password({ title }: PasswordProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinUsFormType>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: JoinUsFormType) => {
    console.log(data)
  }

  return (
    <div className="w-[508px]">
      <div className="w-full mb-8">
        <h2 className="text-[2rem] font-semibold mb-3">{title}</h2>
        <p className="text-light-grey">
          Choose a strong password to protect your account.
        </p>
      </div>
      <div>
        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={keyIcon}
          classname="w-full mb-5"
          control={control}
          error={errors.password?.message}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          icon={keyIcon}
          classname="w-full mb-5"
          control={control}
          error={errors.confirmPassword?.message}
        />
        <div className="flex justify-between items-center">
          <Button className="bg-btn-lightGray dark:bg-[#232323]" path="/login">
            Back to Log In
          </Button>
          <Button
            className="bg-yellow dark:text-black"
            onClick={handleSubmit(onSubmit)}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  )
}
