import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

import type { AuthenticatedUser } from '@/redux/slices/authSlice'
import {
  RBAC_RESOURCES,
  RBAC_SCOPES,
  SYSTEM_ROLES,
  type RbacRole,
} from '@/constants/rbac'
import { TOOLBOX_LABELS, type ToolboxItem } from '@/constants/toolbox'
import { cn } from '@/lib/utils'

import Button from '@/components/buttons/Button'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  user: AuthenticatedUser
}

type Section = 'roles' | 'resources' | 'scopes'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'roles', label: 'Roles' },
  { id: 'resources', label: 'Resources' },
  { id: 'scopes', label: 'Scopes' },
]

const isSection = (value: string | null): value is Section =>
  SECTIONS.some((s) => s.id === value)

const PermissionsTab = ({ user }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const isAdmin = !!user.isOrgAdmin
  const orgToolbox = (user.toolbox || []) as ToolboxItem[]

  const sectionParam = searchParams.get('section')
  const section: Section = isSection(sectionParam) ? sectionParam : 'roles'

  const setSection = (next: Section) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', 'permissions')
    params.set('section', next)
    setSearchParams(params, { replace: true })
  }

  const roles = useMemo(() => {
    const q = search.trim().toLowerCase()
    return SYSTEM_ROLES.filter(
      (role) =>
        !q ||
        role.id.toLowerCase().includes(q) ||
        role.description.toLowerCase().includes(q)
    )
  }, [search])

  const resources = useMemo(() => {
    const q = search.trim().toLowerCase()
    return RBAC_RESOURCES.filter(
      (resource) =>
        !q ||
        resource.id.toLowerCase().includes(q) ||
        resource.name.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q)
    )
  }, [search])

  const scopes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return RBAC_SCOPES.filter(
      (scope) =>
        !q ||
        scope.id.toLowerCase().includes(q) ||
        scope.name.toLowerCase().includes(q) ||
        scope.description.toLowerCase().includes(q)
    )
  }, [search])

  const roleScopes = (role: RbacRole) => {
    if (role.id === 'org_member') {
      return orgToolbox.length ? orgToolbox : ['No scopes assigned at org level']
    }
    return role.scopes
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
            Roles & Permissions
          </h3>
          <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
            Configure role-based access for your organisation.
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              className="bg-btn-lightGray dark:bg-[#232323] [&&]:w-fit [&&]:text-sm [&&]:h-[32px] [&&]:px-3"
              onClick={() => toast.info('Copy from role — coming soon')}
            >
              <span className="flex items-center gap-1.5">
                Copy from
                <ChevronDown size={14} />
              </span>
            </Button>
            <Button
              className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&]:text-sm [&&]:h-[32px] [&&]:px-3"
              onClick={() => toast.info('Custom roles — coming soon')}
            >
              <span className="flex items-center gap-1.5">
                <Plus size={14} />
                Create new role
              </span>
            </Button>
          </div>
        )}
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82898F]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles, resources, or scopes"
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E8E8E9] dark:border-[#222224] bg-white dark:bg-[#0D0D0D] text-sm text-[#0E1B28] dark:text-[#D7E4F1] placeholder:text-[#82898F]"
        />
      </div>

      <div className="flex gap-4 border-b border-[#E8E8E9] dark:border-[#222224]">
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={cn(
              'relative pb-2.5 text-sm transition-colors cursor-pointer',
              section === item.id
                ? 'text-[#0E1B28] dark:text-[#D7E4F1] font-semibold'
                : 'text-[#82898F] dark:text-[#9CA3AF] hover:text-[#0E1B28] dark:hover:text-[#D7E4F1]'
            )}
          >
            {item.label}
            {section === item.id && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#FAD645]" />
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-0 px-0">
          {section === 'roles' && (
            <div className="divide-y divide-[#E8E8E9] dark:divide-[#222224]">
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#82898F]">
                <span>Role ID</span>
                <span>Description</span>
              </div>
              {roles.map((role) => {
                const open = expandedRole === role.id
                const scopesForRole = roleScopes(role)
                return (
                  <div key={role.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRole(open ? null : role.id)
                      }
                      className="w-full grid grid-cols-[1fr_2fr] gap-4 px-4 py-4 text-left hover:bg-[#F9F9FB] dark:hover:bg-[#161616] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {open ? (
                          <ChevronDown size={16} className="shrink-0 text-[#82898F]" />
                        ) : (
                          <ChevronRight size={16} className="shrink-0 text-[#82898F]" />
                        )}
                        <code className="text-sm font-mono text-[#0E1B28] dark:text-[#D7E4F1] bg-[#F5F6F6] dark:bg-[#1C1C1C] px-2 py-1 rounded truncate">
                          {role.id}
                        </code>
                        {role.system && (
                          <span className="text-[10px] uppercase tracking-wide text-[#82898F] shrink-0">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#82898F] dark:text-[#9CA3AF]">
                        {role.description}
                        {role.system && ' Cannot be deleted.'}
                      </p>
                    </button>
                    {open && (
                      <div className="px-4 pb-4 pl-10">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#82898F] mb-2">
                          Scopes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {scopesForRole.map((scope) => (
                            <span
                              key={scope}
                              className="text-xs px-2 py-1 rounded bg-[#FDF8EF] dark:bg-[#1a1608] text-[#DF9300] border border-[#FAD645]/30"
                            >
                              {TOOLBOX_LABELS[scope as ToolboxItem] || scope}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {section === 'resources' && (
            <div className="divide-y divide-[#E8E8E9] dark:divide-[#222224]">
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#82898F]">
                <span>Resource ID</span>
                <span>Description</span>
              </div>
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-4 items-start"
                >
                  <div>
                    <code className="text-sm font-mono text-[#0E1B28] dark:text-[#D7E4F1] bg-[#F5F6F6] dark:bg-[#1C1C1C] px-2 py-1 rounded">
                      {resource.id}
                    </code>
                    <p className="text-sm font-medium text-[#0E1B28] dark:text-[#D7E4F1] mt-2">
                      {resource.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#82898F] dark:text-[#9CA3AF]">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {resource.scopes.map((scope) => (
                        <span
                          key={scope}
                          className={cn(
                            'text-xs px-2 py-1 rounded border',
                            orgToolbox.includes(scope)
                              ? 'border-[#FAD645]/40 bg-[#FDF8EF] dark:bg-[#1a1608] text-[#DF9300]'
                              : 'border-[#E8E8E9] dark:border-[#222224] text-[#82898F]'
                          )}
                        >
                          {TOOLBOX_LABELS[scope]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === 'scopes' && (
            <div className="divide-y divide-[#E8E8E9] dark:divide-[#222224]">
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#82898F]">
                <span>Scope ID</span>
                <span>Description</span>
              </div>
              {scopes.map((scope) => {
                const enabled = orgToolbox.includes(scope.id)
                return (
                  <div
                    key={scope.id}
                    className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-4 items-start"
                  >
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-[#0E1B28] dark:text-[#D7E4F1] bg-[#F5F6F6] dark:bg-[#1C1C1C] px-2 py-1 rounded">
                        {scope.id}
                      </code>
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-wide font-semibold',
                          enabled ? 'text-[#0CB95B]' : 'text-[#82898F]'
                        )}
                      >
                        {enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                        {scope.name}
                      </p>
                      <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mt-1">
                        {scope.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PermissionsTab
