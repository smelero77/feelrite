import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    style={{
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      backgroundColor: 'var(--card)',
      color: 'var(--card-foreground)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)',
      letterSpacing: 'var(--letter-spacing)'
    }}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    style={{
      gap: 'calc(var(--spacing) * 1.5)',
      padding: 'calc(var(--spacing) * 6)',
      fontFamily: 'var(--font-sans)',
      letterSpacing: 'var(--letter-spacing)'
    }}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    style={{
      fontFamily: 'var(--font-sans)',
      letterSpacing: 'var(--tracking-tight)',
      fontWeight: '600'
    }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    style={{
      fontFamily: 'var(--font-sans)',
      letterSpacing: 'var(--letter-spacing)',
      color: 'var(--muted-foreground)'
    }}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    style={{
      padding: '0 calc(var(--spacing) * 6) calc(var(--spacing) * 6)',
      fontFamily: 'var(--font-sans)',
      letterSpacing: 'var(--letter-spacing)'
    }}
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    style={{
      padding: '0 calc(var(--spacing) * 6) calc(var(--spacing) * 6)',
      fontFamily: 'var(--font-sans)',
      letterSpacing: 'var(--letter-spacing)'
    }}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
