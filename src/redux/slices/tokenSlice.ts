import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Token } from '@/services/tokenService'
import { tokenService } from '@/services/tokenService'

interface InitialState {
  tokens: Token[]
  isLoading: boolean
  isDeleting: boolean
  error: string | null
}

const initialState: InitialState = {
  tokens: [],
  isDeleting: false,
  isLoading: false,
  error: null,
}

export const fetchTokens = createAsyncThunk(
  'token/fetchTokens',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tokenService.listTokens()
      return response.tokens
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createToken = createAsyncThunk(
  'token/createToken',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await tokenService.createToken({ name })
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteToken = createAsyncThunk(
  'token/deleteToken',
  async (tokenId: string, { rejectWithValue }) => {
    try {
      const response = await tokenService.deleteToken(tokenId)
      return { tokenId, ...response }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<Token[]>) {
      state.tokens = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokens.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTokens.fulfilled, (state, action) => {
        state.tokens = action.payload
        state.isLoading = false
      })
      .addCase(fetchTokens.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      })
      .addCase(createToken.fulfilled, (state, action) => {
        state.tokens.unshift(action.payload.token)
      })
      .addCase(deleteToken.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteToken.fulfilled, (state, action) => {
        state.tokens = state.tokens.filter(
          (token) => token.id !== action.payload.tokenId
        )
        state.isDeleting = false
      })
      .addCase(deleteToken.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export default tokenSlice.reducer
