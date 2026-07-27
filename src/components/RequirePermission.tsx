import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import type { ToolboxItem } from '@/constants/toolbox'
import LockedFeature from '@/components/LockedFeature'

type Props = {
  permission: ToolboxItem
  children: React.ReactNode
}

const RequirePermission = ({ permission, children }: Props) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const toolbox = user?.toolbox || []
  if (!toolbox.includes(permission)) {
    return <LockedFeature permission={permission} />
  }

  return <>{children}</>
}

export default RequirePermission
