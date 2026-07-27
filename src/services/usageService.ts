import apiClient from './api'
import { API_ENDPOINTS } from './config'

export interface QuotaResponse {
  success: boolean
  scanAllowance: number
  scansUsed: number
  scansRemaining: number
  plan: string
}

export const usageService = {
  async getQuota(): Promise<QuotaResponse> {
    const response = await apiClient.get<QuotaResponse>(API_ENDPOINTS.USAGE.QUOTA)
    return response.data
  },
}
