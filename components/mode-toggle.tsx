"use client"

import * as React from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"

export function ModeToggle() {
    const {setTheme, theme} = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={
                () => {
                    setTheme(theme === "dark" ? "light" : "dark")
                }
            }
        >
            {
                theme === "dark" ? (
                    <Sun/>
                ) : (
                    <Moon/>
                )
            }
        </Button>

    )
}
