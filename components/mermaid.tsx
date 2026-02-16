"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { useTheme } from "next-themes"

interface MermaidProps {
    chart: string
}

export function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [hasError, setHasError] = useState(false)
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        const isDark = resolvedTheme === "dark"

        mermaid.initialize({
            startOnLoad: true,
            theme: "base",
            securityLevel: "loose",
            fontFamily: "var(--font-space-mono)",
            themeVariables: {
                primaryColor: isDark ? "#ffffff00" : "#00000000",
                primaryTextColor: isDark ? "#f5f5f5" : "#0a0a0a",
                primaryBorderColor: isDark ? "#404040" : "#d1d5db",
                lineColor: isDark ? "#404040" : "#d1d5db",
                secondaryColor: isDark ? "#ffffff00" : "#00000000",
                tertiaryColor: isDark ? "#ffffff00" : "#00000000",
                mainBkg: isDark ? "#ffffff00" : "#00000000",
                nodeBorder: isDark ? "#404040" : "#d1d5db",
                clusterBkg: isDark ? "#ffffff00" : "#00000000",
                titleColor: isDark ? "#f5f5f5" : "#0a0a0a",
                edgeLabelBackground: isDark ? "#121212" : "#ffffff",
            }
        })

        const renderChart = async () => {
            if (ref.current) {
                try {
                    // Force clean re-render
                    ref.current.innerHTML = ""
                    const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart)
                    ref.current.innerHTML = svg
                } catch (error) {
                    console.error("Mermaid rendering failed:", error)
                    setHasError(true)
                }
            }
        }

        renderChart()
    }, [chart, resolvedTheme])

    if (hasError) {
        return (
            <pre className="p-4 bg-secondary/20 rounded border border-border/40 text-xs font-mono overflow-auto">
                {chart}
            </pre>
        )
    }

    return (
        <div className="w-full my-12 overflow-x-auto bg-secondary/5 rounded-2xl p-8 shadow-sm group hover:bg-secondary/10 transition-colors">
            <div ref={ref} className="mermaid-container flex justify-center" />
        </div>
    )
}
