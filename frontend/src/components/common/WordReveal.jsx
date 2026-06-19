import { motion } from 'framer-motion'

/**
 * Renders a heading with word-by-word stagger reveal animation.
 *
 * Props:
 *   segments  — array of { text: string, gradient?: boolean }
 *               Each segment is a group of words sharing a style.
 *               Words inside a segment are split by spaces and each word
 *               animates independently.
 *   className — extra classes applied to the <h1> wrapper
 *   as        — element tag, defaults to 'h1'
 *   delay     — base delay offset in seconds (default 0)
 */
export default function WordReveal({
  segments = [],
  className = 'text-4xl font-black leading-tight',
  as: Tag = 'h1',
  delay = 0,
}) {
  // Flatten all words with their segment style and compute global stagger index
  const words = []
  segments.forEach((seg) => {
    seg.text.split(/\s+/).filter(Boolean).forEach((word) => {
      words.push({ word, gradient: seg.gradient || false })
    })
  })

  // Rebuild into visual lines (each segment = one line visually)
  let wi = 0
  const lines = segments.map((seg) => {
    const segWords = seg.text.split(/\s+/).filter(Boolean)
    const lineWords = segWords.map((word) => ({
      word,
      gradient: seg.gradient || false,
      index: wi++,
    }))
    return { lineWords, gradient: seg.gradient || false }
  })

  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.lineWords.map(({ word, gradient, index }) => (
            <motion.span
              key={`${li}-${index}`}
              initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.48,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + 0.05 + index * 0.11,
              }}
              className={`inline-block mr-[0.22em] last:mr-0 ${
                gradient ? 'text-gradient' : ''
              }`}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
