import { getPortfolioData } from "@/lib/data"
import { ExternalLink, Github, Terminal } from "lucide-react"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { MobileIndex } from "@/components/mobile-index"

export default async function ProjectsPage() {
    const data = await getPortfolioData()

    const indexItems = data.projects.map(p => ({
        text: p.title,
        id: p.title.toLowerCase().replace(/[^a-z0-0]/g, '-')
    }))

    return (
        <div className="bg-background text-foreground font-sans selection:bg-primary/20">
            <main className="flex flex-col gap-12 pb-32 pt-32 relative">
                <MobileIndex items={indexItems} />
                <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-16">

                    {/* Main Content: Project List */}
                    <div className="space-y-16">
                        <header className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Terminal size={20} />
                                <span className="font-mono text-sm tracking-widest uppercase">Developer Log</span>
                            </div>
                            <h1 className="text-4xl font-medium tracking-tight">Project Archive</h1>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                                A high-density chronological log of systems infrastructure, experiments, and developer tools.
                            </p>
                        </header>

                        <div className="space-y-12">
                            {data.projects.map((project, i) => {
                                // Create a slug-like ID for the index to anchor to
                                const projectId = project.title.toLowerCase().replace(/[^a-z0-0]/g, '-')
                                return (
                                    <ScrollReveal key={i} animation="fade-up" delay={i * 50}>
                                        <div id={projectId} className="group relative grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-4 md:gap-12 pb-12 border-b border-border/40 last:border-0 scroll-mt-32">
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                                                    {project.title}
                                                </h3>
                                                <div className="flex gap-4">
                                                    {project.github && (
                                                        <Link href={project.github} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                                                            <Github size={18} />
                                                        </Link>
                                                    )}
                                                    <Link href={project.link} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                                                        <ExternalLink size={18} />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-mono text-muted-foreground/60">
                                                    {project.tags.map((tag, j) => (
                                                        <span key={j} className="before:content-['#'] before:mr-0.5">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                )
                            })}
                        </div>
                    </div>

                    {/* Sidebar: Subtle Index (Desktop Only) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">Index</h4>
                                <nav className="flex flex-col gap-3">
                                    {data.projects.map((project, i) => {
                                        const projectId = project.title.toLowerCase().replace(/[^a-z0-0]/g, '-')
                                        return (
                                            <Link
                                                key={i}
                                                href={`#${projectId}`}
                                                className="text-[13px] text-muted-foreground hover:text-primary transition-colors truncate block border-l border-border/40 pl-4 py-0.5 hover:border-primary"
                                            >
                                                {project.title}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>

                            <div className="pt-8 border-t border-border/40">
                                <p className="text-[11px] text-muted-foreground/40 leading-relaxed font-mono">
                                    {"// Total: "}{data.projects.length} nodes registered
                                </p>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    )
}
