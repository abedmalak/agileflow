# Capstone Report — Chapter Versions

This folder contains three versions of the capstone chapters. They're listed here from oldest to most polished.

## What's where

### `chapter*.md` (root)
The original chapter drafts. These have outdated facts: Claude 3.5 Haiku instead of 4.5, Llama 3.3 8B (which doesn't exist) instead of 70B, Gemini 2.0 Flash instead of 2.5, the wrong table count, and a few other small errors. Kept for reference only.

### `final/`
The factually corrected versions. Every claim was verified against the codebase. Numbers, model IDs, tool counts, table counts, and feature descriptions all match what's actually built. Prose style was untouched, so these still read like a first draft.

### `final-v2/`
The corrected versions after a humanization pass. Same factual content as `final/`, but with the AI writing tells removed: em dashes, copula avoidance, significance inflation, inline-header bullet patterns, AI vocabulary, filler phrases, and so on. Use these for submission.

## What changed between versions

Compared to the originals:

- **Models:** GPT-4o-mini, Llama 3.3 70B, Gemini 2.5 Flash, Claude Haiku 4.5 (correct OpenRouter IDs: `claude-haiku-4.5` with a dot, not a hyphen; `llama-3.3-70b-instruct:free` since Llama 3.3 only ships in 70B; `gemini-2.5-flash` since 2.0 Flash is being retired).
- **Tools:** 16 AI tool definitions in `src/lib/ai-tools.js`, matching the report. The 3 that were claimed but missing (`getPageContext`, `navigateToPage`, `explainAnalytics`) are now implemented.
- **Tables:** 10 total (8 core in `schema.sql` plus 2 AI session tables in `ai-sessions-schema.sql`), 34 RLS policies, 7 JSONB columns, 8 trigger functions.
- **Formula weights:** 40% competency, 35% availability, 25% performance. The code now matches the report.
- **Frontend counts:** 27 Radix packages, 49 shadcn components, 12 pages.
- **Testing:** Four layers (Vitest, Playwright, axe-core, Playwright responsive viewports); accessibility and responsive coverage scoped to login page only, since that's what's actually tested.
- **Performance:** "<200ms" framed as a design target, since no formal benchmark was recorded.
- **RBAC:** Three system roles (admin, member, viewer) plus three board roles (owner, editor, viewer). The "super-admin" tier is implemented as a hardcoded email match in `src/lib/admin-config.js`, not as a database role.
- **Custom middleware:** Removed the "was replaced" framing from any chapter that had it. There never was a custom Node.js middleware in this project; it was a rejected design alternative.
