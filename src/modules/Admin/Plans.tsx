import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { adminService, type AdminPlan } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Input from '@/components/Input'
import Button from '@/components/buttons/Button'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  scanAllowance: z.string().min(1, 'Allowance is required'),
  priceMonthly: z.string().min(1, 'Price is required'),
})

type FormType = z.infer<typeof schema>

const PlansManagement = () => {
  const [plans, setPlans] = useState<AdminPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editing, setEditing] = useState<AdminPlan | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      scanAllowance: '0',
      priceMonthly: '0',
    },
  })

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminService.listPlans()
      setPlans(data.items)
    } catch {
      toast.error('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    reset({
      name: '',
      slug: '',
      scanAllowance: '50',
      priceMonthly: '0',
    })
    setShowDialog(true)
  }

  const openEdit = (plan: AdminPlan) => {
    setEditing(plan)
    reset({
      name: plan.name,
      slug: plan.slug,
      scanAllowance: String(plan.scanAllowance),
      priceMonthly: String(plan.priceMonthly),
    })
    setShowDialog(true)
  }

  const onSubmit = async (data: FormType) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      scanAllowance: Number(data.scanAllowance),
      priceMonthly: Number(data.priceMonthly),
    }
    try {
      if (editing) {
        const updated = await adminService.updatePlan(editing.id, payload)
        setPlans((prev) => prev.map((p) => (p.id === editing.id ? updated : p)))
        toast.success('Plan updated')
      } else {
        const created = await adminService.createPlan(payload)
        setPlans((prev) => [...prev, created])
        toast.success('Plan created')
      }
      setShowDialog(false)
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to save plan'
      )
    }
  }

  const toggleActive = async (plan: AdminPlan) => {
    setBusyId(plan.id)
    try {
      const updated = await adminService.updatePlan(plan.id, {
        isActive: !plan.isActive,
      })
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)))
      toast.success(updated.isActive ? 'Plan activated' : 'Plan deactivated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to update plan'
      )
    } finally {
      setBusyId(null)
    }
  }

  const deletePlan = async (id: number) => {
    setBusyId(id)
    try {
      const updated = await adminService.deletePlan(id)
      setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)))
      toast.success('Plan deactivated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to delete plan'
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Plans
          </h2>
          <p className="text-sm text-[#82898F] mt-1">
            Create and manage subscription plans.
          </p>
        </div>
        <Button
          className="bg-[#FAD645] dark:text-black [&&]:w-fit [&&]:h-9 [&&]:px-4 [&&]:text-sm"
          onClick={openCreate}
        >
          Create plan
        </Button>
      </div>

      <Card>
        <CardContent className="pt-0">
          {loading ? (
            <p className="text-sm text-[#82898F] py-6">Loading plans...</p>
          ) : plans.length === 0 ? (
            <p className="text-sm text-[#82898F] py-6">No plans yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#E8E8E9] dark:divide-[#222224]">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                      {plan.name}
                      <span
                        className={cn(
                          'ml-2 text-xs font-normal px-2 py-0.5 rounded-full',
                          plan.isActive
                            ? 'bg-[#0CB95B]/15 text-[#0CB95B]'
                            : 'bg-[#E31E18]/15 text-[#E31E18]'
                        )}
                      >
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p className="text-sm text-[#82898F]">
                      {plan.slug} · {plan.scanAllowance} scans · $
                      {plan.priceMonthly}/mo
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="bg-[#FAD645] dark:text-black [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      onClick={() => openEdit(plan)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      isLoading={busyId === plan.id}
                      onClick={() => toggleActive(plan)}
                    >
                      {plan.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    {plan.isActive && (
                      <Button
                        type="button"
                        className="bg-[#E31E18]/10 text-[#E31E18] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                        isLoading={busyId === plan.id}
                        onClick={() => deletePlan(plan.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit plan' : 'Create plan'}</DialogTitle>
            <DialogDescription>
              Set allowance and monthly pricing for this plan.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="name"
              type="text"
              placeholder="Plan name"
              control={control}
              error={errors.name?.message}
            />
            <Input
              name="slug"
              type="text"
              placeholder="Slug (e.g. pro)"
              control={control}
              error={errors.slug?.message}
            />
            <Input
              name="scanAllowance"
              type="number"
              placeholder="Scan allowance"
              control={control}
              error={errors.scanAllowance?.message}
            />
            <Input
              name="priceMonthly"
              type="number"
              placeholder="Monthly price"
              control={control}
              error={errors.priceMonthly?.message}
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FAD645] dark:text-black [&&]:w-fit"
                isLoading={isSubmitting}
              >
                {editing ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlansManagement
