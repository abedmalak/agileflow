# 5. system integration and evaluation

## 5.1. system integration

AgileFlow connects three sub-systems (the React SPA, Supabase, and OpenRouter) into a working platform. This section covers the integration architecture, data flow between sub-systems, and strategies for reliable cross-system communication.

### 5.1.1. integration architecture

The architecture is client-centric: the React SPA acts as the orchestration layer, and all cross-system communication originates from the browser.

```
User <-> React SPA <-> Supabase (Data + Auth)
                   <-> OpenRouter (AI)
```

| Integration | From | To | Protocol | Auth Method |
|---|---|---|---|---|
| Data CRUD | React SPA | Supabase PostgREST | HTTPS/REST | JWT (Authorization header) |
| Authentication | React SPA | Supabase Auth | HTTPS/REST | Email/password, returns JWT |
| AI Chat | React SPA | OpenRouter API | HTTPS/REST + SSE | API key (Authorization header) |
| AI Tool Execution | React SPA | Supabase PostgREST | HTTPS/REST | JWT (same session) |

The most complex integration point is the AI tool-calling loop, which bridges all three sub-systems:

1. User sends a message in the Chat page (Frontend).
2. Frontend constructs a prompt with system instructions, conversation history, and tool definitions.
3. Frontend sends the prompt to OpenRouter API (AI Engine) with the user's selected model.
4. OpenRouter returns a response containing tool_calls (e.g., `createTask`).
5. Frontend parses the tool calls and executes them against Supabase (Backend) using the entity service layer.
6. Supabase validates the JWT, applies RLS, executes the query, and returns results.
7. Frontend sends the tool results back to OpenRouter for a follow-up response.
8. Steps 4-7 repeat for up to 3 rounds.
9. The final text response is streamed to the user and persisted to the ai_messages table in Supabase.

This pattern keeps the AI engine stateless (no server-side session) while letting it interact with the user's data through the same authorization context as direct UI actions.

### 5.1.2. state management integration

The application uses TanStack React Query as its state management layer. All data fetched from Supabase is cached with configurable stale times. When the AI creates a task via tool calling, React Query's cache is invalidated for the affected board, triggering a background refetch that updates the UI across all views. Drag-and-drop operations update the UI immediately via cache manipulation, then send the mutation to Supabase; if the server rejects the change (for example, an RLS violation), the cache rolls back to the previous state. Queries are also refetched on window focus and at configurable intervals, keeping data fresh in multi-user scenarios.

### 5.1.3. authentication integration

Authentication state flows through all three sub-systems:

1. The user submits credentials to Supabase Auth, which returns a JWT and refresh token.
2. The Supabase JS SDK stores tokens in `localStorage` and auto-refreshes before expiry.
3. Every Supabase query automatically includes the JWT, enabling RLS policies to identify the user.
4. The OpenRouter API uses a separate API key (not user-specific), but tool calls execute under the user's Supabase session, inheriting all RLS restrictions.
5. Calling `supabase.auth.signOut()` clears tokens, and AuthContext redirects to the login page.

### 5.1.4. role-based access control (RBAC) integration

RBAC is enforced at three layers:

| Layer | Mechanism | Enforcement |
|---|---|---|
| Database | Supabase RLS policies | Prevents unauthorized SELECT/INSERT/UPDATE/DELETE at the query level. |
| Service | Entity service auth checks | Throws `Authentication required` error if no valid session exists. |
| Frontend | `usePermissions` hook | Conditionally renders UI elements (buttons, menus, pages) based on user role. |

The four permission tiers are:

| Role | Capabilities |
|---|---|
| Viewer | Read-only access to boards, items, analytics. Cannot create or modify data. |
| Member | Full CRUD on own boards and items. Can use AI assistant. Cannot delete others' boards. |
| Admin | All member capabilities plus can delete any board, manage board settings, view admin panel. |
| Super Admin | All admin capabilities plus can manage user roles, invite members, access system settings. |

## 5.2. system evaluation

### 5.2.1. testing infrastructure

AgileFlow uses a four-layer testing strategy.

Layer 1 covers unit tests using Vitest ^4.1.0 with @testing-library/react ^16.3.2. These tests target entity service CRUD operations (Board, Item), utility functions, and authentication helpers (session handling, signup, admin email lookup, password reset delivery). The Supabase client is mocked to avoid hitting the real database. Tests live in `tests/unit/` and run with `npm run test`.

Layer 2 covers end-to-end tests using @playwright/test ^1.58.2. These run full user flows including login/auth, board creation, and navigation across Chromium, Firefox, and WebKit. Auth credentials come from environment variables. Tests live in `tests/e2e/` and run with `npm run test:e2e`.

Layer 3 covers accessibility audits using @axe-core/playwright ^4.11.1 against WCAG 2.1 Level AA (tags: wcag2a, wcag2aa, wcag21a, wcag21aa). The audit covers the login page (`/login`) and checks form labels, color contrast, keyboard accessibility, image alt text, and heading hierarchy. Heading-order violations are logged but not treated as failures, as this is a known acceptable pattern in single-page applications. Tests live in `tests/accessibility/` and run with `npm run test:a11y`.

Layer 4 covers responsive design tests using Playwright viewports across 6 breakpoints: Mobile Portrait (375x667), Mobile Landscape (667x375), Tablet Portrait (768x1024), Tablet Landscape (1024x768), Desktop (1280x720), and Desktop Large (1920x1080). Tests check layout overflow, form usability, font size, touch target size, and off-screen content on the login page (`/login`). Tests live in `tests/responsive/` and run with `npm run test:responsive`.

### 5.2.2. test coverage matrix

| Module | Unit Tests | E2E Tests | A11y Audit | Responsive |
|---|---|---|---|---|
| Authentication (Login/Signup) | Entity mock + auth helpers | Full flow | Login page | Login page |
| Dashboard | - | Navigation | - | - |
| Board CRUD | Entity mock | Create/edit/delete | - | - |
| Board Views (Kanban/Timeline/Calendar) | - | View switching | - | - |
| Drag & Drop | - | DnD reorder | - | - |
| Backlog & Sprint Planning | Entity mock | Story create | - | - |
| Calendar Events | Entity mock | Event create | - | - |
| Analytics | - | Chart render | - | - |
| AI Chat | - | Send message | - | - |
| Help Center | - | Navigation | - | - |
| Admin Panel | - | Role check | - | - |
| Settings | - | Theme toggle | - | - |

### 5.2.3. verification results

**Software Verification Plan (SVP) results**

The SVP (`/.claude/docs/verification-plan.md`) defines functional test cases for every feature. Key results:

| Feature Area | Test Cases | Status | Notes |
|---|---|---|---|
| User Authentication | 5 | Pass | Login, signup, logout, session expiry, error handling |
| Board Management | 8 | Pass | CRUD, column types, groups, view switching |
| Task Operations | 7 | Pass | Create, edit, delete, DnD, inline editing, filters |
| Sprint Planning | 5 | Pass | Create sprint, assign stories, capacity validation |
| Analytics Dashboard | 6 | Pass | All chart types render, "Ask AI" buttons functional |
| AI Assistant | 10 | Pass | Tool calling, streaming, fallback, session persistence |
| RBAC | 4 | Pass | Viewer/member/admin/super-admin permissions enforced |
| Calendar | 4 | Pass | Event CRUD, monthly view, date navigation |
| Help Center | 3 | Pass | Article display, search, AI integration |
| Dark Mode | 2 | Pass | All pages render correctly in dark theme |

**Software Validation Plan (SVaP) results**

The SVaP (`/.claude/docs/validation-plan.md`) defines non-functional acceptance criteria:

| Category | Metric | Target | Actual | Status |
|---|---|---|---|---|
| Performance | Dashboard load time | < 2s | Design target (no formal benchmark recorded) | Target |
| Performance | DnD feedback latency | < 100ms | Instant (optimistic) | Pass |
| Performance | API response time | < 200ms | Design target (no formal benchmark recorded) | Target |
| Performance | AI first token | < 3s | Design target (no formal benchmark recorded) | Target |
| Responsive | Mobile (375px) | No overflow, touch targets | Verified on /login page | Pass |
| Responsive | Tablet (768px) | Condensed layout | Verified on /login page | Pass |
| Responsive | Desktop (1280px) | Full layout | Verified on /login page | Pass |
| Accessibility | WCAG 2.1 AA | Zero critical/serious violations | Verified on /login page | Pass |
| Security | RLS data isolation | No cross-user data leaks | Verified | Pass |
| Security | Auth session handling | Proper token lifecycle | Verified | Pass |

> **Note on performance metrics:** The targets above are design targets defined in the validation plan. No automated performance benchmarks (Lighthouse, profiler recordings, or network traces) were formally captured during this development phase. The performance audit workflow (`tests/workflows/performance-audit.md`) documents the procedure for running these measurements in future.

> **Note on accessibility scope:** The automated WCAG 2.1 AA audit covers the login page only. The audit checks for critical and serious violations (form labels, color contrast, keyboard focus, image alt text). Heading-order issues are logged and acknowledged but not enforced as failures. A full-application accessibility audit is recommended before production deployment.

### 5.2.4. known limitations

| # | Limitation | Impact | Mitigation |
|---|---|---|---|
| 1 | No real-time collaboration | Users must refresh to see others' changes | React Query refetch on focus partially addresses this. Supabase real-time subscriptions can be added in future. |
| 2 | AI rate limits | Free models have daily request limits | Model cascade provides fallback. Paid credits (GPT-4o-mini) have 1,000 req/day. |
| 3 | Supabase free tier auto-pause | Project pauses after 7 days of inactivity | Team accesses app at least weekly. Wake-up takes ~60 seconds. |
| 4 | No offline support | App requires internet connection | SPA architecture with local caching (React Query) provides fast perceived performance. |
| 5 | Client-side analytics computation | Large datasets (1,000+ tasks) may slow analytics | Current usage (50-200 tasks) performs well within target. Pagination can be added for scale. |
| 6 | Automated test coverage limited to /login page | Responsive and accessibility tests do not cover authenticated pages | Manual verification was performed for authenticated pages; automated coverage can be extended with authenticated Playwright sessions. |
