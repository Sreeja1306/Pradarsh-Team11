/**
 * Shared Framer Motion variants used consistently across every page.
 * Import what you need — using the same easing + timing everywhere keeps
 * the site feeling like one system.
 */

// ── Easing ────────────────────────────────────────────────────────────────────
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1]
export const EASE_OUT      = 'easeOut'

// ── Page wrapper — stagger children ──────────────────────────────────────────
export const pageVariants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren:   0.05,
    },
  },
}

// ── Generic item: fade up ─────────────────────────────────────────────────────
export const fadeUpVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
}

// ── Slower/larger fade up for headings ────────────────────────────────────────
export const headingVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
}

// ── Slide in from right ───────────────────────────────────────────────────────
export const slideInRightVariants = {
  hidden:  { opacity: 0, x: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
}

// ── Fade in only (no translate) ───────────────────────────────────────────────
export const fadeInVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
}

// ── Card grid stagger ─────────────────────────────────────────────────────────
export const cardGridVariants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

export const cardItemVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
}
