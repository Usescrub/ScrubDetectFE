import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

import Guard from '@/assets/icons/guard.svg?react'
import Cog from '@/assets/icons/cog.svg?react'
import LogOut from '@/assets/icons/log-out.svg?react'
import Home from '@/assets/icons/home.svg?react'
import ShortLogo from '@/assets/icons/shortlogo.svg?react'
import ScrubLogo from '@/assets/icons/scrubLogo.svg?react'
import { cn } from '@/lib/utils'
import { useLocation } from 'react-router-dom'

const menuGrp = {
  1: [
    {
      title: 'Dashboard',
      icon: Home,
      url: '/dashboard',
    },
    {
      title: 'Scan',
      icon: Guard,
      url: '/scan',
    },
  ],
  2: [
    {
      title: 'Settings',
      icon: Cog,
      url: '#',
    },
  ],
  3: [
    {
      title: 'Log Out',
      icon: LogOut,
      url: '#',
    },
  ],
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { state } = useSidebar()
  const { pathname } = useLocation()

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      {...props}
      className="dark:bg-[#121212]"
    >
      <SidebarHeader
        className={cn(
          'relative py-5',
          state === 'expanded' && 'px-6',
          state === 'collapsed' && 'px-3'
        )}
      >
        <SidebarTrigger className="absolute right-[-10px] top-[30%] rounded-full cursor-pointer h-[25px] w-[25px] bg-[#FAD645] absolute"></SidebarTrigger>
        <div className="text-white">
          {state === 'collapsed' ? <ShortLogo /> : <ScrubLogo fill="white" />}
        </div>
        <Separator className="px-2 mt-5" />
      </SidebarHeader>
      <SidebarContent
        className={cn(
          state === 'expanded' && 'px-6',
          state === 'collapsed' && 'px-2'
        )}
      >
        {Object.values(menuGrp).map((v, index) => {
          return (
            <>
              <SidebarGroup>
                <SidebarMenu className="gap-3">
                  {v.map((item) => (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={pathname.includes(item.url)}
                        size="lg"
                        className="text-white"
                      >
                        <item.icon width={25} height={25} className="ml-1" />
                        <a href={item.url}> {item.title} </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              {!(index === Object.values(menuGrp).length - 1) && (
                <Separator className="px-2 mt-5" />
              )}
            </>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
