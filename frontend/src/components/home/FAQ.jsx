import { Link } from 'react-router-dom'
import {
  Globe, Smartphone, Brain, Sparkles, Layers,
  User, GitBranch, Shield, Cloud, Wrench,
} from 'lucide-react'

const CATEGORIES = [
  { name: 'Web Development',       slug: 'web-development',       icon: Globe },
  { name: 'Mobile Apps',           slug: 'mobile-apps',           icon: Smartphone },
  { name: 'AI & Machine Learning', slug: 'ai-machine-learning',   icon: Brain },
  { name: 'Generative AI',         slug: 'generative-ai',         icon: Sparkles },
  { name: 'SaaS Products',         slug: 'saas-products',         icon: Layers },
  { name: 'Portfolio',             slug: 'portfolio',             icon: User },
  { name: 'Open Source',           slug: 'open-source',           icon: GitBranch },
  { name: 'Cyber Security',        slug: 'cyber-security',        icon: Shield },
  { name: 'Cloud Computing',       slug: 'cloud-computing',       icon: Cloud },
  { name: 'Dev Tools',             slug: 'dev-tools',             icon: Wrench },
]

function CategoryCard({ name, slug, icon: Icon }) {
  return (
    <Link
      to={`/explore?category=${encodeURIComponent(name)}`}
      className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100
        shadow-sm hover:shadow-card transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500
        flex items-center justify-center shadow-glow group-hover:shadow-glow-pink transition-all duration-200">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{name}</span>
    </Link>
  )
}

export default function FAQ() {
  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Categories</h2>
          <p className="text-gray-500 text-base">Find projects across every domain.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} {...cat} />
          ))}
        </div>
      </div>
    </section>
  )
}
