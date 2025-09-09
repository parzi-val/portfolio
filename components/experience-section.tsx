import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function ExperienceSection() {
  const experiences = [
    {
      title: "AI Agentic R&D Intern - NTT GDC",
      period: "May 2025 - July 2025",
      description:
        "Built 'Judge', a real-time LLM guardrail engine reducing evaluation latency by 83%. Researched Model Context Protocol (MCP) and prototyped multi-agent architectures for enterprise AI systems.",
      skills: ["LLM", "MCP", "Google ADK", "Crew AI", "Semantic Kernel"],
      url: "",
    },
    {
      title: "Tech Lead at Team Avatar",
      period: "2024 - Present",
      description:
        "Leading the development of a humanoid robot, overseeing system architecture and integration of mechanical, electrical, and AI components",
      skills: ["Python", "ROS"],
      url: "",
    },
  ]

  const projects = [
    {
      title: "Backend Developer - FFCS",
      period: "2024",
      description:
        "Developed the backend architecture on FastAPI framework for an automated semester timetable generation system, enhancing scheduling efficiency for VIT students.",
      skills: ["FastAPI", "Gemini", "Asyncio"],
      url: "https://ffcs-pearl.vercel.app/",
    },
    {
      title: "System Design & SDE - Axle",
      period: "2025 - Present",
      description:
        "Developing a real-time file synchronization system that tracks changes in a directory and efficiently computes differences using a hybrid Git - XOR mechanism.",
      skills: ["Go", "Fsnotify", "Git", "Networks"],
      url: "https://github.com/parzi-val/axle-file-sync",
    },
    {
      title: "Backend Developer - Altrobot",
      period: "2025",
      description:
        "Developed the backend architecture for an automation tool that compresses images and generates alt text for blogs, significantly increasing efficiency.",
      skills: ["FastAPI", "Gemini", "Asyncio"],
      url: "https://altrobot.vercel.app",
    },
  ]

  const renderItem = (item: any, index: number, isLast: boolean) => (
    <div key={index} className={`border-b border-gray-800 pb-3 ${isLast ? 'border-0' : ''}`}>
      {item.url ? (
        <Link href={item.url} className="block hover:bg-[#252525] p-1 -mx-1 rounded transition-colors">
          <div className="text-violet-400 mb-1 font-jetbrains">{item.title}</div>
          <div className="text-sm text-gray-300">{item.period}</div>
          <div className="text-sm text-gray-400 mt-1">{item.description}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {item.skills.map((skill: string, j: number) => (
              <span 
                key={j} 
                className="text-xs bg-[#252525] text-gray-300 px-2 py-1 rounded cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex justify-end mt-3">
            <div className="text-xs text-gray-500 flex items-center group">
              View details <ExternalLink className="ml-1 w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ) : (
        <div className="p-1">
          <div className="text-violet-400 mb-1 font-jetbrains">{item.title}</div>
          <div className="text-sm text-gray-300">{item.period}</div>
          <div className="text-sm text-gray-400 mt-1">{item.description}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {item.skills.map((skill: string, j: number) => (
              <span 
                key={j} 
                className="text-xs bg-[#252525] text-gray-300 px-2 py-1 rounded cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-[#1a1a1a] p-4 rounded">
      {/* Experience Section */}
      <div className="mb-6">
        <fieldset className="border border-gray-700 rounded p-4">
          <legend className="text-lg font-bold text-violet-500 px-2 bg-[#1a1a1a]">Experience</legend>
          <div className="space-y-4 mt-2">
            {experiences.map((exp, i) => renderItem(exp, i, i === experiences.length - 1))}
          </div>
        </fieldset>
      </div>

      {/* Projects Section */}
      <div className="mb-4">
        <fieldset className="border border-gray-700 rounded p-4">
          <legend className="text-lg font-bold text-violet-500 px-2 bg-[#1a1a1a]">Projects</legend>
          <div className="space-y-4 mt-2">
            {projects.map((project, i) => renderItem(project, i, i === projects.length - 1))}
          </div>
        </fieldset>
      </div>

      <Link
        href="/projects"
        className="mt-4 text-sm text-gray-400 flex items-center hover:text-violet-400 transition-all duration-300 group"
      >
        View all projects
        <svg
          className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  )
}

