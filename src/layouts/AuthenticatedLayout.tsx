import { Outlet } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'

import FilledChevronDown from '@/assets/icons/filledChevronDown.svg?react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import AppSidebar from '@/components/app-sidebar'

export default function AuthenticatedLayout() {
  return (
    <SidebarProvider className="dark:bg-[#121212] bg-[#F8FAFC]">
      <AppSidebar />
      <SidebarInset className="w-full flex-1 bg-inherit">
        <div className="main flex flex-col flex-1  py-2 w-full px-5 bg-inherit">
          <div className="header flex justify-between py-1 w-full items-center">
            <div className="title">Dashboard</div>
            <div className="title flex gap-x-5 items-center">
              <ThemeSwitcher />
              <div className="flex justify-center items-center profile rounded-full h-[40px] bg-red-100 w-[40px]">
                PA
              </div>
              <div className="">
                <FilledChevronDown />
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="body">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
