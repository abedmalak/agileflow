# 6. conclusion and future work

## 6.1. summary

AgileFlow is a cloud-native Agile project management platform built as a React SPA with a Supabase PostgreSQL backend, deployed on Vercel. It brings together task tracking, sprint planning, analytics, and an AI assistant in one application.

The board system supports three views (Kanban, Timeline, Calendar) across 11 column types. The AI assistant uses OpenRouter's multi-model API to handle 16 tool-calling operations, including task creation, sprint suggestions, and user assignment, with streaming responses and persistent chat history. Security runs at three layers: Row Level Security on every database table, service-level checks, and frontend guards, with both system roles (admin/member/viewer) and board roles (owner/editor/viewer). The test suite covers unit tests (Vitest), end-to-end tests (Playwright), accessibility audits via axe-core, and responsive design checks across 4 breakpoints. Total infrastructure cost across the three-month development period came to roughly $10-15, all on AI API credits. Everything else runs on free-tier Supabase and Vercel.

## 6.2. achievements

| Objective | Achievement |
|---|---|
| Build a production-grade Agile PM tool | Deployed at agileflow-one.vercel.app with CI/CD |
| Implement AI-powered task management | 16 tools, assignment algorithm, sprint suggestions |
| Support multiple board views | Kanban, Timeline/Gantt, Calendar all over the same data |
| Enforce data security | RLS on all 10 tables + role-based access control + JWT auth |
| Ensure software quality | 4-layer test infrastructure (unit, e2e, a11y, responsive) |
| Minimize operational costs | ~$10-15 total for 3-month development cycle |

## 6.3. lessons learned

The most useful thing RLS taught us is that you can't rely on application code alone to enforce access control. When authorization lives in the database, a bug in the application layer doesn't automatically become a data leak. We caught a few cases where a frontend edge case would have exposed the wrong records under a pure application-level approach. Moving that logic to the database removed the problem class entirely.

We went into the AI integration assuming one LLM provider would be enough. It wasn't. Models go down, rate limits get hit, free tiers change without notice. The cascading fallback across four providers (GPT-4o-mini, Llama, Gemini, Haiku) kept the assistant working through the whole development and testing period even when individual models were unavailable. If we'd hardcoded one endpoint, availability would have been noticeably worse.

JSONB columns were one of the better decisions in the schema design. Board columns, task data, and user skills all vary by board and by team, and trying to normalize all of that into fixed relational columns would have made the schema brittle. JSONB gave us the flexibility to handle variable structure without giving up foreign keys, ACID transactions, or the ability to query inside the documents when we needed to.

Optimistic UI updates made drag-and-drop feel real. The board doesn't wait for Supabase to confirm before moving a card. React Query manages the cache invalidation if the server comes back with a conflict. On a slower connection this difference is obvious, and even on a fast one users notice when a drag operation has latency. This pattern is worth the extra complexity.

## 6.4. future work

| # | Enhancement | Description | Priority |
|---|---|---|---|
| 1 | Real-time Collaboration | Implement Supabase Realtime subscriptions for live updates when multiple users edit the same board simultaneously. | High |
| 2 | Advanced AI Features | Add sprint retrospective analysis, automated task decomposition, and predictive delay warnings based on historical velocity data. | Medium |
| 3 | Mobile Application | Develop a React Native companion app for mobile task management and push notifications. | Medium |
| 4 | Gantt Chart Dependencies | Add task dependency arrows to the Timeline view, enabling critical path visualization. | Medium |
| 5 | Integration with External Tools | Connect to GitHub (issue sync), Slack (notifications), and Google Calendar (event sync) via webhooks and OAuth. | Low |
| 6 | Performance Optimization | Implement virtual scrolling for boards with 500+ tasks, lazy-load analytics charts, and add service worker caching for offline support. | Low |
| 7 | Enterprise Features | Multi-tenant workspace support, SSO/SAML authentication, audit logging, and data export (CSV/PDF). | Low |

---

# 7. REFERENCES

1. Beck, K., et al. (2001). *Manifesto for Agile Software Development*. https://agilemanifesto.org/
2. Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide*. https://scrumguides.org/
3. Anderson, D. J. (2010). *Kanban: Successful Evolutionary Change for Your Technology Business*. Blue Hole Press.
4. Meta Platforms. (2024). *React 18 Documentation*. https://react.dev/
5. Evan You et al. (2024). *Vite Build Tool Documentation*. https://vitejs.dev/
6. Supabase Inc. (2024). *Supabase Documentation: PostgreSQL, Auth, Row Level Security*. https://supabase.com/docs
7. PostgreSQL Global Development Group. (2024). *PostgreSQL 15 Documentation: Row Level Security*. https://www.postgresql.org/docs/15/ddl-rowsecurity.html
8. PostgREST Contributors. (2024). *PostgREST Documentation*. https://postgrest.org/
9. Tanstack. (2024). *TanStack React Query v5 Documentation*. https://tanstack.com/query/latest
10. Radix UI. (2024). *Radix Primitives Documentation*. https://www.radix-ui.com/
11. shadcn. (2024). *shadcn/ui Component Library*. https://ui.shadcn.com/
12. Tailwind Labs. (2024). *Tailwind CSS v3 Documentation*. https://tailwindcss.com/
13. OpenRouter. (2024). *OpenRouter API Documentation*. https://openrouter.ai/docs
14. OpenAI. (2024). *Function Calling Documentation*. https://platform.openai.com/docs/guides/function-calling
15. Anthropic. (2024). *Claude API Documentation: Tool Use*. https://docs.anthropic.com/en/docs/tool-use
16. Google DeepMind. (2024). *Gemini API Documentation*. https://ai.google.dev/docs
17. Meta AI. (2024). *Llama 3 Model Documentation*. https://llama.meta.com/
18. Vercel. (2024). *Vercel Deployment Documentation*. https://vercel.com/docs
19. Playwright. (2024). *Playwright Testing Framework Documentation*. https://playwright.dev/
20. Vitest. (2024). *Vitest Testing Framework Documentation*. https://vitest.dev/
21. Deque Systems. (2024). *axe-core Accessibility Testing Engine*. https://github.com/dequelabs/axe-core
22. W3C. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. https://www.w3.org/TR/WCAG21/
23. OWASP Foundation. (2021). *OWASP Top Ten Web Application Security Risks*. https://owasp.org/www-project-top-ten/
24. Rodriguez, M., Chen, L., & Patel, S. (2025). "AI-Augmented Task Assignment in Agile Teams: A Multi-Criteria Approach." *Journal of Software Engineering and Applications*, 18(2), 145-162.
25. Saaty, T. L. (1980). *The Analytic Hierarchy Process*. McGraw-Hill. (Referenced for MCDM methodology in the task assignment algorithm.)

---

# 8. APPENDICES

## Appendix A: database schema (ERD diagram)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   auth.users     │     │    profiles       │     │    boards        │
│ (Supabase mgd)   │     │                  │     │                  │
│ id (UUID PK)     │<────│ id (UUID PK/FK)  │     │ id (UUID PK)     │
│ email            │     │ full_name        │     │ user_id (FK)  ───│──┐
│ encrypted_pass   │     │ email            │     │ title            │  │
│ ...              │     │ avatar           │     │ description      │  │
│                  │     │ role             │     │ color, icon      │  │
│                  │     │ theme            │     │ columns (JSONB)  │  │
│                  │     │ settings (JSONB) │     │ groups (JSONB)   │  │
│                  │     │ job_title        │     │ settings (JSONB) │  │
│                  │     │ department       │     │ visibility       │  │
│                  │     │ skills (TEXT[])  │     └────────┬─────────┘  │
│                  │     │ description      │              │            │
│                  │     └──────────────────┘              │            │
│                  │                                       │            │
│                  │     ┌──────────────────┐              │            │
│                  │     │     items        │              │            │
│                  │     │ id (UUID PK)     │              │            │
│                  │     │ board_id (FK) ───│──────────────┘            │
│                  │     │ group_id         │                           │
│                  │     │ title            │     ┌──────────────────┐  │
│                  │     │ description      │     │  team_members    │  │
│                  │     │ data (JSONB)     │     │ id (UUID PK)     │  │
│                  │     │ order_index      │     │ board_id (FK) ───│──┤
│                  │     └──────────────────┘     │ user_id (FK)  ───│──┤
│                  │                              │ role             │  │
│                  │     ┌──────────────────┐     │ invited_by (FK)  │  │
│                  │<────│  calendar_events  │     └──────────────────┘  │
│                  │     │ id (UUID PK)     │                           │
│                  │     │ user_id (FK)     │     ┌──────────────────┐  │
│                  │     │ title, desc      │     │   sprints        │  │
│                  │     │ start/end_date   │     │ id (UUID PK)     │  │
│                  │     │ color, type      │     │ user_id (FK)  ───│──┤
│                  │     │ attendees (JSONB)│     │ board_id (FK) ───│──┘
│                  │     └──────────────────┘     │ name, goal       │
│                  │                              │ start/end_date   │
│                  │     ┌──────────────────┐     │ status           │
│                  │<────│  user_stories    │     │ capacity         │
│                  │     │ id (UUID PK)     │     │ committed_pts    │
│                  │     │ user_id (FK)     │     │ completed_pts    │
│                  │     │ title, desc      │     │ velocity         │
│                  │     │ priority, status │     └────────┬─────────┘
│                  │     │ story_points     │              │
│                  │     │ sprint_id (FK) ──│──────────────┘
│                  │     │ board_id (FK)    │
│                  │     │ acceptance (JSON)│
│                  │     └──────────────────┘
│                  │
│                  │     ┌──────────────────┐     ┌──────────────────┐
│                  │<────│  ai_sessions     │     │  ai_messages     │
│                  │     │ id (UUID PK)     │<────│ id (UUID PK)     │
│                  │     │ user_id (FK)     │     │ session_id (FK)  │
│                  │     │ title            │     │ role             │
│                  │     │ model            │     │ content          │
│                  │     └──────────────────┘     │ tool_calls (JSON)│
│                  │                              │ tool_results(JSON)│
│                  │     ┌──────────────────┐     │ model            │
│                  │<────│  notifications   │     │ tokens_used      │
│                  │     │ id (UUID PK)     │     └──────────────────┘
│                  │     │ user_id (FK)     │
│                  │     │ title, message   │
│                  │     │ type, is_read    │
│                  │     │ link             │
│                  │     └──────────────────┘
└──────────────────┘
```

## Appendix B: AI tool-calling sequence diagram

```
User          Frontend (React)      OpenRouter API       Supabase
 |                  |                     |                  |
 |  "Create a task  |                     |                  |
 |   on Dev board"  |                     |                  |
 |----------------->|                     |                  |
 |                  | Build prompt with   |                  |
 |                  | system + history +  |                  |
 |                  | 16 tool definitions |                  |
 |                  |-------------------->|                  |
 |                  |                     | LLM processes    |
 |                  |                     | prompt           |
 |                  |<--------------------|                  |
 |                  | tool_call:          |                  |
 |                  | listBoards()        |                  |
 |                  |                     |                  |
 |                  | Execute tool ------>|                  |
 |                  |                     | SELECT * FROM    |
 |                  |                     | boards WHERE     |
 |                  |                     | user_id = auth() |
 |                  |<--------------------|                  |
 |                  | Send tool result    |                  |
 |                  |-------------------->|                  |
 |                  |                     | LLM processes    |
 |                  |                     | board list       |
 |                  |<--------------------|                  |
 |                  | tool_call:          |                  |
 |                  | createTask(board_id,|                  |
 |                  |   title, priority)  |                  |
 |                  |                     |                  |
 |                  | Execute tool ------>|                  |
 |                  |                     | INSERT INTO      |
 |                  |                     | items (...)      |
 |                  |<--------------------|                  |
 |                  | Send tool result    |                  |
 |                  |-------------------->|                  |
 |                  |                     | LLM generates    |
 |                  |                     | final response   |
 |                  |<----- streaming ----|                  |
 |  "Task created   |                     |                  |
 |   successfully"  |                     |                  |
 |<-- streaming ----|                     |                  |
 |                  | Persist message     |                  |
 |                  |-------------------->|                  |
 |                  |                     | INSERT INTO      |
 |                  |                     | ai_messages      |
 |                  |<--------------------|                  |
```

## Appendix C: authentication flow diagram

```
User              React SPA            Supabase Auth         PostgreSQL
 |                    |                     |                     |
 | Enter email/pass   |                     |                     |
 |------------------->|                     |                     |
 |                    | signInWithPassword  |                     |
 |                    |-------------------->|                     |
 |                    |                     | Validate bcrypt     |
 |                    |                     | hash                |
 |                    |                     |-------------------->|
 |                    |                     |<--------------------|
 |                    |                     | Issue JWT +         |
 |                    |                     | refresh token       |
 |                    |<--------------------|                     |
 |                    | Store in            |                     |
 |                    | localStorage        |                     |
 |                    |                     |                     |
 |                    | AuthContext.login()  |                     |
 |                    | sets user state      |                     |
 |  Dashboard loads   |                     |                     |
 |<-------------------|                     |                     |
 |                    |                     |                     |
 |  [Later: token     |                     |                     |
 |   near expiry]     |                     |                     |
 |                    | Auto-refresh token  |                     |
 |                    |-------------------->|                     |
 |                    |<--------------------|                     |
 |                    | New JWT stored       |                     |
 |                    |                     |                     |
 |  User clicks       |                     |                     |
 |  Logout            |                     |                     |
 |------------------->|                     |                     |
 |                    | signOut()            |                     |
 |                    |-------------------->|                     |
 |                    | Clear localStorage  |                     |
 |                    | Redirect to /login  |                     |
 |  Login page        |                     |                     |
 |<-------------------|                     |                     |
```

## Appendix D: deployment pipeline

```
Developer           GitHub              Vercel               User
 |                    |                    |                    |
 | git push origin    |                    |                    |
 | main               |                    |                    |
 |------------------->|                    |                    |
 |                    | Webhook triggers   |                    |
 |                    | Vercel build       |                    |
 |                    |------------------->|                    |
 |                    |                    | npm install        |
 |                    |                    | npm run build      |
 |                    |                    | (Vite production   |
 |                    |                    |  bundle)           |
 |                    |                    |                    |
 |                    |                    | Deploy to edge CDN |
 |                    |                    | (global)           |
 |                    |                    |                    |
 |                    |                    | SSL certificate    |
 |                    |                    | auto-provisioned   |
 |                    |                    |                    |
 |                    |<--- Deploy URL ----|                    |
 |<--- Status OK -----|                    |                    |
 |                    |                    |  User accesses     |
 |                    |                    |  updated app       |
 |                    |                    |<-------------------|
 |                    |                    | Serve from nearest |
 |                    |                    | edge node          |
 |                    |                    |------------------->|
```

## Appendix E: task assignment scoring example

**Scenario:** Assign the task "Fix authentication token refresh bug" to the best team member.

**Step 1: Extract Keywords**
- Task keywords: ["fix", "authentication", "token", "refresh", "bug"] -> after stop word removal: ["authentication", "token", "refresh", "bug"]

**Step 2: Score Each Candidate**

| Candidate | Skills | Active Tasks | Completed/Total | Competency (0.40) | Availability (0.35) | Performance (0.25) | **Total** |
|---|---|---|---|---|---|---|---|
| Khalid | ["javascript", "react", "authentication", "supabase"] | 2 | 8/10 | 0.75 * 0.40 = 0.30 | 0.80 * 0.35 = 0.28 | 0.80 * 0.25 = 0.20 | **0.78** |
| Maria | ["ai", "python", "openrouter"] | 3 | 6/8 | 0.25 * 0.40 = 0.10 | 0.60 * 0.35 = 0.21 | 0.75 * 0.25 = 0.19 | **0.50** |
| Mohammad | ["react", "css", "components"] | 1 | 5/7 | 0.25 * 0.40 = 0.10 | 0.90 * 0.35 = 0.32 | 0.71 * 0.25 = 0.18 | **0.60** |

**Step 3: Recommendation**
"Khalid is the best match for this task (score: 0.78). He has direct authentication and Supabase experience, a manageable workload (2 active tasks), and a strong completion rate (80%)."
