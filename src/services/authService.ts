import type { AuthenticatedUser } from '@/redux/slices/authSlice'
import { camelToSnake, snakeToCamel } from '@/lib/utils'

import apiClient from './api'
import { API_ENDPOINTS } from './config'
import { SIGNUP_ACCESS_TOKEN_KEY } from '@/constants'

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

export interface UserStatusResponse {
  isActive: boolean
  isVerified: boolean
}

export interface UpdateProfileRequest {
  fullName?: string
  phone?: string
  role?: string
  country?: string
}

export interface UpdateOrganisationRequest {
  company?: string
  companySize?: string
  industry?: string
}

export interface OrganisationControls {
  webhookUrl?: string | null
  webhookSecret?: string | null
  brandName?: string | null
  logoUrl?: string | null
}

export interface UpdateOrganisationControlsRequest {
  webhookUrl?: string
  brandName?: string
  logoUrl?: string
}

export interface WebhookTestResponse {
  success: boolean
  statusCode?: number | null
  detail: string
}

export interface TeamMember {
  id: number
  email: string
  fullName?: string
  role?: string
  permissions: string[]
  isOrgAdmin: boolean
  isActive: boolean
  isVerified: boolean
  createdAt: string
}

export interface InviteTeamMemberRequest {
  email: string
  fullName: string
  role?: string
}

export interface OrganisationEvent {
  id: number
  event: string
  message: string
  actor: string
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface OrganisationEventListResponse {
  items: OrganisationEvent[]
  total: number
  limit: number
  offset: number
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    )
    return response.data
  },

  async getCurrentUser(): Promise<AuthenticatedUser> {
    const response = await apiClient.get<AuthenticatedUser>(
      API_ENDPOINTS.AUTH.ME
    )
    return response.data
  },

  async updateProfile(data: UpdateProfileRequest): Promise<AuthenticatedUser> {
    const response = await apiClient.patch<AuthenticatedUser>(
      API_ENDPOINTS.AUTH.ME,
      data
    )
    return response.data
  },

  async updateOrganisation(
    data: UpdateOrganisationRequest
  ): Promise<AuthenticatedUser> {
    const response = await apiClient.patch<AuthenticatedUser>(
      API_ENDPOINTS.AUTH.ORGANISATION,
      data
    )
    return response.data
  },

  async getOrganisationControls(): Promise<OrganisationControls> {
    const response = await apiClient.get<OrganisationControls>(
      API_ENDPOINTS.AUTH.ORGANISATION_CONTROLS
    )
    return response.data
  },

  async updateOrganisationControls(
    data: UpdateOrganisationControlsRequest
  ): Promise<OrganisationControls> {
    const response = await apiClient.patch<OrganisationControls>(
      API_ENDPOINTS.AUTH.ORGANISATION_CONTROLS,
      data
    )
    return response.data
  },

  async rotateWebhookSecret(): Promise<OrganisationControls> {
    const response = await apiClient.post<OrganisationControls>(
      API_ENDPOINTS.AUTH.ORGANISATION_WEBHOOK_SECRET_ROTATE
    )
    return response.data
  },

  async sendTestWebhook(): Promise<WebhookTestResponse> {
    const response = await apiClient.post<WebhookTestResponse>(
      API_ENDPOINTS.AUTH.ORGANISATION_WEBHOOK_TEST
    )
    return response.data
  },

  async listTeam(): Promise<{ members: TeamMember[]; total: number }> {
    const response = await apiClient.get<{ members: TeamMember[]; total: number }>(
      API_ENDPOINTS.AUTH.TEAM
    )
    return response.data
  },

  async listOrganisationActivity(
    limit = 50,
    offset = 0
  ): Promise<OrganisationEventListResponse> {
    const response = await apiClient.get<OrganisationEventListResponse>(
      API_ENDPOINTS.AUTH.ORGANISATION_ACTIVITY,
      { params: { limit, offset } }
    )
    return response.data
  },

  async listOrganisationLogs(
    limit = 50,
    offset = 0
  ): Promise<OrganisationEventListResponse> {
    const response = await apiClient.get<OrganisationEventListResponse>(
      API_ENDPOINTS.AUTH.ORGANISATION_LOGS,
      { params: { limit, offset } }
    )
    return response.data
  },

  async inviteTeamMember(
    data: InviteTeamMemberRequest
  ): Promise<{ member: TeamMember; message: string }> {
    const response = await apiClient.post<{ member: TeamMember; message: string }>(
      API_ENDPOINTS.AUTH.TEAM_INVITE,
      data
    )
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
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            SIGNUP_ACCESS_TOKEN_KEY
          )}`,
        },
      }
    )
    return response.data
  },

  async getUserStatus(email: string): Promise<UserStatusResponse> {
    const response = await apiClient.get<UserStatusResponse>(
      API_ENDPOINTS.AUTH.USER_STATUS(email)
    )
    return snakeToCamel(response.data)
  },
}
