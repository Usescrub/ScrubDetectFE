import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const location = useLocation()

  if (!isAuthenticated) {
    const currentPath = location.pathname + location.search
    return (
      <Navigate
        to={`/login?rdr=${encodeURIComponent(currentPath)}`}
        replace
        state={{ from: location }}
      />
    )
  }

  return <>{children}</>
}
