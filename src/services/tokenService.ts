import apiClient from './api'
import { API_ENDPOINTS } from './config'

export interface Token {
  id: string
  name: string
  token: string
  createdAt: string
  lastUsedAt?: string
}

export interface CreateTokenRequest {
  name: string
}

export interface CreateTokenResponse {
  success: boolean
  data: Token
  message?: string
}

export interface ListTokensResponse {
  success: boolean
  data: Token[]
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
