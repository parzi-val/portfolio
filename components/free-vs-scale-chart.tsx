"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

/**
 * Fraction of attention heads free to window, per model, across three
 * attention families. Real numbers pulled from the per-head compressibility
 * maps (free_pct), not illustrative.
 */
type ScalePoint = {
  paramsM: number
  model: string
  gpt2?: number
  pythia?: number
  qwen?: number
}

const DATA: ScalePoint[] = [
  { paramsM: 124, model: "GPT-2 Small (124M)", gpt2: 81.0 },
  { paramsM: 160, model: "Pythia-160M", pythia: 67.36 },
  { paramsM: 355, model: "GPT-2 Medium (355M)", gpt2: 94.27 },
  { paramsM: 410, model: "Pythia-410M", pythia: 95.05 },
  { paramsM: 500, model: "Qwen2.5-0.5B", qwen: 97.32 },
  { paramsM: 774, model: "GPT-2 Large (774M)", gpt2: 98.61 },
  { paramsM: 1000, model: "Pythia-1B", pythia: 84.38 },
  { paramsM: 1400, model: "Pythia-1.4B", pythia: 96.61 },
  { paramsM: 1500, model: "GPT-2 XL (1.5B)", gpt2: 99.5 },
  { paramsM: 2800, model: "Pythia-2.8B", pythia: 99.9 },
  { paramsM: 7600, model: "Qwen2.5-7B", qwen: 99.87 },
]

const X_TICKS = [124, 500, 2000, 8000]

function formatParams(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(m % 1000 === 0 ? 0 : 1)}B` : `${m}M`
}

function ScaleTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: ScalePoint; value: number }[]
}) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0].payload
  const pct = point.gpt2 ?? point.pythia ?? point.qwen
  return (
    <div className="rounded-md border border-border/50 bg-card px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-foreground">{point.model}</div>
      <div className="mt-1 font-mono text-muted-foreground">{pct}% windowable</div>
    </div>
  )
}

export function FreeVsScaleChart() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={DATA} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="paramsM"
            type="number"
            scale="log"
            domain={[100, 10000]}
            ticks={X_TICKS}
            tickFormatter={formatParams}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            stroke="var(--border)"
          />
          <YAxis
            domain={[60, 100]}
            ticks={[60, 70, 80, 90, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            stroke="var(--border)"
            width={40}
          />
          <Tooltip content={<ScaleTooltip />} />
          <Line
            type="monotone"
            dataKey="gpt2"
            name="GPT-2"
            stroke="var(--muted-foreground)"
            strokeWidth={1.75}
            strokeDasharray="4 3"
            dot={{ r: 3, fill: "var(--muted-foreground)", strokeWidth: 0 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="pythia"
            name="Pythia"
            stroke="var(--foreground)"
            strokeWidth={1.75}
            strokeDasharray="1 4"
            strokeLinecap="round"
            dot={{ r: 3, fill: "var(--foreground)", strokeWidth: 0 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="qwen"
            name="Qwen"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "var(--primary)", strokeWidth: 0 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-px w-3 border-t border-dashed border-muted-foreground" /> GPT-2
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-px w-3 border-t border-dotted border-foreground"
            style={{ borderTopWidth: 2 }}
          />{" "}
          Pythia
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[2px] w-3 bg-primary" /> Qwen
        </span>
      </div>
    </div>
  )
}
