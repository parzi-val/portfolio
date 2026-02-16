import { ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import Link from "next/link"
import type { Writing } from "@/lib/types"

export function BlogSection({ writings }: { writings: Writing[] }) {
    return (
        <div className="space-y-8">
            {writings.map((blog, index) => {
                const href = blog.isLocal ? `/writing/${blog.slug}` : (blog.link || "#")
                const blogId = blog.isLocal ? blog.slug : blog.title.toLowerCase().replace(/[^a-z0-0]/g, '-')

                return (
                    <ScrollReveal key={index} animation="fade-up" delay={index * 50}>
                        <Link
                            id={blogId}
                            href={href}
                            target={blog.isLocal ? undefined : "_blank"}
                            rel={blog.isLocal ? undefined : "noopener noreferrer"}
                            className="group block border-b border-border/40 pb-8 last:border-0 last:pb-0 scroll-mt-32"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                                    {blog.title}
                                </h3>
                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                            </div>

                            <p className="text-muted-foreground text-sm leading-relaxed mb-3 max-w-2xl">
                                {blog.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/60">
                                <span>{blog.date}</span>
                                <div className="flex gap-2">
                                    {blog.tags.map((tag: string) => (
                                        <span key={tag} className="bg-secondary/40 px-1.5 py-0.5 rounded">
                                            #{tag.toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>
                )
            })}
        </div>
    )
}
