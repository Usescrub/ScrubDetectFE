import type { AuthenticatedUser } from '@/redux/slices/authSlice'
import { camelToSnake } from '@/lib/utils'

import apiClient from './api'
import { API_ENDPOINTS } from './config'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  tokenType: string
  user: AuthenticatedUser
}

export interface AuthResponse {
  success: boolean
  data: LoginResponse
  message?: string
}

export interface RefreshTokenResponse {
  accessToken: string
  tokenType: string
}

export interface SignupRequest {
  fullName: string
  username: string
  email: string
  phone: string
  password?: string
  company?: string
  companySize?: string
  industry?: string
  role?: string
  country?: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface VerifyEmailResponse {
  success: boolean
  message?: string
}

export interface CreatePasswordRequest {
  new_password: string
}

export interface CreatePasswordResponse {
  success: boolean
  message?: string
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    )
    return response.data
  },

  async getCurrentUser(): Promise<{
    success: boolean
    data: AuthenticatedUser
  }> {
    const response = await apiClient.get<{
      success: boolean
      data: AuthenticatedUser
    }>(API_ENDPOINTS.AUTH.ME)
    return response.data
  },

  async signup(data: SignupRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      camelToSnake(data)
    )
    return response.data
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<VerifyEmailResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data
    )
    return response.data
  },

  async resendVerification(email: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      { email }
    )
    return response.data
  },

  async createPassword(
    data: CreatePasswordRequest
  ): Promise<CreatePasswordResponse> {
    const response = await apiClient.post<CreatePasswordResponse>(
      API_ENDPOINTS.AUTH.PASSWORD,
      data
    )
    return response.data
  },
}
