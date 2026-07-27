import Button from '@/components/buttons/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ScanResult } from '@/services/scanService'

type RejectScanDialogProps = {
  scan: ScanResult | null
  open: boolean
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const RejectScanDialog = ({
  scan,
  open,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
}: RejectScanDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white dark:bg-[#0D0D0D]">
      <DialogHeader>
        <DialogTitle className="text-[#0E1B28] dark:text-[#D7E4F1]">
          Reject analysis
        </DialogTitle>
        <DialogDescription className="text-[#82898F] dark:text-[#9CA3AF]">
          Mark {scan?.fileName ?? 'this scan'} as rejected. This indicates the
          analysis should not be used for decision-making.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="button"
          className="bg-white dark:bg-[#1C1C1C] border border-[#E0E0E0] dark:border-[#333333] text-[#0E1B28] dark:text-[#D7E4F1]"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#E31E18] text-white hover:bg-[#E31E18]/90"
          disabled={isSubmitting}
          onClick={onConfirm}
        >
          {isSubmitting ? 'Rejecting...' : 'Reject analysis'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default RejectScanDialog
