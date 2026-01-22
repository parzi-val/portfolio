"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu } from "lucide-react"

interface NavigationProps {
  currentPath: string
}

export function Navigation({ currentPath }: NavigationProps) {
  const activePath = currentPath
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 500)
  }

  const tabs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    //{ name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ]

  // Get current path display
  const getPathDisplay = () => {
    switch (activePath) {
      case "/": return "~/bala/home"
      case "/projects": return "~/bala/projects"
      case "/contact": return "~/bala/contact"
      default: return "~/bala"
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-2 relative">
      <div
        className="text-xl font-bold text-violet-400 font-jetbrains flex items-center cursor-pointer hover:bg-gray-800/30 px-2 py-1 rounded transition-all duration-200 relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mobile: hamburger + breadcrumb */}
        <div className="sm:hidden flex items-center">
          <Menu className="w-6 h-6 mr-3" />
          <span>{getPathDisplay()}</span>
          <span className="mx-1">{'>'}</span>
          <span
            className="inline-block text-violet-400"
            style={{
              animation: 'blink 1s infinite',
            }}
          >_</span>
        </div>

        {/* Desktop: just breadcrumb */}
        <div className="hidden sm:flex items-center">
          <span>{getPathDisplay()}</span>
          <span className="mx-1">{'>'}</span>
          <span
            className="inline-block text-violet-400"
            style={{
              animation: 'blink 1s infinite',
            }}
          >_</span>
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded shadow-lg py-2 z-50 min-w-[200px]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.path}
                className={`block px-4 py-2 hover:bg-gray-800/50 transition-colors ${activePath === tab.path ? "text-violet-400 bg-gray-800/30" : "text-gray-300"
                  }`}
              >
                <span className="font-jetbrains text-sm">cd {tab.path === "/" ? "~" : `~${tab.path}`}</span>
                <span className="block text-xs text-gray-400 mt-1">{tab.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop nav - hidden on mobile */}
      <nav className="hidden sm:flex space-x-6">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.path}
            className={`relative pb-2 ${activePath === tab.path ? "text-violet-400" : "text-gray-400 hover:text-gray-200"
              }`}
          >
            {tab.name}
            {activePath === tab.path && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-400"></span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}

