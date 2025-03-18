import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function ProfileCard() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-violet-500 mb-4">
          <Image
            src="/me.jpg?height=128&width=128"
            alt="Profile picture"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-violet-400">Bala</h1>
        <p className="text-gray-400 mt-1 text-center">Backend Developer & AI Enthusiast</p>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <Badge className="bg-violet-500/20 text-violet-400 hover:bg-violet-500/30">Express.js</Badge>
          <Badge className="bg-violet-500/20 text-violet-400 hover:bg-violet-500/30">Node.js</Badge>
          <Badge className="bg-violet-500/20 text-violet-400 hover:bg-violet-500/30">Python</Badge>
          <Badge className="bg-violet-500/20 text-violet-400 hover:bg-violet-500/30">Go</Badge>
          <Badge className="bg-violet-500/20 text-violet-400 hover:bg-violet-500/30">Agentic AI</Badge>
        </div>


      </div>
    </div>
  )
}

