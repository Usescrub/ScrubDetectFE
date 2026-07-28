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
import FinancialReports from './modules/Dashboard/FinancialReports'
import ReportDetail from './modules/Dashboard/FinancialReports/ReportDetail'
import CreditScoring from './modules/Dashboard/CreditScoring'
import FraudMonitoring from './modules/Dashboard/FraudMonitoring'
import Settings from './modules/Dashboard/Settings'
import ConsentPage from './modules/Consent/ConsentPage'
import { PublicRoute } from './components/PublicRoutes'
import RequirePermission from './components/RequirePermission'
import RequireAdmin from './components/RequireAdmin'
import {
  AdminLayout,
  AdminDashboard,
  UsersManagement,
  OrganisationsManagement,
  PlansManagement,
  ActivityLogs,
} from './modules/Admin'
import { TOOLBOX } from './constants/toolbox'

const router = createBrowserRouter([
  {
    path: '/consent/:consentToken',
    element: <ConsentPage />,
  },
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
      {
        path: 'scan',
        element: (
          <RequirePermission permission={TOOLBOX.DETECT_API}>
            <Scan />
          </RequirePermission>
        ),
      },
      { path: 'token-management', element: <TokenManagement /> },
      { path: 'settings', element: <Settings /> },
      {
        path: 'financial-reports',
        element: (
          <RequirePermission permission={TOOLBOX.CREDIT_REPORT}>
            <FinancialReports />
          </RequirePermission>
        ),
      },
      {
        path: 'financial-reports/:caseId',
        element: (
          <RequirePermission permission={TOOLBOX.CREDIT_REPORT}>
            <ReportDetail />
          </RequirePermission>
        ),
      },
      {
        path: 'credit-scoring',
        element: (
          <RequirePermission permission={TOOLBOX.CREDIT_SCORE}>
            <CreditScoring />
          </RequirePermission>
        ),
      },
      {
        path: 'fraud-monitoring',
        element: (
          <RequirePermission permission={TOOLBOX.FRAUD_MONITORING}>
            <FraudMonitoring />
          </RequirePermission>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <RequireAdmin>
          <AdminLayout />
        </RequireAdmin>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UsersManagement /> },
      { path: 'organisations', element: <OrganisationsManagement /> },
      { path: 'plans', element: <PlansManagement /> },
      { path: 'logs', element: <ActivityLogs /> },
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
