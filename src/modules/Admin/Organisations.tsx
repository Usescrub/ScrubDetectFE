import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  adminService,
  type AdminOrganisation,
  type AdminPlan,
} from '@/services/adminService'
import {
  ALL_TOOLBOX,
  TOOLBOX_LABELS,
  type ToolboxItem,
} from '@/constants/toolbox'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import Button from '@/components/buttons/Button'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

const OrganisationsManagement = () => {
  const [orgs, setOrgs] = useState<AdminOrganisation[]>([])
  const [plans, setPlans] = useState<AdminPlan[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AdminOrganisation | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    domain: '',
    companySize: '',
    industry: '',
    country: '',
    planId: '',
    toolbox: [] as ToolboxItem[],
  })

  const load = async (nextOffset = offset, nextSearch = query) => {
    setLoading(true)
    try {
      const data = await adminService.listOrganisations({
        limit: PAGE_SIZE,
        offset: nextOffset,
        search: nextSearch || undefined,
      })
      setOrgs(data.items)
      setTotal(data.total)
      setOffset(nextOffset)
    } catch {
      toast.error('Failed to load organisations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(0, query)
  }, [query])

  useEffect(() => {
    adminService
      .listPlans()
      .then((data) => setPlans(data.items))
      .catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(search.trim())
  }

  const openEdit = (org: AdminOrganisation) => {
    const matchedPlan = plans.find((p) => p.slug === org.planSlug)
    setEditing(org)
    setForm({
      name: org.name || '',
      domain: org.domain || '',
      companySize: org.companySize || '',
      industry: org.industry || '',
      country: org.country || '',
      planId: matchedPlan
        ? String(matchedPlan.id)
        : org.subscription?.planId
          ? String(org.subscription.planId)
          : '',
      toolbox: [...(org.toolbox || [])],
    })
  }

  const toggleToolbox = (item: ToolboxItem) => {
    setForm((prev) => ({
      ...prev,
      toolbox: prev.toolbox.includes(item)
        ? prev.toolbox.filter((t) => t !== item)
        : [...prev.toolbox, item],
    }))
  }

  const saveOrg = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const updated = await adminService.updateOrganisation(editing.id, {
        name: form.name || undefined,
        domain: form.domain || undefined,
        companySize: form.companySize || undefined,
        industry: form.industry || undefined,
        country: form.country || undefined,
        toolbox: form.toolbox,
        planId: form.planId ? Number(form.planId) : undefined,
      })
      setOrgs((prev) => prev.map((o) => (o.id === editing.id ? updated : o)))
      setEditing(null)
      toast.success('Organisation updated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to update organisation'
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteOrg = async (id: number) => {
    try {
      await adminService.deleteOrganisation(id)
      setOrgs((prev) => prev.filter((o) => o.id !== id))
      toast.success('Organisation deleted')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to delete organisation'
      )
    }
  }

  const page = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Organisations
          </h2>
          <p className="text-sm text-[#82898F] mt-1">
            Update org details, toolbox access, and plans.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organisations"
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
            <p className="text-sm text-[#82898F] py-6">Loading organisations...</p>
          ) : orgs.length === 0 ? (
            <p className="text-sm text-[#82898F] py-6">No organisations found.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#E8E8E9] dark:divide-[#222224]">
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                      {org.name}
                    </p>
                    <p className="text-sm text-[#82898F]">
                      {[org.domain, org.industry, org.companySize]
                        .filter(Boolean)
                        .join(' · ') || 'No details'}
                    </p>
                    <p className="text-xs text-[#82898F] mt-1">
                      {`${org.usersCount} users`}
                      {org.planSlug ? ` · Plan: ${org.planSlug}` : ''}
                      {org.toolbox?.length
                        ? ` · ${org.toolbox.map((t) => TOOLBOX_LABELS[t] || t).join(', ')}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="bg-[#FAD645] dark:text-black [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      onClick={() => openEdit(org)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#E31E18]/10 text-[#E31E18] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      onClick={() => deleteOrg(org.id)}
                    >
                      Delete
                    </Button>
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

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit organisation</DialogTitle>
            <DialogDescription>
              Update name, toolbox, and subscription plan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {(
              [
                ['name', 'Name'],
                ['domain', 'Domain'],
                ['companySize', 'Company size'],
                ['industry', 'Industry'],
                ['country', 'Country'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                <span className="text-[#82898F]">{label}</span>
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="h-9 rounded-lg border border-[#E8E8E9] dark:border-[#222224] bg-transparent px-3 outline-none focus:border-[#FAD645]"
                />
              </label>
            ))}
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-[#82898F]">Plan</span>
              <select
                value={form.planId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, planId: e.target.value }))
                }
                className="h-9 rounded-lg border border-[#E8E8E9] dark:border-[#222224] bg-transparent px-3 outline-none focus:border-[#FAD645]"
              >
                <option value="">No change</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className="text-sm text-[#82898F] mb-2">Toolbox</p>
              <div className="flex flex-col gap-2">
                {ALL_TOOLBOX.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={form.toolbox.includes(item)}
                      onCheckedChange={() => toggleToolbox(item)}
                    />
                    <span
                      className={cn(
                        form.toolbox.includes(item)
                          ? 'text-[#0E1B28] dark:text-[#D7E4F1]'
                          : 'text-[#82898F]'
                      )}
                    >
                      {TOOLBOX_LABELS[item]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#FAD645] dark:text-black [&&]:w-fit"
              isLoading={saving}
              onClick={saveOrg}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrganisationsManagement
