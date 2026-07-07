import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarContextProps {
    state: "expanded" | "collapsed"
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.")
    }
    return context
}

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const getSidebarStateFromCookie = () => {
    if (typeof document === "undefined") return undefined
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${SIDEBAR_COOKIE_NAME}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return undefined
}

export const SidebarProvider = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        defaultCollapsed?: boolean
    }
>(({ defaultCollapsed = false, className, children, ...props }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(() => {
        const cookieValue = getSidebarStateFromCookie()
        if (cookieValue) {
            return cookieValue === "false"
        }
        return defaultCollapsed
    })
    const [openMobile, setOpenMobile] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)")
        const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches)
        }
        // Set initial state
        handleResize(mediaQuery)
        mediaQuery.addEventListener("change", handleResize)
        return () => mediaQuery.removeEventListener("change", handleResize)
    }, [])

    const setCollapsedWithCookie = React.useCallback(
        (value: boolean | ((prev: boolean) => boolean)) => {
            setIsCollapsed((prev) => {
                const next = typeof value === "function" ? value(prev) : value
                document.cookie = `${SIDEBAR_COOKIE_NAME}=${!next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
                return next
            })
        },
        []
    )

    const toggleSidebar = React.useCallback(() => {
        setCollapsedWithCookie((prev) => !prev)
    }, [setCollapsedWithCookie])

    // Keyboard shortcut listener (cmd+b on macOS / ctrl+b on Windows/Linux)
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                toggleSidebar()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    return (
        <SidebarContext.Provider
            value={{
                state: isCollapsed ? "collapsed" : "expanded",
                collapsed: isCollapsed,
                setCollapsed: setCollapsedWithCookie,
                openMobile,
                setOpenMobile,
                isMobile,
                toggleSidebar,
            }}
        >
            <div
                ref={ref}
                className={cn(
                    "min-h-screen flex w-full bg-[#fdf9f4] text-[#466272] font-sans",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    )
})
SidebarProvider.displayName = "SidebarProvider"
