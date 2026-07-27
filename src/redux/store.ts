import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import scanReducer from './slices/scanSlice'
import tokenReducer from './slices/tokenSlice'
import reportReducer from './slices/reportSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    scan: scanReducer,
    token: tokenReducer,
    report: reportReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
