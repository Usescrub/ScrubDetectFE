export const TOOLBOX = {
  DETECT_API: 'DETECT_API',
  CREDIT_REPORT: 'CREDIT_REPORT',
  CREDIT_SCORE: 'CREDIT_SCORE',
  FRAUD_MONITORING: 'FRAUD_MONITORING',
} as const

export type ToolboxItem = (typeof TOOLBOX)[keyof typeof TOOLBOX]

export const TOOLBOX_LABELS: Record<ToolboxItem, string> = {
  DETECT_API: 'Detect API',
  CREDIT_REPORT: 'Credit Report',
  CREDIT_SCORE: 'Credit Score',
  FRAUD_MONITORING: 'Fraud Monitoring',
}

export const ALL_TOOLBOX: ToolboxItem[] = [
  TOOLBOX.DETECT_API,
  TOOLBOX.CREDIT_REPORT,
  TOOLBOX.CREDIT_SCORE,
  TOOLBOX.FRAUD_MONITORING,
]

/** @deprecated Use TOOLBOX */
export const PERMISSIONS = TOOLBOX
/** @deprecated Use ToolboxItem */
export type Permission = ToolboxItem
/** @deprecated Use TOOLBOX_LABELS */
export const PERMISSION_LABELS = TOOLBOX_LABELS
/** @deprecated Use ALL_TOOLBOX */
export const ALL_PERMISSIONS = ALL_TOOLBOX
