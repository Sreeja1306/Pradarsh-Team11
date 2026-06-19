import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * 6-phase intro animation.
 *
 * Phases:
 *  splash   – dark bg, actual logo file centered with glow
 *  emerge   – blobs burst FROM CENTER outward, bg crossfades dark→white, logo shrinks
 *  scatter  – blobs fly further out and fade, small dark patch dissolves
 *  headline – white bg, headline reveals line-by-line (typewriter, no scramble), plain card
 *  zoom     – navbar fades in, device frame scales up inside card, CTA scales in
 *  done     – overlay removed, homepage fully visible
 *
 * Session flag: sessionStorage key 'pradarsh_intro_played'
 * Checked synchronously before any state so navigating back to Home never replays.
 */

// ── Blob positions — all START at center (scale 0), burst to these final spots ─
const BLOBS = [
  { id: 1, tx: '-60%', ty: '-55%', color: 'linear-gradient(135deg,#f43f8e 0%,#a855f7 100%)', w: 340, h: 300, rx: '60% 40% 55% 45%/45% 55% 40% 60%', delay: 0    },
  { id: 2, tx:  '55%', ty: '-60%', color: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)', w: 380, h: 320, rx: '40% 60% 45% 55%/55% 45% 60% 40%', delay: 0.05 },
  { id: 3, tx: '-58%', ty:  '52%', color: 'linear-gradient(135deg,#7c3aed 0%,#f43f8e 100%)', w: 360, h: 340, rx: '55% 45% 60% 40%/40% 60% 45% 55%', delay: 0.04 },
  { id: 4, tx:  '52%', ty:  '55%', color: 'linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)', w: 300, h: 280, rx: '45% 55% 40% 60%/60% 40% 55% 45%', delay: 0.08 },
  { id: 5, tx: '-30%', ty:  '60%', color: 'linear-gradient(135deg,#d946ef 0%,#6d28d9 100%)', w: 200, h: 180, rx: '60% 40% 60% 40%/40% 60% 40% 60%', delay: 0.1  },
  { id: 6, tx:  '35%', ty: '-25%', color: 'linear-gradient(135deg,#f43f8e 0%,#a855f7 100%)', w: 180, h: 160, rx: '40% 60% 40% 60%/60% 40% 60% 40%', delay: 0.07 },
]

// ── Simple typewriter: reveals characters one by one, guaranteed to resolve ──
function Typewriter({ text, gradient = false, onDone }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    setDisplayed('')
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        onDone?.()
      }
    }, 55)
    return () => clearInterval(id)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  if (gradient) {
    return (
      <span style={{
        background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {displayed}
        <span style={{
          display: 'inline-block',
          width: 3, height: '0.85em',
          background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
          marginLeft: 2, verticalAlign: 'middle',
          borderRadius: 2,
          animation: 'caretBlink 1s step-end infinite',
        }} />
      </span>
    )
  }
  return <span>{displayed}</span>
}

// ── Overlay rendered during splash → zoom phases ─────────────────────────────
function IntroOverlay({ phase }) {
  const isSplash   = phase === 'splash'
  const isEmerge   = phase === 'emerge'
  const isScatter  = phase === 'scatter'
  const isHeadline = phase === 'headline'
  const isZoom     = phase === 'zoom'
  const showBlobs  = isEmerge || isScatter
  const showHero   = isHeadline || isZoom
  const darkBg     = isSplash || isEmerge

  return (
    <motion.div
      key="intro-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* Dark background */}
      <motion.div
        style={{ position: 'absolute', inset: 0, background: '#1a0a2e' }}
        animate={{ opacity: darkBg ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {/* White background */}
      <motion.div
        style={{ position: 'absolute', inset: 0, background: '#ffffff' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: darkBg ? 0 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* SPLASH: actual logo file, centered, with glow */}
      <AnimatePresence>
        {(isSplash || isEmerge) && (
          <motion.div
            key="logo-lockup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isEmerge ? 0 : 1, scale: isEmerge ? 0.5 : 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <img
              src="/logo.png"
              alt="Pradarsh"
              style={{
                width: 220, height: 220,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 48px rgba(236,72,153,0.8)) drop-shadow(0 0 80px rgba(139,92,246,0.5))',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMERGE + SCATTER: blobs burst from center outward */}
      {showBlobs && BLOBS.map((blob) => (
        <motion.div
          key={blob.id}
          initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
          animate={
            isScatter
              ? {
                  x: [`calc(${blob.tx})`, `calc(${blob.tx} * 1.8)`],
                  y: [`calc(${blob.ty})`, `calc(${blob.ty} * 1.8)`],
                  scale: [1, 1.3],
                  opacity: [1, 0],
                }
              : {
                  x: `calc(${blob.tx})`,
                  y: `calc(${blob.ty})`,
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={{
            duration: isScatter ? 0.7 : 0.7,
            delay: blob.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: blob.w, height: blob.h,
            borderRadius: blob.rx,
            background: blob.color,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* SCATTER: small dark remnant at center dissolves */}
      {isScatter && (
        <motion.div
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
          style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%,-50%)',
            width: 90, height: 90,
            borderRadius: '40% 60% 55% 45%/45% 55% 40% 60%',
            background: '#2d1b3d',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* HEADLINE + ZOOM: white bg, two-col layout */}
      {showHero && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          maxWidth: 1280, margin: '0 auto',
          padding: '0 3rem',
        }}>
          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              fontSize: 'clamp(36px,5vw,64px)',
            }}>
              <div style={{ color: '#111', display: 'block' }}>Showcase.</div>
              <div style={{ color: '#111', display: 'block' }}>Discover.</div>
              <div style={{ display: 'block' }}>
                {isHeadline
                  ? <Typewriter text="Get Inspired." gradient />
                  : (
                    <span style={{
                      background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      Get Inspired.
                    </span>
                  )
                }
              </div>
            </div>

            {/* CTA scales in during zoom */}
            <AnimatePresence>
              {isZoom && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  style={{ marginTop: 32 }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 28px', borderRadius: 12,
                    background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
                    color: 'white', fontWeight: 700, fontSize: 15,
                    fontFamily: 'system-ui, sans-serif',
                    boxShadow: '0 4px 24px rgba(139,92,246,0.45)',
                  }}>
                    Explore Projects →
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: hero card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div
              initial={{ opacity: 0, x: 48, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                width: '100%', maxWidth: 440,
                aspectRatio: '4/3',
                borderRadius: 20,
                background: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 45%,#ec4899 100%)',
                boxShadow: '0 20px 60px rgba(139,92,246,0.35)',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Device frame scales in during zoom */}
              <AnimatePresence>
                {isZoom && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    style={{
                      width: '84%', background: 'white',
                      borderRadius: 12, overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    }}
                  >
                    <div style={{
                      background: '#f3f4f6', padding: '8px 12px',
                      display: 'flex', alignItems: 'center', gap: 6,
                      borderBottom: '1px solid #e5e7eb',
                    }}>
                      {['#ef4444','#f59e0b','#22c55e'].map((c) => (
                        <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                      ))}
                      <div style={{ flex: 1, marginLeft: 8, height: 18, background: 'white', borderRadius: 4, border: '1px solid #e5e7eb' }} />
                    </div>
                    <div style={{ padding: '10px 12px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                      {['React','Python','Svelte','Node.js','PyTorch','AI','Flutter','Redis','Next.js'].map((t, i) => (
                        <div key={t} style={{
                          background: '#f9fafb', borderRadius: 6, padding: '5px 6px',
                          display: 'flex', alignItems: 'center', gap: 4,
                          border: '1px solid #f3f4f6',
                        }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: `hsl(${(i*47+260)%360},70%,60%)`, flexShrink: 0 }} />
                          <span style={{ fontSize: 8, fontWeight: 600, color: '#374151', fontFamily: 'system-ui,sans-serif' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}

      {/* ZOOM: real logo navbar fades in at top */}
      {isZoom && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 64,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center',
            padding: '0 2rem', gap: 10,
          }}
        >
          <img src="/logo.png" alt="Pradarsh" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span style={{
            fontWeight: 900, fontSize: 18,
            fontFamily: 'system-ui,sans-serif',
            background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Pradarsh</span>
        </motion.div>
      )}

      <style>{`@keyframes caretBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function IntroAnimation({ children }) {
  // Check sessionStorage SYNCHRONOUSLY before any React state.
  // This means every time Home mounts (including navigate-back), we immediately
  // know whether to skip — no flash, no re-play.
  const alreadyPlayed = typeof sessionStorage !== 'undefined'
    && sessionStorage.getItem('pradarsh_intro_played') === 'true'

  const [phase, setPhase]               = useState('splash')
  const [contentVisible, setContentVisible] = useState(alreadyPlayed)

  useEffect(() => {
    if (alreadyPlayed) return // nothing to do

    const timers = [
      setTimeout(() => setPhase('emerge'),   1800),
      setTimeout(() => setPhase('scatter'),  2700),
      setTimeout(() => setPhase('headline'), 3500),
      setTimeout(() => setPhase('zoom'),     5000),
      setTimeout(() => setContentVisible(true), 5400),
      setTimeout(() => {
        setPhase('done')
        sessionStorage.setItem('pradarsh_intro_played', 'true')
      }, 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Already played — skip directly to content, no overlay at all
  if (alreadyPlayed) return <>{children}</>

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 0 }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {phase !== 'done' && <IntroOverlay key="overlay" phase={phase} />}
      </AnimatePresence>
    </>
  )
}
