import Link from "next/link"
import { ArrowLeft, Clock, Tag, Terminal } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { getBlogBySlug, getPortfolioData } from "@/lib/data"
import type { Writing } from "@/lib/types"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Mermaid } from "@/components/mermaid"
import { MobileIndex } from "@/components/mobile-index"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const blog = await getBlogBySlug(slug)

    if (!blog) return {}

    return {
        title: `${blog.title} | Balasubramanian KR`,
        description: blog.description,
        openGraph: {
            title: blog.title,
            description: blog.description,
            type: "article",
            publishedTime: blog.date,
            authors: ["Balasubramanian KR"],
            tags: blog.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.description,
        }
    }
}

export async function generateStaticParams() {
    const data = await getPortfolioData();
    return data.writings
        .filter(w => w.isLocal && w.slug)
        .map((blog) => ({
            slug: blog.slug,
        }));
}

export default async function BlogPage({ params }: PageProps) {
    const { slug } = await params
    const blog = await getBlogBySlug(slug)

    if (!blog) {
        notFound()
    }

    // Extract headings for Table of Contents
    const headings = (blog.content || "").split("\n")
        .filter(line => line.startsWith("## "))
        .map(line => {
            const text = line.replace("## ", "").replace(/\*\*/g, "").trim()
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            return { text, id }
        })

    return (
        <div className="bg-background text-foreground selection:bg-primary/20">
            <main className="flex flex-col gap-12 pb-32 pt-24 min-h-screen relative">
                <MobileIndex items={headings} title="Sections" />
                <div className="max-w-6xl mx-auto w-full px-6">
                    <ScrollReveal animation="fade-in">
                        <Link
                            href="/writing"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Writing
                        </Link>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-16">
                        {/* Article Content */}
                        <article className="space-y-12 overflow-hidden">
                            <ScrollReveal animation="fade-up">
                                <header className="space-y-6">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Terminal size={18} />
                                        <span className="font-mono text-xs tracking-widest uppercase">Technical Log / {blog.date}</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
                                        {blog.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-2">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>{Math.ceil((blog.content || "").split(" ").length / 200)} min read</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} />
                                            <div className="flex gap-2">
                                                {blog.tags.map(tag => (
                                                    <span key={tag} className="hover:text-foreground transition-colors cursor-default">
                                                        #{tag.toLowerCase()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </header>
                            </ScrollReveal>

                            <div className="prose prose-neutral dark:prose-invert max-w-none 
                                prose-headings:text-foreground prose-headings:font-medium prose-headings:tracking-tight
                                prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/40 prose-h2:scroll-mt-32
                                prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:scroll-mt-32
                                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
                                prose-hr:border-foreground/20 prose-hr:my-16
                                prose-blockquote:border-l-primary prose-blockquote:bg-secondary/20 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                                prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                                prose-pre:bg-background prose-pre:border prose-pre:border-border/60 prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-sm
                                prose-li:text-muted-foreground prose-li:text-lg prose-ul:list-disc prose-ol:list-decimal
                                prose-img:rounded-xl prose-strong:text-foreground">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        h2({ children }) {
                                            const text = String(children);
                                            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                            return <h2 id={id}>{children}</h2>;
                                        },
                                        h3({ children }) {
                                            const text = String(children);
                                            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                            return <h3 id={id}>{children}</h3>;
                                        },
                                        pre({ children }) {
                                            // Extract the child if it's a code block
                                            const child = children as any;
                                            if (child?.props?.className?.includes("language-mermaid")) {
                                                return <>{children}</>;
                                            }
                                            return <pre>{children}</pre>;
                                        },
                                        code({ node, className, children, ...props }) {
                                            const match = /language-mermaid/.exec(className || "");
                                            if (match) {
                                                return (
                                                    <Mermaid chart={String(children).replace(/\n$/, "")} />
                                                );
                                            }
                                            return (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {blog.content || ""}
                                </ReactMarkdown>
                            </div>
                        </article>

                        {/* Sticky Index & Journal Info */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-32 space-y-12">
                                {/* Table of Contents */}
                                {headings.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">Table of Contents</h4>
                                        <nav className="flex flex-col gap-3">
                                            {headings.map((heading, i) => (
                                                <a
                                                    key={i}
                                                    href={`#${heading.id}`}
                                                    className="text-[13px] text-muted-foreground hover:text-primary transition-colors truncate block border-l border-border/40 pl-4 py-0.5 hover:border-primary active:text-primary active:border-primary"
                                                >
                                                    {heading.text}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">Journal Info</h4>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">Status</div>
                                            <div className="text-[13px] font-mono text-primary flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                PUBLISHED
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">Type</div>
                                            <div className="text-[13px] text-foreground">Technical Blog</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">Focus</div>
                                            <div className="text-[13px] text-foreground leading-relaxed">
                                                {blog.tags.join(", ")}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-border/40">
                                    <p className="text-[11px] text-muted-foreground/40 leading-relaxed font-mono italic">
                                        {"// End of transmission"}
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    )
}
