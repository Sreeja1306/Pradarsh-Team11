# Pradarsh — Presentation Content

## Slide 1: Title
**Pradarsh**
*The launchpad for developer projects*
Showcase. Discover. Get Inspired.

---

## Slide 2: Problem Statement
- Developers build amazing projects but lack a dedicated platform to showcase them
- GitHub is for code, LinkedIn is for jobs — neither is designed for project discovery
- No easy way for the community to find, filter, and get inspired by real developer work

---

## Slide 3: Solution
**Pradarsh** is a developer-first project showcase platform where:
- Developers publish their projects with rich details (demo, tech stack, screenshots)
- Anyone can explore and discover projects by category, technology, or developer
- The community grows through authentic showcasing, not self-promotion

---

## Slide 4: Key Features
1. **Project Showcase** — title, description, thumbnail, screenshots, GitHub + demo links
2. **Smart Search & Filter** — search by project name OR developer name, filter by category + technology
3. **Developer Profiles** — public portfolio page for every developer
4. **Authentication** — Email/Password + Google + GitHub OAuth
5. **Live Stats** — real-time platform statistics (projects, developers, categories)
6. **Dashboard** — manage your own projects with full CRUD

---

## Slide 5: Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + React Router v6 + Vite   |
| Styling    | TailwindCSS + Custom design system  |
| Backend    | Python + FastAPI                    |
| Database   | Supabase (PostgreSQL)               |
| Auth       | Supabase Auth (Email + OAuth)       |
| Storage    | Supabase Storage                    |
| Animation  | Framer Motion + CSS transitions     |

---

## Slide 6: Architecture
```
React Frontend
    │── Supabase Auth (OAuth + Session)
    │── Axios → FastAPI Backend
                    │── JWT Verification
                    │── Supabase PostgreSQL (CRUD)
                    └── Supabase Storage (Images)
```

---

## Slide 7: Database Schema
- **profiles** — developer info (name, avatar, bio, social links)
- **projects** — project data (title, description, category, technologies[], thumbnails)
- **categories** — 10 predefined categories
- RLS policies ensuring owner-only writes
- Auto-create profile trigger on signup

---

## Slide 8: Pages Built
1. Home — Hero + Stats + Categories + CTA
2. Explore — Search + Filter + Paginated Grid
3. Project Details — Full project view + screenshots gallery
4. Developer Profile — Public portfolio page
5. Publish — Project creation form with file upload
6. Dashboard — Manage own projects (edit + delete)
7. Login / Register — Email + Google + GitHub OAuth

---

## Slide 9: Design System
- **Color palette**: Purple (`#8B5CF6`) + Pink (`#EC4899`) gradient
- **Cards**: White with subtle shadows + hover lift
- **Glassmorphism** on floating elements
- **Typography**: Inter font, consistent weight hierarchy
- **Responsive**: Mobile → Tablet → Desktop
- **Animations**: Smooth transitions, skeleton loaders

---

## Slide 10: Team
Team 11 — Built with React + FastAPI + Supabase
