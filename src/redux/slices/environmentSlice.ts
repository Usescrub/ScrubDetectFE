import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ApiEnvironment = 'live' | 'sandbox'

const STORAGE_KEY = 'scrub_environment'

function readStoredMode(): ApiEnvironment {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'live' || stored === 'sandbox') return stored
  return 'sandbox'
}

interface EnvironmentState {
  mode: ApiEnvironment
}

const initialState: EnvironmentState = {
  mode: readStoredMode(),
}

const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setEnvironment(state, action: PayloadAction<ApiEnvironment>) {
      state.mode = action.payload
      localStorage.setItem(STORAGE_KEY, action.payload)
    },
    toggleEnvironment(state) {
      state.mode = state.mode === 'live' ? 'sandbox' : 'live'
      localStorage.setItem(STORAGE_KEY, state.mode)
    },
  },
})

export const { setEnvironment, toggleEnvironment } = environmentSlice.actions
export default environmentSlice.reducer
