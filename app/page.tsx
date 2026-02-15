import { AboutSection } from "@/components/about-section"
import { getPortfolioData } from "@/lib/data"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { ScrollReveal } from "@/components/scroll-reveal"

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

          <ScrollReveal animation="fade-up">
            <div id="projects-full" className="scroll-mt-32">
              <h2 className="text-xl font-medium mb-12 tracking-tight">Projects</h2>
              <ProjectsSection projects={data.projects} />
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  )
}
