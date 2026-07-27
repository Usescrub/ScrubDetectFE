import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlaidLink, type PlaidLinkOnSuccessMetadata } from 'react-plaid-link'

import Button from '@/components/buttons/Button'
import { consentService } from '@/services/reportService'

type ViewState = 'loading' | 'ready' | 'exchanging' | 'done' | 'unavailable'

const ConsentPage = () => {
  const { consentToken } = useParams<{ consentToken: string }>()
  const [view, setView] = useState<ViewState>('loading')
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [message, setMessage] = useState('Preparing secure bank connection...')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)

  useEffect(() => {
    if (!consentToken) {
      setView('unavailable')
      setErrorDetail('This link is invalid.')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const data = await consentService.createLinkToken(consentToken)
        if (cancelled) return
        setLinkToken(data.linkToken)
        setView('ready')
        setMessage('Connect your bank account to continue.')
      } catch (error) {
        if (cancelled) return
        const axiosError = error as {
          response?: { status?: number; data?: { detail?: string } }
        }
        const status = axiosError.response?.status
        if (status === 404 || status === 410) {
          setErrorDetail(
            axiosError.response?.data?.detail ||
              'This link is invalid, already used, or has expired.'
          )
        } else {
          setErrorDetail('Unable to start bank connection. Please try again later.')
        }
        setView('unavailable')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [consentToken])

  const onSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      if (!consentToken) return
      setView('exchanging')
      setMessage('Finishing connection...')
      try {
        const result = await consentService.exchangeToken(consentToken, {
          publicToken,
          institution: metadata.institution
            ? {
              name: metadata.institution.name,
              institutionId: metadata.institution.institution_id,
            }
            : null,
          accounts: metadata.accounts,
        })
        setMessage(result.message || 'Bank connected. Your report is being generated.')
        setView('done')
      } catch {
        setErrorDetail('Bank was linked but we could not finalize the connection.')
        setView('unavailable')
      }
    },
    [consentToken]
  )

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  })

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D0D0D] border border-[#E0E0E0] dark:border-[#333333] p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mb-2">
          ScrubDetect
        </h1>

        {view === 'loading' && (
          <p className="text-[#82898F] dark:text-[#9CA3AF]">{message}</p>
        )}

        {view === 'ready' && (
          <>
            <p className="text-[#82898F] dark:text-[#9CA3AF] mb-6">{message}</p>
            <Button
              className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90"
              disabled={!ready}
              onClick={() => open()}
            >
              Connect Bank Account
            </Button>
          </>
        )}

        {view === 'exchanging' && (
          <p className="text-[#82898F] dark:text-[#9CA3AF]">{message}</p>
        )}

        {view === 'done' && (
          <>
            <p className="text-lg font-medium text-[#0CB95B] mb-2">All set</p>
            <p className="text-[#82898F] dark:text-[#9CA3AF]">{message}</p>
          </>
        )}

        {view === 'unavailable' && (
          <>
            <p className="text-lg font-medium text-[#E31E18] mb-2">
              Link unavailable
            </p>
            <p className="text-[#82898F] dark:text-[#9CA3AF]">
              {errorDetail}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ConsentPage
