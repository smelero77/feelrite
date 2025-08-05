"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { DesktopProfileForm } from "./desktop-profile-form"
import { MobileProfileForm } from "./mobile-profile-form"
import { TabletProfileForm } from "./tablet-profile-form"

export function ProfileForm() {
  const screenSize = useScreenSize()

  if (screenSize === 'mobile') {
    return <MobileProfileForm />
  }

  if (screenSize === 'tablet') {
    return <TabletProfileForm />
  }

  return <DesktopProfileForm />
} 