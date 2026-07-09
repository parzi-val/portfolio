export type ResearchProgram = {
  name: string
  href: string
  enabled: boolean
}

/**
 * Single source of truth for which research programs show up in the sidebar.
 * Flip `enabled` to hold a program back on a given branch (e.g. main/prod)
 * without touching the sidebar or page code.
 */
export const RESEARCH_PROGRAMS: ResearchProgram[] = [
  { name: "Semantic Gravity", href: "/semantic-gravity", enabled: true },
  { name: "Attention Windowing", href: "/attention-windowing", enabled: true },
]
