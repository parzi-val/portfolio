"use client"

import { useState } from "react"

/**
 * A tiny bouncing Saturn pinned to the corner. Hover reveals the terminal
 * easter-egg command; clicking copies it. The browser-side breadcrumb to
 * `curl -L krbala.in`.
 */

const CMD = "curl -L krbala.in"

export function SaturnHint() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group fixed bottom-4 right-4 z-40">
      <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md border border-border/60 bg-card/90 px-2.5 py-1 font-mono text-xs text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        {copied ? "copied!" : CMD}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy terminal command: ${CMD}`}
        className="animate-saturn-bob block text-muted-foreground transition-colors hover:text-foreground hover:[animation-play-state:paused]"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="3.2"
            transform="rotate(-18 12 12)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="5.2" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
