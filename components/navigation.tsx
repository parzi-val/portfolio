"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationProps {
  currentPath?: string
}

export function Navigation({ currentPath }: NavigationProps) {
  const pathname = usePathname()
  const activePath = currentPath || pathname

  const tabs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    //{ name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <div className="flex items-center border-b border-gray-800 pb-2 ">
      <div className="text-xl font-bold mr-6 text-violet-400">B</div>
      <nav className="flex space-x-6">
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

