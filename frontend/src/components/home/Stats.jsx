import { useEffect, useState } from 'react'
import { Layers, Users, Tag } from 'lucide-react'
import projectService from '../../services/projectService'

const DEFAULT_STATS = {
  total_projects: 0,
  total_developers: 0,
  total_categories: 0,
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-center">
        <div className="text-2xl font-black text-gray-900">{value}</div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  )
}

export default function Stats() {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectService.getStats()
      .then(setStats)
      .catch(() => setStats(DEFAULT_STATS))
      .finally(() => setLoading(false))
  }, [])

  const formatNumber = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    if (n === 0 && loading) return '...'
    return `${n}+`
  }

  const items = [
    {
      icon: Layers,
      value: formatNumber(stats.total_projects),
      label: 'Projects',
      color: 'bg-gradient-to-br from-primary-500 to-primary-600',
    },
    {
      icon: Users,
      value: formatNumber(stats.total_developers),
      label: 'Developers',
      color: 'bg-gradient-to-br from-accent-500 to-accent-600',
    },
    {
      icon: Tag,
      value: `${stats.total_categories}+`,
      label: 'Categories',
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-8">
        {items.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}
