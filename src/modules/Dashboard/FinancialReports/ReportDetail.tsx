import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import Button from '@/components/buttons/Button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  clearCurrentCase,
  fetchReportDetail,
} from '@/redux/slices/reportSlice'
import type { CaseStatus } from '@/services/reportService'

const POLL_STATUSES: CaseStatus[] = [
  'PENDING_CONNECTION',
  'CONNECTED',
  'PROCESSING',
]

const statusStyles: Record<CaseStatus, string> = {
  PENDING_CONNECTION: 'bg-[#FDF8EF] text-[#DF9300]',
  CONNECTED: 'bg-[#FDF8EF] text-[#DF9300]',
  PROCESSING: 'bg-[#FDF8EF] text-[#DF9300]',
  COMPLETED: 'bg-[#EBFAF5] text-[#0CB95B]',
  FAILED: 'bg-[#FDEDED] text-[#E31E18]',
  EXPIRED: 'bg-[#FDEDED] text-[#E31E18]',
}

const ReportDetail = () => {
  const { caseId } = useParams<{ caseId: string }>()
  const dispatch = useAppDispatch()
  const { currentCase, isLoading, error } = useAppSelector((state) => state.report)

  useEffect(() => {
    if (!caseId) return
    dispatch(fetchReportDetail(caseId))
    return () => {
      dispatch(clearCurrentCase())
    }
  }, [caseId, dispatch])

  useEffect(() => {
    if (!caseId || !currentCase) return
    if (!POLL_STATUSES.includes(currentCase.status)) return

    const id = window.setInterval(() => {
      dispatch(fetchReportDetail(caseId))
    }, 5000)

    return () => window.clearInterval(id)
  }, [caseId, currentCase?.status, dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  if (isLoading && !currentCase) {
    return (
      <div className="text-center py-16 text-[#82898F]">Loading report...</div>
    )
  }

  if (!currentCase) {
    return (
      <div className="text-center py-16">
        <p className="text-[#82898F] mb-4">Report not found.</p>
        <Link to="/financial-reports" className="underline">
          Back to reports
        </Link>
      </div>
    )
  }

  const report = currentCase.report

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/financial-reports"
            className="text-sm text-[#82898F] hover:underline"
          >
            ← Back to reports
          </Link>
          <h2 className="text-2xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mt-2">
            {currentCase.referenceId}
          </h2>
          <p className="text-sm text-[#82898F] mt-1">
            Subject: {currentCase.subjectId}
          </p>
        </div>
        <div
          className={`${statusStyles[currentCase.status]} capitalize py-2 px-4 w-fit rounded-2xl text-sm`}
        >
          {currentCase.status.replaceAll('_', ' ').toLowerCase()}
        </div>
      </div>

      <Card className="bg-white dark:bg-[#0D0D0D]">
        <CardContent className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#82898F]">Created</p>
            <p className="text-[#0E1B28] dark:text-[#D7E4F1]">
              {new Date(currentCase.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[#82898F]">Connection completed</p>
            <p className="text-[#0E1B28] dark:text-[#D7E4F1]">
              {currentCase.connectionCompletedAt
                ? new Date(currentCase.connectionCompletedAt).toLocaleString()
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-[#82898F]">Report completed</p>
            <p className="text-[#0E1B28] dark:text-[#D7E4F1]">
              {currentCase.reportCompletedAt
                ? new Date(currentCase.reportCompletedAt).toLocaleString()
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-[#82898F]">Webhook delivered</p>
            <p className="text-[#0E1B28] dark:text-[#D7E4F1]">
              {currentCase.webhookDeliveredAt
                ? new Date(currentCase.webhookDeliveredAt).toLocaleString()
                : '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      {POLL_STATUSES.includes(currentCase.status) && (
        <Card className="bg-white dark:bg-[#0D0D0D]">
          <CardContent className="px-6 py-8 text-center text-[#82898F]">
            Waiting for the applicant to connect their bank and for the report
            to finish generating. This page refreshes automatically.
          </CardContent>
        </Card>
      )}

      {currentCase.status === 'COMPLETED' && report && (
        <Card className="bg-white dark:bg-[#0D0D0D]">
          <CardContent className="px-6 py-6 flex flex-col gap-4">
            <div>
              <p className="text-[#82898F] text-sm">Score</p>
              <p className="text-3xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
                {report.score}
              </p>
            </div>
            {report.reportPdfUrl && (
              <Button
                className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit"
                onClick={() => window.open(report.reportPdfUrl!, '_blank')}
              >
                Open PDF report
              </Button>
            )}
            <pre className="text-xs overflow-auto max-h-96 rounded bg-[#F9F9FB] dark:bg-[#161616] p-4 text-[#0E1B28] dark:text-[#D7E4F1]">
              {JSON.stringify(report.report, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {(currentCase.status === 'FAILED' || currentCase.status === 'EXPIRED') && (
        <Card className="bg-white dark:bg-[#0D0D0D]">
          <CardContent className="px-6 py-8 text-center text-[#E31E18]">
            This report {currentCase.status.toLowerCase()}. Create a new request
            to try again.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ReportDetail
