import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import Input from '@/components/Input'
import Button from '@/components/buttons/Button'
import PromptLink from '@/components/PromptLink'

import MailIcon from '@/assets/icons/components/MailIcon'

const formSchema = z
  .object({
    email: z.email(),
  })
  .required()

type ForgetPasswordFormType = z.infer<typeof formSchema>

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormType>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgetPasswordFormType) => {
    console.log(data)
  }

  return (
    <>
      <div className="max-w-[508px] h-[405px]">
        <div className="w-full mb-7">
          <h2 className="font-semibold text-[2rem] mb-3">Forgot Password</h2>
          <p className="text-light-grey">
            Enter your email, and we’ll send you a link to reset your password
            securely.
          </p>
        </div>
        <form className="mb-5">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            icon={MailIcon}
            control={control}
            error={errors.email?.message}
          />
          <div className="controls flex justify-between items-center">
            <Button className="bg-btn-lightGray dark:bg-[#232323]" path="../">
              Go Back
            </Button>
            <Button
              className="bg-yellow dark:text-black"
              onClick={handleSubmit(onSubmit)}
            >
              Send Reset Link
            </Button>
          </div>
        </form>
        <PromptLink prompt="New to Scrub.io?" action="Sign Up" path="/signup" />
      </div>
    </>
  )
}
