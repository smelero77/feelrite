import * as React from "react"
import { cn } from "@/lib/utils"

interface NavigationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
          "outline-none focus-visible:ring-[3px]",
          "size-9 h-6 w-6",
          "hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50",
          className
        )}
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          boxShadow: 'var(--shadow-xs)',
          fontFamily: 'var(--font-sans)',
          borderRadius: 'var(--radius)',
          letterSpacing: 'var(--letter-spacing)',
          transition: 'all 0.2s ease'
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)

NavigationButton.displayName = "NavigationButton" 