import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { adminService, type AdminStats } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/card'

const statCards = [
  { key: 'totalUsers' as const, label: 'Users', to: '/admin/users' },
  {
    key: 'totalOrganisations' as const,
    label: 'Organisations',
    to: '/admin/organisations',
  },
  { key: 'totalPlans' as const, label: 'Plans', to: '/admin/plans' },
]

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const data = await adminService.getStats()
        if (!cancelled) setStats(data)
      } catch {
        if (!cancelled) toast.error('Failed to load admin stats')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
          Dashboard
        </h2>
        <p className="text-sm text-[#82898F] mt-1">
          Platform overview across users, organisations, and plans.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link key={card.key} to={card.to}>
            <Card className="hover:border-[#FAD645]/60 transition-colors">
              <CardContent className="pt-0">
                <p className="text-sm text-[#82898F]">{card.label}</p>
                <p className="text-3xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mt-2">
                  {loading ? '—' : (stats?.[card.key] ?? 0)}
                </p>
                {card.key === 'totalUsers' && stats && (
                  <p className="text-xs text-[#82898F] mt-2">
                    {stats.activeUsers} active · {stats.verifiedUsers} verified
                  </p>
                )}
                {card.key === 'totalPlans' && stats && (
                  <p className="text-xs text-[#82898F] mt-2">
                    {stats.activePlans} active
                  </p>
                )}
                {card.key === 'totalOrganisations' && stats && (
                  <p className="text-xs text-[#82898F] mt-2">
                    {stats.totalAuditLogs} audit logs
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/logs">
          <Card className="hover:border-[#FAD645]/60 transition-colors">
            <CardContent className="pt-0">
              <p className="font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                Activity logs
              </p>
              <p className="text-sm text-[#82898F] mt-1">
                Cross-organisation audit trail
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/plans">
          <Card className="hover:border-[#FAD645]/60 transition-colors">
            <CardContent className="pt-0">
              <p className="font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                Manage plans
              </p>
              <p className="text-sm text-[#82898F] mt-1">
                Create and update subscription plans
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
