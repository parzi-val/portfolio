"use client"

import { useEffect, useRef } from "react"

/**
 * GlyphField — a solar system whose planets are glyphs from many writing
 * systems. Concentric, slightly tilted orbits; each planet rides its own orbit
 * at a steady, Kepler-ish pace (inner orbits faster). The orbit rings are drawn.
 * The visual ode of the Semantic Gravity program: tokens (here, letters) held
 * in orbit by a shared center of gravity.
 *
 * Ambient by design: monochrome, low opacity, calm motion, theme-aware.
 * All the feel lives in CONFIG — tune there, not in the loop.
 */

// ---- tunable knobs (the whole "feel" is here) --------------------------------
const CONFIG = {
  orbits: 12, // number of concentric orbits
  rMinF: 0.12, // innermost orbit radius as a fraction of the outer radius
  flatten: 0.55, // how edge-on the plane sits (1 = head-on, lower = more lateral)
  persp: 1.8, // perspective strength as a multiple of the outer radius (lower = stronger)
  centerYFrac: 0.46, // vertical placement of the sun (0.5 = middle)
  doubleChance: 0.35, // chance a given orbit carries a second planet
  baseSpeed: 0.0011, // base angular speed (rad/frame)
  speedExp: 1.5, // Kepler-ish falloff: inner orbits spin faster
  maxOmega: 0.012, // clamp so the innermost planet doesn't blur
  dir: 1, // orbital direction (+1 / −1)

  // look
  orbitAlpha: 0.1, // orbit-ring opacity
  orbitWidth: 1, // orbit-ring thickness (px)
  sun: true,
  sunAlpha: 0.18,
  sunR: 3, // sun core radius (px)
  glyphPx: 26, // base glyph size (css px)
  alpha: [0.1, 0.26] as const, // per-planet opacity range
  rotJitter: 0.12, // static per-glyph tilt (radians)

  dprCap: 2,
}

// ---- the multilingual lineup -------------------------------------------------
// Greek doubles as the paper's own notation (α β Δ σ Ω …); Tamil is the personal
// ode. The rest just reads as "language, broadly." Edit the chars to taste.
const SCRIPTS: { family: string; chars: string }[] = [
  { family: "Noto Sans", chars: "aegkmrst" + "αβγδΔθλσφΩ" + "ДЖЗИЛЯ" },
  { family: "Noto Sans Tamil", chars: "அஆகஙமழண" },
  { family: "Noto Sans Devanagari", chars: "अकखगमरह" },
  { family: "Noto Sans Arabic", chars: "عشلمكنه" },
  { family: "Noto Sans Hebrew", chars: "אבשמלק" },
  { family: "Noto Sans JP", chars: "道字語心行あきねカヲ" },
  { family: "Noto Sans KR", chars: "한글ㄱㅎㅂ" },
]

const GLYPHS: { char: string; family: string }[] = SCRIPTS.flatMap((s) =>
  [...s.chars].map((char) => ({ char, family: s.family }))
)

type Planet = {
  rf: number // orbit radius fraction
  angle: number
  speed: number
  size: number
  baseAlpha: number
  rot: number
  glyph: number
  x: number
  y: number
  depth: number // projected depth (smaller = farther)
  scale: number // perspective scale at the planet's current position
}

/** Pull a live theme token (an hsl(...) string) straight from the DOM. */
function cssColor(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

/** Declare the Google Fonts subsets we need (text= ships only the glyphs used). */
function ensureFontLinks() {
  SCRIPTS.forEach((s, i) => {
    const id = `glyph-field-font-${i}`
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    const fam = s.family.replace(/ /g, "+")
    link.href =
      `https://fonts.googleapis.com/css2?family=${fam}:wght@400` +
      `&text=${encodeURIComponent(s.chars)}&display=swap`
    document.head.appendChild(link)
  })
}

async function waitForFonts() {
  try {
    await Promise.all(
      SCRIPTS.map((s) =>
        document.fonts.load(`24px "${s.family}"`, s.chars).catch(() => {})
      )
    )
  } catch {
    /* offline / blocked — fall back to system glyphs */
  }
}

/** Pre-bake each glyph to its own offscreen sprite once, in the theme color. */
function buildAtlas(fg: string, dpr: number): HTMLCanvasElement[] {
  const px = Math.ceil(CONFIG.glyphPx * 1.6 * dpr)
  return GLYPHS.map((g) => {
    const c = document.createElement("canvas")
    c.width = px
    c.height = px
    const cx = c.getContext("2d")!
    cx.fillStyle = fg
    cx.textAlign = "center"
    cx.textBaseline = "middle"
    cx.font = `${Math.floor(px * 0.62)}px "${g.family}", sans-serif`
    cx.fillText(g.char, px / 2, px / 2)
    return c
  })
}

export function GlyphField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = 0
    let h = 0
    let cx = 0
    let cy = 0
    let rMax = 0
    let focal = 0
    let dpr = Math.min(window.devicePixelRatio || 1, CONFIG.dprCap)
    let fg = cssColor("--foreground", "hsl(0 0% 3.9%)")
    let atlas = buildAtlas(fg, dpr)
    let orbits: number[] = []
    let planets: Planet[] = []
    let raf = 0

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    /** Keep the system centered in the visible area (right of the sidebar). */
    function readSidebar(): number {
      const v = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width")
      )
      if (!Number.isNaN(v)) return v
      return w >= 768 ? 264 : 0
    }

    function layout() {
      const sb = readSidebar()
      cx = sb + (w - sb) / 2
      cy = h * CONFIG.centerYFrac
      // overfill so the outer orbits reach past the edges
      rMax = 1.05 * Math.max((w - sb) / 2, h / 2)
      focal = rMax * CONFIG.persp
    }

    /**
     * Perspective projection of a point on the (flat) orbital plane: looking
     * across the plane, the far side (pz > 0) shrinks toward a vanishing zone,
     * the near side (pz < 0) sweeps wide toward the viewer.
     */
    function project(r: number, theta: number) {
      const px = r * Math.cos(theta)
      const pz = r * Math.sin(theta)
      const scale = focal / (focal + pz)
      return {
        x: cx + px * scale,
        y: cy - pz * CONFIG.flatten * scale,
        scale,
        depth: pz, // larger = farther (drawn first)
      }
    }

    function generate() {
      orbits = []
      planets = []
      const n = CONFIG.orbits
      for (let i = 0; i < n; i++) {
        const base = CONFIG.rMinF + (1 - CONFIG.rMinF) * ((i + 1) / n)
        const rf = base + rand(-0.02, 0.02)
        orbits.push(rf)
        const omega = Math.min(CONFIG.maxOmega, CONFIG.baseSpeed / Math.pow(rf, CONFIG.speedExp))
        const count = 1 + (Math.random() < CONFIG.doubleChance ? 1 : 0)
        const [a0, a1] = CONFIG.alpha
        for (let k = 0; k < count; k++) {
          planets.push({
            rf,
            angle: rand(0, Math.PI * 2),
            speed: omega * CONFIG.dir,
            size: CONFIG.glyphPx * (1.25 - 0.45 * rf), // inner planets read larger
            baseAlpha: rand(a0, a1),
            rot: rand(-CONFIG.rotJitter, CONFIG.rotJitter),
            glyph: Math.floor(Math.random() * GLYPHS.length),
            x: 0,
            y: 0,
            depth: 0,
            scale: 1,
          })
        }
      }
    }

    function resize() {
      w = canvas!.clientWidth || window.innerWidth
      h = canvas!.clientHeight || window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, CONFIG.dprCap)
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      atlas = buildAtlas(fg, dpr)
      layout()
    }

    function drawSun() {
      if (!CONFIG.sun) return
      ctx!.fillStyle = fg
      ctx!.globalAlpha = CONFIG.sunAlpha * 0.4
      ctx!.beginPath()
      ctx!.arc(cx, cy, CONFIG.sunR * 2.6, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.globalAlpha = CONFIG.sunAlpha
      ctx!.beginPath()
      ctx!.arc(cx, cy, CONFIG.sunR, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.globalAlpha = 1
    }

    function drawOrbits() {
      ctx!.strokeStyle = fg
      ctx!.lineWidth = CONFIG.orbitWidth
      ctx!.globalAlpha = CONFIG.orbitAlpha
      const STEPS = 80
      for (const rf of orbits) {
        const r = rf * rMax
        ctx!.beginPath()
        for (let i = 0; i <= STEPS; i++) {
          const pr = project(r, (i / STEPS) * Math.PI * 2)
          if (i === 0) ctx!.moveTo(pr.x, pr.y)
          else ctx!.lineTo(pr.x, pr.y)
        }
        ctx!.stroke()
      }
      ctx!.globalAlpha = 1
    }

    function drawPlanets() {
      // far-to-near so near planets overlap far ones
      const order = planets.slice().sort((a, b) => b.depth - a.depth)
      for (const p of order) {
        const sp = atlas[p.glyph]
        if (!sp) continue
        const s = Math.max(0.7, Math.min(1.6, p.scale))
        const front = (s - 0.7) / 0.9 // 0 (far) … 1 (near)
        const size = p.size * s
        ctx!.globalAlpha = p.baseAlpha * (0.5 + 0.5 * front)
        ctx!.save()
        ctx!.translate(p.x, p.y)
        if (p.rot) ctx!.rotate(p.rot)
        ctx!.drawImage(sp, -size / 2, -size / 2, size, size)
        ctx!.restore()
      }
      ctx!.globalAlpha = 1
    }

    function place() {
      for (const p of planets) {
        const pr = project(p.rf * rMax, p.angle)
        p.x = pr.x
        p.y = pr.y
        p.scale = pr.scale
        p.depth = pr.depth
      }
    }

    function render() {
      ctx!.clearRect(0, 0, w, h)
      drawOrbits()
      drawSun()
      drawPlanets()
    }

    function frame() {
      for (const p of planets) p.angle += p.speed
      place()
      render()
      raf = requestAnimationFrame(frame)
    }

    function start() {
      cancelAnimationFrame(raf)
      place()
      if (reduceMotion) {
        render()
        return
      }
      raf = requestAnimationFrame(frame)
    }

    // theme toggle → rebake sprites; sidebar collapse → recenter
    const domObserver = new MutationObserver(() => {
      const nf = cssColor("--foreground", fg)
      if (nf !== fg) {
        fg = nf
        atlas = buildAtlas(fg, dpr)
      }
      layout()
      if (reduceMotion) {
        place()
        render()
      }
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
        if (reduceMotion) {
          place()
          render()
        }
      }, 150)
    }
    window.addEventListener("resize", onResize)

    // boot
    ensureFontLinks()
    resize()
    generate()
    start()
    waitForFonts().then(() => {
      atlas = buildAtlas(fg, dpr)
      if (reduceMotion) {
        place()
        render()
      }
    })

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
