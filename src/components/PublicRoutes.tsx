import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { getCurrentUser } from '@/redux/slices/authSlice'

interface PublicRouteProps {
  redirectTo?: string
}

export function PublicRoute({ redirectTo }: PublicRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  if (isAuthenticated) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
