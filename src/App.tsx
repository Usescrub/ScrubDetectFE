import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'
import PrivateRoute from './components/PrivateRoute'
import AuthenticatedLayout from './layouts/AuthenticatedLayout'
import LoginPage from './modules/Auth/LoginPage'
import ForgotPassword from './modules/Auth/ForgotPassword'
import Password from './modules/Auth/Password'
import JoinUs from './modules/Auth/signup/JoinUs'
import Details from './modules/Auth/signup/Details'
import Verification from './modules/Auth/signup/Verification'
import VerifyEmail from './modules/Auth/VerifyEmail'
import Dashboard from './modules/Dashboard'
import Scan from './modules/Dashboard/Scan'
import TokenManagement from './modules/Dashboard/TokenManagement'
import { PublicRoute } from './components/PublicRoutes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      { path: 'forgot-password', element: <ForgotPassword /> },
      {
        path: 'new-password',
        element: <Password title="Create a New Password" />,
      },
      { path: 'verify-email', element: <VerifyEmail /> },
      {
        path: '/signup',
        children: [
          { index: true, element: <Navigate to="join-us" /> },
          { path: 'join-us', element: <JoinUs /> },
          { path: 'details', element: <Details /> },
          { path: 'verification', element: <Verification /> },
          {
            path: 'create-password',
            element: <Password title="Create Your Password" />,
          },
        ],
      },
    ],
  },
  {
    path: '',
    element: (
      <PrivateRoute>
        <AuthenticatedLayout />
      </PrivateRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'scan', element: <Scan /> },
      { path: 'token-management', element: <TokenManagement /> },
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
