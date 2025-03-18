import Link from "next/link"

export function DevNotesSection() {
  const devNotes = [
    "Tried Warp AI Terminal – pretty smooth UX.",
    "Started learning Go for Axle, liking goroutines so far.",
    "Exploring DiceDB – testing how it plays with Git-based diff.",
    "Tested langflow – not bad, but ain't as refined as one would expect.",
    "This was made entirely by v0 - genuinely impressed."
  ]

  return (
    <div className="bg-[#1a1a1a] p-4 rounded">
      <h2 className="text-lg font-bold mb-4">Dev Notes</h2>

      <div className="space-y-2">
        {devNotes.map((note, i) => (
          <div key={i} className="text-gray-400 text-sm border-l-4 border-violet-400 pl-2">
            {note}
          </div>
        ))}
      </div>
    </div>
  )
}
