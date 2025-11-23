import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { scanDocument, clearError } from '@/redux/slices/scanSlice'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Select from '@/components/Select'
import Button from '@/components/buttons/Button'

import File from '@/assets/icons/file.svg?react'
import Warning2 from '@/assets/icons/warning-2.svg?react'
import TickCircle from '@/assets/icons/tick-circle.svg?react'

import ScanResults from './ScanResults'

const formSchema = z.object({
  fileType: z.string().min(1, 'Please select a file type'),
})

type FormType = z.infer<typeof formSchema>

const fileTypeOptions = [
  { label: 'PDF', value: '.pdf' },
  { label: 'DOCX', value: '.docx' },
  { label: 'PNG', value: '.png' },
  { label: 'JPG', value: '.jpg' },
  { label: 'JPEG', value: '.jpeg' },
  { label: 'WEBP', value: '.webp' },
]

const SUPPORTED_TYPES = ['pdf', 'docx', 'png', 'jpg', 'jpeg', 'webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024

const Scan = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    currentScan,
    isScanning,
    error: scanError,
  } = useAppSelector((state) => state.scan)
  const { user } = useAppSelector((state) => state.auth)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState<string>('.pdf')
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)

  useEffect(() => {
    if (!user?.apiKey) {
      setShowApiKeyDialog(true)
    }
  }, [user])

  useEffect(() => {
    if (scanError) {
      toast.error(scanError)
      dispatch(clearError())
    }
  }, [scanError, dispatch])

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileType: '',
    },
  })

  if (currentScan && currentScan.scanStatus === 'completed') {
    return <ScanResults />
  }

  const validateFile = (file: File): string | null => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    if (!fileExtension || !SUPPORTED_TYPES.includes(fileExtension)) {
      return `File type .${fileExtension} is not supported. Supported types: ${SUPPORTED_TYPES.join(
        ', '
      ).toUpperCase()}`
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit. Current size: ${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)}MB`
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setSelectedFile(null)
      return
    }

    setError(null)
    setSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = async (data: FormType) => {
    if (!selectedFile) {
      setError('Please select a file to scan')
      return
    }

    setError(null)
    try {
      await dispatch(
        scanDocument({
          file: selectedFile,
          fileType: data.fileType || fileType,
        })
      ).unwrap()
      toast.success('Document scanned successfully')
    } catch (err) {
      const errorMessage =
        typeof err === 'string'
          ? err
          : err instanceof Error
          ? err.message
          : 'Failed to scan document. Please try again.'
      setError(errorMessage)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-6 text-[#0E1B28] dark:text-[#D7E4F1]">
        Scan a Document
      </h2>
      <Card className="w-full bg-white dark:bg-[#0D0D0D]">
        <CardContent className="px-2 py-2">
          <div className="card-content border rounded-2xl border-[#E0E0E0] dark:border-[#333333] p-6 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#0E1B28] dark:text-[#D7E4F1]">
                Select File Type
              </label>
              <Select
                control={control}
                onChange={setFileType}
                classname="dark:bg-[#161616]"
                name="fileType"
                placeholder="Make Selection -- PDF, DOCX, PNG etc. --"
                options={fileTypeOptions}
                icon={File}
                iconClassName="fill-[#82898F] dark:fill-[#6B7280]"
                error={errors.fileType?.message}
              />
            </div>

            <div
              className={`
              relative border-2 border-dashed rounded-2xl p-12 mb-6
              transition-colors cursor-pointer h-[500px] flex items-center justify-center
              bg-[#FEFEFEF5]
              ${
                isDragging
                  ? 'border-[#FAD645] bg-[#FDF8EF] dark:bg-[#1a1a0a]'
                  : 'border-[#E0E0E0] dark:border-[#333333] bg-[#F9F9FB] dark:bg-[#161616]'
              }
            `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={fileType}
                onChange={handleFileInputChange}
              />

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <File className="w-full h-full fill-[#82898F] dark:fill-[#6B7280]" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-medium mb-2 text-[#0E1B28] dark:text-[#D7E4F1]">
                    Drag & drop a file here
                  </p>
                  <p className="text-sm text-[#82898F] dark:text-[#9CA3AF]">
                    or click to browse
                  </p>
                </div>
                <Button
                  className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 mt-2 [&&]:w-fit"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUploadClick()
                  }}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <File className="w-4! h-4! stroke-[black]" />
                    Upload File
                  </span>
                </Button>
              </div>
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1C] rounded-lg border border-[#E0E0E0] dark:border-[#333333]">
                <p className="text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            )}

            {(error || scanError) && (
              <div className="mt-4 p-4 bg-[#FDEDED] dark:bg-[#2a1a1a] rounded-lg border border-[#E31E18]">
                <p className="text-sm text-[#E31E18]">{error || scanError}</p>
              </div>
            )}

            {isScanning && (
              <div className="mt-4 p-4 bg-[#FDF8EF] dark:bg-[#1a1a0a] rounded-lg border border-[#FAD645]/30">
                <p className="text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  Scanning document... Please wait.
                </p>
              </div>
            )}
          </div>

          <div className="mb-6 p-4 bg-[#FDF8EF] dark:bg-[#1a1a0a] rounded-lg border border-[#FAD645]/30">
            <div className="flex items-start gap-3">
              <Warning2 className="w-5 h-5 text-[#DF9300] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                Supported file types: PDF, JPG, JPEG, PNG, WEBP. Max file size:
                10MB.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              className="bg-white dark:bg-[#1C1C1C] border border-[#E0E0E0] dark:border-[#333333] text-[#0E1B28] dark:text-[#D7E4F1]  [&&}:text-sm [&&]:px-2 [&&]:h-[24px] [&&]:w-fit hover:bg-[#F9F9FB] dark:hover:bg-[#222222]"
              onClick={handleCancel}
            >
              <span className="flex items-center gap-2 text-sm">
                <span className="text-xl">×</span>
                Cancel
              </span>
            </Button>
            <Button
              className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&}:text-sm [&&]:px-2 [&&]:h-[24px]"
              onClick={handleSubmit(onSubmit)}
              disabled={isScanning || !selectedFile}
            >
              <span className="flex items-center text-sm gap-2">
                <TickCircle className="w-5 h-5" />
                {isScanning ? 'Scanning...' : 'Scan Document'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="bg-white dark:bg-[#0D0D0D]">
          <DialogHeader>
            <DialogTitle className="text-[#0E1B28] dark:text-[#D7E4F1]">
              API Key Required
            </DialogTitle>
            <DialogDescription className="text-[#82898F] dark:text-[#9CA3AF]">
              You need an API key to scan documents. Please create a token to
              get your API key.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90"
              onClick={() => {
                setShowApiKeyDialog(false)
                navigate('/token-management')
              }}
            >
              Get Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Scan
