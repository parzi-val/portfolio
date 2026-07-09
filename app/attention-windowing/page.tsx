import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ExternalLink, FileText, Github } from "lucide-react"
import { CompressibilityField } from "@/components/compressibility-field"
import { FreeVsScaleChart } from "@/components/free-vs-scale-chart"
import { ScrollReveal } from "@/components/scroll-reveal"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Attention Windowing",
  description:
    "A research program on measuring exactly how much of attention is slack, per head and causally, then deploying the measurement as compression.",
}

type Status = "published" | "shelved" | "active" | "framework" | "blueprint" | "horizon"

const STATUS: Record<Status, { label: string; filled: boolean; muted: boolean }> = {
  published: { label: "published", filled: true, muted: false },
  shelved: { label: "shelved", filled: false, muted: true },
  active: { label: "active", filled: true, muted: false },
  framework: { label: "framework", filled: false, muted: true },
  blueprint: { label: "blueprint", filled: false, muted: true },
  horizon: { label: "horizon", filled: false, muted: true },
}

type LinkRef = { label: string; href: string; icon: "arxiv" | "code" | "page"; internal?: boolean }

type Thread = {
  status: Status
  title: string
  blurb: string
  links?: LinkRef[]
}

const THREADS: Thread[] = [
  {
    status: "framework",
    title: "The compressibility map",
    blurb:
      "The instrument the program is built on. Replace one attention head with a fixed sink-plus-local window, renormalize, and read off the perplexity it costs: a causal, per-head map of how much of each head is load-bearing. Across GPT-2, Pythia, and Qwen from 124M to 7.6B parameters, 81 to 99.9% of heads come back near-free to window, and the fraction climbs with scale. What's windowable is predicted by locality, not by how peaky a head looks, and grouped-query attention, the dominant KV-cache trick, doesn't consume the headroom (a pre-registered prediction, falsified by a permutation test).",
  },
  {
    status: "active",
    title: "The realization: a three-axis Pareto",
    blurb:
      "Cashing the map out end-to-end on Qwen2.5-7B, with the honest correction that makes it deployable: per-head-free is not jointly-free, and a map measured at short context over-promises at long context. Measure at the context you actually run at, window whole KV groups, and it becomes a Pareto improvement: 25% of groups lossless, 50% for about 2× faster attention (an exact FlexAttention kernel) and 2× less KV cache at matched quality, no fine-tuning. A healing-gated frontier runs past that.",
  },
  {
    status: "active",
    title: "Does it survive retrieval?",
    blurb:
      "The open question, and an honest one. Perplexity is blind to long-range retrieval: a windowed model can read as lossless and still have forgotten how to find a needle in a haystack. A passkey suite with six arms tests whether the perplexity-expensive heads the map keeps dense are the same heads retrieval needs. If they are, this is a long-context compression result that beats the KV-cache baselines; if they aren't, it's a clean edge-AI story instead. I'm waiting on GPU credits to run it.",
  },
  {
    status: "blueprint",
    title: "The edge stack",
    blurb:
      "Where the compression compounds: windowing is orthogonal to weight quantization and stacks with it. On 4-bit weights it adds about 0.2 perplexity, and the KV-cache saving is structural, roughly the windowed fraction regardless of context. A small QLoRA heal recovers the frontier. Four-bit weights, half the groups windowed, an optional adapter: a 7-to-8B model at long context on commodity hardware.",
  },
]

const LOG: { date: string; entry: string }[] = [
  { date: "2026-07-09", entry: "Cross-validated across Qwen + Llama and WikiText + PG19; retrieval validation is the open gate." },
  { date: "2026-07-06", entry: "Realized end-to-end on Qwen2.5-7B: the three-axis Pareto over quality, latency, and KV cache." },
  { date: "2026-07-03", entry: "Opened the program: a causal per-head compressibility map, the exploit corollary of collapse." },
]

const PARETO_ROWS: { windowed: string; quality: string; latency: string; kv: string; ft: string }[] = [
  { windowed: "25% of groups", quality: "lossless, both archs", latency: "~1.5×*", kv: "1.33×", ft: "none" },
  { windowed: "50% of groups", quality: "lossless Qwen · +0.22 Llama", latency: "~1.9–2.2×", kv: "1.99×", ft: "none" },
  { windowed: "75% of groups", quality: "+0.5 … +0.96", latency: "~3.8×", kv: "3.97×", ft: "healing-gated" },
]

const CROSSVAL_ROWS: { model: string; p25: string; p50: string; p75: string; random: string }[] = [
  { model: "Qwen2.5-7B (7:1) · WikiText @8k", p25: "−0.33", p50: "−0.08", p75: "+0.49", random: "+1.75" },
  { model: "Qwen2.5-7B · PG19 @8k (transfer)", p25: "−0.33", p50: "−0.12", p75: "+0.54", random: "+1.34" },
  { model: "Llama-3.1-8B (4:1) · WikiText @8k", p25: "+0.04", p50: "+0.21", p75: "+0.94", random: "+4.39" },
  { model: "Llama-3.1-8B · PG19 @8k (transfer)", p25: "+0.05", p50: "+0.24", p75: "+0.96", random: "+0.84" },
]

const cardClass =
  "rounded-lg border border-border/50 bg-card/55 backdrop-blur-[2px] p-6 transition-colors"

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS[status]
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          s.filled ? "bg-foreground" : "border border-muted-foreground/60"
        )}
      />
      <span className={s.muted ? "text-muted-foreground/70" : "text-foreground"}>{s.label}</span>
    </span>
  )
}

export default function AttentionWindowingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* the living compressibility map — fixed behind everything on this page */}
      <CompressibilityField />

      <div className="relative z-10">
        <div className="px-6 pt-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        {/* Hero — field fully visible behind the title */}
        <section className="flex min-h-[78vh] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">Attention Windowing</h1>
          <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
            Most of attention is slack. Measure exactly how much, per head and causally, then
            deploy the measurement.
          </p>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            The slack is real, but only where you measure it.
          </p>
        </section>

        <main className="max-w-3xl mx-auto w-full px-6 pb-32 space-y-20">
          {/* What this is */}
          <ScrollReveal animation="fade-up">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Attention Windowing is the exploit corollary of Semantic Gravity. If content routing
              collapses toward a few local, anchor-heavy targets, then dense O(n²) attention is a
              bill most heads never run up. This program measures that overpayment directly: per
              head, causally, on pretrained models from 124M to 7.6B parameters. The measurement
              becomes a deployable compression: window the heads that are already local, keep the
              few that route globally, and cut latency and KV cache at matched quality. The
              discipline that makes it real is measuring where you deploy, not where it&apos;s
              convenient. What&apos;s left open is whether it survives a retrieval test, and that
              answer decides whether this ends up a long-context compression paper or an edge-AI
              one.
            </p>
          </ScrollReveal>

          {/* Threads */}
          <ScrollReveal animation="fade-up">
            <section className="space-y-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Threads
              </h2>
              <div className="space-y-4">
                {THREADS.map((t) => (
                  <article key={t.title} className={cn(cardClass, "hover:border-border")}>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-lg font-medium tracking-tight">{t.title}</h3>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                  </article>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Results */}
          <ScrollReveal animation="fade-up">
            <section className="space-y-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Results
              </h2>

              <figure className="space-y-3">
                <div className={cn(cardClass, "p-4")}>
                  <FreeVsScaleChart />
                </div>
                <figcaption className="text-xs text-muted-foreground/70 leading-relaxed">
                  Most heads are windowable, and more so with scale: 81% to 99.9% across three
                  attention families.
                </figcaption>
              </figure>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">The Pareto</h3>
                <div className={cn(cardClass, "overflow-x-auto p-0")}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="text-left font-medium px-4 py-3">Windowed</th>
                        <th className="text-left font-medium px-4 py-3">Quality (Δppl @8k)</th>
                        <th className="text-left font-medium px-4 py-3">Latency vs SDPA @32k</th>
                        <th className="text-left font-medium px-4 py-3">KV-cache @128k</th>
                        <th className="text-left font-medium px-4 py-3">Fine-tuning</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                      {PARETO_ROWS.map((row) => (
                        <tr key={row.windowed} className="border-b border-border/30 last:border-0">
                          <td className="px-4 py-3 whitespace-nowrap">{row.windowed}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.quality}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.latency}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.kv}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.ft}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground/70">
                  *25% latency is interpolated; the bench measured 50% and 75% directly.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Cross-validation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  One calibration map, calibrated once on WikiText @4096, deployed unchanged across
                  architecture and domain.
                </p>
                <div className={cn(cardClass, "overflow-x-auto p-0")}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="text-left font-medium px-4 py-3">Model</th>
                        <th className="text-left font-medium px-4 py-3">25%</th>
                        <th className="text-left font-medium px-4 py-3">50%</th>
                        <th className="text-left font-medium px-4 py-3">75%</th>
                        <th className="text-left font-medium px-4 py-3">Random-50%</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                      {CROSSVAL_ROWS.map((row) => (
                        <tr key={row.model} className="border-b border-border/30 last:border-0">
                          <td className="px-4 py-3 whitespace-nowrap font-sans">{row.model}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.p25}</td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">{row.p50}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.p75}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.random}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  25% lossless everywhere; 50% lossless on Qwen, +0.22 on Llama; beats a random pick
                  by 5 to 20 times over.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Artifacts */}
          <ScrollReveal animation="fade-up">
            <section className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Artifacts
              </h2>
              <div className={cn(cardClass, "flex flex-col gap-3")}>
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 shrink-0" />
                  &quot;Measure Where You Deploy: Attention Windowing as a Pareto Improvement&quot;
                  (in preparation)
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Github className="w-4 h-4 shrink-0" />
                  Code on request
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  The whole study reproduces on public checkpoints for ~$20 of single-GPU time
                </span>
              </div>
            </section>
          </ScrollReveal>

          {/* Log */}
          <ScrollReveal animation="fade-up">
            <section className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Log
              </h2>
              <div className={cn(cardClass, "space-y-3")}>
                {LOG.map((l) => (
                  <div key={l.date + l.entry} className="flex gap-4 text-sm">
                    <span className="font-mono text-xs text-muted-foreground/70 shrink-0 w-24 pt-0.5">
                      {l.date}
                    </span>
                    <span className="text-muted-foreground">{l.entry}</span>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        </main>
      </div>
    </div>
  )
}
