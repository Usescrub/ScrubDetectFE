import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch } from '@/redux/hooks'
import { logoutAsync } from '@/redux/slices/authSlice'

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
import KeyIcon from '@/assets/icons/components/KeyIcon'
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
      title: 'Token Management',
      icon: KeyIcon,
      url: '/token-management',
    },
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
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout. Please try again.')
      navigate('/login')
    }
  }

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
            <React.Fragment key={index}>
              <SidebarGroup>
                <SidebarMenu className="gap-3">
                  {v.map((item) => {
                    if (item.title === 'Log Out') {
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={handleLogout}
                            size="lg"
                            className="text-white cursor-pointer"
                          >
                            <item.icon
                              width={25}
                              height={25}
                              className="ml-1"
                            />
                            <>{item.title}</>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    }
                    const IconComponent = item.icon
                    return (
                      <Link key={item.title} to={item.url}>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            isActive={pathname.includes(item.url)}
                            size="lg"
                            className="text-white"
                          >
                            <IconComponent
                              width={25}
                              height={25}
                              className="ml-1"
                            />
                            <>{item.title}</>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Link>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroup>
              {!(index === Object.values(menuGrp).length - 1) && (
                <Separator className="px-2 mt-5" />
              )}
            </React.Fragment>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
