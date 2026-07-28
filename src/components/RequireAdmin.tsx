import { Navigate } from 'react-router-dom'

import { useAppSelector } from '@/redux/hooks'

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isSuperadmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default RequireAdmin
