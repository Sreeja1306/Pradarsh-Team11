# Pradarsh — Testing Checklist

## Authentication

- [ ] Register with email + password → confirmation email sent
- [ ] Login with email + password → session established, navbar updates
- [ ] Login with Google OAuth → redirects, returns logged in
- [ ] Login with GitHub OAuth → redirects, returns logged in
- [ ] Register with existing email → error shown
- [ ] Login with wrong password → error shown
- [ ] Logout → session cleared, redirected to home
- [ ] Navigate to `/publish` without login → redirected to `/login`
- [ ] Navigate to `/dashboard` without login → redirected to `/login`

## Home Page

- [ ] Hero section renders with badge, headline, CTA buttons
- [ ] Stats show live counts from database (not zeros if data exists)
- [ ] All 10 category cards render with icons
- [ ] Category card click → navigates to `/explore?category=...`
- [ ] "Explore Projects" CTA → navigates to `/explore`
- [ ] "Publish Your Project" CTA → navigates to `/publish`
- [ ] Footer renders with correct links

## Explore / Search

- [ ] All published projects load on initial visit
- [ ] Search by project name → filtered results shown
- [ ] Search by developer name → developer's projects shown
- [ ] Select category chip → only that category shown
- [ ] Select technology filter → matching projects shown
- [ ] Combine search + category + tech → all filters applied
- [ ] Clear all filters → all projects reload
- [ ] No results → empty state shown
- [ ] Pagination works (next/prev page buttons)
- [ ] URL updates with query params (shareable link)
- [ ] Total project count shown in subtitle

## Project Card

- [ ] Thumbnail image shown (or gradient placeholder if none)
- [ ] Category badge overlays thumbnail
- [ ] Arrow icon appears on hover
- [ ] Tech tags show (max 3 + overflow count)
- [ ] Author avatar / initials shown
- [ ] Click → navigates to `/project/:id`

## Project Details

- [ ] Hero thumbnail renders
- [ ] Title, description, category, tech tags shown
- [ ] GitHub button opens correct URL in new tab
- [ ] Live Demo button opens correct URL in new tab
- [ ] Screenshots gallery renders with prev/next navigation
- [ ] Thumbnail strip updates main image on click
- [ ] View count increments on each visit
- [ ] Developer card shows avatar, name, @username
- [ ] "View Profile" link navigates to `/developer/:username`
- [ ] Owner sees "Edit" link (other users don't)

## Publish

- [ ] Unauthenticated → "Sign in to publish" card shown
- [ ] Authenticated → full publish form shown
- [ ] Submit without title → validation error
- [ ] Submit without thumbnail → validation error
- [ ] Invalid GitHub URL → validation error
- [ ] Upload thumbnail → preview shown
- [ ] Upload screenshots → grid shown with remove buttons
- [ ] Successful publish → redirected to new project's detail page
- [ ] New project appears in Explore

## Dashboard

- [ ] Stats strip shows correct total/published/draft counts
- [ ] All user's projects listed (any status)
- [ ] Edit button → navigates to `/edit/:id`
- [ ] Delete button → confirmation modal shown
- [ ] Confirm delete → project removed from list
- [ ] Cancel delete → modal closes, project remains
- [ ] Empty state shown if no projects

## Edit Project

- [ ] Form pre-populated with existing project data
- [ ] Technologies chips pre-populated
- [ ] Existing thumbnail shown in preview
- [ ] Save changes → project updated, redirected to dashboard
- [ ] Non-owner visiting `/edit/:id` → access denied message
- [ ] Backend returns 403 for non-owner update attempt

## Developer Profile

- [ ] Valid username → profile loads with avatar, name, bio
- [ ] Social links render and open correctly
- [ ] Published projects grid shown
- [ ] Project count badge correct
- [ ] Invalid username → "Developer not found" + back link

## Navigation

- [ ] Navbar active state correct on each route
- [ ] Logo click → home
- [ ] Mobile hamburger menu works
- [ ] Avatar dropdown shows Dashboard + My Profile + Sign Out
- [ ] 404 page shows for unknown routes

## Responsiveness

- [ ] Home page — mobile (375px)
- [ ] Explore page — tablet (768px)
- [ ] Project Details — desktop (1280px)
- [ ] Navbar hamburger on mobile
- [ ] Project grid collapses to 1 col on mobile, 2 on tablet, 3 on desktop
