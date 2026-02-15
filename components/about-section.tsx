import Image from "next/image"
import { ExperienceSection } from "./experience-section"
import { ProjectsSection } from "./projects-section"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import Link from "next/link"
import { PortfolioData } from "@/lib/data"

const iconMap: Record<string, React.ReactNode> = {
    GitHub: <Github className="w-5 h-5" />,
    LinkedIn: <Linkedin className="w-5 h-5" />,
    Twitter: <Twitter className="w-5 h-5" />,
    Email: <Mail className="w-5 h-5" />,
}

export function AboutSection({ data }: { data: PortfolioData }) {
    return (
        <div className="space-y-24">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8 order-2 md:order-1">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-medium tracking-tight">{data.bio.greeting}</h1>
                        <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                            {data.bio.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        {data.socials.map((social, i) => (
                            <Link
                                key={i}
                                href={social.href}
                                target="_blank"
                                className="p-2 rounded-full border border-border/60 hover:bg-secondary/50 hover:border-primary/20 transition-all text-muted-foreground hover:text-foreground"
                            >
                                {iconMap[social.platform]}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="relative aspect-square w-full max-w-sm mx-auto md:ml-auto md:mr-0 overflow-hidden rounded-2xl bg-secondary/20 order-1 md:order-2">
                    <Image
                        src={data.bio.avatar}
                        alt="Profile picture"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}
