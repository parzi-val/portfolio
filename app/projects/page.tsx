import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Star } from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    {
      title: "de-mesp",
      description:
        "A decentralized AI marketplace focused on the validation of medical data using AI models and blockchain technology.",
      image: "/demesp.png?height=200&width=400",
      tags: ["Express.js", "FastAPI", "Gemini"],

      url: "https://github.com/coderman400/de-mesp",
      github: "https://github.com/coderman400/de-mesp",
      featured: true,
    },
    {
      title: "FFCS Timetable Generator",
      description: "A website for VIT students to completely automate the semester timetable generation during FFCS.",
      image: "/ffcs.png?height=200&width=400",
      tags: ["FastAPI", "Gemini", "Asyncio"],
      url: "https://ffcs-pearl.vercel.app/",
      github: "https://github.com/parzi-val/ffcs",
      featured: true,
    },
    {
      title: "Malayalam Lexicons",
      description: "Comprehensive collection of Malayalam words, including meanings, synonyms, IPA, POS, and morphemes.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Python", "Streamlit"],
      url: "https://malayalam-lexicons.streamlit.app",
      github: "https://github.com/parzi-val/malayalam-lexicons",
      featured: false,
    },
    {
      title: "Axle (In Progress)",
      description:
        "Axle is a real-time file synchronization system that tracks changes in a directory and efficiently computes differences using an XOR-based mechanism.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Go", "Fsnotify", "Git"],
      url: "https://github.com/parzi-val/axle-file-sync",
      github: "https://github.com/parzi-val/axle-file-sync",
      featured: false,
    },
    {
      title: "Devspeaks",
      description: "Reddit style forum app for developers to share knowledge and discuss trending topics.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Django"],
      url: "https://github.com/parzi-val/devspeaks",
      github: "https://github.com/parzi-val/devspeaks",
      featured: false,
    },
    {
      title: "Fuzzy Querying for Video Databases",
      description: "A fuzzy querying framework concept for video databases with semantic information extraction.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["YOLOv8", "Spacy", "MongoDB"],
      url: "https://github.com/parzi-val/fuzzy-querying",
      github: "https://github.com/parzi-val/fuzzy-querying",
      featured: false,
    },
  ]

  const featuredProjects = projects.filter((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-jetbrains">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Navigation currentPath="/projects" />

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-violet-400 mb-6">Projects</h1>

          {/* Featured Projects */}
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-violet-500 text-black">Featured</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-violet-400">{project.title}</h3>
                    <p className="text-gray-400 mt-2">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag, j) => (
                        <span key={j} className="text-xs bg-[#252525] text-gray-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-4">
                        <Link
                          href={project.github}
                          className="flex items-center gap-1 text-gray-400 hover:text-violet-400 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4" />
                          <span>Repo</span>
                        </Link>
                      </div>
                      <Link
                        href={project.url}
                        className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Projects */}
          <div>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((project, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-violet-400">{project.title}</h3>
                    <p className="text-gray-400 mt-2 text-sm">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags.map((tag, j) => (
                        <span key={j} className="text-xs bg-[#252525] text-gray-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        <Link
                          href={project.github}
                          className="flex items-center gap-1 text-gray-400 hover:text-violet-400 transition-colors text-xs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-3 h-3" />
                          <span>Repo</span>
                        </Link>
                      </div>
                      <Link
                        href={project.url}
                        className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

