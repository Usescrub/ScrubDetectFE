import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { login } from '@/redux/slices/authSlice'

import Input from '@/components/Input'
import PromptLink from '@/components/PromptLink'

import MailIcon from '@/assets/icons/components/MailIcon'
import googleIcon from '@/assets/icons/google.svg'
import KeyIcon from '@/assets/icons/components/KeyIcon'
import Button from '@/components/buttons/Button'
import UnauthenticatedLayout from '@/layouts/UnauthenticatedLayout'

const formSchema = z
  .object({
    email: z.email(),
    password: z.string(),
  })
  .required()

type FormType = z.infer<typeof formSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: FormType) => {
    try {
      await dispatch(login({ email: data.email, password: data.password }))
      toast.success('Login successful')
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error instanceof Error
          ? error.message
          : 'Login failed. Please check your credentials and try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <UnauthenticatedLayout>
      <div className="max-w-[508px] h-[405px] w-full">
        <div className="mb-7 text">
          <h2 className="font-semibold text-[2rem] mb-2">Log In</h2>
          <p className="text-light-grey font-normal">
            Log in to monitor transactions, detect fraud, and stay ahead of
            threats.
          </p>
        </div>
        <div className="controls mb-5">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            control={control}
            icon={MailIcon}
            error={errors.email?.message}
          />
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            control={control}
            icon={KeyIcon}
            error={errors.password?.message}
          />
          <PromptLink
            prompt="Forgot your password?"
            action="Reset it here"
            path="/forgot-password"
          />
          <div className="flex w-full justify-between my-5 gap-2.5">
            <Button className="bg-[#E9E9E9] dark:bg-[#232323] gap-2.5" path="">
              <span className="font-medium text-black dark:text-white">
                Sign in with Google
              </span>
              <img src={googleIcon} alt="google-icon" width={24} height={24} />
            </Button>
            <Button
              className="bg-yellow"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <span className="text-white dark:text-black">
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </span>
            </Button>
          </div>
          <PromptLink
            prompt="New to Scrub.io?"
            action="Sign Up"
            path="/signup"
          />
        </div>
      </div>
    </UnauthenticatedLayout>
  )
}
