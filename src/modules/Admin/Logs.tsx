import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { adminService, type AdminLog } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/card'
import Button from '@/components/buttons/Button'

const PAGE_SIZE = 50

const ActivityLogs = () => {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async (nextOffset = offset, nextSearch = query) => {
    setLoading(true)
    try {
      const data = await adminService.listLogs({
        limit: PAGE_SIZE,
        offset: nextOffset,
        search: nextSearch || undefined,
      })
      setLogs(data.items)
      setTotal(data.total)
      setOffset(nextOffset)
    } catch {
      toast.error('Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(0, query)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(search.trim())
  }

  const page = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Activity logs
          </h2>
          <p className="text-sm text-[#82898F] mt-1">
            Cross-organisation audit events.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events"
            className="h-9 rounded-lg border border-[#E8E8E9] dark:border-[#222224] bg-transparent px-3 text-sm outline-none focus:border-[#FAD645]"
          />
          <Button
            type="submit"
            className="bg-[#FAD645] dark:text-black [&&]:w-fit [&&]:h-9 [&&]:px-4 [&&]:text-sm"
          >
            Search
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="pt-0">
          {loading ? (
            <p className="text-sm text-[#82898F] py-6">Loading logs...</p>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#82898F]">No logs found.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8E8E9] dark:divide-[#222224] overflow-x-auto">
              <div className="grid grid-cols-[160px_1fr_140px_140px] gap-4 px-2 py-3 text-xs font-semibold uppercase tracking-wide text-[#82898F] min-w-[640px]">
                <span>Timestamp</span>
                <span>Event</span>
                <span>Actor</span>
                <span>Organisation</span>
              </div>
              {logs.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[160px_1fr_140px_140px] gap-4 px-2 py-3 text-sm min-w-[640px]"
                >
                  <span className="text-[#82898F]">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                  <div>
                    <p className="text-[#0E1B28] dark:text-[#D7E4F1]">
                      {item.message}
                    </p>
                    <p className="text-xs text-[#82898F] mt-0.5">{item.event}</p>
                  </div>
                  <span className="text-[#82898F] truncate">{item.actor}</span>
                  <span className="text-[#82898F] truncate">
                    {item.organisationName ||
                      (item.organisationId != null
                        ? `#${item.organisationId}`
                        : '—')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E8E8E9] dark:border-[#222224]">
              <p className="text-sm text-[#82898F]">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  disabled={offset === 0 || loading}
                  className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                  onClick={() => load(Math.max(0, offset - PAGE_SIZE))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  disabled={offset + PAGE_SIZE >= total || loading}
                  className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                  onClick={() => load(offset + PAGE_SIZE)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityLogs
