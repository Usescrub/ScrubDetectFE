import { Check, Sparkles } from 'lucide-react'
import Button from './buttons/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { cn } from '@/lib/utils'

interface PricingPlan {
  name: string
  slug: string
  price: string
  allowance: number
  features: string[]
  cta: string
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    slug: 'free',
    price: '$0',
    allowance: 50,
    features: ['50 scans per month', 'Basic detection', 'Email support'],
    cta: 'Select Free',
  },
  {
    name: 'Pro',
    slug: 'pro',
    price: '$29',
    allowance: 500,
    features: ['500 scans per month', 'Advanced detection', 'Priority support'],
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    price: 'Custom',
    allowance: 10000,
    features: ['Unlimited scans', 'Dedicated support', 'Custom integrations'],
    cta: 'Contact sales',
  },
]

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan?: string
}

function normalizePlan(plan?: string) {
  const slug = plan?.trim().toLowerCase()
  if (!slug || slug === 'none') return 'free'
  return slug
}

export function PricingModal({ isOpen, onClose, currentPlan }: PricingModalProps) {
  const activePlan = normalizePlan(currentPlan)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          'w-[min(96vw,56rem)] max-w-[56rem] sm:max-w-[56rem]',
          'border-0 p-0 overflow-visible gap-0 shadow-2xl'
        )}
      >
        <div className="px-6 pt-8 pb-2 sm:px-8">
          <DialogHeader className="text-left space-y-1.5 pr-8">
            <DialogTitle className="text-[#0E1B28] dark:text-[#D7E4F1] text-2xl font-bold tracking-tight">
              Choose your plan
            </DialogTitle>
            <DialogDescription className="text-[#82898F] text-sm">
              Get more scans and unlock premium features.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {plans.map((plan) => {
              const current = plan.slug === activePlan
              const recommended = plan.slug === 'pro' && !current

              return (
                <div
                  key={plan.slug}
                  className={cn(
                    'relative flex flex-col rounded-2xl p-6 min-w-0 border-2',
                    current
                      ? 'border-transparent bg-[#FAD645] shadow-[0_12px_40px_-12px_rgba(250,214,69,0.85)]'
                      : 'border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#141414]',
                    recommended && 'border-[#FAD645] animate-plan-border-pulse'
                  )}
                >
                  {recommended ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#0E1B28] text-[#D7E4F1] px-3 py-1 text-xs font-semibold whitespace-nowrap z-10">
                      <Sparkles className="w-3 h-3 text-[#FAD645]" />
                      Recommended
                    </span>
                  ) : null}

                  {current ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0E1B28] text-[#FAD645] px-3 py-1 text-xs font-semibold whitespace-nowrap z-10">
                      Current plan
                    </span>
                  ) : null}

                  <div className="mb-6 pt-1">
                    <h3
                      className={cn(
                        'font-semibold text-lg',
                        current
                          ? 'text-[#0E1B28]'
                          : 'text-[#0E1B28] dark:text-[#D7E4F1]'
                      )}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mt-3">
                      <p
                        className={cn(
                          'text-3xl font-bold tracking-tight',
                          current
                            ? 'text-[#0E1B28]'
                            : 'text-[#0E1B28] dark:text-[#D7E4F1]'
                        )}
                      >
                        {plan.price}
                      </p>
                      {plan.price !== 'Custom' && (
                        <span
                          className={cn(
                            'text-sm',
                            current ? 'text-[#0E1B28]/70' : 'text-[#82898F]'
                          )}
                        >
                          /mo
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-sm mt-2',
                        current ? 'text-[#0E1B28]/70' : 'text-[#82898F]'
                      )}
                    >
                      {plan.allowance.toLocaleString()} scans/mo
                    </p>
                  </div>

                  <ul className="space-y-3.5 text-sm flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={cn(
                            'mt-0.5 inline-flex shrink-0 rounded-full p-1',
                            current
                              ? 'bg-[#0E1B28]/10'
                              : 'bg-[#EBFAF5] dark:bg-[#0a1a14]'
                          )}
                        >
                          <Check
                            className={cn(
                              'w-3.5 h-3.5',
                              current ? 'text-[#0E1B28]' : 'text-[#0CB95B]'
                            )}
                          />
                        </span>
                        <span
                          className={cn(
                            'leading-snug',
                            current
                              ? 'text-[#0E1B28]'
                              : 'text-[#0E1B28] dark:text-[#D7E4F1]'
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      'mt-8 w-full h-11 text-sm px-4',
                      current
                        ? 'bg-[#0E1B28] text-[#FAD645] hover:bg-[#0E1B28]/90 cursor-default'
                        : 'bg-[#FAD645] text-[#0E1B28] hover:bg-[#FAD645]/90'
                    )}
                    disabled={current}
                    onClick={() => {
                      if (!current) onClose()
                    }}
                  >
                    {current ? 'Current plan' : plan.cta}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
