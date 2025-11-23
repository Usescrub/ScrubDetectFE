import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signup, updateSignupData } from '@/redux/slices/authSlice'

import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/buttons/Button'

import CompanyIcon from '@/assets/icons/components/CompanyIcon'
import FlagIcon from '@/assets/icons/components/FlagIcon'
import GroupIcon from '@/assets/icons/components/GroupIcon'
import IndustryIcon from '@/assets/icons/components/IndustryIcon'
import RoleIcon from '@/assets/icons/components/RoleIcon'
import UnauthenticatedLayout from '@/layouts/UnauthenticatedLayout'

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

const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Italy', value: 'IT' },
  { label: 'Spain', value: 'ES' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Norway', value: 'NO' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Finland', value: 'FI' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Austria', value: 'AT' },
  { label: 'Greece', value: 'GR' },
  { label: 'Japan', value: 'JP' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'India', value: 'IN' },
  { label: 'China', value: 'CN' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Argentina', value: 'AR' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Egypt', value: 'EG' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Israel', value: 'IL' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Russia', value: 'RU' },
  { label: 'Other', value: 'OTHER' },
]

const industryOptions = [
  { label: 'Technology', value: 'technology' },
  { label: 'Financial Services', value: 'financial_services' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Retail', value: 'retail' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Real Estate', value: 'real_estate' },
  { label: 'Consulting', value: 'consulting' },
  { label: 'Legal', value: 'legal' },
  { label: 'Marketing & Advertising', value: 'marketing_advertising' },
  { label: 'Media & Entertainment', value: 'media_entertainment' },
  { label: 'Telecommunications', value: 'telecommunications' },
  { label: 'Energy', value: 'energy' },
  { label: 'Transportation & Logistics', value: 'transportation_logistics' },
  { label: 'Hospitality & Tourism', value: 'hospitality_tourism' },
  { label: 'Food & Beverage', value: 'food_beverage' },
  { label: 'Construction', value: 'construction' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Pharmaceuticals', value: 'pharmaceuticals' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Aerospace', value: 'aerospace' },
  { label: 'Government', value: 'government' },
  { label: 'Non-Profit', value: 'non_profit' },
  { label: 'Other', value: 'other' },
]

const roleOptions = [
  { label: 'CEO / Founder', value: 'ceo_founder' },
  { label: 'CTO / Technical Director', value: 'cto_technical_director' },
  { label: 'CFO', value: 'cfo' },
  { label: 'COO', value: 'coo' },
  { label: 'VP / Vice President', value: 'vp' },
  { label: 'Director', value: 'director' },
  { label: 'Manager', value: 'manager' },
  { label: 'Senior Manager', value: 'senior_manager' },
  { label: 'Team Lead', value: 'team_lead' },
  { label: 'Senior Developer', value: 'senior_developer' },
  { label: 'Developer / Engineer', value: 'developer_engineer' },
  { label: 'Product Manager', value: 'product_manager' },
  { label: 'Project Manager', value: 'project_manager' },
  { label: 'Business Analyst', value: 'business_analyst' },
  { label: 'Data Analyst', value: 'data_analyst' },
  { label: 'Data Scientist', value: 'data_scientist' },
  { label: 'Security Engineer', value: 'security_engineer' },
  { label: 'DevOps Engineer', value: 'devops_engineer' },
  { label: 'QA Engineer', value: 'qa_engineer' },
  { label: 'UX/UI Designer', value: 'ux_ui_designer' },
  { label: 'Marketing Manager', value: 'marketing_manager' },
  { label: 'Sales Manager', value: 'sales_manager' },
  { label: 'HR Manager', value: 'hr_manager' },
  { label: 'Operations Manager', value: 'operations_manager' },
  { label: 'Consultant', value: 'consultant' },
  { label: 'Freelancer', value: 'freelancer' },
  { label: 'Student', value: 'student' },
  { label: 'Other', value: 'other' },
]

const companySizeOptions = [
  { label: '1-10 employees', value: '1-10' },
  { label: '11-50 employees', value: '11-50' },
  { label: '51-200 employees', value: '51-200' },
  { label: '201-500 employees', value: '201-500' },
  { label: '501-1000 employees', value: '501-1000' },
  { label: '1001-5000 employees', value: '1001-5000' },
  { label: '5001-10000 employees', value: '5001-10000' },
  { label: '10000+ employees', value: '10000+' },
]

export default function Details() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { signupData } = useAppSelector((state) => state.auth)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    if (!signupData.firstName || !signupData.email) {
      toast.error('Please complete the previous step first')
      navigate('/signup/join-us')
    }
  }, [navigate, signupData])

  const onSubmit = async (data: DetailsFormType) => {
    if (!signupData.firstName || !signupData.email) {
      toast.error('Please complete the previous step first')
      navigate('/signup/join-us')
      return
    }

    try {
      dispatch(
        updateSignupData({
          company: data.company,
          companySize: data.size,
          industry: data.industry,
          role: data.role,
          country: data.country,
        })
      )

      await dispatch(signup()).unwrap()
      navigate('/signup/verification')
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to save details. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <UnauthenticatedLayout>
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
            options={countryOptions}
            placeholder="Select your country"
            icon={FlagIcon}
            control={control}
            error={errors.country?.message}
          />
          <Select
            name="industry"
            options={industryOptions}
            placeholder="Select your industry"
            icon={IndustryIcon}
            control={control}
            error={errors.industry?.message}
          />
          <div className="w-full flex justify-between gap-x-2 items-center">
            <Select
              name="role"
              options={roleOptions}
              placeholder="Select Role"
              control={control}
              icon={RoleIcon}
              error={errors.role?.message}
            />
            <Select
              name="size"
              options={companySizeOptions}
              placeholder="Company Size"
              icon={GroupIcon}
              control={control}
              error={errors.size?.message}
            />
          </div>
          <div className="controls flex justify-between items-center w-full gap-x-2.5">
            <Button
              className="bg-btn-lightGray dark:bg-[#232323]"
              onClick={() => navigate('/signup/join-us')}
            >
              Go Back
            </Button>
            <Button
              className="bg-yellow dark:text-black"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Proceed'}
            </Button>
          </div>
        </form>
      </div>
    </UnauthenticatedLayout>
  )
}
