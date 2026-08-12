import { useEffect } from 'react'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCurrentUser, setUser } from '@/redux/slices/authSlice'

import { cn } from '@/lib/utils'

import AccountTab from './AccountTab'
import OrganisationTab from './OrganisationTab'
import TeamTab from './TeamTab'
import PreferencesTab from './PreferencesTab'
import PermissionsTab from './PermissionsTab'
import ControlsTab from './ControlsTab'

const TABS = [
  { id: 'account', label: 'Account' },
  { id: 'organisation', label: 'Organisation' },
  { id: 'team', label: 'Team' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'controls', label: 'Controls' },
  { id: 'preferences', label: 'Preferences', locked: true },
] as const

type TabId = (typeof TABS)[number]['id']

const DEFAULT_TAB: TabId = 'account'

const isTabId = (value: string | null): value is TabId =>
  TABS.some((tab) => tab.id === value)

const Settings = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = searchParams.get('tab')
  const activeTab = isTabId(tabParam) ? tabParam : DEFAULT_TAB

  useEffect(() => {
    if (!tabParam || !isTabId(tabParam)) {
      setSearchParams({ tab: DEFAULT_TAB }, { replace: true })
    }
  }, [tabParam, setSearchParams])

  useEffect(() => {
    dispatch(getCurrentUser())
      .unwrap()
      .catch(() => toast.error('Failed to load account'))
  }, [dispatch])

  const setActiveTab = (tab: TabId) => {
    const params: Record<string, string> = { tab }
    if (tab === 'permissions') params.section = 'roles'
    if (tab === 'controls') params.section = 'activity'
    setSearchParams(params, { replace: true })
  }

  const refreshUser = async () => {
    const next = await dispatch(getCurrentUser()).unwrap()
    dispatch(setUser(next))
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
          Manage your account, organisation, team, and access.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-[#E8E8E9] dark:border-[#222224] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors cursor-pointer items-center',
              activeTab === tab.id
                ? 'text-[#0E1B28] dark:text-[#D7E4F1] font-semibold'
                : 'text-[#82898F] dark:text-[#9CA3AF] hover:text-[#0E1B28] dark:hover:text-[#D7E4F1]',
              'locked' in tab && tab.locked && 'opacity-60'
            )}
          >
            {tab.label}
            {'locked' in tab && tab.locked && (
              <Lock className="inline-block ml-1.5 text-[#DF9300]" size={13} />
            )}
            {activeTab === tab.id && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#FAD645]" />
            )}
          </button>
        ))}
      </div>

      {!user ? (
        <p className="text-sm text-[#82898F]">Loading...</p>
      ) : (
        <>
          {activeTab === 'account' && (
            <AccountTab user={user} onSaved={refreshUser} />
          )}
          {activeTab === 'organisation' && (
            <OrganisationTab user={user} onSaved={refreshUser} />
          )}
          {activeTab === 'team' && <TeamTab user={user} />}
          {activeTab === 'permissions' && <PermissionsTab user={user} />}
          {activeTab === 'controls' && (
            <ControlsTab user={user} onSaved={refreshUser} />
          )}
          {activeTab === 'preferences' && <PreferencesTab />}
        </>
      )}
    </div>
  )
}

export default Settings
