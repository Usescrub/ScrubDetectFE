import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useAppSelector } from '@/redux/hooks'
import Button from '@/components/buttons/Button'

import Usertag from '@/assets/icons/user-tag.svg?react'
import MobileTag from '@/assets/icons/mobile.svg?react'
import WarningTag from '@/assets/icons/warning-2.svg?react'
import TickTag from '@/assets/icons/tick-circle.svg?react'
import UnauthenticatedLayout from '@/layouts/UnauthenticatedLayout'

const POLLING_INTERVAL = 3000

export default function Verification() {
  const navigate = useNavigate()
  const { signupData } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState<string>('')
  const [isResending, setIsResending] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!signupData.email) {
      navigate('/signup/join-us')
      return
    }
    setEmail(signupData.email)
  }, [navigate, signupData])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPolling && !isActivated) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isPolling, isActivated])

  useEffect(() => {
    if (!email || isActivated) return

    const checkUserStatus = async () => {
      try {
        const response = await authService.getUserStatus(email)
        if (response.data?.isActive || response.data?.isVerified) {
          setIsActivated(true)
          setIsPolling(false)
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          toast.success('Account verified successfully!')
        }
      } catch (error) {
        console.error('Error checking user status:', error)
      }
    }

    setIsPolling(true)
    checkUserStatus()

    pollingIntervalRef.current = setInterval(() => {
      checkUserStatus()
    }, POLLING_INTERVAL)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [email, isActivated])

  const handleResendVerification = async () => {
    if (!email) return

    setIsResending(true)
    try {
      await authService.resendVerification(email)
      toast.success('Verification email sent successfully')
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            'Failed to resend verification email. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsResending(false)
    }
  }
  return (
    <UnauthenticatedLayout>
      <div className="max-w-[508px] w-full h-[425px] px-2">
        <div className="mb-7 text">
          <h2 className="font-semibold text-[2rem] mb-2">
            Verification Link Sent!
          </h2>
          <p className="text-light-grey font-normal">
            Welcome onboard, click on the verification link sent to your email
            at
            <span className="text-light-grey font-medium">&nbsp; {email}</span>
            &nbsp; to verify your account.
          </p>
          {isPolling && !isActivated && (
            <div className="mt-2">
              <p className="text-sm text-[#DF9300] dark:text-[#FAD645] mb-2">
                Checking verification status...
              </p>
              <div className="flex items-start gap-2 p-3 bg-[#FDF8EF] dark:bg-[#1a1a0a] rounded-lg border border-[#FAD645]/30">
                <WarningTag className="w-4 h-4 text-[#DF9300] dark:text-[#FAD645] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#0E1B28] dark:text-[#D7E4F1]">
                  Please do not reload or close this page while we verify your
                  account.
                </p>
              </div>
            </div>
          )}
          {isActivated && (
            <p className="text-sm text-[#0CB95B] mt-2">
              ✓ Account verified! You can now proceed.
            </p>
          )}
        </div>
        <div>
          <div className="w-full flex flex-col justify-center items-center gap-5">
            <div className="w-full px-5 py-[1.5625rem] bg-[#F9F9FB] dark:bg-[#121212] rounded-[20px] flex flex-col gap-8">
              <h3 className="font-medium leading-4.5 text-[#4C4C4C] dark:text-white">
                What do you have to do after your Account Activation?
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <Usertag />
                  <p>Tell us more about you</p>
                </div>
                <div className="flex gap-2 items-center">
                  <MobileTag />
                  <p>Authenticate your phone number</p>
                </div>
                <div className="flex gap-2 items-center">
                  <WarningTag />
                  <p>Explore your dashboard in test mode</p>
                </div>
                <div className="flex gap-2 items-center">
                  <TickTag />
                  <p>Go live on your dashboard with your compliance details</p>
                </div>
              </div>
            </div>
            <div className="controls flex flex-col gap-3 w-full">
              <Button
                className="bg-transparent text-yellow text-sm w-full"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              <div className="flex justify-between items-center w-full gap-x-2.5">
                <Button
                  className="bg-btn-lightGray dark:bg-[#232323]"
                  onClick={() => navigate('/signup/details')}
                >
                  Go Back
                </Button>
                <Button
                  className="bg-yellow dark:text-black"
                  onClick={() => navigate('/signup/create-password')}
                  disabled={!isActivated}
                >
                  {isPolling && !isActivated
                    ? 'Waiting for verification...'
                    : 'Proceed'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  )
}
