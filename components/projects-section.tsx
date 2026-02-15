import { ArrowUpRight } from "lucide-react"

interface Project {
    title: string;
    description: string;
    tags: string[];
    link: string;
}

export function ProjectsSection({ projects }: { projects: Project[] }) {

    return (
        <div className="space-y-16">
            {projects.map((project, index) => (
                <div key={index} className="group relative">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                        <h3 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                            {project.title}
                        </h3>

                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                        >
                            View Project <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-xs font-mono text-muted-foreground/80 bg-secondary/50 px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {index !== projects.length - 1 && <div className="h-px bg-border/40 w-full" />}
                </div>
            ))}
        </div>
    )
}
