import apiClient from './api'
import { API_ENDPOINTS } from './config'

export type CaseStatus =
  | 'PENDING_CONNECTION'
  | 'CONNECTED'
  | 'PROCESSING'
  | 'REPORT_READY'
  | 'FAILED'
  | 'EXPIRED'

export interface CreateReportRequest {
  fullName: string
  contactPhone?: string
  contactEmail?: string
  referenceId: string
  countryCodes?: string[]
}

export interface CreateReportResponse {
  caseId: string
  status: string
  message: string
  linkUrl: string
}

export interface ReportPayload {
  score: number
  report: Record<string, unknown>
  reportPdfUrl?: string | null
}

export interface CaseStatusResponse {
  caseId: string
  referenceId: string
  subjectId: string
  status: CaseStatus
  createdAt: string
  connectionCompletedAt?: string | null
  reportCompletedAt?: string | null
  webhookDeliveredAt?: string | null
  report?: ReportPayload | null
}

export interface CaseListResponse {
  items: CaseStatusResponse[]
  total: number
  limit: number
  offset: number
}

export interface LinkTokenResponse {
  linkToken: string
  provider: string
  brandName?: string | null
  logoUrl?: string | null
  displayName?: string | null
}

export interface ConsentSessionResponse {
  status: 'valid' | 'expired' | 'used' | 'invalid'
  displayName: string
  brandName?: string | null
  logoUrl?: string | null
  applicantName?: string | null
  detail?: string | null
}

export interface ExchangeTokenRequest {
  publicToken: string
  institution?: {
    name?: string
    institutionId?: string
  } | null
  accounts?: unknown[] | null
}

export interface ExchangeTokenResponse {
  success: boolean
  message: string
}

export const reportService = {
  createReport: async (data: CreateReportRequest) => {
    const response = await apiClient.post<CreateReportResponse>(
      API_ENDPOINTS.REPORT.CREATE,
      data
    )
    return response.data
  },

  listReports: async (limit = 50, offset = 0) => {
    const response = await apiClient.get<CaseListResponse>(
      API_ENDPOINTS.REPORT.LIST,
      { params: { limit, offset } }
    )
    return response.data
  },

  getReport: async (caseId: string) => {
    const response = await apiClient.get<CaseStatusResponse>(
      API_ENDPOINTS.REPORT.GET(caseId)
    )
    return response.data
  },
}

export const consentService = {
  getSession: async (consentToken: string) => {
    const response = await apiClient.get<ConsentSessionResponse>(
      API_ENDPOINTS.CONSENT.SESSION(consentToken)
    )
    return response.data
  },

  createLinkToken: async (consentToken: string) => {
    const response = await apiClient.post<LinkTokenResponse>(
      API_ENDPOINTS.CONSENT.LINK_TOKEN(consentToken)
    )
    return response.data
  },

  exchangeToken: async (consentToken: string, data: ExchangeTokenRequest) => {
    const response = await apiClient.post<ExchangeTokenResponse>(
      API_ENDPOINTS.CONSENT.EXCHANGE(consentToken),
      data
    )
    return response.data
  },
}
