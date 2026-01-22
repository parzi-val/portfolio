import Link from "next/link"
import { BookOpen, ArrowUpRight } from "lucide-react"

export function PublicationsCard() {
    return (
        <div className="bg-[#1a1a1a] p-4 rounded">
            <fieldset className="border border-gray-700 rounded p-4">
                <legend className="text-lg font-bold text-violet-500 px-2 bg-[#1a1a1a] flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Publications
                </legend>

                <div className="mt-2">
                    <Link href="/publications/decentralized-identity" className="group block">
                        <h3 className="text-gray-200 group-hover:text-violet-400 transition-colors leading-tight">
                            Decentralized Digital Identity: A Blockchain and Neural Network Approach
                        </h3>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                            <span>Premier Journal of Science, 2025</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
                        </div>
                    </Link>
                </div>
            </fieldset>
        </div>
    )
}
