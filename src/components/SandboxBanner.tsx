import { useAppSelector } from '@/redux/hooks'

export default function SandboxBanner() {
  const mode = useAppSelector((state) => state.environment.mode)
  if (mode !== 'sandbox') return null

  return (
    <div
      role="status"
      className="w-full shrink-0 bg-[#FAD645] text-[#0E1B28] text-center text-sm font-medium py-2 px-4"
    >
      Sandbox mode — test data and credentials only. Switch to Live for production.
    </div>
  )
}
