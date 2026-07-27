import type { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ScanResult } from '@/services/scanService'

type ScanActionsMenuProps = {
  scan: ScanResult
  onView: (scan: ScanResult) => void
  onReject: (scan: ScanResult) => void
}

const ScanActionsMenu = ({ scan, onView, onReject }: ScanActionsMenuProps) => {
  const isRejected = scan.reviewStatus === 'rejected'

  return (
    <div className="w-full flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full w-[35px] h-[35px] bg-[#F5F6F6] dark:bg-[#161616] flex items-center justify-center hover:bg-[#EBEBF5] dark:hover:bg-[#222224] cursor-pointer"
            aria-label="Scan actions"
          >
            <MoreVertical className="w-4 h-4 text-[#0E1B28] dark:text-[#D7E4F1]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onView(scan)}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-[#E31E18] focus:text-[#E31E18]"
            disabled={isRejected}
            onClick={() => onReject(scan)}
          >
            Reject analysis
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const createScanColumns = (
  onView: (scan: ScanResult) => void,
  onReject: (scan: ScanResult) => void
): ColumnDef<ScanResult>[] => [
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
      const reviewStatus = row.original.reviewStatus
      const status =
        reviewStatus === 'rejected' ? 'rejected' : row.original.scanStatus
      const classNames: Record<string, string> = {
        completed: 'bg-[#EBFAF5] text-[#0CB95B]',
        failed: 'bg-[#FDEDED] text-[#E31E18]',
        processing: 'bg-[#FDF8EF] text-[#DF9300]',
        rejected: 'bg-[#FDEDED] text-[#E31E18]',
      }
      const roundedClassname: Record<string, string> = {
        completed: 'bg-[#0CB95B]',
        failed: 'bg-[#E31E18]',
        processing: 'bg-[#DF9300]',
        rejected: 'bg-[#E31E18]',
      }

      return (
        <div
          className={`${classNames[status]} items-center flex capitalize py-2 px-4 w-fit rounded-2xl`}
        >
          <div
            className={`rounded-full h-[8px] w-[8px] mr-3 ${roundedClassname[status]}`}
          ></div>
          <div>{status}</div>
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
    header: 'AI SCORE',
    cell: ({ row }) => (
      <div className="capitalize uppercase">
        {(row.original.aiGeneratedScore ?? 0) * 100}%
      </div>
    ),
  },
  {
    accessorKey: 'result',
    header: 'RESULT SUMMARY',
    cell: ({ row }) => (
      <div className="capitalize uppercase">
        {row.original.reviewStatus === 'rejected'
          ? 'Rejected'
          : (row.original.aiGeneratedScore ?? 0) > 0.5
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
    cell: ({ row }) => (
      <ScanActionsMenu
        scan={row.original}
        onView={onView}
        onReject={onReject}
      />
    ),
  },
]

export default ScanActionsMenu
