import { Link } from 'react-router-dom'
import { TOOLBOX_LABELS, type ToolboxItem } from '@/constants/toolbox'

type Props = {
  permission: ToolboxItem
}

const LockedFeature = ({ permission }: Props) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 px-6 text-center">
      <h2 className="text-2xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mb-2">
        {TOOLBOX_LABELS[permission]} locked
      </h2>
      <p className="text-[#82898F] dark:text-[#9CA3AF] max-w-md mb-6">
        Your organisation does not include access to this feature. Contact your
        Scrub administrator to enable {TOOLBOX_LABELS[permission]}.
      </p>
      <Link
        to="/dashboard"
        className="text-sm underline text-[#0E1B28] dark:text-[#FAD645]"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

export default LockedFeature
