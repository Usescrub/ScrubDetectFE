import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import type { AuthenticatedUser } from '@/redux/slices/authSlice'
import {
  authService,
  type TeamMember,
} from '@/services/authService'
import { TOOLBOX_LABELS, type ToolboxItem } from '@/constants/toolbox'
import { roleOptions } from '@/constants/formOptions'

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
import Select from '@/components/Select'
import Button from '@/components/buttons/Button'

import MailIcon from '@/assets/icons/components/MailIcon'
import RoleIcon from '@/assets/icons/components/RoleIcon'
import UserIcon from '@/assets/icons/components/User'

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().optional(),
})

type FormType = z.infer<typeof schema>

type Props = {
  user: AuthenticatedUser
}

const TeamTab = ({ user }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isAdmin = !!user.isOrgAdmin
  const orgToolbox = (user.toolbox || []) as ToolboxItem[]
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', role: '' },
  })

  const loadTeam = async () => {
    setLoading(true)
    try {
      const data = await authService.listTeam()
      setMembers(data.members)
    } catch {
      toast.error('Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  useEffect(() => {
    if (searchParams.get('invite') === '1' && isAdmin) {
      setShowInvite(true)
      const next = new URLSearchParams(searchParams)
      next.delete('invite')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams, isAdmin])

  const onInvite = async (data: FormType) => {
    try {
      await authService.inviteTeamMember({
        fullName: data.fullName,
        email: data.email,
        role: data.role || undefined,
      })
      toast.success('Teammate invited')
      setShowInvite(false)
      reset()
      await loadTeam()
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to invite teammate'
      )
    }
  }

  const roleLabel = (value?: string) =>
    roleOptions.find((o) => o.value === value)?.label || value || '—'

  const toolboxLabel = orgToolbox
    .map((item) => TOOLBOX_LABELS[item] || item)
    .join(', ') || 'No toolbox items'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Team
          </h3>
          <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
            People in your organisation. All members share the org toolbox: {toolboxLabel}.
          </p>
        </div>
        {isAdmin && (
          <Button
            className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&]:text-sm [&&]:h-[28px] [&&]:px-3"
            onClick={() => setShowInvite(true)}
          >
            Add teammate
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-0">
          {loading ? (
            <p className="text-sm text-[#82898F]">Loading team...</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-[#82898F]">No teammates yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#E8E8E9] dark:divide-[#222224]">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                      {member.fullName || member.email}
                      {member.isOrgAdmin && (
                        <span className="ml-2 text-xs font-normal text-[#DF9300]">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-[#82898F]">{member.email}</p>
                  </div>
                  <div className="text-sm text-[#82898F] dark:text-[#9CA3AF]">
                    <p>{roleLabel(member.role)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add teammate</DialogTitle>
            <DialogDescription>
              They'll get an email with a temporary password to sign in, and
              inherit the organisation toolbox.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onInvite)}
          >
            <Input
              name="fullName"
              type="text"
              placeholder="Full name"
              icon={UserIcon}
              control={control}
              error={errors.fullName?.message}
            />
            <Input
              name="email"
              type="email"
              placeholder="Work email"
              icon={MailIcon}
              control={control}
              error={errors.email?.message}
            />
            <Select
              name="role"
              options={roleOptions}
              placeholder="Select role"
              icon={RoleIcon}
              control={control}
              error={errors.role?.message}
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit"
                onClick={() => setShowInvite(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Send invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TeamTab
