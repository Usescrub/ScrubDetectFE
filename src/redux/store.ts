import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import scanReducer from './slices/scanSlice'
import tokenReducer from './slices/tokenSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    scan: scanReducer,
    token: tokenReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
