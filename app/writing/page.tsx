import { BlogSection } from "@/components/blog-section"
import { getPortfolioData } from "@/lib/data"

export default async function WritingPage() {
    const data = await getPortfolioData()

    return (
        <div className="bg-background text-foreground font-sans selection:bg-primary/20">
            <main className="flex flex-col gap-32 pb-32 pt-32">
                <div className="max-w-3xl mx-auto w-full px-6 space-y-12">

                    <div className="space-y-4">
                        <h1 className="text-4xl font-medium tracking-tight">Writing</h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Thoughts on software, linguistics, and systems.
                        </p>
                    </div>

                    <BlogSection writings={data.writings} />
                </div>
            </main>
        </div>
    )
}
