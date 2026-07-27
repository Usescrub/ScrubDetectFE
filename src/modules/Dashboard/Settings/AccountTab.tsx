import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import type { AuthenticatedUser } from '@/redux/slices/authSlice'
import { authService } from '@/services/authService'
import { countryOptions, roleOptions } from '@/constants/formOptions'

import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/buttons/Button'

import FlagIcon from '@/assets/icons/components/FlagIcon'
import RoleIcon from '@/assets/icons/components/RoleIcon'
import UserIcon from '@/assets/icons/components/User'

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.string().min(1, 'Role is required'),
  country: z.string().min(1, 'Country is required'),
})

type FormType = z.infer<typeof schema>

type Props = {
  user: AuthenticatedUser
  onSaved: () => Promise<void>
}

const AccountTab = ({ user, onSaved }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user.fullName || '',
      phone: user.phone || '',
      role: user.role || '',
      country: user.country || '',
    },
  })

  useEffect(() => {
    reset({
      fullName: user.fullName || '',
      phone: user.phone || '',
      role: user.role || '',
      country: user.country || '',
    })
  }, [user, reset])

  const onSubmit = async (data: FormType) => {
    try {
      await authService.updateProfile(data)
      await onSaved()
      toast.success('Account updated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to update account'
      )
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 pt-0">
        <div>
          <h3 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Personal details
          </h3>
          <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
            Update how you appear across Scrub.
          </p>
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-[#82898F]">Email</label>
          <div className="rounded-full bg-[#F9F9FB] dark:bg-[#0D0D0D] px-4 py-3 text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
            {user.email}
          </div>
        </div>

        <form
          className="flex flex-col gap-2 max-w-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            name="fullName"
            type="text"
            placeholder="Full name"
            icon={UserIcon}
            classname="border text-sm"
            control={control}
            error={errors.fullName?.message}
          />
          <Input
            name="phone"
            type="tel"
            phone
            classname="border text-sm"
            placeholder="Phone number"
            control={control}
            error={errors.phone?.message}
          />
          <Select
            name="role"
            classname="border text-sm"
            options={roleOptions}
            placeholder="Select role"
            icon={RoleIcon}
            control={control}
            error={errors.role?.message}
          />
          <Select
            classname="border text-sm"
            name="country"
            options={countryOptions}
            placeholder="Select country"
            icon={FlagIcon}
            control={control}
            error={errors.country?.message}
          />
          <Button
            type="submit"
            className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit mt-2"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountTab
