import { ACCESS_TOKEN_KEY } from '@/constants'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  roles?: string[]
}

export interface AuthState {
  isAuthenticated: boolean
  user: AuthenticatedUser | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

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
  },
})

export const { loginSucceeded, logout, setUser } = authSlice.actions

export default authSlice.reducer
