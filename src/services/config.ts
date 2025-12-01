export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8000',
  API_VERSION: 'v1',
  TIMEOUT: 30000,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
    SIGNUP: '/api/v1/auth/signup',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
    PASSWORD: '/api/v1/auth/password',
    USER_STATUS: (email: string) =>
      `/api/v1/auth/user-status?email=${encodeURIComponent(email)}`,
  },
  DETECTION: {
    DETECT_FILE: '/api/v1/detect/file',
    GET_RESULT: (id: string) => `/api/v1/detect/result/${id}`,
    GET_ALL_RESULTS: '/api/v1/detect/scans',
  },
  TOKENS: {
    CREATE: '/api/v1/auth/tokens',
    LIST: '/api/v1/auth/tokens',
    DELETE: (id: string) => `/api/v1/auth/tokens/${id}`,
  },
} as const
