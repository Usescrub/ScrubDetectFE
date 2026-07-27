import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  reportService,
  type CaseStatusResponse,
  type CreateReportRequest,
} from '@/services/reportService'

interface ReportState {
  cases: CaseStatusResponse[]
  currentCase: CaseStatusResponse | null
  total: number
  isLoading: boolean
  isCreating: boolean
  error: string | null
}

const initialState: ReportState = {
  cases: [],
  currentCase: null,
  total: 0,
  isLoading: false,
  isCreating: false,
  error: null,
}

const extractError = (error: unknown, fallback: string) => {
  const axiosError = error as {
    response?: { data?: { message?: string; detail?: string } }
    message?: string
  }
  const detail = axiosError.response?.data?.detail
  return (
    axiosError.response?.data?.message ||
    (typeof detail === 'string' ? detail : undefined) ||
    axiosError.message ||
    fallback
  )
}

export const fetchReports = createAsyncThunk(
  'report/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.listReports()
    } catch (error) {
      return rejectWithValue(extractError(error, 'Failed to load reports'))
    }
  }
)

export const createReport = createAsyncThunk(
  'report/createReport',
  async (data: CreateReportRequest, { rejectWithValue }) => {
    try {
      return await reportService.createReport(data)
    } catch (error) {
      return rejectWithValue(extractError(error, 'Failed to create report'))
    }
  }
)

export const fetchReportDetail = createAsyncThunk(
  'report/fetchReportDetail',
  async (caseId: string, { rejectWithValue }) => {
    try {
      return await reportService.getReport(caseId)
    } catch (error) {
      return rejectWithValue(extractError(error, 'Failed to load report'))
    }
  }
)

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearCurrentCase(state) {
      state.currentCase = null
    },
    clearReportError(state) {
      state.error = null
    },
    setCurrentCase(state, action: PayloadAction<CaseStatusResponse>) {
      state.currentCase = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.cases = action.payload.items
        state.total = action.payload.total
        state.isLoading = false
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createReport.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createReport.fulfilled, (state) => {
        state.isCreating = false
      })
      .addCase(createReport.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })
      .addCase(fetchReportDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReportDetail.fulfilled, (state, action) => {
        state.currentCase = action.payload
        state.isLoading = false
        const idx = state.cases.findIndex(
          (c) => c.caseId === action.payload.caseId
        )
        if (idx >= 0) {
          state.cases[idx] = { ...state.cases[idx], ...action.payload }
        }
      })
      .addCase(fetchReportDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentCase, clearReportError, setCurrentCase } =
  reportSlice.actions
export default reportSlice.reducer
