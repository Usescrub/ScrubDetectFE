import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  adminService,
  type AdminUser,
} from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/card'
import Button from '@/components/buttons/Button'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

const UsersManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const load = async (nextOffset = offset, nextSearch = query) => {
    setLoading(true)
    try {
      const data = await adminService.listUsers({
        limit: PAGE_SIZE,
        offset: nextOffset,
        search: nextSearch || undefined,
      })
      setUsers(data.items)
      setTotal(data.total)
      setOffset(nextOffset)
    } catch {
      toast.error('Failed to load users')
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

  const patchUser = async (
    id: number,
    data: { isActive?: boolean; isVerified?: boolean; isSuperadmin?: boolean }
  ) => {
    setUpdatingId(id)
    try {
      const updated = await adminService.updateUser(id, data)
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
      toast.success('User updated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to update user'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const deactivateUser = async (id: number) => {
    setUpdatingId(id)
    try {
      const updated = await adminService.deleteUser(id)
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
      toast.success('User deactivated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to deactivate user'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const page = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Users
          </h2>
          <p className="text-sm text-[#82898F] mt-1">
            Manage accounts. Superadmin requires an allowed domain and an explicit grant.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email or name"
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
            <p className="text-sm text-[#82898F] py-6">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-[#82898F] py-6">No users found.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#E8E8E9] dark:divide-[#222224]">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                      {user.fullName || user.email}
                      {user.isSuperadmin && (
                        <span className="ml-2 text-xs font-normal text-[#DF9300]">
                          Superadmin
                        </span>
                      )}
                      {user.isOrgAdmin && (
                        <span className="ml-2 text-xs font-normal text-[#82898F]">
                          Org admin
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-[#82898F] truncate">
                      {user.email}
                      {user.organisationName ? ` · ${user.organisationName}` : ''}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          user.isActive
                            ? 'bg-[#0CB95B]/15 text-[#0CB95B]'
                            : 'bg-[#E31E18]/15 text-[#E31E18]'
                        )}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          user.isVerified
                            ? 'bg-[#0CB95B]/15 text-[#0CB95B]'
                            : 'bg-[#DF9300]/15 text-[#DF9300]'
                        )}
                      >
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!user.isVerified && (
                      <Button
                        type="button"
                        className="bg-[#FAD645] dark:text-black [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                        isLoading={updatingId === user.id}
                        onClick={() =>
                          patchUser(user.id, { isVerified: true })
                        }
                      >
                        Verify
                      </Button>
                    )}
                    {user.superadminEligible && (
                      <Button
                        type="button"
                        className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                        isLoading={updatingId === user.id}
                        onClick={() =>
                          patchUser(user.id, {
                            isSuperadmin: !user.isSuperadmin,
                          })
                        }
                      >
                        {user.isSuperadmin ? 'Revoke admin' : 'Grant admin'}
                      </Button>
                    )}
                    {user.isActive ? (
                      <Button
                        type="button"
                        className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                        isLoading={updatingId === user.id}
                        onClick={() =>
                          patchUser(user.id, { isActive: false })
                        }
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="bg-[#FAD645] dark:text-black [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                        isLoading={updatingId === user.id}
                        onClick={() =>
                          patchUser(user.id, { isActive: true })
                        }
                      >
                        Activate
                      </Button>
                    )}
                    {user.isActive && (
                      <Button
                        type="button"
                        className="bg-[#E31E18]/10 text-[#E31E18] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                        isLoading={updatingId === user.id}
                        onClick={() => deactivateUser(user.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
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

export default UsersManagement
