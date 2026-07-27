import type { AxiosRequestConfig } from 'axios'
import apiClient from './api'
import { API_ENDPOINTS } from './config'

export interface ScanRequest {
  file: File
  fileType?: string
}

export type ReviewStatus = 'pending' | 'rejected'

export interface DetectionApiResponse {
  success: boolean
  cached: boolean
  scanId?: number
  detectionData: {
    filename: string
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

export interface ScanListItem {
  id: number
  imageUrl?: string
  imageHash: string
  detectionData: DetectionApiResponse['detectionData']
  modelUsed?: string
  confidenceScore?: number
  isCached: boolean
  processingTimeMs?: number
  reviewStatus?: ReviewStatus
  createdAt: string
}

export interface AllScanResultsResponse {
  success: boolean
  scans: ScanListItem[]
  total: number
}

export interface ScanResult {
  id: string
  fileName: string
  fileType: string
  uploadedBy: string
  scanStatus: 'completed' | 'failed' | 'processing'
  reviewStatus: ReviewStatus
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

const formatUploadDate = (value: string | number) =>
  new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

const transformDetectionResponse = (
  apiResponse: DetectionApiResponse
): ScanResult => {
  const aiGeneratedScore = apiResponse.detectionData.type.aiGenerated
  const isAiGenerated = aiGeneratedScore > 0.5

  return {
    id: apiResponse.scanId
      ? String(apiResponse.scanId)
      : apiResponse.detectionData.request.id,
    fileName: apiResponse.detectionData.filename || 'Unknown',
    fileType: (apiResponse.detectionData.filename || 'Unknown.unknown')
      .split('.')
      .pop() || 'unknown',
    uploadedBy: 'Current User',
    scanStatus:
      apiResponse.detectionData.status === 'success' ? 'completed' : 'failed',
    reviewStatus: 'pending',
    uploadDate: formatUploadDate(
      apiResponse.detectionData.request.timestamp * 1000
    ),
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
}

const transformScanListItem = (scan: ScanListItem): ScanResult => {
  const fromDetection = transformDetectionResponse({
    success: true,
    cached: scan.isCached,
    detectionData: scan.detectionData,
    imageHash: scan.imageHash,
    scanId: scan.id,
  })

  return {
    ...fromDetection,
    id: String(scan.id),
    reviewStatus: scan.reviewStatus ?? 'pending',
    uploadDate: formatUploadDate(scan.createdAt),
  }
}

export const scanService = {
  async scanDocument(
    file: File,
    config: AxiosRequestConfig = {}
  ): Promise<ScanResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<DetectionApiResponse>(
      API_ENDPOINTS.DETECTION.DETECT_FILE,
      formData,
      {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      }
    )

    return {
      success: response.data.success,
      data: transformDetectionResponse(response.data),
    }
  },

  async getScanResult(scanId: string): Promise<ScanResponse> {
    const response = await apiClient.get<{ success: boolean; scan: ScanListItem }>(
      API_ENDPOINTS.DETECTION.GET_SCAN(scanId)
    )

    return {
      success: response.data.success,
      data: transformScanListItem(response.data.scan),
    }
  },

  async getAllScanResults(): Promise<{ success: boolean; data: ScanResult[] }> {
    const response = await apiClient.get<AllScanResultsResponse>(
      API_ENDPOINTS.DETECTION.GET_ALL_RESULTS
    )

    return {
      success: response.data.success,
      data: response.data.scans.map(transformScanListItem),
    }
  },

  async rejectScan(scanId: string): Promise<ReviewStatus> {
    const response = await apiClient.post<{ success: boolean; reviewStatus: ReviewStatus }>(
      API_ENDPOINTS.DETECTION.REJECT_SCAN(scanId)
    )
    return response.data.reviewStatus
  },
}
