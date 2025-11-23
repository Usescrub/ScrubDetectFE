import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

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
import File from '@/assets/icons/file.svg?react'
import Plus from '@/assets/icons/plus.svg?react'
import Calendar from '@/assets/icons/calendar.svg?react'
import Filter from '@/assets/icons/filter.svg?react'
import Export from '@/assets/icons/export.svg?react'
import Reload from '@/assets/icons/reload.svg?react'
import { fetchAllScanResults } from '@/redux/slices/scanSlice'
import type { ScanResult } from '@/services/scanService'

type TableData = {
  id: string
  date: number
  status: 'completed' | 'failed' | 'processing'
  fileName: string
  type: 'PDF'
  result: 'Sensitive'
}

const filterObject = {
  completed: 'bg-[#0CB95B]',
  failed: 'bg-[#E31E18]',
  processing: 'bg-[#DF9300]',
}

const dashboardColumns: ColumnDef<ScanResult>[] = [
  {
    accessorKey: 'fileName',
    header: 'FILE NAME',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('fileName')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.scanStatus
      const classNames: Record<TableData['status'], string> = {
        completed: 'bg-[#EBFAF5] text-[#0CB95B]',
        failed: 'bg-[#FDEDED] text-[#E31E18]',
        processing: 'bg-[#FDF8EF] text-[#DF9300]',
      }
      const roundedClassname: Record<TableData['status'], string> = {
        completed: 'bg-[#0CB95B]',
        failed: 'bg-[#E31E18]',
        processing: 'bg-[#DF9300]',
      }

      return (
        <div
          className={`${classNames[status]} items-center flex capitalize py-2 px-4 w-fit rounded-2xl`}
        >
          <div
            className={`rounded-full h-[8px] w-[8px] mr-3 ${roundedClassname[status]}`}
          ></div>
          <div>{row.getValue('status')}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'fileType',
    header: 'TYPE',
    cell: ({ row }) => (
      <div className="capitalize uppercase">{row.original.fileType}</div>
    ),
  },
  {
    accessorKey: 'aiGeneratedScore',
    header: 'SCORE',
    cell: ({ row }) => (
      <div className="capitalize uppercase">
        {row.original.aiGeneratedScore * 100}%
      </div>
    ),
  },
  {
    accessorKey: 'result',
    header: 'RESULT SUMMARY',
    cell: ({ row }) => (
      <div className="capitalize uppercase">
        {row.original.aiGeneratedScore > 0.5
          ? 'AI Generated'
          : 'Human Generated'}
      </div>
    ),
  },
  {
    accessorKey: 'uploadDate',
    header: 'DATE',
  },
  {
    id: 'actions',
    header: () => (
      <div className="w-full flex items-center justify-center">ACTIONS</div>
    ),
    enableHiding: false,
    cell: () => {
      return (
        <div className="w-full flex items-center justify-center">
          <div className="rounded-full w-[35px] h-[35px] bg-[#F5F6F6] dark:bg-[#161616] flex items-center justify-center">
            <File />
          </div>
        </div>
      )
    },
  },
]

const Dashboard = () => {
  const [filter, setFilter] = useState<string[]>([])
  const { scanHistory, isLoading } = useAppSelector((state) => state.scan)
  const dispatch = useAppDispatch()
  console.log(isLoading, scanHistory)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllScanResults())
  }, [dispatch])

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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="cards">
        <div className="title mb-3">
          <p>Account Usage</p>
        </div>
        <div className="flex gap-x-5 w-full">
          <Card className="w-full h-[175px]">
            <CardDescription>Scans Used This Month</CardDescription>
            <CardContent className="px-0">
              <div className="content">
                <p className="font-bold text-3xl">{scanHistory.length}/50</p>
              </div>
              <Progress value={50} className="w-full h-[23px] mt-8" />
            </CardContent>
          </Card>
          <Card className="w-full h-[175px]">
            <CardDescription>Plan Limit</CardDescription>
            <CardContent className="px-0">
              <div className="content">
                <p className="font-bold text-3xl mb-2">50 scans</p>
                <p className="text-[#30B0C7] text-[14px] flex items-center gap-x-3 cursor-pointer">
                  Upgrade plans
                  <span>
                    <ArrowLeft />
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
        <AppTable data={scanHistory} columns={dashboardColumns} />
      </div>
    </div>
  )
}
export default Dashboard
