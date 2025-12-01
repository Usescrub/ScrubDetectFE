import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import Button from '@/components/buttons/Button'
import UnauthenticatedLayout from '@/layouts/UnauthenticatedLayout'
import TickCircle from '@/assets/icons/tick-circle.svg?react'
import Warning2 from '@/assets/icons/warning-2.svg?react'

type VerificationStatus = 'loading' | 'success' | 'error'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<VerificationStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Verification token is missing. Please check your email link.')
      setStatus('error')
      return
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail({ token })
        setStatus('success')
        toast.success('Email verified successfully!')
      } catch (err) {
        const errorMessage =
          typeof err === 'string'
            ? err
            : (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message || 'Failed to verify email. Please try again.'
        setError(errorMessage)
        setStatus('error')
        toast.error(errorMessage)
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <UnauthenticatedLayout>
      <div className="max-w-[508px] w-full h-[425px] px-2">
        <div className="mb-7 text">
          <h2 className="font-semibold text-[2rem] mb-2">Email Verification</h2>
          <p className="text-light-grey font-normal">
            {status === 'loading'
              ? 'Verifying your email address...'
              : status === 'success'
              ? 'Your email has been successfully verified!'
              : 'There was an issue verifying your email.'}
          </p>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-5">
          {status === 'loading' && (
            <div className="w-full px-5 py-[1.5625rem] bg-[#F9F9FB] dark:bg-[#121212] rounded-[20px] flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#FAD645] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#0E1B28] dark:text-[#D7E4F1]">
                Please wait while we verify your email...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="w-full px-5 py-[1.5625rem] bg-[#EBFAF5] dark:bg-[#0a1a14] rounded-[20px] flex flex-col items-center gap-4 border border-[#0CB95B]/30">
              <TickCircle className="w-16 h-16 text-[#0CB95B]" />
              <p className="text-[#0E1B28] dark:text-[#D7E4F1] text-center">
                Your email has been successfully verified! You can now close
                this page and return to the application.
              </p>
            </div>
          )}

          {status === 'error' && error && (
            <div className="w-full px-5 py-[1.5625rem] bg-[#FDEDED] dark:bg-[#2a1a1a] rounded-[20px] flex flex-col gap-4 border border-[#E31E18]">
              <div className="flex items-start gap-3">
                <Warning2 className="w-5 h-5 text-[#E31E18] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#E31E18] mb-1">
                    Verification Failed
                  </p>
                  <p className="text-sm text-[#E31E18]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="controls flex flex-col gap-3 w-full">
            {status === 'error' && (
              <div className="flex justify-between items-center w-full gap-x-2.5">
                <Button
                  className="bg-btn-lightGray dark:bg-[#232323]"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
                <Button
                  className="bg-yellow dark:text-black"
                  onClick={() => navigate('/signup/verification')}
                >
                  Resend Verification
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  )
}
