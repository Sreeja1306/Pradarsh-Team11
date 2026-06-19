import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import RotatingGlobe from './RotatingGlobe'

const EASE = [0.22, 1, 0.36, 1]

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay } },
})
const slideRight = {
  hidden:  { opacity: 0, x: 56, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: EASE, delay: 0.25 } },
}
const badgeStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.55 } },
}
const badgePop = {
  hidden:  { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } },
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-16 lg:pb-24">

      {/* Soft ambient glows */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-accent-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: headline + CTAs ── */}
          <div className="space-y-7">

            {/* Pill badge */}
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              The launchpad for developer projects
            </motion.div>

            {/* Headline — word-by-word stagger reveal */}
            {(() => {
              const lines = [
                { words: ['Showcase.'], gradient: false },
                { words: ['Discover.'], gradient: false },
                { words: ['Get', 'Inspired.'], gradient: true },
              ]
              // Flatten to get global word index for stagger timing
              let wordIndex = 0
              return (
                <h1 className="text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight">
                  {lines.map((line, li) => (
                    <span key={li} className="block">
                      {line.words.map((word) => {
                        const delay = 0.06 + wordIndex++ * 0.12
                        return (
                          <motion.span
                            key={word + li}
                            initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
                            className={`inline-block mr-[0.22em] last:mr-0 ${
                              line.gradient ? 'text-gradient' : 'text-gray-900'
                            }`}
                          >
                            {word}
                          </motion.span>
                        )
                      })}
                      {/* Blinking caret after last word of last line */}
                      {line.gradient && (
                        <span
                          className="inline-block w-[3px] h-[0.82em] ml-1 align-middle rounded-sm"
                          style={{
                            background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
                            animation: 'caretBlink 1.1s step-end infinite',
                          }}
                        />
                      )}
                    </span>
                  ))}
                </h1>
              )
            })()}

            {/* Subtext */}
            <motion.p
              variants={fadeUp(0.45)}
              initial="hidden"
              animate="visible"
              className="text-gray-500 text-lg leading-relaxed max-w-md"
            >
              Pradarsh is a platform for developers to showcase their projects
              and portfolios and connect with the community.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp(0.6)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <Link to="/explore" className="btn-primary text-base px-7 py-3">
                Explore Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register" className="btn-outline text-base px-7 py-3">
                Join Now
              </Link>
            </motion.div>
          </div>

          {/* ── Right: rotating globe ── */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              variants={slideRight}
              initial="hidden"
              animate="visible"
              className="relative flex items-center justify-center"
            >
              {/* Soft glow behind globe */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 340, height: 340,
                  background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(236,72,153,0.10) 50%, transparent 75%)',
                  filter: 'blur(24px)',
                }}
              />

              <RotatingGlobe size={340} />

              {/* PRADARSH wordmark centred over the globe */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              >
                <span
                  style={{
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontFamily: 'system-ui, sans-serif',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 16px rgba(139,92,246,0.45))',
                    zIndex: 10,
                  }}
                >
                  PRADARSH
                </span>
              </div>

              {/* Floating badges */}
              <motion.div variants={badgeStagger} initial="hidden" animate="visible">
                <motion.div
                  variants={badgePop}
                  className="absolute -top-2 -left-4 glass rounded-xl px-3 py-1.5 shadow-card
                    flex items-center gap-1.5"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs font-semibold text-gray-700">&lt;/&gt; React</span>
                </motion.div>

                <motion.div
                  variants={badgePop}
                  className="absolute -bottom-2 -right-4 glass rounded-xl px-3 py-1.5 shadow-card
                    flex items-center gap-1.5"
                >
                  <div className="w-2 h-2 rounded-full bg-accent-400" />
                  <span className="text-xs font-semibold text-gray-700">+ AI Tools</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes caretBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
