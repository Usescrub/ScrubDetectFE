import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent } from '@/components/ui/card'
import Button from '@/components/buttons/Button'
import Warning2 from '@/assets/icons/warning-2.svg?react'
import TickCircle from '@/assets/icons/tick-circle.svg?react'

const ScanResults = () => {
  const navigate = useNavigate()
  const { currentScan } = useAppSelector((state) => state.scan)

  if (!currentScan) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-[#0E1B28] dark:text-[#D7E4F1]">
          No scan results available
        </p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    if (status === 'completed') {
      return 'bg-[#0CB95B]'
    }
    return 'bg-[#E31E18]'
  }

  const getStatusTextColor = (status: string) => {
    if (status === 'completed') {
      return 'bg-[#EBFAF5] text-[#0CB95B]'
    }
    return 'bg-[#FDEDED] text-[#E31E18]'
  }

  const getScanStatusColor = (status: string) => {
    if (status === 'completed') {
      return 'bg-[#EBFAF5] text-[#0CB95B]'
    }
    if (status === 'failed') {
      return 'bg-[#FDEDED] text-[#E31E18]'
    }
    return 'bg-[#FDF8EF] text-[#DF9300]'
  }

  const getScanStatusDot = (status: string) => {
    if (status === 'completed') {
      return 'bg-[#0CB95B]'
    }
    if (status === 'failed') {
      return 'bg-[#E31E18]'
    }
    return 'bg-[#DF9300]'
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-6 text-[#0E1B28] dark:text-[#D7E4F1]">
        Scan Results
      </h2>

      <Card className="w-full bg-white dark:bg-[#0D0D0D]">
        <CardContent className="px-6 py-8">
          {/* First Detection Summary - File Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-[#0E1B28] dark:text-[#D7E4F1]">
              Detection Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mb-1">
                  File Name
                </p>
                <p className="text-base font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                  {currentScan?.fileName}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mb-1">
                  File Type
                </p>
                <p className="text-base font-medium text-[#0E1B28] dark:text-[#D7E4F1] uppercase">
                  {currentScan?.fileType}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mb-1">
                  Uploaded By
                </p>
                <p className="text-base font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                  {currentScan?.uploadedBy}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mb-1">
                  Scan Status
                </p>
                <div
                  className={`${getScanStatusColor(
                    currentScan?.scanStatus
                  )} items-center flex capitalize py-1 px-2 text-xs w-fit rounded-2xl`}
                >
                  <div
                    className={`rounded-full h-[8px] w-[8px] mr-1 ${getScanStatusDot(
                      currentScan?.scanStatus
                    )}`}
                  ></div>
                  <div>{currentScan?.scanStatus}</div>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mb-1">
                  Upload Date
                </p>
                <p className="text-base font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                  {currentScan?.uploadDate}
                </p>
              </div>
            </div>
          </div>

          {/* Second Detection Summary - Scan Results */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-[#0E1B28] dark:text-[#D7E4F1]">
              Detection Summary
            </h3>
            <div className="border border-[#E0E0E0] dark:border-[#333333] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 bg-[#F9F9FB] dark:bg-[#161616] border-b border-[#E0E0E0] dark:border-[#333333]">
                <div className="px-4 py-3 font-semibold text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  METRIC
                </div>
                <div className="px-4 py-3 font-semibold text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  STATUS
                </div>
                <div className="px-4 py-3 font-semibold text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  RESULT SUMMARY
                </div>
              </div>

              {/* Document Validity Row */}
              <div className="grid grid-cols-3 border-b border-[#E0E0E0] dark:border-[#333333]">
                <div className="px-4 py-4 text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  Document Validity
                </div>
                <div className="px-4 py-4">
                  <div
                    className={`${getStatusTextColor(
                      currentScan?.scanStatus
                    )} items-center flex capitalize py-1 px-2 text-xs w-fit rounded-2xl`}
                  >
                    <div
                      className={`rounded-full h-[8px] w-[8px] mr-1 ${getStatusColor(
                        currentScan?.scanStatus
                      )}`}
                    ></div>
                    <div className="capitalize">
                      {currentScan?.aiGeneratedScore &&
                      currentScan?.aiGeneratedScore > 0.5
                        ? 'Invalid'
                        : 'Valid'}
                    </div>
                  </div>
                </div>
                {/* <div className="px-4 py-4 text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  {currentScan?.documentValidity.resultSummary}
                </div> */}
              </div>
              <div className="grid grid-cols-3 border-b border-[#E0E0E0] dark:border-[#333333]">
                <div className="px-4 py-4 text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  Document Score
                </div>
                <div className="px-4 py-4">
                  <div className="capitalize">
                    {currentScan?.aiGeneratedScore * 100}%
                  </div>
                </div>
              </div>

              {/* Tampering Detected Row */}
              {/* <div className="grid grid-cols-3">
                <div className="px-4 py-4 text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  Tampering Detected
                </div>
                <div className="px-4 py-4">
                  <div
                    className={`${getStatusTextColor(
                      currentScan?.tamperingDetected.status
                    )} items-center flex capitalize py-2 px-4 w-fit rounded-2xl`}
                  >
                    <div
                      className={`rounded-full h-[8px] w-[8px] mr-3 ${getStatusColor(
                        currentScan?.tamperingDetected.status
                      )}`}
                    ></div>
                    <div className="capitalize">
                      {currentScan?.tamperingDetected.status === 'detected'
                        ? 'Detected'
                        : 'Not Detected'}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  {currentScan?.tamperingDetected.resultSummary}
                </div>
              </div> */}
            </div>
          </div>

          {/* Warning Message */}
          {currentScan?.warningMessage && (
            <div className="mb-6 p-4 bg-[#FDF8EF] dark:bg-[#1a1a0a] rounded-lg border border-[#FAD645]/30">
              <div className="flex items-start gap-3">
                <Warning2 className="w-5 h-5 text-[#DF9300] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                  {currentScan?.warningMessage}
                </p>
              </div>
            </div>
          )}

          {/* Back to Dashboard Button */}
          <div className="flex justify-center">
            <Button
              className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&]:px-6"
              onClick={() => navigate('/dashboard')}
            >
              <span className="flex items-center gap-2 text-sm">
                <TickCircle className="w-5 h-5" />
                Back to Dashboard
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScanResults
