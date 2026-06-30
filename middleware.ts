import { NextRequest, NextResponse } from "next/server"

/**
 * Terminal easter egg: `curl krbala.in` clears the screen, prints a colored
 * Mandelbrot mascot, then a plain-text bio. Browsers fall through to the real
 * site. Runs as edge middleware, so it needs a host that executes Next
 * middleware at request time (e.g. Vercel), not a static export.
 */

// CLI clients to intercept. Browsers send "Mozilla/..." and are left alone.
const CLI_UA = /\b(curl|wget|httpie|libcurl)\b/i

// minimal ANSI; ESC built at runtime so no control chars sit in the source.
const ESC = String.fromCharCode(27)
const R = ESC + "[0m" // reset
const B = ESC + "[1m" // bold
const D = ESC + "[2m" // dim
const C = ESC + "[38;2;95;205;240m" // cyan (matches the fractal)
const GOLD = ESC + "[38;2;250;190;70m" // gold accent
const SKY = ESC + "[38;2;95;175;240m" // soft blue

// clear screen + scrollback + cursor home. Drop this line to stop clearing.
const CLEAR = ESC + "[2J" + ESC + "[3J" + ESC + "[H"

// ---- mascot: a colored Mandelbrot, rendered to fit a terminal --------------
// Color comes from the escape-iteration count (the real thing), not the chars.
const RAMP = " .:-=+*#%@"

// blue -> cyan -> white -> gold -> orange. Routed through near-white (not black)
// and kept bright so the outer bands stay visible on a dark terminal.
const STOPS: number[][] = [
  [0.0, 60, 120, 235],
  [0.3, 95, 205, 240],
  [0.5, 235, 240, 220],
  [0.72, 250, 190, 70],
  [1.0, 235, 120, 50],
]
function paletteFor(t: number): string {
  let i = 0
  while (i < STOPS.length - 1 && t > STOPS[i + 1][0]) i++
  const a = STOPS[i]
  const b = STOPS[Math.min(i + 1, STOPS.length - 1)]
  const f = b[0] === a[0] ? 0 : Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])))
  const r = Math.round(a[1] + (b[1] - a[1]) * f)
  const g = Math.round(a[2] + (b[2] - a[2]) * f)
  const bl = Math.round(a[3] + (b[3] - a[3]) * f)
  return `${r};${g};${bl}`
}

function buildFractal(cols = 70, rows = 24): string {
  const reMin = -2.05
  const reMax = 0.62
  const imMin = -1.15
  const imMax = 1.15
  const maxIter = 110
  const minIter = 4 // blank the fast-escaping far field for a clean backdrop
  let out = ""
  for (let y = 0; y < rows; y++) {
    const im = imMin + (imMax - imMin) * (y / (rows - 1))
    let last = ""
    for (let x = 0; x < cols; x++) {
      const cre = reMin + (reMax - reMin) * (x / (cols - 1))
      let zr = 0
      let zi = 0
      let it = 0
      while (zr * zr + zi * zi <= 4 && it < maxIter) {
        const t = zr * zr - zi * zi + cre
        zi = 2 * zr * zi + im
        zr = t
        it++
      }
      if (it < minIter) {
        if (last) {
          out += R
          last = ""
        }
        out += " "
      } else if (it >= maxIter) {
        const c = ESC + "[38;2;120;95;200m" // solid indigo body
        if (c !== last) {
          out += c
          last = c
        }
        out += "#"
      } else {
        const t = it / maxIter
        const ch = RAMP[1 + Math.min(RAMP.length - 2, Math.floor(t * (RAMP.length - 1)))]
        const c = ESC + "[38;2;" + paletteFor(t) + "m"
        if (c !== last) {
          out += c
          last = c
        }
        out += ch
      }
    }
    out += R + "\n"
  }
  return out
}

const MASCOT = buildFractal()

const BIO = `
  ${GOLD}${B}K. R. Balasubramanian${R} ${D}(Bala)${R}  ${D}|${R}  ${SKY}systems + applied AI${R}

  ${D}------------------------------------------------------------${R}

  Systems-oriented software engineer. Low-level infra, deterministic
  pipelines, and developer tooling. Lately: multi-agent systems,
  representational learning, and the geometry of how models route.

  ${C}arxiv ${R}  ${GOLD}All Routes Lead to Collapse${R}    arxiv.org/abs/2606.22325
  ${C}github${R}  github.com/parzi-val
  ${C}x     ${R}  x.com/parzeival
  ${C}in    ${R}  linkedin.com/in/balasubramaniankr
  ${C}mail  ${R}  krbala1511@gmail.com
  ${C}web   ${R}  https://krbala.in

  ${D}------------------------------------------------------------${R}

  ${D}you found the terminal easter egg. open krbala.in in a browser
  for the full thing.${R}

`

const OUTPUT = CLEAR + MASCOT + "\n" + BIO

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || ""
  if (CLI_UA.test(ua)) {
    return new NextResponse(OUTPUT, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    })
  }
  return NextResponse.next()
}

// only intercept the homepage; curling any subpath still hits the real site
export const config = {
  matcher: "/",
}
