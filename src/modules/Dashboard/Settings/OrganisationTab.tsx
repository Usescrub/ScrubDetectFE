import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import type { AuthenticatedUser } from '@/redux/slices/authSlice'
import { authService } from '@/services/authService'
import {
  companySizeOptions,
  industryOptions,
} from '@/constants/formOptions'

import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/buttons/Button'

import CompanyIcon from '@/assets/icons/components/CompanyIcon'
import GroupIcon from '@/assets/icons/components/GroupIcon'
import IndustryIcon from '@/assets/icons/components/IndustryIcon'

const schema = z.object({
  company: z.string().min(1, 'Company name is required'),
  companySize: z.string().min(1, 'Company size is required'),
  industry: z.string().min(1, 'Industry is required'),
})

type FormType = z.infer<typeof schema>

type Props = {
  user: AuthenticatedUser
  onSaved: () => Promise<void>
}

const OrganisationTab = ({ user, onSaved }: Props) => {
  const isAdmin = !!user.isOrgAdmin

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: user.company || '',
      companySize: user.companySize || '',
      industry: user.industry || '',
    },
  })

  useEffect(() => {
    reset({
      company: user.company || '',
      companySize: user.companySize || '',
      industry: user.industry || '',
    })
  }, [user, reset])

  const onSubmit = async (data: FormType) => {
    if (!isAdmin) return
    try {
      await authService.updateOrganisation(data)
      await onSaved()
      toast.success('Organisation updated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to update organisation'
      )
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 pt-0">
        <div>
          <h3 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Company details
          </h3>
          <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
            {isAdmin
              ? 'Update your organisation profile. Changes sync to your team.'
              : 'Only organisation admins can edit company details.'}
          </p>
        </div>

        <form
          className="flex flex-col gap-2 max-w-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset disabled={!isAdmin} className="contents">
            <Input
              name="company"
              type="text"
              placeholder="Company name"
              icon={CompanyIcon}
              control={control}
              classname="border text-sm"
              error={errors.company?.message}
            />
            <Select
              name="industry"
              classname="border text-sm"
              options={industryOptions}
              placeholder="Select industry"
              icon={IndustryIcon}
              control={control}
              error={errors.industry?.message}
            />
            <Select
              name="companySize"
              classname="border text-sm"
              options={companySizeOptions}
              placeholder="Company size"
              icon={GroupIcon}
              control={control}
              error={errors.companySize?.message}
            />
          </fieldset>
          {isAdmin && (
            <Button
              type="submit"
              className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit mt-2"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Save changes
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default OrganisationTab
