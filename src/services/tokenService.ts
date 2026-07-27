import apiClient from './api'
import { API_ENDPOINTS } from './config'
import type { ToolboxItem } from '@/constants/toolbox'

export interface Token {
  id: string
  name: string
  key: string
  scopes: ToolboxItem[]
  createdAt: string
  lastUsedAt?: string
  isEnabled?: boolean
}

export interface CreateTokenRequest {
  name: string
  scopes: ToolboxItem[]
}

export interface CreateTokenResponse {
  success?: boolean
  token: Token
  message?: string
}

export interface ListTokensResponse {
  success: boolean
  tokens: Token[]
  message?: string
}

export interface DeleteTokenResponse {
  success: boolean
  message?: string
}

export const tokenService = {
  async createToken(data: CreateTokenRequest): Promise<CreateTokenResponse> {
    const response = await apiClient.post<CreateTokenResponse>(
      API_ENDPOINTS.TOKENS.CREATE,
      data
    )
    return response.data
  },

  async listTokens(): Promise<ListTokensResponse> {
    const response = await apiClient.get<ListTokensResponse>(
      API_ENDPOINTS.TOKENS.LIST
    )
    return response.data
  },

  async deleteToken(tokenId: string): Promise<DeleteTokenResponse> {
    const response = await apiClient.delete<DeleteTokenResponse>(
      API_ENDPOINTS.TOKENS.DELETE(tokenId)
    )
    return response.data
  },
}
