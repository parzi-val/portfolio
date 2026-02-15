import { ExternalLink } from "lucide-react"

interface Experience {
  title: string;
  period: string;
  description: string;
  skills: string[];
  url: string;
}

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {

  return (
    <div className="space-y-16">
      {experiences.map((exp, index) => (
        <div key={index} className="group relative grid md:grid-cols-4 gap-4 transition-all pb-12 border-b border-border/40 last:border-0 last:pb-0">
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-medium text-foreground text-lg leading-none group-hover:text-primary transition-colors flex items-center gap-2">
              {exp.title}
              {exp.url && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </h3>

            <p className="text-muted-foreground leading-relaxed text-sm">
              {exp.description}
            </p>

            {exp.skills && (
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <span key={skill} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-1 md:text-right">
            <span className="text-sm font-mono text-muted-foreground tabular-nums tracking-wide">{exp.period}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
