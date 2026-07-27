import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import type { AuthenticatedUser } from '@/redux/slices/authSlice'
import {
  authService,
  type OrganisationEvent,
} from '@/services/authService'
import { cn } from '@/lib/utils'

import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/Input'
import Button from '@/components/buttons/Button'

type Props = {
  user: AuthenticatedUser
}

type ControlsSection = 'activity' | 'logs'

const CONTROLS_SECTIONS: { id: ControlsSection; label: string }[] = [
  { id: 'activity', label: 'Activity' },
  { id: 'logs', label: 'Logs' },
]

const isControlsSection = (value: string | null): value is ControlsSection =>
  CONTROLS_SECTIONS.some((s) => s.id === value)

const schema = z.object({
  webhookUrl: z
    .string()
    .url('Enter a valid URL')
    .or(z.literal(''))
    .optional(),
  brandName: z.string().optional(),
  logoUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
})

type FormType = z.infer<typeof schema>

const storageKey = (orgId?: string) =>
  `scrub_controls_${orgId || 'default'}`

const ControlsTab = ({ user }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isAdmin = !!user.isOrgAdmin
  const sectionParam = searchParams.get('section')
  const section: ControlsSection = isControlsSection(sectionParam)
    ? sectionParam
    : 'activity'

  const [activity, setActivity] = useState<OrganisationEvent[]>([])
  const [logs, setLogs] = useState<OrganisationEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  const setSection = (next: ControlsSection) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', 'controls')
    params.set('section', next)
    setSearchParams(params, { replace: true })
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      webhookUrl: '',
      brandName: user.company || '',
      logoUrl: '',
    },
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(String(user.organisationId)))
      if (raw) {
        reset(JSON.parse(raw))
        return
      }
    } catch {
      /* ignore */
    }
    reset({
      webhookUrl: '',
      brandName: user.company || '',
      logoUrl: '',
    })
  }, [user, reset])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingEvents(true)
      try {
        const [activityRes, logsRes] = await Promise.all([
          authService.listOrganisationActivity(),
          authService.listOrganisationLogs(),
        ])
        if (!cancelled) {
          setActivity(activityRes.items)
          setLogs(logsRes.items)
        }
      } catch {
        if (!cancelled) toast.error('Failed to load activity and logs')
      } finally {
        if (!cancelled) setLoadingEvents(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user.organisationId])

  const onSubmit = async (data: FormType) => {
    if (!isAdmin) return
    localStorage.setItem(
      storageKey(String(user.organisationId)),
      JSON.stringify(data)
    )
    toast.success('Controls saved')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
          Controls
        </h3>
        <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
          Webhooks, branding, and organisation activity.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6 pt-0">
          <form
            className="flex flex-col gap-4 max-w-xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <h4 className="text-sm font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mb-1">
                Webhook URL
              </h4>
              <p className="text-xs text-[#82898F] mb-2">
                Receive event payloads for scans, reports, and team changes.
              </p>
              <fieldset disabled={!isAdmin} className="contents">
                <Input
                  name="webhookUrl"
                  type="url"
                  placeholder="https://example.com/webhooks/scrub"
                  control={control}
                  classname="border text-sm"
                  error={errors.webhookUrl?.message}
                />
              </fieldset>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mb-1">
                Branding
              </h4>
              <p className="text-xs text-[#82898F] mb-2">
                Customise how your organisation appears in emails and consent
                flows.
              </p>
              <fieldset disabled={!isAdmin} className="flex flex-col gap-2">
                <Input
                  name="brandName"
                  type="text"
                  placeholder="Display name"
                  control={control}
                  classname="border text-sm"
                  error={errors.brandName?.message}
                />
                <Input
                  name="logoUrl"
                  type="url"
                  placeholder="Logo URL"
                  control={control}
                  classname="border text-sm"
                  error={errors.logoUrl?.message}
                />
              </fieldset>
            </div>

            {isAdmin && (
              <Button
                type="submit"
                className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Save controls
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div>
        <div className="flex gap-4 border-b border-[#E8E8E9] dark:border-[#222224] mb-4">
          {CONTROLS_SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={cn(
                'relative pb-2.5 text-sm transition-colors cursor-pointer',
                section === item.id
                  ? 'text-[#0E1B28] dark:text-[#D7E4F1] font-semibold'
                  : 'text-[#82898F] dark:text-[#9CA3AF] hover:text-[#0E1B28] dark:hover:text-[#D7E4F1]'
              )}
            >
              {item.label}
              {section === item.id && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#FAD645]" />
              )}
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="pt-0">
            {loadingEvents ? (
              <div className="py-8 text-center text-sm text-[#82898F]">
                Loading...
              </div>
            ) : section === 'activity' ? (
              activity.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#82898F] dark:text-[#9CA3AF]">
                    No recent activity yet. Team invites, scan usage, and report
                    events will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E8E8E9] dark:divide-[#222224]">
                  {activity.map((item) => (
                    <div key={item.id} className="py-4 px-2">
                      <p className="text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                        {item.message}
                      </p>
                      <p className="text-xs text-[#82898F] mt-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )
            ) : logs.length === 0 ? (
              <div className="divide-y divide-[#E8E8E9] dark:divide-[#222224]">
                <div className="grid grid-cols-[140px_1fr_100px] gap-4 px-2 py-3 text-xs font-semibold uppercase tracking-wide text-[#82898F]">
                  <span>Timestamp</span>
                  <span>Event</span>
                  <span>Actor</span>
                </div>
                <div className="py-8 text-center">
                  <p className="text-sm text-[#82898F] dark:text-[#9CA3AF]">
                    No audit logs yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#E8E8E9] dark:divide-[#222224]">
                <div className="grid grid-cols-[160px_1fr_160px] gap-4 px-2 py-3 text-xs font-semibold uppercase tracking-wide text-[#82898F]">
                  <span>Timestamp</span>
                  <span>Event</span>
                  <span>Actor</span>
                </div>
                {logs.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[160px_1fr_160px] gap-4 px-2 py-3 text-sm"
                  >
                    <span className="text-[#82898F]">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <span className="text-[#0E1B28] dark:text-[#D7E4F1]">
                      {item.message}
                    </span>
                    <span className="text-[#82898F] truncate">{item.actor}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ControlsTab
