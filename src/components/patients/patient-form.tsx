"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { DesktopPatientForm } from "./desktop-patient-form"
import { MobilePatientForm } from "./mobile-patient-form"
import { TabletPatientForm } from "./tablet-patient-form"

export function PatientForm() {
  const screenSize = useScreenSize()

  if (screenSize === 'mobile') {
    return <MobilePatientForm />
  }

  if (screenSize === 'tablet') {
    return <TabletPatientForm />
  }

  return <DesktopPatientForm />
} 