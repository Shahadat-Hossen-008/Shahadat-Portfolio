/**
 * Background.tsx
 * Reusable three-layer background: radial glow + graph-paper grid + optional scanlines.
 * Server component (no hooks, no interactivity) — safe to use in layout.tsx or any page.
 *
 * Usage:
 *   <section className="relative bg-void overflow-hidden">
 *     <Background scanlines />
 *     <div className="relative z-10"> ...your content... </div>
 *   </section>
 *
 * Note: the wrapping <section> needs `position: relative` (or Tailwind `relative`)
 * so the absolutely-positioned layers anchor to it and not the page.
 */

type BackgroundProps = {
  /** Show the scanline texture. Keep this true only on the hero — repeating it
   *  on every section dilutes the one moment it's supposed to punctuate. */
  scanlines?: boolean
  /** Show the breathing radial glow. Local layers should default this to
   *  false — the layout-level instance below is the one glow the page needs. */
  glow?: boolean
  /** Show the graph-paper grid. Defaults to true. */
  grid?: boolean
  /** `fixed`: pins the layer to the viewport once, at the layout level —
   *  the grid stays continuous across every section, no seams at boundaries.
   *  `absolute` (default): anchors to the nearest positioned ancestor —
   *  use this for a section-local glow/scanlines on top of the fixed base. */
  position?: 'fixed' | 'absolute'
  className?: string
}

export default function Background({
  scanlines = false,
  glow = false,
  grid = true,
  position = 'absolute',
  className = '',
}: BackgroundProps) {
  return (
    <div
      className={`bg-layers ${position === 'fixed' ? 'bg-layers-fixed' : ''} ${className}`}
      aria-hidden="true"
    >
      {grid && <div className="bg-grid" />}
      {glow && <div className="bg-glow" />}
      {scanlines && <div className="bg-scanlines" />}
    </div>
  )
}
