import { useEffect } from 'react'
import { LockIcon } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setEnvironment } from '@/redux/slices/environmentSlice'
import { cn } from '@/lib/utils'


export default function SandboxModeToggle() {
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state.environment.mode)
  const liveEnabled = !!useAppSelector((state) => state.auth.user?.liveEnabled)

  useEffect(() => {
    if (!liveEnabled && mode === 'live') {
      dispatch(setEnvironment('sandbox'))
    }
  }, [liveEnabled, mode, dispatch])

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-10 items-center rounded-full border border-[#EBEBF5] dark:border-[#1C1C1C] bg-white dark:bg-dark p-1"
        role="group"
        aria-label="API environment"
      >
        <button
          type="button"
          onClick={() => dispatch(setEnvironment('sandbox'))}
          className={cn(
            'h-8 px-3 rounded-full text-xs font-medium transition-colors cursor-pointer',
            mode === 'sandbox'
              ? 'bg-[#0E1B28] text-white dark:bg-[#FAD645] dark:text-[#0E1B28]'
              : 'text-[#82898F] dark:text-[#9CA3AF] hover:text-[#0E1B28] dark:hover:text-[#D7E4F1]'
          )}
        >
          Sandbox
        </button>
        <button
          type="button"
          disabled={!liveEnabled}
          aria-disabled={!liveEnabled}
          title={
            liveEnabled
              ? 'Switch to Live'
              : 'Live access requires organisation approval'
          }
          onClick={() => {
            if (!liveEnabled) return
            dispatch(setEnvironment('live'))
          }}
          className={cn(
            'h-8 px-3 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5',
            !liveEnabled &&
            'text-[#9CA3AF] dark:text-[#6B7280] cursor-not-allowed',
            liveEnabled && mode === 'live' &&
            'bg-[#0E1B28] text-white dark:bg-[#FAD645] dark:text-[#0E1B28] cursor-pointer',
            liveEnabled &&
            mode !== 'live' &&
            'text-[#82898F] dark:text-[#9CA3AF] hover:text-[#0E1B28] dark:hover:text-[#D7E4F1] cursor-pointer'
          )}
        >
          Live
          {!liveEnabled && <LockIcon size={12} className="w-3 h-3 shrink-0" />}
        </button>
      </div>
      {!liveEnabled && (
        <span className="hidden sm:inline text-xs text-[#82898F] dark:text-[#9CA3AF] whitespace-nowrap">
          Live locked
        </span>
      )}
    </div>
  )
}
