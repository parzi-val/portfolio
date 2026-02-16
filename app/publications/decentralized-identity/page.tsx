"use client"

import { ArrowLeft, Copy, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PublicationPage() {
    const [copied, setCopied] = useState(false)
    const citationText = "Babu A, Balasubramanian KR, Singh A, Meenakshi RS and Natarajan Y. Decentralized Digital Identity: A Blockchain and Neural Network Approach. Premier Journal of Science 2025;15:100142"

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
                            Decentralized Digital Identity: A Blockchain and Neural Network Approach
                        </h1>
                        <div className="text-muted-foreground font-mono text-xs">
                            Premier Journal of Science, 2025
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
                                    <p className="font-medium">Co-Author · Lead Architect for N-SAM Biometric System</p>
                                    <ul className="list-disc list-outside ml-4 text-muted-foreground space-y-2 leading-relaxed">
                                        <li>Architected the N-SAM biometric pipeline for decentralized identity, integrating deep-learning facial embeddings with encrypted off-chain IPFS storage.</li>
                                        <li>Implemented and benchmarked FaceNet, FaceNet512, and ArcFace across LFW/BUPT datasets, achieving up to 97.65% accuracy and AUC ≈ 0.996.</li>
                                        <li>Designed the system’s feature extraction, preprocessing, and thresholding workflow, including ROC and cross-validation analysis.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-medium mb-4 flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                                    Abstract
                                </h2>
                                <p className="text-muted-foreground leading-relaxed text-justify">
                                    Current digital identity systems face significant challenges in privacy, security, user control, and performance. This research proposes a novel blockchain-powered approach that integrates neural network technologies to address fundamental limitations of centralized identity management. By leveraging decentralized architecture and biometric authentication, we present a transformative solution to digital identity verification that enhances user privacy, security, and autonomy while mitigating systemic risks in both centralized and decentralized frameworks. Empirical evaluation demonstrates authentication accuracy of up to 97.20% and average login latency of 1.069 seconds, validating the system’s effectiveness and responsiveness on standard consumer hardware.
                                </p>
                            </section>
                        </div>

                        {/* DOI & Citation */}
                        <div className="space-y-8 pt-8 border-t border-border/40">
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">DOI</h3>
                                <a
                                    href="https://doi.org/10.70389/PJS.100142"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline break-all text-sm flex items-start gap-2 transition-colors"
                                >
                                    <span>https://doi.org/10.70389/PJS.100142</span>
                                    <ExternalLink className="w-3 h-3 shrink-0 mt-0.5" />
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
