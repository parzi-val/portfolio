import { AboutSection } from "@/components/about-section"
import { getPortfolioData } from "@/lib/data"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { ScrollReveal } from "@/components/scroll-reveal"
import Link from "next/link"

export default async function HomePage() {
  const data = await getPortfolioData()

  return (
    <div className="bg-background text-foreground font-sans selection:bg-primary/20">
      <main className="flex flex-col gap-32 pb-32 pt-32">
        <div className="max-w-6xl mx-auto w-full px-6 space-y-32">
          <ScrollReveal animation="fade-in">
            <AboutSection data={data} />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div id="experience" className="scroll-mt-32">
              <h2 className="text-xl font-medium mb-12 tracking-tight">Experience</h2>
              <ExperienceSection experiences={data.experiences} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div id="projects" className="space-y-12">
              <h2 className="text-2xl font-medium tracking-tight">Projects</h2>
              <ProjectsSection projects={data.projects.filter(p => p.featured)} />

              <div className="pt-4">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Archive
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  )
}
