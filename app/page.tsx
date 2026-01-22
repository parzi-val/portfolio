import { ProfileCard } from "@/components/profile-card"
import { ExperienceSection } from "@/components/experience-section"
import { DevNotesSection } from "@/components/blogs-section"
import { SocialSection } from "@/components/social-section"
import { ResumeSection } from "@/components/resume-section"
import { PublicationsCard } from "@/components/publications-card"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-jetbrains">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Navigation currentPath="/" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          {/* Left Column - Profile Card & Social */}
          <div className="md:col-span-3 space-y-6">
            <ProfileCard />
            <SocialSection />
            <ResumeSection />
          </div>

          {/* Middle Column - Experience & Projects */}
          <div className="md:col-span-6 space-y-6">
            <ExperienceSection />
          </div>

          {/* Right Column - Blogs & Repository */}
          <div className="md:col-span-3 space-y-6">
            <PublicationsCard />
            <DevNotesSection />
          </div>
        </div>
      </div>
    </div>
  )
}

