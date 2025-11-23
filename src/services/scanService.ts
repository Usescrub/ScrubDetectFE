import apiClient from './api'
import { API_ENDPOINTS } from './config'

export interface ScanRequest {
  file: File
  fileType?: string
}

export interface DetectionApiResponse {
  success: boolean
  cached: boolean
  detectionData: {
    fileName: string
    status: string
    request: {
      id: string
      timestamp: number
      operations: number
    }
    type: {
      aiGenerated: number
    }
    media: {
      id: string
      uri: string
    }
    processingTimeMs: number
  }
  imageHash: string
}

export interface AllScanResultsResponse {
  success: boolean
  scans: DetectionApiResponse[]
  total: number
}

export interface ScanResult {
  id: string
  fileName: string
  fileType: string
  uploadedBy: string
  scanStatus: 'completed' | 'failed' | 'processing'
  uploadDate: string
  warningMessage?: string
  requestId?: string
  aiGeneratedScore?: number
  mediaId?: string
  processingTimeMs?: number
  imageHash?: string
}

export interface ScanResponse {
  success: boolean
  data: ScanResult
  message?: string
}

const transformDetectionResponse = (
  apiResponse: DetectionApiResponse
): ScanResult => {
  const aiGeneratedScore = apiResponse.detectionData.type.aiGenerated
  const isAiGenerated = aiGeneratedScore > 0.5

  const result: ScanResult = {
    id: apiResponse.detectionData.request.id,
    fileName: apiResponse.detectionData.fileName || 'Unknown',
    fileType: (apiResponse.detectionData.fileName || 'Unknown.unknown')
      .split('.')
      .pop(),
    uploadedBy: 'Current User',
    scanStatus:
      apiResponse.detectionData.status === 'success' ? 'completed' : 'failed',
    uploadDate: new Date(
      apiResponse.detectionData.request.timestamp * 1000
    ).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
    warningMessage: isAiGenerated
      ? `This document appears to be AI-generated with a confidence score of ${(
          aiGeneratedScore * 100
        ).toFixed(1)}%. Proceed with caution.`
      : undefined,
    requestId: apiResponse.detectionData.request.id,
    aiGeneratedScore,
    mediaId: apiResponse.detectionData.media.id,
    processingTimeMs: apiResponse.detectionData.processingTimeMs,
    imageHash: apiResponse.imageHash,
  }

  return result
}

export const scanService = {
  async scanDocument(file: File): Promise<ScanResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<DetectionApiResponse>(
      API_ENDPOINTS.DETECTION.DETECT_FILE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    const transformedData = transformDetectionResponse(response.data)

    return {
      success: response.data.success,
      data: transformedData,
    }
  },

  async getScanResult(scanId: string): Promise<ScanResponse> {
    const response = await apiClient.get<DetectionApiResponse>(
      API_ENDPOINTS.DETECTION.GET_RESULT(scanId)
    )

    const transformedData = transformDetectionResponse(response.data)

    return {
      success: response.data.success,
      data: transformedData,
    }
  },

  async getAllScanResults(): Promise<{ success: boolean; data: ScanResult[] }> {
    const response = await apiClient.get<AllScanResultsResponse>(
      API_ENDPOINTS.DETECTION.GET_ALL_RESULTS
    )

    const transformedData = response.data.scans.map(transformDetectionResponse)

    return {
      success: response.data.success,
      data: transformedData,
    }
  },
}
