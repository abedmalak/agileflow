DO $$
DECLARE
  owner_id UUID := '75eddd1f-68e8-4aef-a25f-cbdfb4f4fcaf'; -- test@test.com (Maria Alftaih)
  board1_id UUID;
  board2_id UUID;
  board3_id UUID;
  sprint1_id UUID;
  sprint2_id UUID;
  sprint3_id UUID;
BEGIN

-- Board 1: Sprint Board (main dev board)
INSERT INTO boards (user_id, title, description, color, icon, columns, groups) VALUES (
  owner_id,
  'Sprint Board',
  'Main development board for tracking sprint tasks and progress',
  '#0073EA',
  '🚀',
  '[{"id":"task","title":"Task","type":"task","width":250},{"id":"status","title":"Status","type":"status","width":140,"options":{"choices":[{"label":"Not Started","color":"#C4C4C4"},{"label":"Working on it","color":"#FFCB00"},{"label":"Done","color":"#00C875"},{"label":"Stuck","color":"#E2445C"}]}},{"id":"person","title":"Assignee","type":"person","width":140},{"id":"priority","title":"Priority","type":"priority","width":120,"options":{"choices":[{"value":"low","label":"Low","color":"#787D80"},{"value":"medium","label":"Medium","color":"#FFCB00"},{"value":"high","label":"High","color":"#FDAB3D"},{"value":"critical","label":"Critical","color":"#E2445C"}]}},{"id":"date","title":"Due Date","type":"date","width":130},{"id":"timeline","title":"Timeline","type":"timeline","width":160},{"id":"text","title":"Notes","type":"text","width":180}]'::jsonb,
  '[{"id":"grp_todo","title":"To Do","color":"#579BFC"},{"id":"grp_progress","title":"In Progress","color":"#FDAB3D"},{"id":"grp_review","title":"In Review","color":"#E2445C"},{"id":"grp_done","title":"Done","color":"#00C875"}]'::jsonb
) RETURNING id INTO board1_id;

-- Board 2: Bug Tracker
INSERT INTO boards (user_id, title, description, color, icon, columns, groups) VALUES (
  owner_id,
  'Bug Tracker',
  'Track and manage reported bugs and issues',
  '#E2445C',
  '🐛',
  '[{"id":"task","title":"Task","type":"task","width":250},{"id":"status","title":"Status","type":"status","width":140,"options":{"choices":[{"label":"Not Started","color":"#C4C4C4"},{"label":"Working on it","color":"#FFCB00"},{"label":"Done","color":"#00C875"},{"label":"Stuck","color":"#E2445C"}]}},{"id":"person","title":"Assigned To","type":"person","width":140},{"id":"priority","title":"Severity","type":"priority","width":120,"options":{"choices":[{"value":"low","label":"Low","color":"#787D80"},{"value":"medium","label":"Medium","color":"#FFCB00"},{"value":"high","label":"High","color":"#FDAB3D"},{"value":"critical","label":"Critical","color":"#E2445C"}]}},{"id":"date","title":"Reported","type":"date","width":130},{"id":"text","title":"Steps to Reproduce","type":"text","width":200}]'::jsonb,
  '[{"id":"grp_new","title":"New","color":"#E2445C"},{"id":"grp_investigating","title":"Investigating","color":"#FDAB3D"},{"id":"grp_fixing","title":"Fixing","color":"#579BFC"},{"id":"grp_resolved","title":"Resolved","color":"#00C875"}]'::jsonb
) RETURNING id INTO board2_id;

-- Board 3: Product Roadmap
INSERT INTO boards (user_id, title, description, color, icon, columns, groups) VALUES (
  owner_id,
  'Product Roadmap',
  'High-level feature planning and roadmap tracking',
  '#00C875',
  '🗺️',
  '[{"id":"task","title":"Task","type":"task","width":250},{"id":"status","title":"Status","type":"status","width":140,"options":{"choices":[{"label":"Not Started","color":"#C4C4C4"},{"label":"Working on it","color":"#FFCB00"},{"label":"Done","color":"#00C875"},{"label":"Stuck","color":"#E2445C"}]}},{"id":"person","title":"Owner","type":"person","width":140},{"id":"priority","title":"Priority","type":"priority","width":120,"options":{"choices":[{"value":"low","label":"Low","color":"#787D80"},{"value":"medium","label":"Medium","color":"#FFCB00"},{"value":"high","label":"High","color":"#FDAB3D"},{"value":"critical","label":"Critical","color":"#E2445C"}]}},{"id":"timeline","title":"Timeline","type":"timeline","width":160},{"id":"text","title":"Description","type":"text","width":200}]'::jsonb,
  '[{"id":"grp_q1","title":"Q1 2026","color":"#579BFC"},{"id":"grp_q2","title":"Q2 2026","color":"#00C875"},{"id":"grp_backlog","title":"Backlog","color":"#C4C4C4"}]'::jsonb
) RETURNING id INTO board3_id;

-- Sprint Board Items (25 tasks)
INSERT INTO items (board_id, group_id, title, description, data, order_index) VALUES
(board1_id, 'grp_done', 'Set up Supabase authentication', 'Configure email/password auth with RLS policies', '{"status":"Done","person":"Abdul Rahman Malak","priority":"Critical","date":"2026-03-10"}'::jsonb, 0),
(board1_id, 'grp_done', 'Design database schema', 'Create tables for boards, items, profiles, sprints', '{"status":"Done","person":"Mohammad Houjeirat","priority":"Critical","date":"2026-03-11"}'::jsonb, 1),
(board1_id, 'grp_done', 'Build board CRUD operations', 'Create, read, update, delete boards via Supabase', '{"status":"Done","person":"Abdul Rahman Malak","priority":"High","date":"2026-03-12"}'::jsonb, 2),
(board1_id, 'grp_done', 'Implement Kanban board view', 'Drag-and-drop card layout with group columns', '{"status":"Done","person":"Khalid Hajjo Rifai","priority":"High","date":"2026-03-14"}'::jsonb, 3),
(board1_id, 'grp_done', 'Create dashboard with widgets', 'Summary cards, recent activity, quick actions', '{"status":"Done","person":"Maria Alftaih","priority":"Medium","date":"2026-03-15"}'::jsonb, 4),
(board1_id, 'grp_done', 'Add calendar page', 'Monthly calendar view with event creation', '{"status":"Done","person":"Khalid Hajjo Rifai","priority":"Medium","date":"2026-03-16"}'::jsonb, 5),
(board1_id, 'grp_done', 'Implement backlog management', 'User stories with sprint assignment', '{"status":"Done","person":"Mohammad Houjeirat","priority":"High","date":"2026-03-18"}'::jsonb, 6),
(board1_id, 'grp_done', 'Build settings page', 'Profile editing, theme toggle, preferences', '{"status":"Done","person":"Maria Alftaih","priority":"Low","date":"2026-03-19"}'::jsonb, 7),
(board1_id, 'grp_progress', 'AI assistant with tool calling', 'OpenRouter integration with task creation tools', '{"status":"Working on it","person":"Abdul Rahman Malak","priority":"Critical","date":"2026-03-28"}'::jsonb, 8),
(board1_id, 'grp_progress', 'Fix auth session persistence', 'Resolve stale token issues across tabs and devices', '{"status":"Working on it","person":"Abdul Rahman Malak","priority":"Critical","date":"2026-03-27"}'::jsonb, 9),
(board1_id, 'grp_progress', 'Enhanced error messages', 'Show actual Supabase error details in toasts', '{"status":"Working on it","person":"Mohammad Houjeirat","priority":"High","date":"2026-03-27"}'::jsonb, 10),
(board1_id, 'grp_progress', 'User profile enhancements', 'Add job title, department, skills, description', '{"status":"Working on it","person":"Maria Alftaih","priority":"Medium","date":"2026-03-28"}'::jsonb, 11),
(board1_id, 'grp_review', 'Sprint velocity chart', 'Recharts line chart showing velocity over sprints', '{"status":"Stuck","person":"Maria Alftaih","priority":"High","date":"2026-03-29"}'::jsonb, 12),
(board1_id, 'grp_review', 'Board analytics tab', 'Task distribution, completion rates, burndown', '{"status":"Stuck","person":"Khalid Hajjo Rifai","priority":"Medium","date":"2026-03-30"}'::jsonb, 13),
(board1_id, 'grp_todo', 'Dark mode polish', 'Ensure all components have proper dark: variants', '{"status":"","person":"Khalid Hajjo Rifai","priority":"Medium","date":"2026-04-02"}'::jsonb, 14),
(board1_id, 'grp_todo', 'Mobile responsive layout', 'Optimize sidebar, boards, and forms for mobile', '{"status":"","person":"Khalid Hajjo Rifai","priority":"High","date":"2026-04-03"}'::jsonb, 15),
(board1_id, 'grp_todo', 'Performance optimization', 'Lazy loading, code splitting, bundle analysis', '{"status":"","person":"Abdul Rahman Malak","priority":"Medium","date":"2026-04-05"}'::jsonb, 16),
(board1_id, 'grp_todo', 'Export board data to CSV', 'Download board items as spreadsheet', '{"status":"","person":"Mohammad Houjeirat","priority":"Low","date":"2026-04-07"}'::jsonb, 17),
(board1_id, 'grp_todo', 'Keyboard shortcuts', 'Navigate boards and create items with hotkeys', '{"status":"","person":"Khalid Hajjo Rifai","priority":"Low","date":"2026-04-08"}'::jsonb, 18),
(board1_id, 'grp_todo', 'Notification system', 'In-app notifications for task assignments', '{"status":"","person":"Maria Alftaih","priority":"Medium","date":"2026-04-10"}'::jsonb, 19);

-- Bug Tracker Items (12 bugs)
INSERT INTO items (board_id, group_id, title, description, data, order_index) VALUES
(board2_id, 'grp_resolved', 'Login page infinite loading', 'Users see spinner forever when cookies are stale', '{"status":"Done","person":"Abdul Rahman Malak","priority":"Critical","date":"2026-03-25"}'::jsonb, 0),
(board2_id, 'grp_resolved', 'Calendar event creation fails', 'RLS policy blocks insert for some users', '{"status":"Done","person":"Mohammad Houjeirat","priority":"Critical","date":"2026-03-26"}'::jsonb, 1),
(board2_id, 'grp_resolved', 'Generic error toasts hide details', 'All errors say Please try again with no context', '{"status":"Done","person":"Mohammad Houjeirat","priority":"High","date":"2026-03-27"}'::jsonb, 2),
(board2_id, 'grp_fixing', 'Empty states show loading forever', 'When no stories exist backlog shows spinner', '{"status":"Working on it","person":"Khalid Hajjo Rifai","priority":"High","date":"2026-03-28"}'::jsonb, 3),
(board2_id, 'grp_fixing', 'Multiple tabs cause auth conflicts', 'Token refresh in one tab invalidates others', '{"status":"Working on it","person":"Abdul Rahman Malak","priority":"Critical","date":"2026-03-28"}'::jsonb, 4),
(board2_id, 'grp_investigating', 'Dashboard widget slow to load', 'Recent activity takes 5+ seconds on first load', '{"status":"Stuck","person":"Maria Alftaih","priority":"Medium","date":"2026-03-29"}'::jsonb, 5),
(board2_id, 'grp_investigating', 'Board column reorder not persisting', 'Drag columns to reorder but reverts on refresh', '{"status":"Stuck","person":"Khalid Hajjo Rifai","priority":"Medium","date":"2026-03-30"}'::jsonb, 6),
(board2_id, 'grp_new', 'Sprint capacity not enforced', 'Can assign more points than sprint capacity', '{"status":"","person":"Mohammad Houjeirat","priority":"Medium","date":"2026-04-01"}'::jsonb, 7),
(board2_id, 'grp_new', 'AI responses not using markdown', 'Bold and tables not rendering in chat bubbles', '{"status":"","person":"Abdul Rahman Malak","priority":"High","date":"2026-04-01"}'::jsonb, 8),
(board2_id, 'grp_new', 'Theme toggle flickers on page load', 'Brief white flash when dark mode is enabled', '{"status":"","person":"Khalid Hajjo Rifai","priority":"Low","date":"2026-04-02"}'::jsonb, 9),
(board2_id, 'grp_new', 'Profile avatar upload broken', 'File picker opens but image never saves', '{"status":"","person":"Maria Alftaih","priority":"Low","date":"2026-04-03"}'::jsonb, 10),
(board2_id, 'grp_new', 'Search not finding board items', 'Search bar on boards page returns no results', '{"status":"","person":"Mohammad Houjeirat","priority":"Medium","date":"2026-04-04"}'::jsonb, 11);

-- Product Roadmap Items (10 features)
INSERT INTO items (board_id, group_id, title, description, data, order_index) VALUES
(board3_id, 'grp_q1', 'Core platform launch', 'Authentication, boards, dashboard, settings', '{"status":"Done","person":"Abdul Rahman Malak","priority":"Critical","timeline":{"from":"2026-01-15","to":"2026-03-15"}}'::jsonb, 0),
(board3_id, 'grp_q1', 'Agile workflow engine', 'Sprints, backlog, user stories, velocity tracking', '{"status":"Done","person":"Mohammad Houjeirat","priority":"Critical","timeline":{"from":"2026-02-01","to":"2026-03-20"}}'::jsonb, 1),
(board3_id, 'grp_q1', 'AI-powered assistant', 'Chat interface with tool calling capabilities', '{"status":"Working on it","person":"Abdul Rahman Malak","priority":"High","timeline":{"from":"2026-03-01","to":"2026-04-05"}}'::jsonb, 2),
(board3_id, 'grp_q2', 'Advanced analytics dashboard', 'Burndown charts, team velocity, task distribution', '{"status":"","person":"Maria Alftaih","priority":"High","timeline":{"from":"2026-04-01","to":"2026-05-15"}}'::jsonb, 3),
(board3_id, 'grp_q2', 'Real-time collaboration', 'Live cursors, presence indicators, co-editing', '{"status":"","person":"Khalid Hajjo Rifai","priority":"Medium","timeline":{"from":"2026-04-15","to":"2026-06-01"}}'::jsonb, 4),
(board3_id, 'grp_q2', 'Email notifications', 'Task assignment and deadline reminder emails', '{"status":"","person":"Maria Alftaih","priority":"Medium","timeline":{"from":"2026-05-01","to":"2026-05-30"}}'::jsonb, 5),
(board3_id, 'grp_q2', 'Mobile PWA support', 'Progressive web app for mobile access', '{"status":"","person":"Khalid Hajjo Rifai","priority":"High","timeline":{"from":"2026-05-15","to":"2026-06-30"}}'::jsonb, 6),
(board3_id, 'grp_backlog', 'GitHub integration', 'Link commits and PRs to board items', '{"status":"","person":"Abdul Rahman Malak","priority":"Low"}'::jsonb, 7),
(board3_id, 'grp_backlog', 'Custom field types', 'Allow users to define custom column types', '{"status":"","person":"Mohammad Houjeirat","priority":"Low"}'::jsonb, 8),
(board3_id, 'grp_backlog', 'Gantt chart view', 'Timeline view for project planning', '{"status":"","person":"Khalid Hajjo Rifai","priority":"Medium"}'::jsonb, 9);

-- Sprints (3 sprints with realistic data)
INSERT INTO sprints (user_id, board_id, name, goal, start_date, end_date, status, capacity, committed_points, completed_points, velocity) VALUES
(owner_id, board1_id, 'Sprint 1 - Foundation', 'Set up core platform infrastructure and authentication', '2026-03-01', '2026-03-14', 'completed', 40, 38, 35, 35)
RETURNING id INTO sprint1_id;

INSERT INTO sprints (user_id, board_id, name, goal, start_date, end_date, status, capacity, committed_points, completed_points, velocity) VALUES
(owner_id, board1_id, 'Sprint 2 - Features', 'Build board views, backlog management, and calendar', '2026-03-15', '2026-03-28', 'active', 45, 42, 28, 0)
RETURNING id INTO sprint2_id;

INSERT INTO sprints (user_id, board_id, name, goal, start_date, end_date, status, capacity, committed_points, completed_points, velocity) VALUES
(owner_id, board1_id, 'Sprint 3 - Polish', 'AI tools, analytics, dark mode, mobile responsive', '2026-03-29', '2026-04-11', 'planning', 50, 0, 0, 0)
RETURNING id INTO sprint3_id;

-- User Stories (15 stories across sprints)
INSERT INTO user_stories (user_id, title, description, priority, status, story_points, sprint_id, board_id, assigned_to, acceptance_criteria) VALUES
(owner_id, 'User authentication flow', 'As a user I want to sign up and log in securely', 'critical', 'done', 8, sprint1_id, board1_id, 'Abdul Rahman Malak', '["Email/password login works","Session persists across page reloads","Logout clears all tokens"]'::jsonb),
(owner_id, 'Board CRUD operations', 'As a PM I want to create and manage project boards', 'high', 'done', 5, sprint1_id, board1_id, 'Abdul Rahman Malak', '["Can create board with title and description","Can edit board settings","Can delete board with confirmation"]'::jsonb),
(owner_id, 'Database schema design', 'As a developer I want a well-structured database', 'critical', 'done', 8, sprint1_id, board1_id, 'Mohammad Houjeirat', '["All tables have RLS policies","Foreign keys properly set","Indexes on frequently queried columns"]'::jsonb),
(owner_id, 'Dashboard overview page', 'As a user I want a summary dashboard on login', 'medium', 'done', 5, sprint1_id, board1_id, 'Maria Alftaih', '["Shows task count by status","Shows recent activity","Shows upcoming deadlines"]'::jsonb),
(owner_id, 'Kanban drag-and-drop', 'As a PM I want to drag tasks between status columns', 'high', 'done', 8, sprint1_id, board1_id, 'Khalid Hajjo Rifai', '["Cards can be dragged between groups","Order persists after refresh","Visual feedback during drag"]'::jsonb),
(owner_id, 'Settings and profile page', 'As a user I want to manage my profile and preferences', 'low', 'done', 3, sprint1_id, board1_id, 'Maria Alftaih', '["Can change name and avatar","Can toggle dark mode","Can update job title and skills"]'::jsonb),
(owner_id, 'Sprint management', 'As a scrum master I want to create and track sprints', 'high', 'in-progress', 8, sprint2_id, board1_id, 'Mohammad Houjeirat', '["Can create sprint with dates and goals","Can assign stories to sprints","Sprint shows capacity vs committed"]'::jsonb),
(owner_id, 'Calendar events', 'As a PM I want to schedule and view team events', 'medium', 'in-progress', 5, sprint2_id, board1_id, 'Khalid Hajjo Rifai', '["Can create events with date and time","Events show on monthly calendar","Can edit and delete events"]'::jsonb),
(owner_id, 'AI chat assistant', 'As a user I want an AI helper for project questions', 'high', 'in-progress', 8, sprint2_id, board1_id, 'Abdul Rahman Malak', '["AI responds to project management questions","AI can create tasks via tool calling","Chat history is persisted"]'::jsonb),
(owner_id, 'Error handling overhaul', 'As a developer I want meaningful error messages', 'high', 'in-progress', 5, sprint2_id, board1_id, 'Mohammad Houjeirat', '["Every error shows actual reason from Supabase","No more generic Please try again","Console.error logs preserved for debugging"]'::jsonb),
(owner_id, 'User profile enhancement', 'As a team member I want to describe my role and skills', 'medium', 'in-progress', 3, sprint2_id, board1_id, 'Maria Alftaih', '["Can set job title and department","Can write a description","Can list skills as tags"]'::jsonb),
(owner_id, 'Sprint velocity analytics', 'As a PM I want to see velocity trends over sprints', 'high', 'backlog', 8, sprint3_id, board1_id, 'Maria Alftaih', '["Line chart shows velocity per sprint","Includes average velocity line","Handles sprints with zero data"]'::jsonb),
(owner_id, 'Dark mode polish', 'As a user I want consistent dark mode everywhere', 'medium', 'backlog', 5, sprint3_id, board1_id, 'Khalid Hajjo Rifai', '["All pages tested in dark mode","No white flash on load","Charts use dark-friendly colors"]'::jsonb),
(owner_id, 'Mobile responsive design', 'As a mobile user I want to use AgileFlow on my phone', 'high', 'backlog', 8, sprint3_id, board1_id, 'Khalid Hajjo Rifai', '["Sidebar collapses on mobile","Board scrolls horizontally","Forms are touch-friendly"]'::jsonb),
(owner_id, 'Performance optimization', 'As a user I want fast page loads under 2 seconds', 'medium', 'backlog', 5, sprint3_id, board1_id, 'Abdul Rahman Malak', '["Bundle size under 500KB gzipped","Lazy load non-critical pages","React Query caching configured"]'::jsonb);

-- Calendar Events (8 events across March-April)
INSERT INTO calendar_events (user_id, title, description, start_date, end_date, color, event_type, location, all_day) VALUES
(owner_id, 'Sprint 1 Review', 'Demo completed features to stakeholders', '2026-03-14 14:00:00+03', '2026-03-14 15:00:00+03', '#0073EA', 'meeting', 'Zoom', false),
(owner_id, 'Sprint 2 Planning', 'Plan sprint 2 backlog and assign stories', '2026-03-15 10:00:00+03', '2026-03-15 12:00:00+03', '#00C875', 'meeting', 'Conference Room A', false),
(owner_id, 'Capstone Midterm Presentation', 'Present progress to Prof. Temur and Dr. Bodur', '2026-03-20 09:00:00+03', '2026-03-20 10:30:00+03', '#E2445C', 'deadline', 'BAU Campus', false),
(owner_id, 'Code Review Session', 'Team code review for auth and board modules', '2026-03-22 13:00:00+03', '2026-03-22 14:30:00+03', '#FDAB3D', 'meeting', 'Online', false),
(owner_id, 'Sprint 2 Retrospective', 'Discuss what went well and improvements', '2026-03-28 15:00:00+03', '2026-03-28 16:00:00+03', '#579BFC', 'meeting', 'Zoom', false),
(owner_id, 'Sprint 3 Kickoff', 'Start sprint 3 with analytics and polish goals', '2026-03-29 10:00:00+03', '2026-03-29 11:00:00+03', '#00C875', 'meeting', 'Conference Room B', false),
(owner_id, 'Capstone Final Report Due', 'Submit final report and documentation', '2026-04-05 23:59:00+03', NULL, '#E2445C', 'deadline', 'Online Submission', true),
(owner_id, 'Final Demo Day', 'Live demo of AgileFlow to faculty and industry panel', '2026-04-10 10:00:00+03', '2026-04-10 12:00:00+03', '#0073EA', 'deadline', 'BAU Auditorium', false);

END $$;