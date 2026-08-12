import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import Button from '@/components/buttons/Button'
import Input from '@/components/Input'
import AppTable from '@/components/Table/AppTable'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createReport, fetchReports } from '@/redux/slices/reportSlice'
import type { CaseStatus } from '@/services/reportService'
import Plus from '@/assets/icons/plus.svg?react'

const formSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    contactPhone: z.string().optional(),
    referenceId: z.string().min(1, 'Reference ID is required'),
    countryCode: z
      .string()
      .min(2, 'Country code is required')
      .max(2, 'Use a 2-letter country code')
      .regex(/^[A-Za-z]{2}$/, 'Use a 2-letter country code'),
  })
  .refine((data) => data.contactEmail || data.contactPhone, {
    message: 'Email or phone is required',
    path: ['contactEmail'],
  })

type FormType = z.infer<typeof formSchema>

type ReportRow = {
  caseId: string
  referenceId: string
  status: CaseStatus
  createdAt: string
}

const statusStyles: Record<CaseStatus, string> = {
  PENDING_CONNECTION: 'bg-[#FDF8EF] text-[#DF9300]',
  CONNECTED: 'bg-[#FDF8EF] text-[#DF9300]',
  PROCESSING: 'bg-[#FDF8EF] text-[#DF9300]',
  REPORT_READY: 'bg-[#EBFAF5] text-[#0CB95B]',
  FAILED: 'bg-[#FDEDED] text-[#E31E18]',
  EXPIRED: 'bg-[#FDEDED] text-[#E31E18]',
}

const columns: ColumnDef<ReportRow>[] = [
  {
    accessorKey: 'referenceId',
    header: 'REFERENCE',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <div
          className={`${statusStyles[status]} capitalize py-2 px-4 w-fit rounded-2xl text-sm`}
        >
          {status.replaceAll('_', ' ').toLowerCase()}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString(),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to={`/financial-reports/${row.original.caseId}`}
        className="text-sm text-[#0E1B28] dark:text-[#FAD645] underline"
      >
        View
      </Link>
    ),
  },
]

const FinancialReports = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { cases, isLoading, isCreating } = useAppSelector((state) => state.report)
  const [showCreate, setShowCreate] = useState(false)

  const tableData: ReportRow[] = cases.map((c) => ({
    caseId: c.caseId,
    referenceId: c.referenceId,
    status: c.status,
    createdAt: c.createdAt,
  }))

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      contactEmail: '',
      contactPhone: '',
      referenceId: '',
      countryCode: 'US',
    },
  })

  useEffect(() => {
    dispatch(fetchReports())
  }, [dispatch])

  const onSubmit = async (data: FormType) => {
    try {
      const result = await dispatch(
        createReport({
          fullName: data.fullName,
          contactEmail: data.contactEmail || undefined,
          contactPhone: data.contactPhone || undefined,
          referenceId: data.referenceId,
          countryCodes: [data.countryCode.toUpperCase()],
        })
      ).unwrap()
      toast.success('Report request created')
      setShowCreate(false)
      reset()
      await dispatch(fetchReports())
      navigate(`/financial-reports/${result.caseId}`)
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to create report')
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Financial Reports
          </h2>
          <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
            Create and track bank-connected financial reports.
          </p>
        </div>
        <Button
          className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&]:text-sm [&&]:h-[28px] [&&]:px-2 [&&]:py-3"
          onClick={() => setShowCreate(true)}
        >
          <span className="flex items-center gap-2 text-sm">
            <Plus width={16} height={16} />
            New Report
          </span>
        </Button>
      </div>

      <Card className="w-full bg-white dark:bg-[#0D0D0D]">
        <CardContent className="px-6 py-8">
          {isLoading && cases.length === 0 ? (
            <div className="text-center py-8 text-[#82898F]">Loading reports...</div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8 text-[#82898F]">
              No reports yet. Create one to send a bank connection link.
            </div>
          ) : (
            <AppTable data={tableData} columns={columns} />
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white dark:bg-[#0D0D0D]">
          <DialogHeader>
            <DialogTitle className="text-[#0E1B28] dark:text-[#D7E4F1]">
              Create Financial Report
            </DialogTitle>
            <DialogDescription className="text-[#82898F] dark:text-[#9CA3AF]">
              Applicant will receive a link to connect their bank account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
            <Input
              name="referenceId"
              type="text"
              placeholder="Reference ID"
              control={control}
              error={errors.referenceId?.message}
              classname="w-full"
            />
            <Input
              name="countryCode"
              type="text"
              placeholder="Country code (e.g. US, NG, GB)"
              control={control}
              error={errors.countryCode?.message}
              classname="w-full"
            />
            <Input
              name="fullName"
              type="text"
              placeholder="Full name"
              control={control}
              error={errors.fullName?.message}
              classname="w-full"
            />
            <Input
              name="contactEmail"
              type="email"
              placeholder="Contact email"
              control={control}
              error={errors.contactEmail?.message}
              classname="w-full"
            />
            <Input
              name="contactPhone"
              type="text"
              placeholder="Contact phone"
              control={control}
              error={errors.contactPhone?.message}
              classname="w-full"
            />
            <DialogFooter>
              <Button
                type="button"
                className="bg-white dark:bg-[#1C1C1C] border border-[#E0E0E0] dark:border-[#333333] text-[#0E1B28] dark:text-[#D7E4F1]"
                onClick={() => {
                  setShowCreate(false)
                  reset()
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FinancialReports
