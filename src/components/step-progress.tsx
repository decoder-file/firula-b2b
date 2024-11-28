import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface StepProgressProps {
  steps: string[]
  currentStep: number
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((step, index) => (
        <div key={step} className="flex w-full items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium',
                index < currentStep && 'bg-primary/20',
                index === currentStep && 'bg-black text-white',
                index > currentStep && 'bg-gray-100',
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5 text-primary" />
              ) : (
                <p
                  className={cn(
                    index < currentStep && 'text-black',
                    index === currentStep && 'bg-black text-white',
                    index > currentStep && 'text-black',
                  )}
                >
                  {index + 1}
                </p>
              )}
            </div>
            <span
              className={cn(
                'mt-2 from-neutral-300 text-sm',
                index === currentStep && 'text-white',
                index !== currentStep && 'text-gray-500',
              )}
            >
              {step}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-2 h-[2px] w-full',
                index < currentStep && 'bg-primary',
                index >= currentStep && 'bg-gray-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
