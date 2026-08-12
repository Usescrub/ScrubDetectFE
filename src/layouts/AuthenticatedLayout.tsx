import { Outlet, useLocation } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import SandboxModeToggle from '@/components/SandboxModeToggle'
import SandboxBanner from '@/components/SandboxBanner'
import AppSidebar from '@/components/app-sidebar'
import { useAppSelector } from '@/redux/hooks'
import { getInitials } from '@/lib/utils'

const headerTitleMap = {
  '/dashboard': 'Dashboard',
  '/scan': 'Scan',
  '/token-management': 'Token Management',
  '/financial-reports': 'Financial Reports',
  '/settings': 'Settings',
}

export default function AuthenticatedLayout() {
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const headerTitle =
    headerTitleMap[location.pathname as keyof typeof headerTitleMap]

  const initials = getInitials(user?.fullName || user?.name, user?.email)

  return (
    <SidebarProvider className="dark:bg-[#121212] bg-[#F8FAFC]">
      <AppSidebar />
      <SidebarInset className="w-full flex-1 bg-inherit transition-all duration-300 ease-out">
        <SandboxBanner />
        <div className="main flex flex-col flex-1  py-2 w-full px-5 bg-inherit">
          <div className="header flex justify-between py-1 w-full items-center animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="title text-2xl font-semibold">{headerTitle}</div>
            <div className="title flex gap-x-5 items-center cursor-pointer">
              <SandboxModeToggle />
              <ThemeSwitcher />
              <div className="flex justify-center items-center profile rounded-full h-[40px] w-[40px] bg-[#FAD645] text-[#0E1B28] font-semibold text-sm">
                {initials}
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="body">
            <div
              key={location.pathname}
              className="animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out"
            >
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
