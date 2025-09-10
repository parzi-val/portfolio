import Link from "next/link"
import { FileText } from "lucide-react"

export function ResumeSection() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded">
      <h2 className="text-lg font-bold mb-4">Resume</h2>
      
      <Link
        href="https://drive.google.com/file/d/18qMJOBUk1-MJa_vazY32RlDlTl30bm2C/view?usp=sharing"
        className="flex items-center gap-3 hover:bg-[#252525] p-2 -mx-2 rounded transition-colors icon-tilt"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-violet-400 icon">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium">Download Resume</div>
          <div className="text-sm text-gray-400">View PDF</div>
        </div>
      </Link>
    </div>
  )
}