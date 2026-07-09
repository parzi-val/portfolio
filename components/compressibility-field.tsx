"use client"

import { useEffect, useRef } from "react"

/**
 * CompressibilityField — a living [layer x head] grid, Attention Windowing's
 * answer to the Semantic Gravity solar system. Most cells sit dim (the head is
 * near-free to window); a sparse few flash awake at random, like heads firing,
 * weighted toward the load-bearing ones the map says to keep dense. The
 * brightness is seeded from the real per-head delta_ppl compressibility map
 * measured on Qwen2.5-7B.
 *
 * Ambient by design: quiet, theme-aware, no fast motion. All the feel lives in
 * CONFIG — tune there, not in the loop.
 */

// ---- tunable knobs (the whole "feel" is here) --------------------------------
const CONFIG = {
  cellPx: 20, // fixed cell pitch; the 28x28 map tiles (mirrored) to fill the viewport
  gapFrac: 0.22, // gap between cells as a fraction of cell size

  glowPower: 3.4, // >1 suppresses mid-range values so only true outliers count as load-bearing
  loadBearingThreshold: 0.14,

  dimAlpha: 0.035, // steady baseline for windowable cells
  idleGlowAlpha: 0.16, // steady baseline for load-bearing cells, between flashes
  flashPeakAlpha: 0.85, // alpha at a flash's peak, for a load-bearing cell
  flashPeakAlphaDim: 0.45, // alpha at a flash's peak, for a random dim cell

  flashMinGapMs: 180, // fastest a new flash can be spawned after the last one
  flashMaxGapMs: 520,
  flashMinDurationMs: 700, // how long a single flash takes to rise and fade
  flashMaxDurationMs: 1500,
  flashBiasLoadBearing: 22, // how many times more likely a load-bearing cell is picked to flash

  legibility: true, // a soft, localized fade behind the hero text, not a viewport-wide ring
  legibilityRFrac: 0.24,
  legibilitySpanFrac: 2.2,
  legibilityMaxAlpha: 0.45,

  frameIntervalMs: 45, // throttle redraws; this is a slow ambient backdrop, not 60fps

  dprCap: 2,
}

// ---- the real map -------------------------------------------------------------
// delta_ppl[layer][head] from a causal per-head windowing ablation on
// Qwen2.5-7B (28 layers x 28 heads). Rounded to 3 decimals; this is decorative,
// not a data viz, so the rounding costs nothing.
const DELTA_PPL: number[][] = [
  [0.007,0.000,0.001,0,0.000,-0.001,0.000,0.001,0.001,0.001,0,0.000,0.000,0.001,0.004,0.000,0.000,0.005,0.002,0.000,0.001,0.000,0.001,0.011,0.002,0.000,0.003,0.000],
  [0,0.000,-0.001,0.000,0.000,-0.001,0.004,0.005,0.000,0.002,0.000,-0.001,0.000,0.000,-0.001,0.000,0,0,0,0.000,-0.001,-0.005,0.002,0.000,0.000,-0.002,0.000,0.000],
  [0.004,-0.001,0.001,0.002,0.005,0.001,0.004,0.001,0.000,-0.001,-0.001,0.000,-0.001,0.000,-0.004,-0.001,0.006,0.000,-0.001,0.000,0,0.000,0.007,0.000,0.000,0.000,0.010,0],
  [-0.001,-0.001,-0.002,-0.002,-0.003,0.002,0.000,0,0.004,0.000,0.001,0.000,-0.002,0,0.000,-0.001,-0.002,-0.001,0.001,0.001,0.000,-0.001,-0.001,0.001,-0.001,0,0.000,0.000],
  [0.003,0.002,0,0.002,0.003,0.000,0.001,0,0,0.008,0.000,0.004,0.000,0,0.000,0.000,0.004,0.004,0.000,0.000,0,-0.001,0.000,0.000,-0.001,0,0.002,0],
  [0.003,0.001,0.001,0.000,-0.006,0.003,0.009,-0.006,0.001,-0.002,-0.001,0.012,0.004,0.001,-0.002,0.012,0.002,-0.002,0.006,0.002,0.002,0.012,-0.001,0.000,0.004,0.000,0.002,0.000],
  [0.000,0,0.000,0,0.000,0.000,0,-0.001,0.004,-0.001,0.001,0.001,0.005,-0.005,0,0.000,0,0,0.002,0.000,0,0.000,0,0.002,0,0.000,0,0],
  [0.000,-0.001,0,0.001,0.000,0.000,0,0.000,0.000,0,-0.002,0.000,0.000,0.000,0.002,0.010,0,0.001,0.000,-0.003,0.000,0.001,-0.002,0.005,0.001,0.001,0.003,-0.001],
  [-0.001,0.001,0.004,-0.005,0.007,0.000,0.001,0.001,0.001,0.004,-0.001,-0.002,-0.001,-0.001,0,0,0,0.001,0.000,0.000,0,0.001,-0.002,0,0.005,0.002,-0.001,0.001],
  [0,0.001,0.000,-0.002,0.002,0.000,0.000,-0.001,0.004,0.001,0.002,0.000,0.000,-0.001,0.000,0.000,0.000,0.001,0.005,0.002,0,0.001,0.002,0.001,0.000,0.005,0.001,0.001],
  [-0.001,0.000,-0.001,-0.001,0,0,0.000,-0.002,0.000,0.000,0.001,-0.001,0.000,0.000,0.001,-0.001,0.000,0.000,0.000,0.002,0.001,0.000,0,0,0.000,0.000,0.000,0],
  [0.010,0,0.003,0.000,-0.002,0.002,0.000,0.001,0.012,0.000,0.004,0.001,-0.005,0.001,0.000,0,0.000,0,0,0.001,0.000,0.002,0.000,0.001,0.001,0.000,-0.001,0.001],
  [0.000,-0.002,-0.006,0.000,-0.001,0.002,-0.004,0.004,-0.003,-0.001,0.004,0.000,0.005,0.000,-0.002,0.000,0.002,-0.002,-0.001,0.004,0.001,0.000,-0.001,0.001,0.002,0.000,0,0.002],
  [0.000,0,-0.001,0.002,0.001,0.001,-0.013,0.001,0,0.000,-0.001,0.003,-0.001,0.000,0.000,0.002,0.004,0.003,-0.001,0.002,0.000,0.000,0.001,-0.001,0.002,0.001,0.000,0.001],
  [0.001,0.002,0.002,-0.002,0.000,0,0.005,0,0.007,-0.001,0.004,0.003,0.002,0.008,0.002,0.001,0.004,0.001,-0.002,0.001,0.000,0,0.002,0.001,0.002,-0.001,0.001,0.004],
  [-0.002,0.018,-0.001,0.001,0.008,0,0.000,0.002,0.000,0,-0.001,0,-0.001,0.000,-0.001,0.001,0.000,0,0.002,0.001,0.004,0.001,-0.001,-0.001,-0.002,0.003,-0.006,0.002],
  [0.006,0.003,0.001,0.001,0.006,0.000,0.001,0.001,0.001,-0.001,0.004,0.001,0.001,0.002,0.003,0.001,0.000,-0.001,-0.001,-0.003,0.001,0.001,0.001,0.001,-0.001,0.001,-0.001,0.003],
  [0.000,0.001,0.000,0.000,-0.002,0.002,0.001,0.001,0.002,0.000,0.008,0,0.004,0.006,-0.001,0.002,0.001,-0.002,0.002,0.001,0.002,0.002,0.000,0.003,0.002,-0.001,-0.001,-0.001],
  [-0.001,-0.005,0.000,0.000,0.001,-0.001,0.001,0,0.003,0.001,-0.001,0.003,0,0.002,0.001,0.001,0.004,-0.001,0.001,0.001,0.001,0.001,0.002,0.015,0.003,-0.001,-0.001,0.001],
  [0,0.014,0.009,0.003,0.003,0.002,0.003,0.000,0,0.0,0.000,-0.001,0.000,0.000,0.002,0.008,0.001,0.004,0.008,0.004,0.000,0.000,0.004,0.002,0.001,0.002,0.002,0.001],
  [0.001,0.000,-0.003,0.000,0.001,0.001,-0.001,0,0.003,0.003,0,0.007,0.005,0.001,0.000,0.002,0.000,0.000,0,0.001,0.000,0.002,0.000,0.001,0.000,0.002,0.004,0.002],
  [0,0.003,0.001,0.001,0.001,0.002,0.001,0.002,0.000,0,0.000,0.001,0,0.001,0.002,0.000,0,-0.001,0.002,0.000,0,0.000,0.001,0,0.001,0.001,0.000,0.002],
  [0.000,0.000,0.000,0.002,0.002,-0.001,0.003,0.000,0.001,0,0.001,0,-0.001,0.002,-0.001,0.001,0.011,0.001,0.000,0.001,0.000,0.003,0.000,0.000,0.002,0.003,0.003,0.003],
  [0.000,0.001,0.002,0.003,0.002,0.001,0.000,0.001,0.002,-0.001,0.000,0.002,0.002,-0.001,0,0.001,0.000,0.000,0.001,-0.002,0.002,0,-0.001,-0.001,0.000,0.000,0,0],
  [0.002,0.001,0,-0.002,0.000,0.000,0.000,0.007,0.001,0.008,0.007,0.001,0.001,0.031,0.000,0,0.000,0.000,0.000,0.000,0,0.002,0.000,0.001,0.003,0.000,0.000,0.002],
  [0.000,0,0,0.000,0.000,0.000,0.000,0.002,0.009,0.001,0.000,0,0.000,0.001,0,-0.001,-0.001,0,0.000,0.000,-0.002,0.000,0,0.002,0.000,0.005,0,0],
  [0,0.004,0.002,0.001,0.002,0.000,0.001,0.051,0.001,0.000,0.004,-0.001,0.017,-0.001,0.000,0.002,0.005,0.001,0.001,0.004,0.000,0,0.000,0,0.001,0.000,0.000,-0.001],
  [0.002,0.004,0.003,0.005,0.002,0.002,0.003,0.000,0.001,0.006,0.0,0.000,0,0,0.004,0.001,0.009,0.002,0.006,0.000,0.001,0.010,0.002,0.001,0.004,0.000,0.001,0.024],
]

const ROWS = DELTA_PPL.length
const COLS = DELTA_PPL[0].length

type Cell = {
  x: number
  y: number
  row: number // logical row into the 28x28 map, after mirror-tiling
  col: number // logical col into the 28x28 map, after mirror-tiling
  intensity: number // 0 (windowable) .. 1 (load-bearing), power-curved
}

/** Pull a live theme token (an hsl(...) string) straight from the DOM. */
function cssColor(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

/**
 * Resolve any CSS color string to its RGB channels via a 1x1 canvas.
 * getComputedStyle normalizes theme tokens to hex/rgb, not necessarily the
 * hsl(...) they were declared as, so a regex-based alpha injection isn't
 * reliable; painting and reading back is.
 */
function toRgbChannels(color: string): [number, number, number] {
  const c = document.createElement("canvas")
  c.width = 1
  c.height = 1
  const cctx = c.getContext("2d")!
  cctx.fillStyle = color
  cctx.fillRect(0, 0, 1, 1)
  const d = cctx.getImageData(0, 0, 1, 1).data
  return [d[0], d[1], d[2]]
}

// Power-curved intensity per map cell, precomputed once: 0 (windowable) to 1 (load-bearing).
const INTENSITY: number[][] = (() => {
  let maxAbs = 0
  for (const row of DELTA_PPL) for (const v of row) maxAbs = Math.max(maxAbs, Math.abs(v))
  return DELTA_PPL.map((row) =>
    row.map((v) => Math.pow(maxAbs > 0 ? Math.min(1, Math.abs(v) / maxAbs) : 0, CONFIG.glowPower))
  )
})()

// A weighted pool for picking which logical cell flashes next: load-bearing
// cells are far more likely to be picked, but any cell can fire occasionally.
const FLASH_POOL: { row: number; col: number; weight: number }[] = []
let FLASH_TOTAL_WEIGHT = 0
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const weight = INTENSITY[r][c] > CONFIG.loadBearingThreshold ? CONFIG.flashBiasLoadBearing : 1
    FLASH_POOL.push({ row: r, col: c, weight })
    FLASH_TOTAL_WEIGHT += weight
  }
}

function pickFlashCell() {
  let x = Math.random() * FLASH_TOTAL_WEIGHT
  for (const entry of FLASH_POOL) {
    x -= entry.weight
    if (x <= 0) return entry
  }
  return FLASH_POOL[FLASH_POOL.length - 1]
}

/**
 * Tile the 28x28 map to cover an arbitrary viewport. Alternate tiles are
 * mirrored on each axis (a reflection tiling) so the pattern has no visible
 * seam at tile boundaries.
 */
function buildCells(w: number, h: number): Cell[] {
  const cols = Math.ceil(w / CONFIG.cellPx) + 1
  const rows = Math.ceil(h / CONFIG.cellPx) + 1
  const cells: Cell[] = []
  for (let j = 0; j < rows; j++) {
    const tileY = Math.floor(j / ROWS)
    const localJ = tileY % 2 === 0 ? j % ROWS : ROWS - 1 - (j % ROWS)
    for (let i = 0; i < cols; i++) {
      const tileX = Math.floor(i / COLS)
      const localI = tileX % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS)
      cells.push({
        x: i * CONFIG.cellPx,
        y: j * CONFIG.cellPx,
        row: localJ,
        col: localI,
        intensity: INTENSITY[localJ][localI],
      })
    }
  }
  return cells
}

export function CompressibilityField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, CONFIG.dprCap)
    let fg = cssColor("--foreground", "hsl(0 0% 3.9%)")
    let primary = cssColor("--primary", fg)
    let bg = cssColor("--background", "hsl(36 8% 94%)")
    let bgRgb = toRgbChannels(bg)
    let raf = 0
    let cells: Cell[] = []
    let lastFrameT = 0
    let nextFlashAt = 0

    // Keyed by row*COLS+col: when a cell last started flashing, and for how long.
    const flashStart = new Float32Array(ROWS * COLS).fill(-Infinity)
    const flashDuration = new Float32Array(ROWS * COLS)

    function layout() {
      cells = buildCells(w, h)
    }

    function resize() {
      w = canvas!.clientWidth || window.innerWidth
      h = canvas!.clientHeight || window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, CONFIG.dprCap)
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      layout()
    }

    function maybeSpawnFlash(t: number) {
      if (t < nextFlashAt) return
      const picked = pickFlashCell()
      const idx = picked.row * COLS + picked.col
      flashStart[idx] = t
      flashDuration[idx] =
        CONFIG.flashMinDurationMs + Math.random() * (CONFIG.flashMaxDurationMs - CONFIG.flashMinDurationMs)
      nextFlashAt = t + CONFIG.flashMinGapMs + Math.random() * (CONFIG.flashMaxGapMs - CONFIG.flashMinGapMs)
    }

    function render(t: number) {
      ctx!.clearRect(0, 0, w, h)
      if (!reduceMotion) maybeSpawnFlash(t)

      const gap = CONFIG.cellPx * CONFIG.gapFrac
      const size = CONFIG.cellPx - gap

      for (const cell of cells) {
        const loadBearing = cell.intensity > CONFIG.loadBearingThreshold
        let alpha = loadBearing ? CONFIG.idleGlowAlpha * cell.intensity : CONFIG.dimAlpha
        let color = loadBearing ? primary : fg

        if (!reduceMotion) {
          const idx = cell.row * COLS + cell.col
          const elapsed = t - flashStart[idx]
          const duration = flashDuration[idx]
          if (elapsed >= 0 && elapsed < duration) {
            const progress = elapsed / duration
            const curve = Math.sin(Math.PI * progress) // rises to a peak, falls back to 0
            const peak = loadBearing ? CONFIG.flashPeakAlpha : CONFIG.flashPeakAlphaDim
            alpha = alpha + (peak - alpha) * curve
            color = primary
          }
        }

        ctx!.globalAlpha = alpha
        ctx!.fillStyle = color
        ctx!.fillRect(cell.x, cell.y, size, size)
      }
      ctx!.globalAlpha = 1

      if (CONFIG.legibility) {
        const cx = w / 2
        const cy = h * 0.42
        const r = Math.min(w, h) * CONFIG.legibilityRFrac
        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * CONFIG.legibilitySpanFrac)
        const [br, bgc, bb] = bgRgb
        grad.addColorStop(0, `rgba(${br}, ${bgc}, ${bb}, ${CONFIG.legibilityMaxAlpha})`)
        grad.addColorStop(1, `rgba(${br}, ${bgc}, ${bb}, 0)`)
        ctx!.fillStyle = grad
        ctx!.fillRect(0, 0, w, h)
      }
    }

    function frame(t: number) {
      if (t - lastFrameT >= CONFIG.frameIntervalMs) {
        lastFrameT = t
        render(t)
      }
      raf = requestAnimationFrame(frame)
    }

    function start() {
      cancelAnimationFrame(raf)
      if (reduceMotion) {
        render(0)
        return
      }
      raf = requestAnimationFrame(frame)
    }

    const domObserver = new MutationObserver(() => {
      fg = cssColor("--foreground", fg)
      primary = cssColor("--primary", primary)
      bg = cssColor("--background", bg)
      bgRgb = toRgbChannels(bg)
      if (reduceMotion) render(0)
    })
    domObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else start()
    }
    document.addEventListener("visibilitychange", onVisibility)

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        resize()
        if (reduceMotion) render(0)
      }, 150)
    }
    window.addEventListener("resize", onResize)

    resize()
    start()

    return () => {
      cancelAnimationFrame(raf)
      domObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("resize", onResize)
      window.clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
      className={className ?? "pointer-events-none fixed inset-0 z-0"}
    />
  )
}
