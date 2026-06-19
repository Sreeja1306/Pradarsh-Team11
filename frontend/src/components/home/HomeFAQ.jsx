import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What is Pradarsh?',
    a: 'Pradarsh is a showcase platform built for developers. You can publish your projects with a title, description, demo link, thumbnail, and tech stack — and the community can discover, explore, and get inspired by what you\'ve built. Think of it as your developer portfolio, but social.',
  },
  {
    q: 'How do I publish a project?',
    a: 'Create a free account, then click "Publish" in the navbar. Fill in your project title, description, category, tech stack, a live demo URL, and a thumbnail image. Hit publish — your project goes live immediately and is searchable by anyone on the Explore page.',
  },
  {
    q: 'Is Pradarsh free to use?',
    a: 'Yes, completely free. Creating an account, publishing projects, and browsing the explore page costs nothing. There are no limits on the number of projects you can publish.',
  },
  {
    q: 'How does the Explore page and filtering work?',
    a: 'The Explore page lists all published projects. You can filter by category using the horizontal chip bar at the top, or by technology using the sidebar on the left — just click any tech to toggle it on or off. Multiple technologies use AND logic, so selecting React + Python shows only projects that use both. You can also use the search bar to find projects by title or developer name.',
  },
  {
    q: 'What is the "Other" filter for technologies and categories?',
    a: 'Clicking "Other" in the technology or category filter shows projects whose tech stack or category falls outside the predefined list — projects where the developer typed in a custom value when publishing. It\'s a catch-all for anything not covered by the standard tags.',
  },
  {
    q: 'Do I need an account to browse projects?',
    a: 'No. Anyone can browse and search the Explore page without signing in. You only need an account to publish your own projects or build a developer profile.',
  },
  {
    q: 'Can I edit or delete a project after publishing?',
    a: 'Yes. Go to your Dashboard to see all your projects. From there you can edit any project\'s details — title, description, thumbnail, tech stack, demo URL — or delete it entirely. Changes go live immediately.',
  },
  {
    q: 'What makes a good project listing?',
    a: 'A clear title, a one or two sentence description that explains what the project does and who it\'s for, a working live demo link, and a sharp thumbnail go a long way. Adding an accurate tech stack helps your project show up in the right filters.',
  },
]

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        open
          ? 'border-primary-200 bg-primary-50/40 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
        aria-expanded={open}
      >
        {/* Left accent bar when open */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`w-1 self-stretch rounded-full flex-shrink-0 transition-all duration-300 ${
              open
                ? 'bg-gradient-to-b from-primary-500 to-accent-500 opacity-100'
                : 'bg-transparent opacity-0'
            }`}
            style={{ minHeight: 20 }}
          />
          <span className={`font-semibold text-base leading-snug transition-colors ${
            open ? 'text-primary-700' : 'text-gray-900'
          }`}>
            {question}
          </span>
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 transition-colors ${
            open ? 'text-primary-500' : 'text-gray-400'
          }`} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-5 pl-[4.5rem] text-gray-600 text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HomeFAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
            bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold
            uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Questions &{' '}
            <span className="text-gradient">Answers</span>
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Everything you need to know before you dive in.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((item) => (
            <FAQItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
