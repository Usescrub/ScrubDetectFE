import apiClient from './api'
import { API_ENDPOINTS } from './config'
import type { ToolboxItem } from '@/constants/toolbox'

export interface AdminUser {
  id: number
  email: string
  username: string
  fullName?: string
  phone?: string
  role?: string
  country?: string
  organisationId?: number
  organisationName?: string
  isOrgAdmin: boolean
  isActive: boolean
  isVerified: boolean
  isSuperadmin: boolean
  superadminEligible: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface AdminSubscriptionSummary {
  id: number
  planId: number
  planName: string
  planSlug: string
  isActive: boolean
  startsAt?: string
  endsAt?: string
}

export interface AdminOrganisation {
  id: number
  name: string
  domain?: string
  companySize?: string
  industry?: string
  country?: string
  toolbox: ToolboxItem[]
  usersCount: number
  planSlug?: string
  createdAt: string
  subscription?: AdminSubscriptionSummary
}

export interface AdminPlan {
  id: number
  name: string
  slug: string
  scanAllowance: number
  priceMonthly: number | string
  isActive: boolean
  createdAt: string
}

export interface AdminLog {
  id: number
  organisationId: number
  organisationName?: string
  event: string
  message: string
  actor: string
  isActivity: boolean
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  totalOrganisations: number
  totalPlans: number
  activePlans: number
  totalAuditLogs: number
  generatedAt: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit?: number
  offset?: number
}

export interface ListParams {
  limit?: number
  offset?: number
  search?: string
  isActive?: boolean
  isVerified?: boolean
  organisationId?: number
  event?: string
}

export interface UpdateAdminUserRequest {
  isActive?: boolean
  isVerified?: boolean
  isSuperadmin?: boolean
}

export interface UpdateAdminOrganisationRequest {
  name?: string
  domain?: string
  companySize?: string
  industry?: string
  country?: string
  toolbox?: ToolboxItem[]
  planId?: number
}

export interface CreateAdminPlanRequest {
  name: string
  slug: string
  scanAllowance: number
  priceMonthly: number
  isActive?: boolean
}

export interface UpdateAdminPlanRequest {
  name?: string
  slug?: string
  scanAllowance?: number
  priceMonthly?: number
  isActive?: boolean
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>(API_ENDPOINTS.ADMIN.STATS)
    return response.data
  },

  async listUsers(params: ListParams = {}): Promise<PaginatedResponse<AdminUser>> {
    const response = await apiClient.get<PaginatedResponse<AdminUser>>(
      API_ENDPOINTS.ADMIN.USERS,
      { params }
    )
    return response.data
  },

  async getUser(id: string | number): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(API_ENDPOINTS.ADMIN.USER(id))
    return response.data
  },

  async updateUser(
    id: string | number,
    data: UpdateAdminUserRequest
  ): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(
      API_ENDPOINTS.ADMIN.USER(id),
      data
    )
    return response.data
  },

  async deleteUser(id: string | number): Promise<AdminUser> {
    const response = await apiClient.delete<AdminUser>(
      API_ENDPOINTS.ADMIN.USER(id)
    )
    return response.data
  },

  async listOrganisations(
    params: ListParams = {}
  ): Promise<PaginatedResponse<AdminOrganisation>> {
    const response = await apiClient.get<PaginatedResponse<AdminOrganisation>>(
      API_ENDPOINTS.ADMIN.ORGANISATIONS,
      { params }
    )
    return response.data
  },

  async getOrganisation(id: string | number): Promise<AdminOrganisation> {
    const response = await apiClient.get<AdminOrganisation>(
      API_ENDPOINTS.ADMIN.ORGANISATION(id)
    )
    return response.data
  },

  async updateOrganisation(
    id: string | number,
    data: UpdateAdminOrganisationRequest
  ): Promise<AdminOrganisation> {
    const response = await apiClient.patch<AdminOrganisation>(
      API_ENDPOINTS.ADMIN.ORGANISATION(id),
      data
    )
    return response.data
  },

  async deleteOrganisation(id: string | number): Promise<AdminOrganisation> {
    const response = await apiClient.delete<AdminOrganisation>(
      API_ENDPOINTS.ADMIN.ORGANISATION(id)
    )
    return response.data
  },

  async listPlans(): Promise<PaginatedResponse<AdminPlan>> {
    const response = await apiClient.get<PaginatedResponse<AdminPlan>>(
      API_ENDPOINTS.ADMIN.PLANS
    )
    return response.data
  },

  async createPlan(data: CreateAdminPlanRequest): Promise<AdminPlan> {
    const response = await apiClient.post<AdminPlan>(
      API_ENDPOINTS.ADMIN.PLANS,
      data
    )
    return response.data
  },

  async updatePlan(
    id: string | number,
    data: UpdateAdminPlanRequest
  ): Promise<AdminPlan> {
    const response = await apiClient.patch<AdminPlan>(
      API_ENDPOINTS.ADMIN.PLAN(id),
      data
    )
    return response.data
  },

  async deletePlan(id: string | number): Promise<AdminPlan> {
    const response = await apiClient.delete<AdminPlan>(
      API_ENDPOINTS.ADMIN.PLAN(id)
    )
    return response.data
  },

  async listLogs(
    params: ListParams = {}
  ): Promise<PaginatedResponse<AdminLog>> {
    const response = await apiClient.get<PaginatedResponse<AdminLog>>(
      API_ENDPOINTS.ADMIN.LOGS,
      { params }
    )
    return response.data
  },
}
