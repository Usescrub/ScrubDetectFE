import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants'
import { authService, type LoginRequest } from '@/services/authService'

import type { RootState } from '../store'

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  roles?: string[]
}

export interface SignupData {
  firstName?: string
  lastName?: string
  fullName?: string
  email?: string
  phone?: string
  company?: string
  companySize?: string
  industry?: string
  role?: string
  country?: string
  password?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: AuthenticatedUser | null
  signupData: SignupData
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  signupData: {},
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Login failed'
      )
    }
  }
)

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout()
  } catch (error) {
    console.error('Logout API call failed:', error)
  }
})

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser()
      return response.data
    } catch (error) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Failed to get user'
      )
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (_, { rejectWithValue, getState }) => {
    try {
      const signupData = (getState() as RootState).auth.signupData
      const response = await authService.signup({
        fullName: `${signupData.firstName} ${signupData.lastName}`,
        username: `${signupData.firstName}.${signupData.lastName}@${signupData.company}.com`,
        email: signupData.email!,
        phone: signupData.phone!,
        company: signupData.company!,
        companySize: signupData.companySize!,
        industry: signupData.industry!,
        role: signupData.role!,
        country: signupData.country!,
      })
      return response
    } catch (error) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Signup failed'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSucceeded(
      state,
      action: PayloadAction<{ accessToken: string; user: AuthenticatedUser }>
    ) {
      state.isAuthenticated = true
      state.user = action.payload.user
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken)
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    },
    setUser(state, action: PayloadAction<AuthenticatedUser | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    updateSignupData(state, action: PayloadAction<Partial<SignupData>>) {
      state.signupData = { ...state.signupData, ...action.payload }
    },
    clearSignupData(state) {
      state.signupData = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken)
        if (action.payload.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken)
        }
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
      })

    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      })

    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      })

    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user
        localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken)
        if (action.payload.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken)
        }
      })
      .addCase(signup.rejected, () => {})
  },
})

export const {
  loginSucceeded,
  logout,
  setUser,
  updateSignupData,
  clearSignupData,
} = authSlice.actions

export default authSlice.reducer
