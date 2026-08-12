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
  onSaved: () => Promise<void>
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

const ControlsTab = ({ user, onSaved }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isAdmin = !!user.isOrgAdmin
  const sectionParam = searchParams.get('section')
  const section: ControlsSection = isControlsSection(sectionParam)
    ? sectionParam
    : 'activity'

  const [activity, setActivity] = useState<OrganisationEvent[]>([])
  const [logs, setLogs] = useState<OrganisationEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [webhookSecret, setWebhookSecret] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [rotatingSecret, setRotatingSecret] = useState(false)
  const [testingWebhook, setTestingWebhook] = useState(false)

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
    let cancelled = false
    const load = async () => {
      try {
        const controls = await authService.getOrganisationControls()
        if (cancelled) return
        reset({
          webhookUrl: controls.webhookUrl || '',
          brandName: controls.brandName || user.company || '',
          logoUrl: controls.logoUrl || '',
        })
        setWebhookSecret(controls.webhookSecret || null)
      } catch {
        if (!cancelled) {
          reset({
            webhookUrl: '',
            brandName: user.company || '',
            logoUrl: '',
          })
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
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
  }, [user.organisationId, section])

  const onSubmit = async (data: FormType) => {
    if (!isAdmin) return
    try {
      const controls = await authService.updateOrganisationControls({
        webhookUrl: data.webhookUrl || '',
        brandName: data.brandName || '',
        logoUrl: data.logoUrl || '',
      })
      setWebhookSecret(controls.webhookSecret || null)
      await onSaved()
      toast.success('Controls saved')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to save controls'
      )
    }
  }

  const onRotateSecret = async () => {
    if (!isAdmin) return
    setRotatingSecret(true)
    try {
      const controls = await authService.rotateWebhookSecret()
      setWebhookSecret(controls.webhookSecret || null)
      setShowSecret(true)
      toast.success('Webhook signing secret rotated')
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to rotate secret'
      )
    } finally {
      setRotatingSecret(false)
    }
  }

  const onSendTestWebhook = async () => {
    if (!isAdmin) return
    setTestingWebhook(true)
    try {
      const result = await authService.sendTestWebhook()
      if (result.success) toast.success(result.detail)
      else toast.error(result.detail)
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Failed to send test webhook'
      )
    } finally {
      setTestingWebhook(false)
    }
  }

  const onCopySecret = async () => {
    if (!webhookSecret) return
    try {
      await navigator.clipboard.writeText(webhookSecret)
      toast.success('Signing secret copied')
    } catch {
      toast.error('Could not copy secret')
    }
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
                ScrubDetect POSTs a signed payload here when a financial report
                completes or fails. Respond with 2xx within 15 seconds.
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

              {isAdmin && webhookSecret && (
                <div className="mt-3 rounded-lg border border-[#E8E8E9] dark:border-[#2A2A2A] bg-[#FAFBFC] dark:bg-[#161616] p-3">
                  <p className="text-xs font-medium text-[#0E1B28] dark:text-[#D7E4F1] mb-1">
                    Signing secret
                  </p>
                  <p className="text-xs text-[#82898F] mb-2">
                    Verify the <code className="text-[11px]">X-Signature</code>{' '}
                    header with HMAC-SHA256 of the raw body.
                  </p>
                  <code className="block break-all rounded bg-[#0D0D0D] px-3 py-2 text-xs font-mono text-[#FAD645]">
                    {showSecret
                      ? webhookSecret
                      : '•'.repeat(Math.min(webhookSecret.length, 40))}
                  </code>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      className="bg-white dark:bg-[#1C1C1C] border border-[#E0E0E0] dark:border-[#333333] text-[#0E1B28] dark:text-[#D7E4F1] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      onClick={() => setShowSecret((v) => !v)}
                    >
                      {showSecret ? 'Hide' : 'Reveal'}
                    </Button>
                    <Button
                      type="button"
                      className="bg-white dark:bg-[#1C1C1C] border border-[#E0E0E0] dark:border-[#333333] text-[#0E1B28] dark:text-[#D7E4F1] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      onClick={onCopySecret}
                    >
                      Copy
                    </Button>
                    <Button
                      type="button"
                      className="bg-white dark:bg-[#1C1C1C] border border-[#E0E0E0] dark:border-[#333333] text-[#0E1B28] dark:text-[#D7E4F1] [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      onClick={onRotateSecret}
                      isLoading={rotatingSecret}
                      disabled={rotatingSecret}
                    >
                      Rotate
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&]:h-8 [&&]:px-3 [&&]:text-xs"
                      onClick={onSendTestWebhook}
                      isLoading={testingWebhook}
                      disabled={testingWebhook}
                    >
                      Send test
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mb-1">
                Branding
              </h4>
              <p className="text-xs text-[#82898F] mb-2">
                Customise how your organisation appears in consent flows. Leave
                blank to use ScrubDetect.
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
