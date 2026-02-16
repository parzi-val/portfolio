"use client"

import { useEffect, useRef, useState, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
    children: ReactNode
    className?: string
    animation?: "fade-up" | "fade-in" | "slide-in-right" | "slide-in-left"
    delay?: number
}

export function ScrollReveal({
    children,
    className,
    animation = "fade-up",
    delay = 0
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const currentRef = ref.current
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0,
                rootMargin: "0px 0px -50px 0px"
            }
        )

        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [])

    const animations = {
        "fade-up": "opacity-0 translate-y-8 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0",
        "fade-in": "opacity-0 data-[visible=true]:opacity-100",
        "slide-in-right": "opacity-0 translate-x-8 data-[visible=true]:opacity-100 data-[visible=true]:translate-x-0",
        "slide-in-left": "opacity-0 -translate-x-8 data-[visible=true]:opacity-100 data-[visible=true]:translate-x-0"
    }

    return (
        <div
            ref={ref}
            data-visible={isVisible}
            className={cn(
                "transition-all duration-700 ease-out",
                animations[animation],
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}
