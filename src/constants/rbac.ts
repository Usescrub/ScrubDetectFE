import { ALL_TOOLBOX, TOOLBOX_LABELS, type ToolboxItem } from './toolbox'

export type RbacRole = {
  id: string
  description: string
  scopes: ToolboxItem[]
  system?: boolean
}

export type RbacResource = {
  id: string
  name: string
  description: string
  scopes: ToolboxItem[]
}

export const SYSTEM_ROLES: RbacRole[] = [
  {
    id: 'org_member',
    description:
      'Granted to all organisation members. Access is limited to toolbox scopes assigned by an admin.',
    scopes: [],
    system: true,
  },
  {
    id: 'org_admin',
    description:
      'Granted to organisation admins. Can manage team, permissions, and organisation settings. Includes org_member access.',
    scopes: [...ALL_TOOLBOX],
    system: true,
  },
]

export const RBAC_RESOURCES: RbacResource[] = [
  {
    id: 'detect_api',
    name: 'Detect API',
    description: 'Image and document AI detection endpoints.',
    scopes: ['DETECT_API'],
  },
  {
    id: 'credit_report',
    name: 'Credit Report',
    description: 'Financial report generation and consent workflows.',
    scopes: ['CREDIT_REPORT'],
  },
  {
    id: 'credit_score',
    name: 'Credit Score',
    description: 'Credit scoring models and score retrieval.',
    scopes: ['CREDIT_SCORE'],
  },
  {
    id: 'fraud_monitoring',
    name: 'Fraud Monitoring',
    description: 'Fraud alerts, rules, and monitoring dashboards.',
    scopes: ['FRAUD_MONITORING'],
  },
]

export const RBAC_SCOPES = ALL_TOOLBOX.map((scope) => ({
  id: scope,
  name: TOOLBOX_LABELS[scope],
  description: `Grants access to ${TOOLBOX_LABELS[scope]} products and APIs.`,
}))
