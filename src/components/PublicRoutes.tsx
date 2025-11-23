import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { getCurrentUser } from '@/redux/slices/authSlice'

interface PublicRouteProps {
  redirectTo?: string
}

export function PublicRoute({ redirectTo }: PublicRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const rdrKey = searchParams.get('rdr')

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  if (isAuthenticated) {
    const redirectPath = rdrKey || redirectTo || '/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
