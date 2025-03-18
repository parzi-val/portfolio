import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function ExperienceSection() {
  const experiences = [
    {
      title: "Tech Lead at Team Avatar",
      period: "2024 - Present",
      description:
        "Leading the development of a humanoid robot, overseeing system architecture and integration of mechanical, electrical, and AI components",
      skills: ["Python", "ROS"],
      url: "",
    },
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

  return (
    <div className="bg-[#1a1a1a] p-4 rounded">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold text-violet-500">Experience && Projects</h2>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="border-b border-gray-800 pb-3 last:border-0">
            <Link href={exp.url} className="block hover:bg-[#252525] p-1 -mx-1 rounded transition-colors">
              <div className="text-violet-400 mb-1 font-mono">{exp.title}</div>
              <div className="text-sm text-gray-300">{exp.period}</div>
              <div className="text-sm text-gray-400 mt-1">{exp.description}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {exp.skills.map((skill, j) => (
                  <span key={j} className="text-xs bg-[#252525] text-gray-300 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2 flex items-center">
                View details <ExternalLink className="ml-1 w-3 h-3" />
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Link
        href="/projects"
        className="mt-4 text-sm text-gray-400 flex items-center hover:text-violet-400 transition-colors"
      >
        View all projects
        <svg
          className="w-4 h-4 ml-1"
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

