## 4.2. Backend Data Service (Supabase)

The backend provides data persistence, authentication, and authorization through Supabase, an open-source Backend-as-a-Service platform built on PostgreSQL. AgileFlow communicates directly from the React client to Supabase's auto-generated REST API, with no custom middleware layer.

### 4.2.1. Requirements

**Behavioral Requirements**

| # | Requirement | Description |
|---|---|---|
| BR-1 | CRUD Operations | Every entity (boards, items, stories, sprints, events, notifications) shall support create, read, update, and delete operations via the REST API. |
| BR-2 | User Isolation | Users shall only access their own data, enforced at the database level via Row Level Security. |
| BR-3 | Team Sharing | Board owners can share boards with team members who receive read/write or read-only access. |
| BR-4 | Auto-Profile | A new profile record is automatically created when a user registers, via a database trigger. |
| BR-5 | First-User Admin | The first registered user automatically receives the "admin" role; subsequent users default to "member." |
| BR-6 | Session Management | JWT session tokens are issued on login, automatically refreshed, and invalidated on logout. |
| BR-7 | Cascading Deletes | Deleting a board cascades to all associated items and team_members. Deleting a user cascades to all their data. |

**Performance Requirements**

| # | Metric | Target |
|---|---|---|
| PR-1 | Query Response Time | Target < 200ms for typical read operations (list boards, fetch items); no benchmark measurements have been taken |
| PR-2 | Connection Pooling | Up to 200 pooled connections via Supavisor (free tier) |
| PR-3 | Database Size | < 500MB (free tier limit; current usage ~5MB) |

**Security Requirements**

| # | Requirement | Description |
|---|---|---|
| SR-1 | Row Level Security | Every table has RLS enabled with per-operation policies (SELECT, INSERT, UPDATE, DELETE). |
| SR-2 | JWT Authentication | All API requests require a valid JWT token in the Authorization header. |
| SR-3 | Password Hashing | Supabase Auth uses bcrypt for password storage; plaintext passwords are never stored. |
| SR-4 | HTTPS Only | All communication between client and Supabase is over TLS (enforced by Supabase infrastructure). |
| SR-5 | SQL Injection Prevention | The Supabase SDK uses parameterized queries; no raw SQL is executed from the client. |

### 4.2.2. Technologies and Methods

**Literature Survey**

The Backend-as-a-Service (BaaS) model differs from traditional server-client architectures by providing managed databases, authentication, and APIs out of the box. Frontend developers can build full-stack applications without writing server code. Supabase launched in 2020 as an open-source Firebase alternative and has been widely adopted because it uses PostgreSQL, which gives ACID compliance, relational joins, and JSONB flexibility. Firebase's Firestore, by contrast, is a document database with eventual consistency.

Row Level Security (RLS) is a PostgreSQL feature that places authorization logic directly in the database engine. RLS policies run on every query, so even if application code has a bug, unauthorized data access is blocked at the storage layer. OWASP recommends this defense-in-depth approach for applications where data isolation is critical.

**Technologies**

| Technology | Version | Role |
|---|---|---|
| Supabase | Hosted (Free Tier) | Backend-as-a-Service platform |
| PostgreSQL | 15 | Relational database engine |
| PostgREST | Auto-managed | Auto-generates REST API from database schema |
| Supabase Auth | Built-in | JWT-based email/password authentication |
| Supabase JS SDK | 2.100.1 | JavaScript client library for browser-to-Supabase communication |
| PL/pgSQL | Built-in | Server-side trigger functions (e.g., handle_new_user) |
| Supavisor | Built-in | Connection pooling (replaces PgBouncer on free tier) |

### 4.2.3. Conceptualization

**Database Entity-Relationship Diagram (ERD)**

The AgileFlow database consists of 10 tables with the following relationships:

```
auth.users (Supabase-managed)
  |
  +-- profiles (1:1, FK id -> auth.users.id, CASCADE)
  |
  +-- boards (1:N, FK user_id -> auth.users.id, CASCADE)
  |     |
  |     +-- items (1:N, FK board_id -> boards.id, CASCADE)
  |     |
  |     +-- team_members (1:N, FK board_id -> boards.id, CASCADE)
  |     |
  |     +-- sprints (1:N, FK board_id -> boards.id, SET NULL)
  |
  +-- user_stories (1:N, FK user_id -> auth.users.id, CASCADE)
  |     +-- (FK sprint_id -> sprints.id, SET NULL)
  |     +-- (FK board_id -> boards.id, SET NULL)
  |
  +-- calendar_events (1:N, FK user_id -> auth.users.id, CASCADE)
  |
  +-- notifications (1:N, FK user_id -> auth.users.id, CASCADE)
  |
  +-- ai_sessions (1:N, FK user_id -> auth.users.id, CASCADE)
        |
        +-- ai_messages (1:N, FK session_id -> ai_sessions.id, CASCADE)
```

**Table Definitions**

| Table | Columns | Key Features |
|---|---|---|
| **profiles** | id (UUID PK), full_name, email, avatar, role, theme, settings (JSONB), created_at, updated_at, job_title, department, description, skills (TEXT[]) | Extends auth.users. Role: admin/member/viewer. Core columns from schema.sql; job_title, department, description, skills added via profiles-enhancement.sql migration. |
| **boards** | id (UUID PK), user_id (FK), title, description, color, icon, columns (JSONB), groups (JSONB), settings (JSONB), created_date, updated_date | Columns/groups stored as JSONB arrays, allowing fully customizable board structures without schema changes. |
| **items** | id (UUID PK), board_id (FK), group_id, title, description, data (JSONB), order_index, created_date, updated_date | The `data` JSONB column stores all cell values keyed by column ID, enabling multiple cell types without separate tables. |
| **calendar_events** | id (UUID PK), user_id (FK), title, description, start_date, end_date, color, event_type, location, attendees (JSONB), all_day, reminder_minutes, created_date, updated_date | Supports full-day events, time-specific events, and multi-attendee scheduling. |
| **user_stories** | id (UUID PK), user_id (FK), title, description, priority, status, story_points, sprint_id (FK), board_id (FK), assigned_to, acceptance_criteria (JSONB), created_date, updated_date | Links to both sprints and boards. Acceptance criteria stored as JSONB array. |
| **sprints** | id (UUID PK), user_id (FK), board_id (FK), name, goal, start_date, end_date, status, capacity, committed_points, completed_points, velocity, created_date, updated_date | Tracks capacity vs. committed points for sprint planning. |
| **notifications** | id (UUID PK), user_id (FK), title, message, type, is_read, link, created_date | Type CHECK constraint: info, success, warning, error, task, mention, sprint. |
| **team_members** | id (UUID PK), board_id (FK), user_id (FK), role, invited_by (FK), created_date | UNIQUE(board_id, user_id) prevents duplicate memberships. Role: owner/editor/viewer. |
| **ai_sessions** | id (UUID PK), user_id (FK), title, model, created_at, updated_at | Stores AI chat sessions per user. Deployed via ai-sessions-schema.sql. |
| **ai_messages** | id (UUID PK), session_id (FK), role (CHECK: user/assistant/system), content, model, created_at | Stores individual messages within a session. Cascades on session delete. |

**JSONB Column Strategy**

We used PostgreSQL's JSONB type for fields where the schema needed to stay flexible. The database has 7 JSONB columns across 5 tables:

- boards.columns stores the column definitions (title, type, options) as an array, so users can add, remove, or reorder columns without ALTER TABLE statements.
- boards.groups stores task groupings (sections) as an array.
- boards.settings stores board-level configuration as a key-value map.
- items.data stores all cell values as a key-value map where keys are column IDs. This single JSONB column supports multiple cell types (text, status, priority, people, date, timeline, tags, number, checkbox, budget, dropdown) without requiring separate typed columns.
- profiles.settings stores user preferences (theme overrides, notification settings) as a key-value map.
- calendar_events.attendees stores attendee lists as a JSON array.
- user_stories.acceptance_criteria stores acceptance criteria items as a JSON array.

This hybrid approach gives referential integrity via foreign keys and ACID-compliant consistency while still allowing the schema flexibility more typical of document databases. Relational structure handles the entities; JSONB handles the attributes that vary per board or user.

### 4.2.4. Software Architecture

**Request Processing Flow**

Every client request to Supabase goes through six steps. The entity service (e.g., `Board.list()`) calls `supabase.from('boards').select('*')`, and the Supabase JS SDK automatically attaches the user's JWT token to the `Authorization` header. Supabase's PostgREST layer then receives the HTTP request, parses the query parameters (filters, sorts, limits), and translates them into a SQL query. PostgreSQL evaluates the Row Level Security policies for the target table and operation, using the `auth.uid()` function to extract the user ID from the JWT and apply conditions like `WHERE user_id = auth.uid()`. After that, PostgreSQL executes the filtered query, applying any additional WHERE clauses, ORDER BY, and LIMIT from the client request. Finally, results are serialized as JSON and returned to the client, where the Supabase SDK deserializes them into JavaScript objects.

**Row Level Security Policy Summary**

The database has 34 RLS policies in total: 32 from the core schema.sql (covering all 8 base tables, roughly 4 per table on average) plus 2 additional policies from ai-sessions-schema.sql (one FOR ALL policy on ai_sessions, one FOR ALL policy on ai_messages). All policies use `auth.uid()` to scope data to the authenticated user.

| Table | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
|---|---|---|---|---|
| profiles | Any authenticated user | Own profile only (auth.uid() = id) | Own profile OR admin role | — |
| boards | Own boards OR team member | Own boards only (user_id = auth.uid()) | Own boards OR team editor/owner | Own boards only |
| items | Items on accessible boards | Items on boards with editor+ access | Items on boards with editor+ access | Items on boards with editor+ access |
| calendar_events | Own events only | Own events only | Own events only | Own events only |
| user_stories | Own stories only | Own stories only | Own stories only | Own stories only |
| sprints | Own sprints only | Own sprints only | Own sprints only | Own sprints only |
| notifications | Own notifications only | Own notifications only | Own notifications only | Own notifications only |
| team_members | Own memberships OR board owner | Board owner only | Board owner only | Board owner only |
| ai_sessions | Own sessions only (FOR ALL) | — (covered by FOR ALL) | — (covered by FOR ALL) | — (covered by FOR ALL) |
| ai_messages | Via session ownership (FOR ALL) | — (covered by FOR ALL) | — (covered by FOR ALL) | — (covered by FOR ALL) |

**Entity Service Layer**

The `src/api/entities/` directory contains 6 primary service modules that wrap Supabase SDK calls with a consistent interface:

```javascript
// Common interface for all entity services
Entity.list(sortField, limit)     // SELECT with optional sort and limit
Entity.get(id)                    // SELECT by primary key
Entity.create(data)               // INSERT with auth user injection
Entity.update(id, data)           // UPDATE by primary key
Entity.delete(id)                 // DELETE by primary key
Entity.filter(filterObj, sort)    // SELECT with WHERE conditions
```

The 6 core services are: `Board`, `Item`, `User`, `CalendarEvent`, `UserStory`, and `Sprint`. Each service checks authentication before executing queries, selects only valid columns to prevent unexpected field injection, and wraps errors in meaningful messages.

**Database Functions and Triggers**

The schema defines 5 stored functions and 8 triggers:

| Trigger | Table | Event | Function | Purpose |
|---|---|---|---|---|
| on_auth_user_created | auth.users | AFTER INSERT | handle_new_user() | Auto-creates a profile row when a user signs up. First user gets "admin" role; subsequent users get "member." |
| on_auth_user_email_updated | auth.users | AFTER UPDATE OF email | sync_profile_email_from_auth() | Keeps profiles.email in sync when auth.users.email changes. |
| update_boards_updated_date | boards | BEFORE UPDATE | update_updated_date() | Auto-sets updated_date on every board update. |
| update_items_updated_date | items | BEFORE UPDATE | update_updated_date() | Auto-sets updated_date on every item update. |
| update_calendar_events_updated_date | calendar_events | BEFORE UPDATE | update_updated_date() | Auto-sets updated_date on every event update. |
| update_user_stories_updated_date | user_stories | BEFORE UPDATE | update_updated_date() | Auto-sets updated_date on every story update. |
| update_sprints_updated_date | sprints | BEFORE UPDATE | update_updated_date() | Auto-sets updated_date on every sprint update. |
| update_profiles_updated_date | profiles | BEFORE UPDATE | update_updated_date() | Auto-sets updated_at on every profile update. |

The 5 stored functions are: `handle_new_user`, `sync_profile_email_from_auth`, `update_updated_date`, `email_exists`, and `admin_get_auth_email`. The last two are `SECURITY DEFINER` functions that allow controlled access to `auth.users` data without exposing the table directly.

### 4.2.5. Materialization

**Schema Deployment Process**

1. Create a Supabase project via the Supabase Dashboard (supabase.com).
2. Navigate to the SQL Editor in the Supabase Dashboard.
3. Paste and execute `supabase/schema.sql`, which creates the 8 core tables, enables RLS, creates 32 policies, and installs triggers and stored functions. Then execute `supabase/ai-sessions-schema.sql` to add the `ai_sessions` and `ai_messages` tables (2 additional RLS policies). Execute `supabase/profiles-enhancement.sql` to add the job_title, department, description, and skills columns to profiles.
4. Enable Email Auth in Authentication > Providers.
5. Copy the project URL and anon key to `.env.local`.

**Environment Configuration**

| Variable | Purpose |
|---|---|
| VITE_SUPABASE_URL | Supabase project URL (e.g., https://xxxx.supabase.co) |
| VITE_SUPABASE_ANON_KEY | Public anon key for client-side authentication |
| VITE_OPENROUTER_API_KEY | API key for AI assistant (OpenRouter) |

### 4.2.6. Evaluation

**Functional Test Cases**

| # | Test Case | Method | Expected Result |
|---|---|---|---|
| TC-1 | User registration | Manual | New profile created with "member" role. JWT issued. |
| TC-2 | Board CRUD | Unit test | Board created, listed, updated, deleted without errors. |
| TC-3 | Item CRUD | Unit test | Items associated with board, data JSONB persisted correctly. |
| TC-4 | RLS data isolation | Manual | User A cannot see User B's boards, items, or events. |
| TC-5 | Team member access | Manual | Invited team member can view shared board and its items. |
| TC-6 | Cascading delete | Manual | Deleting a board removes all associated items and team_members. |
| TC-7 | First-user admin | Manual | First registered user has role "admin"; second has "member." |
| TC-8 | JSONB column operations | Unit test | Board columns/groups stored and retrieved correctly from JSONB. |

**Security Test Cases**

| # | Test Case | Method | Expected Result |
|---|---|---|---|
| ST-1 | Unauthenticated access | Manual (curl) | HTTP 401 returned for any table query without JWT. |
| ST-2 | Cross-user data access | Manual | RLS blocks SELECT on another user's boards (empty result set). |
| ST-3 | Viewer write attempt | Manual | RLS blocks INSERT/UPDATE for team members with "viewer" role. |
| ST-4 | SQL injection via SDK | Code review | Supabase SDK parameterizes all queries; no raw SQL paths exist. |
