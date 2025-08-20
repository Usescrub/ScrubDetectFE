import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { flexRender, useReactTable } from '@tanstack/react-table'
import useTable from './useTable'
interface AppTableProps {
  data: Record<string, string | number | undefined | boolean>[]
  columns: any
}

const AppTable = ({ data, columns }: AppTableProps) => {
  const tableState = useTable()
  const table = useReactTable({
    data,
    columns,
    ...tableState,
  })

  return (
    <Table className="mt-4">
      <TableHeader className="bg-[#F6F8FA] dark:bg-[#141414]">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className="text-[#B2B6BA] py-5">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
export default AppTable
