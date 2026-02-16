import { BlogSection } from "@/components/blog-section"
import { getPortfolioData } from "@/lib/data"
import Link from "next/link"
import { MobileIndex } from "@/components/mobile-index"

export default async function WritingPage() {
    const data = await getPortfolioData()

    const indexItems = data.writings.map(blog => ({
        text: blog.title,
        href: blog.isLocal ? `/writing/${blog.slug}` : (blog.link || "#")
    }))

    return (
        <div className="bg-background text-foreground font-sans selection:bg-primary/20">
            <main className="flex flex-col gap-12 pb-32 pt-32 relative">
                <MobileIndex items={indexItems} />
                <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-16">

                    {/* Main Content: Writing List */}
                    <div className="space-y-16">
                        <header className="space-y-4">
                            <h1 className="text-4xl font-medium tracking-tight">Writing</h1>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                                Thoughts on software, linguistics, and systems.
                            </p>
                        </header>

                        <BlogSection writings={data.writings} />
                    </div>

                    {/* Sidebar: Index (Desktop Only) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">Index</h4>
                                <nav className="flex flex-col gap-3">
                                    {data.writings.map((blog, i) => {
                                        const href = blog.isLocal ? `/writing/${blog.slug}` : (blog.link || "#")
                                        return (
                                            <Link
                                                key={i}
                                                href={href}
                                                className="text-[13px] text-muted-foreground hover:text-primary transition-colors truncate block border-l border-border/40 pl-4 py-0.5 hover:border-primary"
                                            >
                                                {blog.title}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>

                            <div className="pt-8 border-t border-border/40">
                                <p className="text-[11px] text-muted-foreground/40 leading-relaxed font-mono">
                                    {"// Total: "}{data.writings.length} entries log
                                </p>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    )
}
