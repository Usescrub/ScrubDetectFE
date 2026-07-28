import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import { cn, getInitials } from '@/lib/utils'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { Separator } from '@/components/ui/separator'

import ScrubLogo from '@/assets/icons/scrubLogo.svg?react'
import Home from '@/assets/icons/home.svg?react'
import Cog from '@/assets/icons/cog.svg?react'
import LogOut from '@/assets/icons/log-out.svg?react'
import Guard from '@/assets/icons/guard.svg?react'
import KeyIcon from '@/assets/icons/components/KeyIcon'

const navItems = [
  { title: 'Dashboard', to: '/admin', icon: Home, end: true },
  { title: 'Users', to: '/admin/users', icon: Guard, end: false },
  { title: 'Organisations', to: '/admin/organisations', icon: Cog, end: false },
  { title: 'Plans', to: '/admin/plans', icon: KeyIcon, end: false },
  { title: 'Logs', to: '/admin/logs', icon: Guard, end: false },
]

export default function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const initials = getInitials(user?.fullName || user?.name, user?.email)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex dark:bg-[#121212] bg-[#F8FAFC]">
      <aside className="w-64 shrink-0 border-r border-[#E8E8E9] dark:border-[#222224] bg-[#0E1B28] text-[#D7E4F1] flex flex-col">
        <div className="px-6 py-5">
          <ScrubLogo fill="white" />
          <p className="mt-3 text-xs uppercase tracking-wide text-[#9CA3AF]">
            Admin Portal
          </p>
          <Separator className="mt-5 bg-[#222224]" />
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-[#FAD645]/15 text-[#FAD645]'
                    : 'text-[#D7E4F1] hover:bg-white/5'
                )
              }
            >
              <item.icon width={18} height={18} />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-5 flex flex-col gap-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D7E4F1] hover:bg-white/5"
          >
            <Cog width={18} height={18} />
            Back to app
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#D7E4F1] hover:bg-white/5 cursor-pointer"
          >
            <LogOut width={18} height={18} />
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
              Scrub Admin
            </h1>
            <p className="text-sm text-[#82898F]">Platform management</p>
          </div>
          <div className="flex gap-x-5 items-center">
            <ThemeSwitcher />
            <div className="flex justify-center items-center rounded-full h-[40px] w-[40px] bg-[#FAD645] text-[#0E1B28] font-semibold text-sm">
              {initials}
            </div>
          </div>
        </header>
        <Separator className="mx-6 w-auto" />
        <main className="flex-1 px-6 py-5 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
