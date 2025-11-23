import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  scanService,
  type ScanResult,
  type ScanRequest,
} from '@/services/scanService'
import type { RootState } from '../store'

export interface ScanState {
  currentScan: ScanResult | null
  scanHistory: ScanResult[]
  isLoading: boolean
  error: string | null
  isScanning: boolean
}

const initialState: ScanState = {
  currentScan: null,
  scanHistory: [],
  isLoading: false,
  error: null,
  isScanning: false,
}

export const scanDocument = createAsyncThunk(
  'scan/scanDocument',
  async ({ file }: ScanRequest, { rejectWithValue, getState }) => {
    const { tokens } = (getState() as RootState).token
    const config = {
      headers: {
        'X-API-Key': tokens[0].key,
      },
    }
    try {
      const response = await scanService.scanDocument(file, config)
      return response.data
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string; detail?: string } }
        message?: string
      }
      return rejectWithValue(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.detail ||
          axiosError.message ||
          'Failed to scan document'
      )
    }
  }
)

export const fetchScanResult = createAsyncThunk(
  'scan/fetchScanResult',
  async (scanId: string, { rejectWithValue }) => {
    try {
      const response = await scanService.getScanResult(scanId)
      return response.data
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string; detail?: string } }
        message?: string
      }
      return rejectWithValue(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.detail ||
          axiosError.message ||
          'Failed to fetch scan result'
      )
    }
  }
)

export const fetchAllScanResults = createAsyncThunk(
  'scan/fetchAllScanResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scanService.getAllScanResults()
      return response.data
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string; detail?: string } }
        message?: string
      }
      return rejectWithValue(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.detail ||
          'Failed to fetch scan results'
      )
    }
  }
)

const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    clearCurrentScan(state) {
      state.currentScan = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
    setCurrentScan(state, action: PayloadAction<ScanResult | null>) {
      state.currentScan = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanDocument.pending, (state) => {
        state.isScanning = true
        state.isLoading = true
        state.error = null
      })
      .addCase(scanDocument.fulfilled, (state, action) => {
        state.isScanning = false
        state.isLoading = false
        state.currentScan = action.payload
        const exists = state.scanHistory.some(
          (scan) => scan.id === action.payload.id
        )
        if (!exists) {
          state.scanHistory.unshift(action.payload)
        }
      })
      .addCase(scanDocument.rejected, (state, action) => {
        state.isScanning = false
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchScanResult.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchScanResult.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentScan = action.payload
      })
      .addCase(fetchScanResult.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchAllScanResults.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllScanResults.fulfilled, (state, action) => {
        state.isLoading = false
        state.scanHistory = action.payload
      })
      .addCase(fetchAllScanResults.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentScan, clearError, setCurrentScan } =
  scanSlice.actions
export default scanSlice.reducer
