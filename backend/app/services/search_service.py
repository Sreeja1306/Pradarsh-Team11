from app.database.supabase import supabase
from fastapi import HTTPException
from typing import Optional, List

# Canonical predefined technology list — must stay in sync with frontend constants.js
PREDEFINED_TECHNOLOGIES = [
    'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Astro',
    'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'Spring Boot',
    'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C#', 'C++', 'PHP', 'Ruby',
    'PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Supabase', 'Firebase', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify',
    'TailwindCSS', 'Bootstrap', 'Material UI',
    'GraphQL', 'REST API', 'WebSockets',
    'Flutter', 'React Native', 'Swift', 'Kotlin',
    'OpenAI', 'LangChain', 'TensorFlow', 'PyTorch', 'Hugging Face',
    'Unity', 'Stripe', 'Prisma',
]

# Sentinel values sent from the frontend for "Other" filters
OTHER_TECH_SENTINEL = '__other_tech__'
OTHER_CAT_SENTINEL  = '__other__'

# Lowercase set for fast membership checks
PREDEFINED_TECH_SET = {t.lower() for t in PREDEFINED_TECHNOLOGIES}
PREDEFINED_CAT_SET  = {
    'web development', 'mobile apps', 'ai & machine learning', 'generative ai',
    'saas products', 'portfolio', 'open source', 'cyber security',
    'cloud computing', 'dev tools',
    'education', 'finance', 'healthcare', 'entertainment',
    'e-commerce', 'social', 'productivity', 'gaming',
}


class SearchService:
    """
    Handles search and filter queries for projects.

    Technology filtering uses OR logic (project must contain ANY selected tech).
    The __other_tech__ sentinel matches projects whose entire tech stack falls
    outside the predefined list (case-insensitive).

    Category __other__ sentinel matches projects whose category is not in the
    predefined category list.
    """

    def search_projects(
        self,
        q: Optional[str] = None,
        category: Optional[str] = None,
        technologies: Optional[List[str]] = None,
        page: int = 1,
        limit: int = 12,
    ) -> dict:
        try:
            offset = (page - 1) * limit

            # ── Separate sentinels from real filter values ────────────────────
            want_other_tech = False
            want_other_cat  = False
            real_techs: List[str] = []

            if technologies:
                for t in technologies:
                    if t == OTHER_TECH_SENTINEL:
                        want_other_tech = True
                    else:
                        real_techs.append(t)

            real_category = None
            if category:
                if category == OTHER_CAT_SENTINEL:
                    want_other_cat = True
                elif category.lower() != 'all':
                    real_category = category

            # ── Fetch all published projects (we'll filter in Python for
            #    OR-tech and "Other" logic — Supabase PostgREST doesn't expose
            #    array-overlap OR in a single query cleanly without RPC) ───────
            #
            # For datasets at typical indie-project scale (< 10k rows) fetching
            # all published projects and filtering in Python is reliable and fast.
            # If the dataset grows to 50k+ rows, move to a Postgres function/RPC.

            all_query = (
                supabase.table("projects")
                .select("*, profiles(full_name, username, avatar_url)")
                .eq("status", "published")
            )

            # ── Text search: restrict candidate set by IDs ────────────────────
            if q and q.strip():
                q_clean = q.strip()

                title_resp = (
                    supabase.table("projects")
                    .select("id")
                    .eq("status", "published")
                    .ilike("title", f"%{q_clean}%")
                    .execute()
                )
                title_ids = [p["id"] for p in (title_resp.data or [])]

                dev_resp = (
                    supabase.table("profiles")
                    .select("id")
                    .ilike("full_name", f"%{q_clean}%")
                    .execute()
                )
                dev_user_ids = [p["id"] for p in (dev_resp.data or [])]

                dev_project_ids = []
                if dev_user_ids:
                    dp_resp = (
                        supabase.table("projects")
                        .select("id")
                        .eq("status", "published")
                        .in_("user_id", dev_user_ids)
                        .execute()
                    )
                    dev_project_ids = [p["id"] for p in (dp_resp.data or [])]

                all_matching_ids = list(set(title_ids + dev_project_ids))
                if not all_matching_ids:
                    return {"data": [], "total": 0}

                all_query = all_query.in_("id", all_matching_ids)

            # Fetch everything (no server-side tech/cat filter — done in Python)
            response = all_query.execute()
            all_projects = response.data or []

            # ── Python-side filtering ─────────────────────────────────────────

            def matches_category(p: dict) -> bool:
                cat = (p.get("category") or "").strip()
                if want_other_cat:
                    return cat.lower() not in PREDEFINED_CAT_SET
                if real_category:
                    return cat.lower() == real_category.lower()
                return True  # no category filter

            def matches_tech(p: dict) -> bool:
                # No tech filter at all → match everything
                if not real_techs and not want_other_tech:
                    return True

                raw = p.get("technologies") or []
                # Normalise: could be a list or a comma string depending on storage
                if isinstance(raw, str):
                    project_techs = [t.strip() for t in raw.split(",") if t.strip()]
                else:
                    project_techs = [str(t).strip() for t in raw if t]

                project_tech_set = {t.lower() for t in project_techs}

                def tech_matches_filter(project_tech_lower: str, filter_tech_lower: str) -> bool:
                    """
                    Match a project's stored tech value against a filter selection.

                    Rules:
                    - Exact match always wins (react == react)
                    - Filter is a prefix of stored value AND stored value either ends there
                      or is followed by a non-alphanumeric char — so 'react' matches 'react.js'
                      but NOT 'react native' or 'reactive'
                    - Stored value is contained in filter (handles abbreviations like
                      'node' stored when filter is 'node.js')

                    Examples:
                      filter='react',        stored='react'        → True  (exact)
                      filter='react',        stored='react.js'     → True  (react + dot separator)
                      filter='react',        stored='react native' → False (react + space + word)
                      filter='react native', stored='react native' → True  (exact)
                      filter='react native', stored='react'        → False
                      filter='node.js',      stored='node'         → True  (stored in filter)
                      filter='python',       stored='python 3'     → True  (python + space is ok)
                    """
                    if filter_tech_lower == project_tech_lower:
                        return True

                    # stored value is wholly contained in filter (e.g. 'node' in 'node.js')
                    if project_tech_lower in filter_tech_lower:
                        return True

                    # filter is a prefix of stored, but only if followed by a non-alpha char
                    # This allows react→react.js but blocks react→react native
                    if project_tech_lower.startswith(filter_tech_lower):
                        next_char_idx = len(filter_tech_lower)
                        if next_char_idx < len(project_tech_lower):
                            next_char = project_tech_lower[next_char_idx]
                            # Allow . (react.js), digit (python3), + (c++)
                            # Block space (react native), letter (reactive)
                            return not (next_char.isalpha() or next_char == ' ')
                        return True  # exact length match already handled above

                    return False

                # AND logic — project must contain ALL selected filter techs
                # (each filter tech must match at least one of the project's stored techs)
                predefined_match = all(
                    any(tech_matches_filter(pt, rt.lower()) for pt in project_tech_set)
                    for rt in real_techs
                ) if real_techs else False

                # "Other" match — project has at least one tech that does NOT match
                # any predefined technology (even with substring matching).
                # A tech is "predefined" if it substring-matches any entry in PREDEFINED_TECH_SET.
                def is_predefined(project_tech_lower: str) -> bool:
                    return any(
                        tech_matches_filter(project_tech_lower, pred)
                        for pred in PREDEFINED_TECH_SET
                    )

                other_match = (
                    want_other_tech and
                    any(not is_predefined(pt) for pt in project_tech_set)
                )

                if real_techs and want_other_tech:
                    # AND logic: project must satisfy ALL predefined selections
                    # AND also have at least one non-predefined technology
                    return predefined_match and other_match
                if real_techs:
                    return predefined_match
                return other_match

            filtered = [
                p for p in all_projects
                if matches_category(p) and matches_tech(p)
            ]

            # ── Flatten author info ───────────────────────────────────────────
            results = []
            for p in filtered:
                profile = p.pop("profiles", {}) or {}
                p["author_name"]     = profile.get("full_name", "")
                p["author_username"] = profile.get("username", "")
                p["author_avatar"]   = profile.get("avatar_url", "")
                results.append(p)

            # Sort by created_at descending (already ordered by Supabase, but re-sort
            # after Python filtering to be safe)
            results.sort(key=lambda x: x.get("created_at") or "", reverse=True)

            total = len(results)

            # ── Paginate ──────────────────────────────────────────────────────
            page_data = results[offset: offset + limit]

            return {"data": page_data, "total": total}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


search_service = SearchService()
