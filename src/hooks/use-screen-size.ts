"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setScreenSize('mobile')
      } else if (width < TABLET_BREAKPOINT) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return screenSize
}

export function useIsMobile() {
  const screenSize = useScreenSize()
  return screenSize === 'mobile'
}

export function useIsTablet() {
  const screenSize = useScreenSize()
  return screenSize === 'tablet'
}

export function useIsDesktop() {
  const screenSize = useScreenSize()
  return screenSize === 'desktop'
} 