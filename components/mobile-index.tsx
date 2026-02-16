"use client"

import { useState } from "react"
import { List, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface IndexItem {
    text: string
    id?: string
    href?: string
}

interface MobileIndexProps {
    items: IndexItem[]
    title?: string
}

export function MobileIndex({ items, title = "Index" }: MobileIndexProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (items.length === 0) return null

    return (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform active:scale-95"
            >
                {isOpen ? <X size={24} /> : <List size={24} />}
            </button>

            {/* Overlay Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1]"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-16 right-0 w-64 max-h-[70vh] bg-background border border-border/40 rounded-2xl shadow-xl overflow-y-auto p-6 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-200">
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">{title}</h4>
                            <nav className="flex flex-col gap-4">
                                {items.map((item, i) => {
                                    const href = item.href || `#${item.id}`
                                    return (
                                        <Link
                                            key={i}
                                            href={href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors block border-l border-border/40 pl-4 py-1 hover:border-primary active:text-primary active:border-primary"
                                        >
                                            {item.text}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
