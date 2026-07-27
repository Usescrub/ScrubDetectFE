import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import Button from '@/components/buttons/Button'
import { Card, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import AppTable from '@/components/Table/AppTable'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'

import ArrowLeft from '@/assets/icons/arrow-left.svg?react'
import Plus from '@/assets/icons/plus.svg?react'
import Calendar from '@/assets/icons/calendar.svg?react'
import Filter from '@/assets/icons/filter.svg?react'
import Export from '@/assets/icons/export.svg?react'
import Reload from '@/assets/icons/reload.svg?react'
import {
  fetchAllScanResults,
  rejectScanAnalysis,
  setCurrentScan,
} from '@/redux/slices/scanSlice'
import type { ScanResult } from '@/services/scanService'
import { usageService } from '@/services/usageService'
import { PricingModal } from '@/components/PricingModal'
import FinancialReportsPanel from './FinancialReportsPanel'
import { createScanColumns } from './Scan/ScanActionsMenu'
import RejectScanDialog from './Scan/RejectScanDialog'

const filterObject = {
  completed: 'bg-[#0CB95B]',
  failed: 'bg-[#E31E18]',
  processing: 'bg-[#DF9300]',
  rejected: 'bg-[#E31E18]',
}

type DashboardTab = 'scans' | 'financial-reports'

const Dashboard = () => {
  const [filter, setFilter] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<DashboardTab>('scans')
  const [rejectTarget, setRejectTarget] = useState<ScanResult | null>(null)
  const [isRejecting, setIsRejecting] = useState(false)
  const { scanHistory } = useAppSelector((state) => state.scan)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [quota, setQuota] = useState<{
    scanAllowance: number
    scansUsed: number
    scansRemaining: number
    plan: string
  } | null>(null)
  const [loadingQuota, setLoadingQuota] = useState(true)
  const [showPricing, setShowPricing] = useState(false)

  useEffect(() => {
    dispatch(fetchAllScanResults())
  }, [dispatch])

  useEffect(() => {
    let cancelled = false
    const fetchQuota = async () => {
      try {
        setLoadingQuota(true)
        const data = await usageService.getQuota()
        if (!cancelled) setQuota(data)
      } catch {
        if (!cancelled) {
          setQuota({ scanAllowance: 0, scansUsed: 0, scansRemaining: 0, plan: 'none' })
        }
      } finally {
        if (!cancelled) setLoadingQuota(false)
      }
    }
    fetchQuota()
    return () => {
      cancelled = true
    }
  }, [])

  const updateFilter = (obj?: string) => {
    if (!obj) {
      setFilter([])
      return
    }

    const lower = obj.toLowerCase()
    setFilter((prev) =>
      prev.includes(lower)
        ? prev.filter((item) => item !== lower)
        : [...prev, lower]
    )
  }

  const handleViewScan = useCallback(
    (scan: ScanResult) => {
      dispatch(setCurrentScan(scan))
      navigate('/scan')
    },
    [dispatch, navigate]
  )

  const handleRejectScan = async () => {
    if (!rejectTarget) return
    setIsRejecting(true)
    try {
      await dispatch(rejectScanAnalysis(rejectTarget.id)).unwrap()
      toast.success('Analysis rejected')
      setRejectTarget(null)
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to reject analysis')
    } finally {
      setIsRejecting(false)
    }
  }

  const dashboardColumns = useMemo(
    () =>
      createScanColumns(handleViewScan, (scan) => setRejectTarget(scan)),
    [handleViewScan]
  )

  const filteredScans = useMemo(() => {
    if (filter.length === 0) return scanHistory
    return scanHistory.filter((scan) => {
      const status =
        scan.reviewStatus === 'rejected' ? 'rejected' : scan.scanStatus
      return filter.includes(status)
    })
  }, [filter, scanHistory])

  const scansUsed = quota?.scansUsed ?? 0
  const scanAllowance = quota?.scanAllowance ?? 0
  const scansRemaining = quota?.scansRemaining ?? 0
  const plan = quota?.plan ?? 'free'
  const progress = scanAllowance > 0 ? (scansUsed / scanAllowance) * 100 : 0

  const tabButtonClass = (tab: DashboardTab) =>
    cn(
      'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer',
      activeTab === tab
        ? 'border-[#FAD645] text-[#0E1B28] dark:text-[#D7E4F1]'
        : 'border-transparent text-[#82898F] dark:text-[#9CA3AF] hover:text-[#0E1B28] dark:hover:text-[#D7E4F1]'
    )

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-6 border-b border-[#E8E8E9] dark:border-[#222224] mb-6">
        <button
          type="button"
          className={tabButtonClass('scans')}
          onClick={() => setActiveTab('scans')}
        >
          Scans
        </button>
        <button
          type="button"
          className={tabButtonClass('financial-reports')}
          onClick={() => setActiveTab('financial-reports')}
        >
          Financial Reports
        </button>
      </div>

      {activeTab === 'scans' && (
        <>
          <div className="cards">
            <div className="title mb-3">
              <p>Account Usage</p>
            </div>
            <div className="flex gap-x-5 w-full">
              <Card className="w-full h-[205px]">
                <CardDescription>Scans Used This Month</CardDescription>
                <CardContent className="px-0">
                  <div className="content">
                    <p className="font-bold text-3xl">
                      {loadingQuota ? '...' : `${scansUsed}/${scanAllowance}`}
                    </p>
                    <p className="text-sm text-[#82898F] mt-1">
                      {loadingQuota ? '' : `${scansRemaining} remaining`}
                    </p>
                  </div>
                  <Progress value={progress} className="w-full h-[23px] mt-8" />
                </CardContent>
              </Card>
              <Card className="w-full h-[205px]">
                <CardDescription>Plan Limit</CardDescription>
                <CardContent className="px-0">
                  <div className="content">
                    <p className="font-bold text-3xl mb-2">
                      {loadingQuota ? '...' : `${scanAllowance} scans`}
                    </p>
                    <p className="text-[#30B0C7] text-[14px] flex items-center gap-x-3 cursor-pointer">
                      <span
                        className="flex items-center gap-x-3"
                        onClick={() => setShowPricing(true)}
                      >
                        Upgrade plans
                        <span>
                          <ArrowLeft />
                        </span>
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="table bg-white dark:bg-[#0D0D0D] dark:text-[#D7E4F1] text-[#0E1B28] rounded-2xl mt-9 px-6">
            <div className="actions flex justify-between w-full my-3 items-center">
              <div className="input w-full basis-[55%]">Search</div>
              <div className=" flex gap-x-3 basis-[45%] justify-end">
                <div className="rounded-full px-4 flex items-center h-11 cursor-pointer text-black dark:text-white gap-x-2 dark:bg-[#131313] dark:border-[#1C1C1C] bg-[#F7F7FA] border border-[#EBEBF5] min-w-[120px]">
                  <Calendar className="w-[30px] h-[30px]" />
                  <p className="text-[14px] dark:text-[#D7E4F1]">Any Date</p>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className="rounded-full px-4 flex items-center h-11 cursor-pointer text-black dark:text-white gap-x-2 dark:bg-[#131313] dark:border-[#1C1C1C] bg-[#F7F7FA] border border-[#EBEBF5] w-[110px]">
                      <Filter />
                      <p className="text-[14px] dark:text-[#D7E4F1]">Filter</p>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[290px] rounded-3xl px-0 py-0">
                    <div className="px-5 py-5">
                      <div className="mb-3 text-[#82898F] font-semibold ">
                        Status
                      </div>
                      {Object.entries(filterObject).map(([k, v]) => (
                        <div
                          className="flex gap-x-3 items-center ml-2 mb-3 cursor-pointer"
                          onClick={() => updateFilter(k)}
                          key={k}
                        >
                          <Checkbox
                            checked={filter.includes(k)}
                            onCheckedChange={() => updateFilter(k)}
                            className="cursor-pointer"
                          />
                          <div className="flex gap-x-2 items-center">
                            <div
                              className={cn('rounded-full h-[7px] w-[7px]', v)}
                            ></div>
                            <p className="capitalize">{k}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full px-5 flex justify-end py-4 shadow-[0px_0px_7px_0px_#86A7C32E]">
                      <div className="w-[150px] flex items-center justify-end gap-x-3">
                        <div
                          className="border rounded-full p-1 cursor-pointer border-[#EBEBF5]"
                          onClick={() => updateFilter()}
                        >
                          <Reload />
                        </div>
                        <PopoverClose asChild>
                          <Button className="[&]:w-fit bg-yellow [&]:px-4 [&]:h-[35px] text-[14px] font-semibold dark:text-black">
                            Save Filter
                          </Button>
                        </PopoverClose>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="rounded-full px-4 flex items-center h-11 cursor-pointer text-black dark:text-white gap-x-2 dark:bg-[#131313] dark:border-[#1C1C1C] bg-[#F7F7FA] border border-[#EBEBF5] w-fit">
                  <Export />
                  <p className="text-[14px] dark:text-[#D7E4F1]">Export CSV</p>
                </div>

                <div
                  onClick={() => navigate('/scan')}
                  className="rounded-full h-11 w-fit flex items-center justify-center cursor-pointer dark:text-white text-black gap-x-2 px-5 bg-[#FAD645]"
                >
                  <Plus />
                  <p className="text-[14px] dark:text-black">New Scan</p>
                </div>
              </div>
            </div>
            <AppTable data={filteredScans} columns={dashboardColumns} />
          </div>
        </>
      )}

      {activeTab === 'financial-reports' && <FinancialReportsPanel />}

      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        currentPlan={plan}
      />

      <RejectScanDialog
        scan={rejectTarget}
        open={!!rejectTarget}
        isSubmitting={isRejecting}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null)
        }}
        onConfirm={handleRejectScan}
      />
    </div>
  )
}

export default Dashboard
