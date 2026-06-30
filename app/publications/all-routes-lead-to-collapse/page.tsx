"use client"

import { ArrowLeft, Copy, Check, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PublicationPage() {
    const [copied, setCopied] = useState(false)
    const citationText =
        "Balasubramanian KR. All Routes Lead to Collapse. arXiv preprint arXiv:2606.22325, 2026."

    const handleCopy = () => {
        navigator.clipboard.writeText(citationText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-background text-foreground font-sans selection:bg-primary/20">
            <div className="max-w-3xl mx-auto px-6 py-32">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="space-y-12">
                    {/* Header */}
                    <div className="border-b border-border/60 pb-8">
                        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-4 leading-tight">
                            All Routes Lead to Collapse
                        </h1>
                        <div className="text-muted-foreground font-mono text-xs">
                            Preprint · arXiv, 2026
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                        {/* Content: Role & Abstract */}
                        <div className="space-y-12">
                            <section>
                                <h2 className="text-sm font-medium mb-4 flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                                    Role & Contribution
                                </h2>
                                <div className="space-y-4">
                                    <p className="font-medium">Sole Author · Independent Research</p>
                                    <ul className="list-disc list-outside ml-4 text-muted-foreground space-y-2 leading-relaxed">
                                        <li>Derived the reframing identity that exposes the flat, norm-blind metric inside softmax routing, with the Boltzmann form obtained from a maximum-entropy principle rather than assumed.</li>
                                        <li>Measured the concentration signature across nine pretrained transformers against matched null baselines, and across four non-attention routers: graph attention, a selective state-space model, a recurrent mixer, and learned residuals over depth.</li>
                                        <li>Established causation with two within-model ablations (a Mamba selectivity freeze and an RWKV carry sweep), and showed that the positional brake each router carries sets the contingent form.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-medium mb-4 flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                                    Abstract
                                </h2>
                                <p className="text-muted-foreground leading-relaxed text-justify">
                                    Attention sinks, representation collapse, and norm stratification are treated as transformer-specific pathologies. We show they are not specific to attention: they are what content-based routing does under a fixed similarity metric. We give a reframing identity: softmax attention is Boltzmann-weighted aggregation over Euclidean distances with constant key norms, so its score omits a −‖k‖² term and is blind to key magnitude. This predicts that any router whose metric is ill-matched to its representations should compensate, by concentrating its routing and collapsing the routed representations. We test it on routers that score and aggregate over different axes: softmax attention over tokens (nine pretrained transformers), graph attention over nodes, a selective state-space model and a recurrent mixer over time, and learned residuals over depth. All develop the same signature, and two within-model ablations show it is caused by the routing mechanism rather than by incidental dynamics. The form is contingent, set by the strength of the positional brake each router carries alongside its content score; we sweep that brake and move the onset across its whole range. The mechanism is not contingent, and it does not require norm stratification: a router with norm-normalized keys concentrates just the same. We do not claim these models implement Riemannian geometry; the geometric view is a diagnostic that names the inadequacy of the flat, norm-blind metric.
                                </p>
                            </section>
                        </div>

                        {/* Links & Citation */}
                        <div className="space-y-8 pt-8 border-t border-border/40">
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Links</h3>
                                <a
                                    href="https://arxiv.org/abs/2606.22325"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline break-all text-sm flex items-start gap-2 transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span>arxiv.org/abs/2606.22325</span>
                                </a>
                                <a
                                    href="https://github.com/parzi-val/all-routes-lead-to-collapse"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline break-all text-sm flex items-start gap-2 transition-colors"
                                >
                                    <Github className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span>github.com/parzi-val/all-routes-lead-to-collapse</span>
                                </a>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Citation</h3>
                                    <button
                                        onClick={handleCopy}
                                        className="text-[10px] flex items-center gap-1 hover:text-foreground text-muted-foreground transition-colors"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                        {copied ? "Copied" : "Copy"}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground font-mono leading-relaxed p-4 bg-secondary/30 rounded border border-border/40">
                                    {citationText}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
