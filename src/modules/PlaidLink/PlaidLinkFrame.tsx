import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  usePlaidLink,
  type PlaidLinkError,
  type PlaidLinkOnEventMetadata,
  type PlaidLinkOnExitMetadata,
  type PlaidLinkOnSuccessMetadata,
  type PlaidLinkStableEvent,
} from 'react-plaid-link'

import { consentService } from '@/services/reportService'
import ShortLogo from '@/assets/icons/shortlogo.svg?react'

type ViewState = 'loading' | 'opening' | 'exchanging' | 'done' | 'cancelled' | 'error'

const DEFAULT_BRAND_NAME = 'Scrub'

function resolveTargetOrigin(parentOrigin: string | null): string {
  if (parentOrigin) {
    try {
      return new URL(parentOrigin).origin
    } catch {
      // fall through
    }
  }
  if (document.referrer) {
    try {
      return new URL(document.referrer).origin
    } catch {
      // fall through
    }
  }
  return '*'
}

function extractErrorDetail(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: { detail?: unknown } } })?.response
    ?.data
  const detail = data?.detail
  if (typeof detail === 'string' && detail.trim()) return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0]
    if (typeof first === 'string') return first
    if (first && typeof first === 'object' && 'msg' in first) {
      return String((first as { msg: string }).msg)
    }
  }
  return fallback
}

function StatusSpinner() {
  return (
    <span
      className="inline-block h-5 w-5 rounded-full border-2 border-[#E8E8E9] border-t-[#FAD645] animate-spin"
      aria-hidden
    />
  )
}

const PlaidLinkFrame = () => {
  const [searchParams] = useSearchParams()
  const session = searchParams.get('session')
  const parentOrigin = searchParams.get('parentOrigin')
  const receivedRedirectUri = searchParams.get('receivedRedirectUri')

  const targetOrigin = useMemo(
    () => resolveTargetOrigin(parentOrigin),
    [parentOrigin]
  )

  const [view, setView] = useState<ViewState>('loading')
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [brandName, setBrandName] = useState(DEFAULT_BRAND_NAME)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const openedRef = useRef(false)
  const readyPostedRef = useRef(false)

  const applyBranding = useCallback(
    (displayName?: string | null, nextLogoUrl?: string | null) => {
      setBrandName(displayName?.trim() || DEFAULT_BRAND_NAME)
      setLogoUrl(nextLogoUrl?.trim() || null)
    },
    []
  )

  const postToParent = useCallback(
    (payload: Record<string, unknown>) => {
      if (window.parent === window) return
      window.parent.postMessage(payload, targetOrigin)
    },
    [targetOrigin]
  )

  useEffect(() => {
    if (!session) {
      const message =
        'Missing session. Embed /plaid/link?session=<consent_token> from the report API link_url.'
      setErrorDetail(message)
      setView('error')
      postToParent({ type: 'PLAID_LINK_ERROR', message })
      return
    }

    let cancelled = false
      ; (async () => {
        try {
          const sessionData = await consentService.getSession(session)
          if (cancelled) return

          applyBranding(sessionData.displayName, sessionData.logoUrl)

          if (sessionData.status !== 'valid') {
            const detail =
              sessionData.detail ||
              (sessionData.status === 'expired'
                ? 'Link expired'
                : sessionData.status === 'used'
                  ? 'This link has already been used'
                  : 'Invalid link')
            setErrorDetail(detail)
            setView('error')
            postToParent({ type: 'PLAID_LINK_ERROR', message: detail })
            return
          }

          const data = await consentService.createLinkToken(session)
          if (cancelled) return
          applyBranding(
            data.displayName || data.brandName || sessionData.displayName,
            data.logoUrl ?? sessionData.logoUrl
          )
          setLinkToken(data.linkToken)
        } catch (error) {
          if (cancelled) return
          const detail = extractErrorDetail(
            error,
            'Unable to start bank connection. Please try again later.'
          )
          setErrorDetail(detail)
          setView('error')
          postToParent({ type: 'PLAID_LINK_ERROR', message: detail })
        }
      })()

    return () => {
      cancelled = true
    }
  }, [session, postToParent, applyBranding])

  const onSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      if (!session) return
      setView('exchanging')
      try {
        const result = await consentService.exchangeToken(session, {
          publicToken,
          institution: metadata.institution
            ? {
              name: metadata.institution.name,
              institutionId: metadata.institution.institution_id,
            }
            : null,
          accounts: metadata.accounts,
        })
        postToParent({
          type: 'PLAID_LINK_SUCCESS',
          message: result.message,
          metadata,
        })
        setView('done')
      } catch {
        const message =
          'Bank was linked but we could not finalize the connection.'
        setErrorDetail(message)
        setView('error')
        postToParent({ type: 'PLAID_LINK_ERROR', message })
      }
    },
    [session, postToParent]
  )

  const onExit = useCallback(
    (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
      postToParent({
        type: 'PLAID_LINK_EXIT',
        error,
        metadata,
      })
      if (error?.error_code === 'INVALID_LINK_TOKEN') {
        setErrorDetail(
          'This link token is invalid or expired. Request a new report session and try again.'
        )
        setView('error')
        return
      }
      if (error) {
        setErrorDetail(
          error.display_message || error.error_message || 'Connection failed.'
        )
        setView('error')
        return
      }
      setView('cancelled')
    },
    [postToParent]
  )

  const onEvent = useCallback(
    (
      eventName: PlaidLinkStableEvent | string,
      metadata: PlaidLinkOnEventMetadata
    ) => {
      postToParent({
        type: 'PLAID_LINK_EVENT',
        eventName,
        metadata,
      })
    },
    [postToParent]
  )

  const { open, ready, error: sdkError } = usePlaidLink({
    token: linkToken,
    ...(receivedRedirectUri ? { receivedRedirectUri } : {}),
    onSuccess,
    onExit,
    onEvent,
  })

  useEffect(() => {
    if (sdkError) {
      const message = 'Failed to load Plaid Link.'
      setErrorDetail(message)
      setView('error')
      postToParent({ type: 'PLAID_LINK_ERROR', message })
    }
  }, [sdkError, postToParent])

  useEffect(() => {
    if (!linkToken || !ready || openedRef.current || view === 'error') return
    openedRef.current = true
    if (!readyPostedRef.current) {
      readyPostedRef.current = true
      postToParent({ type: 'PLAID_LINK_READY' })
    }
    setView('opening')
    open()
  }, [linkToken, ready, open, postToParent, view])

  const companyInitial = (brandName.trim()[0] || 'C').toUpperCase()
  const isBusy =
    view === 'loading' || view === 'opening' || view === 'exchanging'

  const statusCopy = {
    loading: {
      title: 'Preparing connection',
      detail: 'Setting up a secure session with your bank.',
    },
    opening: {
      title: 'Opening bank link',
      detail: 'Continue in the Plaid window to connect your account.',
    },
    exchanging: {
      title: 'Confirming connection',
      detail: 'Finalizing your bank link. This only takes a moment.',
    },
    done: {
      title: 'Bank connected',
      detail: 'You’re all set. Your financial report is being generated.',
    },
    cancelled: {
      title: 'Connection cancelled',
      detail: 'You can close this window and try again when you’re ready.',
    },
    error: {
      title: 'Link unavailable',
      detail: errorDetail || 'Something went wrong. Please try again later.',
    },
  }[view]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4F6F8] dark:bg-[#0A0A0A]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(250,214,69,0.22)_0%,_transparent_55%),linear-gradient(180deg,#F7F8FA_0%,#EEF1F4_100%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(250,214,69,0.12)_0%,_transparent_50%),linear-gradient(180deg,#121212_0%,#0A0A0A_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#FAD645]/20 blur-3xl dark:bg-[#FAD645]/10"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
          <div className="rounded-2xl border border-[#E4E7EB] bg-white/90 px-8 pb-8 pt-10 text-center shadow-[0_24px_60px_-28px_rgba(14,27,40,0.28)] backdrop-blur-sm dark:border-[#2A2A2A] dark:bg-[#111111]/90 dark:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#82898F] dark:text-[#9CA3AF]">
              Secure bank connection
            </p>

            <div
              className="mb-5 flex items-center justify-center gap-4"
              aria-label={`Scrub and ${brandName}`}
            >
              <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-[#FAD645] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                <ShortLogo className="h-9 w-9" aria-hidden />
                <span className="sr-only">Scrub</span>
              </div>
              <span
                className="select-none text-2xl font-light leading-none text-[#B0B6BC] dark:text-[#5A5A5A]"
                aria-hidden
              >
                ×
              </span>
              <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E8E8E9] bg-[#FAFBFC] p-2.5 dark:border-[#2F2F2F] dark:bg-[#1A1A1A]">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span
                    className="text-2xl font-semibold tracking-tight text-[#0E1B28] dark:text-[#D7E4F1]"
                    aria-label={brandName}
                  >
                    {companyInitial}
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-[1.35rem] font-semibold tracking-tight text-[#0E1B28] dark:text-[#D7E4F1]">
              {brandName}
            </h1>
            <p className="mt-1.5 text-sm text-[#82898F] dark:text-[#9CA3AF]">
              in partnership with Scrub
            </p>

            <div className="mx-auto mt-8 max-w-sm border-t border-[#EEF0F2] pt-7 dark:border-[#242424]">
              {isBusy && (
                <div className="mb-4 flex justify-center">
                  <StatusSpinner />
                </div>
              )}

              {view === 'done' && (
                <div className="mb-4 flex justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F8EF] text-[#0CB95B] dark:bg-[#0CB95B]/15">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path
                        d="M4.5 10.5 8 14l7.5-8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              )}

              <p
                className={
                  view === 'done'
                    ? 'text-base font-semibold text-[#0CB95B]'
                    : view === 'error'
                      ? 'text-base font-semibold text-[#E31E18]'
                      : 'text-base font-semibold text-[#0E1B28] dark:text-[#D7E4F1]'
                }
              >
                {statusCopy.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#82898F] dark:text-[#9CA3AF]">
                {statusCopy.detail}
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs tracking-wide text-[#9AA1A8] dark:text-[#6B7280]">
            Bank-grade encryption · Powered by Scrub
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlaidLinkFrame
