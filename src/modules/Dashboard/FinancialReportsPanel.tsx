import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ColumnDef } from '@tanstack/react-table'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { toast } from 'sonner'

import Button from '@/components/buttons/Button'
import Input from '@/components/Input'
import AppTable from '@/components/Table/AppTable'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
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
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
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

const FinancialReportsPanel = () => {
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

  const lineChartData = useMemo(() => {
    const days = 14
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const buckets = Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (days - 1 - i))
      const key = date.toISOString().slice(0, 10)
      return {
        key,
        label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        reports: 0,
        completed: 0,
      }
    })

    const byKey = new Map(buckets.map((b) => [b.key, b]))

    for (const item of cases) {
      const created = new Date(item.createdAt)
      created.setHours(0, 0, 0, 0)
      const key = created.toISOString().slice(0, 10)
      const bucket = byKey.get(key)
      if (!bucket) continue
      bucket.reports += 1
      if (item.status === 'REPORT_READY') bucket.completed += 1
    }

    return buckets.map(({ label, reports, completed }) => ({
      label,
      reports,
      completed,
    }))
  }, [cases])

  const completedCount = cases.filter((c) => c.status === 'REPORT_READY').length

  const onSubmit = async (data: FormType) => {
    try {
      await dispatch(
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
      navigate('/financial-reports')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to create report')
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-[#82898F] dark:text-[#9CA3AF]">
          Create and track bank-connected financial reports.
        </p>
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

      <div className="flex flex-col lg:flex-row gap-5 mb-6">
        <Card className="w-full bg-white dark:bg-[#0D0D0D]">
          <CardDescription>Reports Over Time</CardDescription>
          <CardContent className="px-0 h-[220px]">
            {isLoading && cases.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#82898F]">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#82898F' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#82898F' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    name="Created"
                    stroke="#FAD645"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#FAD645' }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#0CB95B"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#0CB95B' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:max-w-[280px] bg-white dark:bg-[#0D0D0D]">
          <CardDescription>Summary</CardDescription>
          <CardContent className="px-0">
            <p className="font-bold text-3xl">{cases.length}</p>
            <p className="text-sm text-[#82898F] mt-1">Total reports</p>
            <p className="font-bold text-2xl mt-6">{completedCount}</p>
            <p className="text-sm text-[#82898F] mt-1">Completed</p>
          </CardContent>
        </Card>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2 text-sm">
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

export default FinancialReportsPanel
