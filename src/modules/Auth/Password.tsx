import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { login, clearSignupData } from '@/redux/slices/authSlice'
import { authService } from '@/services/authService'

import Input from '@/components/Input'

import keyIcon from '@/assets/icons/components/KeyIcon'
import Button from '@/components/buttons/Button'
import UnauthenticatedLayout from '@/layouts/UnauthenticatedLayout'

type PasswordProps = {
  title: string
}

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Rewrite password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
type JoinUsFormType = z.infer<typeof formSchema>

export default function Password({ title }: PasswordProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { signupData } = useAppSelector((state) => state.auth)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinUsFormType>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (!signupData.firstName || !signupData.email) {
      navigate('/signup/join-us')
    }
  }, [navigate, signupData])

  const onSubmit = async (data: JoinUsFormType) => {
    try {
      if (!signupData.firstName || !signupData.email) {
        toast.error('Please complete the previous steps first')
        navigate('/signup/join-us')
        return
      }

      await authService.createPassword({
        new_password: data.password,
      })

      dispatch(clearSignupData())

      toast.success('Password created successfully. Logging you in...')

      await dispatch(
        login({
          email: signupData.email!,
          password: data.password,
        })
      ).unwrap()

      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to create password. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <UnauthenticatedLayout>
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
            <Button
              className="bg-yellow dark:text-black"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Setting up...' : 'Proceed'}
            </Button>
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  )
}
