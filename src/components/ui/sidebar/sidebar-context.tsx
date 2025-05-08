
import * as React from "react"
import { SidebarContext, SidebarState } from "./types"

export const SIDEBAR_COOKIE_NAME = "sidebar:state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContextInstance = React.createContext<SidebarContext | null>(null)

export const useSidebar = () => {
  const context = React.useContext(SidebarContextInstance)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

export { SidebarContextInstance }
