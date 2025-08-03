"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { DesktopConsentsForm } from "./desktop-consents-form"
import { MobileConsentsForm } from "./mobile-consents-form"
import { TabletConsentsForm } from "./tablet-consents-form"

export function ConsentsForm() {
  const screenSize = useScreenSize()

  if (screenSize === 'mobile') {
    return <MobileConsentsForm />
  }

  if (screenSize === 'tablet') {
    return <TabletConsentsForm />
  }

  return <DesktopConsentsForm />
} 