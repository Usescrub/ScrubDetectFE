import { Card, CardContent } from '@/components/ui/card'

const PreferencesTab = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center pt-0">
        <p className="text-xs uppercase tracking-wide text-[#DF9300] mb-3">
          Locked
        </p>
        <h3 className="text-lg font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mb-2">
          Preferences coming soon
        </h3>
        <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] max-w-md">
          Notification, display, and workspace preferences will live here.
          This section is locked for now.
        </p>
      </CardContent>
    </Card>
  )
}

export default PreferencesTab
