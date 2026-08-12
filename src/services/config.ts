export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8001',
  API_VERSION: 'v1',
  TIMEOUT: 30000,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
    ORGANISATION: '/api/v1/auth/organisation',
    ORGANISATION_CONTROLS: '/api/v1/auth/organisation/controls',
    ORGANISATION_WEBHOOK_SECRET_ROTATE:
      '/api/v1/auth/organisation/controls/webhook-secret/rotate',
    ORGANISATION_WEBHOOK_TEST: '/api/v1/auth/organisation/controls/webhook-test',
    ORGANISATION_ACTIVITY: '/api/v1/auth/organisation/activity',
    ORGANISATION_LOGS: '/api/v1/auth/organisation/logs',
    TEAM: '/api/v1/auth/team',
    TEAM_INVITE: '/api/v1/auth/team/invite',
    SIGNUP: '/api/v1/auth/signup',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
    PASSWORD: '/api/v1/auth/password',
    USER_STATUS: (email: string) =>
      `/api/v1/auth/user-status?email=${encodeURIComponent(email)}`,
  },
  DETECTION: {
    DETECT_FILE: '/api/v1/detect/file',
    GET_SCAN: (id: string) => `/api/v1/detect/scans/${id}`,
    GET_ALL_RESULTS: '/api/v1/detect/scans',
    REJECT_SCAN: (id: string) => `/api/v1/detect/scans/${id}/reject`,
  },
  TOKENS: {
    CREATE: '/api/v1/auth/tokens',
    LIST: '/api/v1/auth/tokens',
    DELETE: (id: string) => `/api/v1/auth/tokens/${id}`,
  },
  REPORT: {
    CREATE: '/api/v1/report',
    LIST: '/api/v1/report',
    GET: (id: string) => `/api/v1/report/${id}`,
  },
  CONSENT: {
    SESSION: (token: string) => `/c/${token}/session`,
    LINK_TOKEN: (token: string) => `/c/${token}/link-token`,
    EXCHANGE: (token: string) => `/c/${token}/exchange`,
  },
  USAGE: {
    QUOTA: '/api/v1/usage/quota',
  },
  ADMIN: {
    USERS: '/api/v1/admin/users',
    USER: (id: string | number) => `/api/v1/admin/users/${id}`,
    ORGANISATIONS: '/api/v1/admin/organisations',
    ORGANISATION: (id: string | number) => `/api/v1/admin/organisations/${id}`,
    PLANS: '/api/v1/admin/plans',
    PLAN: (id: string | number) => `/api/v1/admin/plans/${id}`,
    LOGS: '/api/v1/admin/logs',
    STATS: '/api/v1/admin/stats',
  },
} as const
