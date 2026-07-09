"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, LucideIcon, FileText, PenTool, User, Briefcase, Folder, Orbit, Sun, Moon, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { RESEARCH_PROGRAMS } from "@/lib/research-programs"

interface NavLink {
    name: string
    href: string
    icon: LucideIcon
    children?: { name: string; href: string }[]
}

const enabledPrograms = RESEARCH_PROGRAMS.filter((p) => p.enabled)

const links: NavLink[] = [
    { name: "About", href: "/", icon: User },
    { name: "Experience", href: "/#experience", icon: Briefcase },
    { name: "Projects", href: "/projects", icon: Folder },
    {
        name: "Research", href: enabledPrograms[0]?.href ?? "/", icon: Orbit,
        children: enabledPrograms.map((p) => ({ name: p.name, href: p.href })),
    },
    { name: "Writing", href: "/writing", icon: PenTool },
]

export function Sidebar() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [researchOpen, setResearchOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    // Sync sidebar width with CSS variable for global layout adjustment
    useEffect(() => {
        const width = isCollapsed ? "80px" : "264px"
        document.documentElement.style.setProperty("--sidebar-width", width)
    }, [isCollapsed])

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-background border border-border/40 md:hidden shadow-md"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/40 backdrop-blur-[2px] z-[50] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full bg-background border-r border-border/40 transition-all duration-300 ease-in-out z-[55] flex flex-col",
                    isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
                    isCollapsed ? "md:w-20" : "md:w-[264px]"
                )}
            >
                {/* Header / Toggle */}
                <div className={cn(
                    "h-16 flex items-center border-b border-border/40 shrink-0 transition-all duration-300",
                    isCollapsed ? "justify-center px-4" : "px-6"
                )}>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground transition-all md:flex hidden",
                            !isCollapsed && "ml-auto"
                        )}
                    >
                        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className={cn(
                    "flex-1 py-8 space-y-2 overflow-y-auto transition-all duration-300",
                    isCollapsed ? "px-2" : "px-4"
                )}>

                    {links.map((link) => {
                        const hasChildren = !!link.children && link.children.length > 0
                        const isActive = link.children
                            ? link.children.some((c) => pathname === c.href)
                            : pathname === link.href
                        const expanded = hasChildren && researchOpen && !isCollapsed
                        return (
                            <div key={link.name}>
                                <Link
                                    href={link.href}
                                    onClick={(e) => {
                                        if (hasChildren && !isCollapsed) {
                                            e.preventDefault()
                                            setResearchOpen((v) => !v)
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center rounded-lg transition-all group",
                                        isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5",
                                        isActive
                                            ? "bg-secondary text-foreground font-medium"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                    title={isCollapsed ? link.name : ""}
                                >
                                    <link.icon className={cn(
                                        "w-5 h-5 shrink-0 transition-colors",
                                        isActive ? "text-primary" : "group-hover:text-foreground"
                                    )} />
                                    <span className={cn(
                                        "text-sm transition-all duration-300",
                                        isCollapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "md:opacity-100"
                                    )}>
                                        {link.name}
                                    </span>
                                    {hasChildren && !isCollapsed && (
                                        <ChevronDown
                                            className={cn(
                                                "w-4 h-4 shrink-0 ml-auto transition-transform duration-200",
                                                expanded && "rotate-180"
                                            )}
                                        />
                                    )}
                                </Link>

                                {hasChildren && expanded && (
                                    <div className="ml-[26px] mt-1 space-y-1">
                                        {link.children!.map((child, i) => {
                                            const childActive = pathname === child.href
                                            const isLast = i === link.children!.length - 1
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={cn(
                                                        "relative flex items-center pl-4 pr-3 py-2 rounded-lg text-sm transition-all",
                                                        "before:absolute before:left-0 before:top-0 before:w-[1.5px] before:bg-border",
                                                        isLast ? "before:h-1/2" : "before:bottom-0",
                                                        "after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-[1.5px] after:w-3 after:bg-border",
                                                        childActive
                                                            ? "bg-secondary text-foreground font-medium"
                                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                                    )}
                                                >
                                                    {child.name}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>

                {/* Footer / Resume & Theme */}
                <div className={cn(
                    "p-4 border-t border-border/40 space-y-4 transition-all duration-300",
                    isCollapsed && "px-2"
                )}>
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className={cn(
                                "flex items-center rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all group",
                                isCollapsed ? "justify-center p-2 w-10 mx-auto" : "gap-3 px-3 py-2.5 w-full"
                            )}
                            title={isCollapsed ? "Toggle Theme" : ""}
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5 shrink-0 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 shrink-0 text-blue-500" />
                            )}
                            {!isCollapsed && <span className="text-sm">Theme</span>}
                        </button>
                    )}

                    <a
                        href="https://drive.google.com/file/d/1IonheWXeP6qduIyeO9GQjwvc1XvxbtZ2/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all",
                            isCollapsed ? "p-2 w-10 mx-auto" : "gap-2 w-full py-2.5"
                        )}
                        title={isCollapsed ? "Resume" : ""}
                    >
                        <FileText className="w-5 h-5" />
                        <span className={cn(
                            "transition-all duration-300",
                            isCollapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "md:opacity-100"
                        )}>
                            Resume
                        </span>
                    </a>
                </div>
            </aside>
        </>
    )
}
