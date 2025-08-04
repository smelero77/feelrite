"use client"

import { Check, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface Step {
  id: number
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  completedSteps?: number[]
  className?: string
}

export function Stepper({ 
  steps, 
  currentStep, 
  completedSteps = [], 
  className 
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id
          const isFuture = step.id > currentStep

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "bg-primary border-primary text-primary-foreground",
                    isFuture && "bg-muted border-muted-foreground text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isCurrent ? "default" : "secondary"}
                    className={cn(
                      "text-xs font-medium",
                      isCompleted && "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    {step.title}
                  </Badge>
                  {isCurrent && (
                    <Badge variant="outline" className="text-xs">
                      Actual
                    </Badge>
                  )}
                </div>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Separator */}
              {index < steps.length - 1 && (
                <div className="flex items-center mx-4">
                  <Separator 
                    orientation="horizontal" 
                    className={cn(
                      "w-16 h-0.5",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 