"use client"

import { Navigation } from "@/components/navigation"
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
        <div className="min-h-screen bg-[#121212] text-gray-200 font-jetbrains">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Navigation currentPath="/publications/decentralized-identity" />

                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-violet-400 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl border border-gray-800">
                        {/* Header */}
                        <div className="mb-8 border-b border-gray-800 pb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4 leading-tight">
                                Decentralized Digital Identity: A Blockchain and Neural Network Approach
                            </h1>
                            <div className="text-sm text-gray-400">
                                <span className="font-medium text-gray-300">Premier Journal of Science, 2025</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Role & Abstract */}
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-lg font-bold text-gray-200 mb-3 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-violet-500 rounded-full inline-block"></span>
                                        Role & Contribution
                                    </h2>
                                    <div className="bg-[#252525] p-4 rounded border border-gray-700/50">
                                        <p className="text-violet-300 font-medium mb-2">Co-Author · Lead Architect for N-SAM Biometric System</p>
                                        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm leading-relaxed">
                                            <li>Architected the N-SAM biometric pipeline for decentralized identity, integrating deep-learning facial embeddings with encrypted off-chain IPFS storage.</li>
                                            <li>Implemented and benchmarked FaceNet, FaceNet512, and ArcFace across LFW/BUPT datasets, achieving up to 97.65% accuracy and AUC ≈ 0.996.</li>
                                            <li>Designed the system’s feature extraction, preprocessing, and thresholding workflow, including ROC and cross-validation analysis.</li>
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-lg font-bold text-gray-200 mb-3 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-violet-500 rounded-full inline-block"></span>
                                        Abstract
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed text-justify">
                                        Current digital identity systems face significant challenges in privacy, security, user control, and performance. This research proposes a novel blockchain-powered approach that integrates neural network technologies to address fundamental limitations of centralized identity management. By leveraging decentralized architecture and biometric authentication, we present a transformative solution to digital identity verification that enhances user privacy, security, and autonomy while mitigating systemic risks in both centralized and decentralized frameworks. Empirical evaluation demonstrates authentication accuracy of up to 97.20% and average login latency of 1.069 seconds, validating the system’s effectiveness and responsiveness on standard consumer hardware.
                                    </p>
                                </section>
                            </div>

                            {/* Right Column: DOI & Citation */}
                            <div className="space-y-6">
                                <div className="bg-[#252525] p-5 rounded border border-gray-700/50">
                                    <h3 className="text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">DOI</h3>
                                    <a
                                        href="https://doi.org/10.70389/PJS.100142"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-violet-400 hover:text-violet-300 break-all text-sm flex items-start gap-2 transition-colors"
                                    >
                                        <span>https://doi.org/10.70389/PJS.100142</span>
                                        <ExternalLink className="w-3 h-3 shrink-0 mt-1" />
                                    </a>
                                </div>

                                <div className="bg-[#252525] p-5 rounded border border-gray-700/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Citation</h3>
                                        <button
                                            onClick={handleCopy}
                                            className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300 transition-colors"
                                        >
                                            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono leading-relaxed p-3 bg-black/30 rounded border border-gray-800">
                                        {citationText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
