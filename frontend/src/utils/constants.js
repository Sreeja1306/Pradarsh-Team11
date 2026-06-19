export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Categories ────────────────────────────────────────────────────────────────
// Single canonical source for category names.
// Used by: Publish form, FilterPanel, FAQ/Categories section.
// "Other" is handled as a special UI token — never stored literally as a category.
export const CATEGORIES = [
  // Tech domains
  'Web Development',
  'Mobile Apps',
  'AI & Machine Learning',
  'Generative AI',
  'SaaS Products',
  'Dev Tools',
  'Open Source',
  'Cloud Computing',
  'Cyber Security',
  // Application domains
  'Education',
  'Finance',
  'Healthcare',
  'Entertainment',
  'E-Commerce',
  'Social',
  'Productivity',
  'Gaming',
  'Portfolio',
]

// ── Technologies ──────────────────────────────────────────────────────────────
// Single canonical spelling for every predefined technology.
// Rule: one entry per technology, spelled exactly as it should appear in the UI
// and be stored in the database. Free-text "Other" values are stored as-is.
//
// Filter matching is case-insensitive as a safety net, but drift is prevented
// at source because the Publish form only lets users pick from this list or type
// a genuinely new technology (not retype an existing one in a different case).
export const POPULAR_TECHNOLOGIES = [
  // Frontend
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Astro',
  // Backend
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'Spring Boot',
  // Languages
  'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C#', 'C++', 'PHP', 'Ruby',
  // Databases
  'PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Supabase', 'Firebase', 'Redis',
  // Cloud & DevOps
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify',
  // Styling
  'TailwindCSS', 'Bootstrap', 'Material UI',
  // APIs & Tools
  'GraphQL', 'REST API', 'WebSockets',
  // Mobile
  'Flutter', 'React Native', 'Swift', 'Kotlin',
  // AI / ML
  'OpenAI', 'LangChain', 'TensorFlow', 'PyTorch', 'Hugging Face',
  // Other popular
  'Unity', 'Stripe', 'Prisma',
]

export const PROJECT_STATUSES = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
}

export const ITEMS_PER_PAGE = 12
