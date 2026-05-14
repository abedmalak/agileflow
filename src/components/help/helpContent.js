export const helpCategories = [
  // ─────────────────────────────────────────────
  // 1. GETTING STARTED
  // ─────────────────────────────────────────────
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of AgileFlow and set up your workspace',
    icon: 'Rocket',
    articles: [
      {
        id: 'welcome',
        title: 'Welcome to AgileFlow',
        description: 'Comprehensive overview of the platform, its purpose, and who it serves',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow is a modern, full-featured project management platform built for teams that want to move fast without losing visibility. Inspired by tools like Monday.com, AgileFlow organizes your work into boards, where each board represents a project, a workstream, or any collection of related tasks. Every board is a structured workspace with rows of tasks, customizable columns for tracking data, and groups that let you categorize work into meaningful sections. The result is a flexible system that adapts to how your team actually works, whether you follow Scrum, Kanban, or your own hybrid methodology.',
          },
          {
            type: 'heading',
            text: 'What Makes AgileFlow Different',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow is not just a task tracker. It is a complete project management ecosystem that combines board-based task management, sprint planning, product backlog management, team analytics, calendar scheduling, and an AI assistant into a single cohesive platform. Instead of juggling multiple tools for different aspects of project management, AgileFlow brings everything together so your team has one source of truth.',
          },
          {
            type: 'paragraph',
            text: 'The board concept is central to how AgileFlow works. Think of a board as a smart spreadsheet designed for project management. Each row is a task, and each column captures a specific piece of information about that task, such as its status, who is responsible, when it is due, or how much budget it requires. You can view the same board data in four different ways: as a table, a Kanban board, a calendar, or a timeline. This means you never have to re-enter data just to see it from a different angle.',
          },
          {
            type: 'heading',
            text: 'Core Capabilities',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Board Management — Create unlimited project boards with 11 column types, multiple groups, and four view modes (Table, Kanban, Calendar, Timeline) to organize any kind of work',
              'Sprint Planning — Plan time-boxed sprints with capacity tracking, story point estimation, and velocity metrics that help you commit to realistic goals',
              'Product Backlog — Maintain a prioritized backlog of user stories with acceptance criteria, story points, and priority levels that feed directly into sprint planning',
              'Team Analytics — Visualize project health with charts for status distribution, team workload, priority breakdown, completion rates, and overdue task tracking',
              'Calendar Scheduling — Plan meetings, milestones, deadlines, and retrospectives on a shared monthly calendar with color-coded event types',
              'AI Assistant — Get intelligent help with task assignment, sprint recommendations, performance analysis, and general project questions through both a floating panel and a dedicated chat page',
              'Role-Based Access — Control who can do what with three permission levels: Admin, Member, and Viewer, each with clearly defined capabilities',
              'Dark Mode — Work comfortably in any lighting condition with full light mode, dark mode, and automatic system detection support',
            ],
          },
          {
            type: 'heading',
            text: 'Who Is AgileFlow For?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow is designed for cross-functional teams of any size that build products, manage projects, or coordinate work across multiple people. It serves everyone from individual contributors tracking their own tasks to engineering managers overseeing multi-sprint release cycles.',
          },
          {
            type: 'list',
            items: [
              'Project Managers — Oversee boards, track milestones, monitor team workload, generate reports, and ensure deadlines are met across all projects',
              'Software Developers — Manage daily tasks, update work status, track sprint commitments, and reference acceptance criteria for user stories',
              'Product Owners — Write and prioritize user stories in the backlog, plan sprints with realistic capacity, and track feature delivery across iterations',
              'Team Leads — Monitor team performance through analytics dashboards, balance workload distribution, and identify bottlenecks before they become blockers',
              'Scrum Masters — Facilitate sprint ceremonies using AgileFlow data, track velocity trends, monitor sprint health through capacity indicators, and use retrospective insights to improve processes',
              'Designers and Marketers — Track creative tasks, manage campaign timelines, organize deliverables by deadline, and coordinate cross-functional handoffs',
            ],
          },
          {
            type: 'heading',
            text: 'Design Philosophy',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow follows a clean, minimal design language inspired by modern productivity tools. The interface stays out of your way so you can focus on the work itself. There are no unnecessary animations, no decorative gradients, and no visual noise. Every element on screen serves a purpose. The color palette is carefully chosen for readability in both light and dark modes, with status colors, priority indicators, and event types using consistent, meaningful color coding throughout the platform.',
          },
          {
            type: 'tip',
            text: 'AgileFlow works best when your whole team is on the platform. Boards, sprints, and analytics all benefit from having accurate assignment and status data from every team member. Invite your teammates early to get the most out of collaboration features.',
          },
        ],
      },
      {
        id: 'create-account',
        title: 'Creating Your Account',
        description: 'Sign up, configure your profile, set your avatar, and choose your theme',
        content: [
          {
            type: 'paragraph',
            text: 'Getting started with AgileFlow takes less than a minute. The platform uses email and password authentication powered by Supabase, a secure backend infrastructure. There is no credit card required, no trial period to worry about, and no complicated onboarding wizard. You create an account, and you are immediately in your workspace ready to create your first board.',
          },
          {
            type: 'heading',
            text: 'Creating Your Account',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Open your web browser and navigate to the AgileFlow application URL.',
              'You will see the login page with fields for email and password. Below the login form, look for the "Create account" or "Sign up" link.',
              'Click the sign-up link to switch to the registration form.',
              'Enter your full name. This is how your teammates will see you across the platform, in assignments, activity feeds, and people columns.',
              'Enter a valid email address. This will be your login credential and the address used for any notifications.',
              'Choose a strong password. Use a mix of letters, numbers, and symbols for security.',
              'Click the "Sign Up" button to create your account.',
              'The system will create your account and automatically sign you in. You will be redirected to the Dashboard, which is your home screen.',
            ],
          },
          {
            type: 'heading',
            text: 'Your Profile and Avatar',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Once you are signed in, AgileFlow automatically generates a personalized avatar for you. Your avatar displays your initials (the first letters of your first and last name) on a uniquely colored circular background. This color is assigned automatically and remains consistent across the platform, making it easy for teammates to identify you in people columns, task assignments, and activity feeds.',
          },
          {
            type: 'paragraph',
            text: 'To complete your profile, navigate to Settings from the sidebar. Under the Profile tab, you can update your full name, job title, and department. Your profile information helps teammates understand your role and makes collaboration smoother. Every time you are assigned a task, mentioned in an activity feed, or appear in an analytics chart, your name and avatar are displayed, so keeping your profile accurate is important.',
          },
          {
            type: 'heading',
            text: 'Choosing Your Theme',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow supports three theme modes to match your visual preference and working environment. You can switch themes at any time, and your preference is saved to your account so it persists across sessions and devices.',
          },
          {
            type: 'list',
            items: [
              'Light Mode — A clean, bright interface with white backgrounds and dark text. Ideal for well-lit environments and daytime use.',
              'Dark Mode — A dark interface with muted backgrounds and light text. Reduces eye strain in low-light environments and saves battery on OLED screens.',
              'System (Auto-Detect) — Automatically matches your operating system preference. If your OS switches to dark mode at sunset, AgileFlow follows along without you lifting a finger.',
            ],
          },
          {
            type: 'steps',
            items: [
              'To quickly toggle between light and dark mode, click the sun or moon icon in the top navigation bar.',
              'For more control, go to Settings and select the Appearance section, where you can choose between Light, Dark, or System.',
            ],
          },
          {
            type: 'heading',
            text: 'Roles and Permissions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When you first create an account, you are assigned the Member role by default. This gives you full access to create boards, manage tasks, plan sprints, and use all standard features. If an administrator changes your role, your available actions will change accordingly. There are three roles in AgileFlow:',
          },
          {
            type: 'list',
            items: [
              'Admin — Full access to everything, plus the ability to manage users, change roles, reset passwords, and access the Admin panel.',
              'Member — Can create boards, add and edit tasks, plan sprints, manage backlog stories, and use the AI assistant. This is the default role for new users.',
              'Viewer — Read-only access to boards and data. Viewers cannot create, edit, drag, or delete anything. The interface hides action buttons and edit controls for viewers.',
            ],
          },
          {
            type: 'tip',
            text: 'Your avatar color is generated automatically based on your user account and stays consistent everywhere. You do not need to upload a profile picture, though the initials-based avatar works well for team identification.',
          },
        ],
      },
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        description: 'Step-by-step: create your first board, add tasks, and start managing work',
        content: [
          {
            type: 'paragraph',
            text: 'This guide walks you through everything you need to go from a fresh account to a fully functional project board with tasks, assignees, and organized groups. Follow each step in order, and you will be productive in under five minutes. By the end, you will have created a board, customized its columns, added tasks, organized them into groups, and invited a teammate.',
          },
          {
            type: 'heading',
            text: 'Step 1: Create Your First Board',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Boards are the foundation of AgileFlow. Every project, sprint, or workstream gets its own board. When you create a board, it automatically comes pre-configured with a sensible default structure so you can start adding tasks immediately.',
          },
          {
            type: 'steps',
            items: [
              'Click "Boards" in the left sidebar to navigate to the Boards page.',
              'Click the "+ New Board" button in the top-right corner of the page.',
              'Enter a title for your board. Choose something descriptive like "Sprint 1 — User Authentication" or "Q2 Marketing Campaign".',
              'Optionally add a description to provide context about the board\'s purpose. This helps teammates understand the scope.',
              'Choose an icon emoji that visually represents the project. This appears in the sidebar and board listings.',
              'Select a color theme for the board header. Colors help differentiate boards at a glance.',
              'Click "Create Board" to finalize. The board opens automatically.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Your new board arrives with six default columns already configured: Task (the title column), Status (with Not Started, Working on it, Done, and Stuck options), Owner (a People column for assigning team members), Priority (with Low, Medium, High, and Critical levels), Due Date (a date picker column), and Notes (a text column for additional context). It also creates three default groups: To Do, In Progress, and Done. This default structure covers the most common project management needs, and you can customize it at any time.',
          },
          {
            type: 'heading',
            text: 'Step 2: Explore the Default Columns',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Before adding tasks, take a moment to understand the default columns. Each column type has a specific editor that appears when you click on a cell.',
          },
          {
            type: 'list',
            items: [
              'Task — The title of each task. Click to edit the text directly, or click to open the full Task Edit Modal.',
              'Status — Click to see a dropdown with colored options: Not Started (gray), Working on it (amber), Done (green), and Stuck (red).',
              'Owner — Click to open a team member dropdown with avatars and full names. Select a person to assign them.',
              'Priority — Click to see a dropdown with colored levels: Low (light blue), Medium (blue), High (orange), and Critical (red).',
              'Due Date — Click to open a calendar date picker. Select a date to set the deadline.',
              'Notes — Click to type free-form text. Useful for descriptions, links, or context.',
            ],
          },
          {
            type: 'heading',
            text: 'Step 3: Add Custom Columns',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'If the default six columns are not enough, you can add more to track additional data points. AgileFlow supports 11 column types in total.',
          },
          {
            type: 'steps',
            items: [
              'Look for the "+" icon at the end of the column header row.',
              'Click it to open the New Column dialog.',
              'Enter a name for the column (e.g., "Story Points", "Sprint", "Tags").',
              'Select a column type from the dropdown: Text, Status, Priority, Date, People, Number, Budget, Checkbox, Dropdown, Tags, or Timeline.',
              'If you selected Dropdown, you will be prompted to define custom options with labels and colors.',
              'Click "Add Column" to insert the new column into the board.',
              'The column appears at the end of the header row. All existing tasks now have an empty cell for this column.',
            ],
          },
          {
            type: 'heading',
            text: 'Step 4: Add Tasks',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Tasks are the individual work items on your board. Each task is a row with data in each column. You can add as many tasks as you need.',
          },
          {
            type: 'steps',
            items: [
              'Find the "+ Add Item" button at the bottom of any group (e.g., at the bottom of "To Do").',
              'Click it and type a descriptive task title. Be specific: "Design login page mockup" is better than "Design".',
              'Press Enter or click the add button to create the task.',
              'The new task appears as a row in the group. All column cells are empty and ready to fill in.',
              'Click on the Status cell and select "Not Started" (or whichever status applies).',
              'Click on the Owner cell and assign a team member from the dropdown.',
              'Click on the Priority cell and set the appropriate priority level.',
              'Click on the Due Date cell and pick a deadline from the calendar.',
              'Click on the Notes cell and add any relevant context, links, or descriptions.',
              'Repeat to add more tasks. Each group can hold as many tasks as you need.',
            ],
          },
          {
            type: 'heading',
            text: 'Step 5: Organize with Groups',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Groups are sections within your board that categorize tasks. The default groups (To Do, In Progress, Done) follow a basic workflow, but you can create your own groups to match how your team thinks about work.',
          },
          {
            type: 'steps',
            items: [
              'Click the "New Group" button in the board toolbar to create a new group.',
              'Name the group something meaningful, like "Frontend", "Bug Fixes", "Sprint Backlog", or "Blocked".',
              'Choose a color for the group header to help visually distinguish it from other groups.',
              'Click "Create" to add the group. It appears on the board ready for tasks.',
              'Drag tasks from other groups into the new group, or add new tasks directly into it.',
            ],
          },
          {
            type: 'heading',
            text: 'Step 6: Invite Your Team',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow is most powerful when your entire team is on the platform. Inviting teammates allows you to assign tasks, track workload across the team, and collaborate in real time.',
          },
          {
            type: 'steps',
            items: [
              'Click the "Invite" button in the sidebar or board header area.',
              'Enter a teammate\'s email address.',
              'Select a role for them: Admin, Member, or Viewer.',
              'Click "Send Invite" to add them to your workspace.',
              'The invited person will need to create their own AgileFlow account using the same email address.',
              'Once they sign up and log in, they will have access to shared boards based on their assigned role.',
            ],
          },
          {
            type: 'warning',
            text: 'Team members must create their own account using the exact email address you invited them with. If they sign up with a different email, they will not be linked to your workspace.',
          },
          {
            type: 'tip',
            text: 'After creating your first board and adding a few tasks, try switching between views. Click the Kanban tab to see your tasks as cards organized by status. Click Timeline to see tasks on a Gantt chart. Each view shows the same data in a different way.',
          },
        ],
      },
      {
        id: 'understanding-interface',
        title: 'Understanding the Interface',
        description: 'Master the sidebar, top bar, search, AI assistant, and every UI element',
        content: [
          {
            type: 'paragraph',
            text: 'The AgileFlow interface is organized into three main areas: a collapsible sidebar for navigation, a top navigation bar for global actions, and a main content area where you interact with boards, backlogs, calendars, and other features. The layout is consistent across every page, so once you learn the structure, navigating becomes second nature.',
          },
          {
            type: 'heading',
            text: 'Sidebar Navigation',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The left sidebar is your primary navigation hub. It contains links to every major section of AgileFlow, organized from top to bottom in the order most teams use them. The sidebar is always visible on desktop screens and collapses into a hamburger menu on mobile devices and narrow browser windows.',
          },
          {
            type: 'list',
            items: [
              'Dashboard — Your home screen showing stats, recent boards, activity feed, and quick actions. This is where you land after logging in.',
              'Boards — A listing of all your project boards. Click any board to open it. Use the search bar to find boards by name.',
              'Backlog — Your product backlog with user stories and sprint planning. This is where you write stories, estimate effort, and plan sprints.',
              'Calendar — A monthly calendar view for scheduling meetings, milestones, deadlines, retrospectives, and other events.',
              'Analytics — Charts and metrics showing project health across all your boards, including completion rates, status distribution, team workload, and priority breakdown.',
              'AI Chat — A dedicated full-page AI assistant with conversation history, session management, and support for both Fast and Thinking response modes.',
            ],
          },
          {
            type: 'paragraph',
            text: 'At the bottom of the sidebar, you will find the user menu area. This provides access to Settings (profile, appearance, preferences), the Admin Panel (visible only to Admin-role users), the Help Center (the documentation you are reading now), and the Sign Out option. Your name and avatar appear here so you can confirm which account you are logged into.',
          },
          {
            type: 'heading',
            text: 'Top Navigation Bar',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The top bar runs across the full width of the page and contains global actions that are available regardless of which page you are on.',
          },
          {
            type: 'list',
            items: [
              'Global Search — A search input (or the Ctrl+K shortcut trigger) that lets you search across all boards and tasks instantly. Results are grouped and clickable.',
              'Notifications — A bell icon that shows a badge when you have unread notifications. Click it to see recent activity such as task assignments, status changes, sprint updates, and system alerts.',
              'Theme Toggle — A sun or moon icon that instantly switches between light and dark mode. One click swaps the entire interface color scheme.',
              'Profile Menu — Your avatar and name, which when clicked, provides access to profile settings and account options.',
            ],
          },
          {
            type: 'heading',
            text: 'Main Content Area',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The main content area takes up the majority of the screen and displays whatever page you have navigated to. On the Dashboard, you see stats and activity. On a Board, you see the table or Kanban view. On the Backlog page, you see user stories and sprints. The content area is fully responsive, adapting its layout for desktop, tablet, and mobile screens.',
          },
          {
            type: 'heading',
            text: 'Mobile and Responsive Behavior',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'On smaller screens (tablets and phones), the sidebar collapses automatically. A hamburger menu icon appears in the top-left corner of the screen. Tap this icon to slide the sidebar open. Tap anywhere outside the sidebar or select a navigation item to close it. All features remain accessible on mobile; the layout simply stacks vertically rather than using side-by-side panels.',
          },
          {
            type: 'heading',
            text: 'AI Assistant Access Points',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow provides two ways to interact with the AI assistant, each suited to different use cases.',
          },
          {
            type: 'list',
            items: [
              'Floating Chat Panel — A chat bubble icon in the bottom-right corner of any page. Click it to open a compact AI chat panel overlaid on your current view. This is ideal for quick questions, getting suggestions while working on a board, or running slash commands without leaving your current context.',
              'AI Chat Page — A full-page chat experience accessible from the "AI Chat" link in the sidebar. This provides a larger conversation area, session history (so you can revisit past conversations), mode selection (Fast vs. Thinking), and suggestion chips for common prompts. Use this when you want a dedicated, distraction-free AI interaction.',
            ],
          },
          {
            type: 'heading',
            text: 'Global Search (Ctrl+K)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Press Ctrl+K (or Cmd+K on Mac) at any time to open the global search dialog. This is the fastest way to find anything in AgileFlow. As you type, results appear in real time, grouped by boards and tasks. Click any result to navigate directly to that board or task. The search dialog can also be opened by clicking the search icon in the top navigation bar.',
          },
          {
            type: 'shortcut',
            keys: 'Ctrl + K',
            description: 'Open global search from anywhere in the application',
          },
          {
            type: 'tip',
            text: 'You can access Settings, the Admin Panel (if you are an Admin), the Help Center, and Sign Out from the user dropdown menu at the bottom of the sidebar. This menu is always accessible regardless of which page you are on.',
          },
        ],
      },
      {
        id: 'agile-methodology',
        title: 'Agile Methodology in AgileFlow',
        description: 'Learn Scrum, Kanban, sprints, user stories, and how they map to AgileFlow features',
        content: [
          {
            type: 'paragraph',
            text: 'Agile is a set of principles for software development and project management that emphasizes iterative delivery, team collaboration, and continuous improvement. Rather than planning an entire project upfront and delivering everything at the end, agile teams break work into small, manageable increments and deliver value frequently. AgileFlow is built around these principles, providing tools that directly support agile workflows.',
          },
          {
            type: 'heading',
            text: 'Scrum Framework',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Scrum is the most popular agile framework. It organizes work into fixed-length iterations called sprints, typically lasting one to four weeks. Each sprint begins with a planning session where the team selects work from a prioritized backlog, and ends with a review of what was accomplished and a retrospective to discuss process improvements.',
          },
          {
            type: 'paragraph',
            text: 'In AgileFlow, Scrum maps directly to the platform\'s features. The Backlog page serves as your product backlog where you write and prioritize user stories. The Sprint Planning feature lets you create sprints, set capacity, and drag stories from the backlog into a sprint. During the sprint, you track progress on boards using status columns and the Kanban view. At the end of the sprint, analytics data and the AI /performance command provide the data you need for retrospectives.',
          },
          {
            type: 'heading',
            text: 'Kanban Method',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Kanban is a visual workflow management method that focuses on limiting work in progress and optimizing the flow of tasks through stages. Unlike Scrum, Kanban does not use fixed sprints; instead, work flows continuously from "to do" through "in progress" to "done."',
          },
          {
            type: 'paragraph',
            text: 'AgileFlow supports Kanban through the Kanban board view, available on any board. Tasks appear as cards in columns representing workflow stages (Not Started, Working on it, Done, Stuck). You drag cards between columns to advance work. The visual layout makes it easy to spot bottlenecks, for example, if your "Working on it" column has twenty cards while "Done" has two, your team may be starting too much work without finishing it.',
          },
          {
            type: 'heading',
            text: 'User Stories',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A user story is a short description of a feature or requirement written from the user\'s perspective. The standard format is: "As a [type of user], I want [some goal] so that [some reason]." User stories focus on the value delivered to the user rather than technical implementation details.',
          },
          {
            type: 'paragraph',
            text: 'In AgileFlow, user stories live on the Backlog page. Each story has a title (often in the "As a... I want... so that..." format), a description for additional detail, a priority level, story points for effort estimation, and acceptance criteria that define when the story is complete. Stories can be assigned to sprints during sprint planning.',
          },
          {
            type: 'heading',
            text: 'Story Points and Estimation',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Story points are a unit of measure for estimating the effort required to complete a user story. They are intentionally abstract and relative, not tied to hours or days. A story worth 2 points is roughly twice the effort of a 1-point story, but the actual hours may vary.',
          },
          {
            type: 'paragraph',
            text: 'AgileFlow uses the Fibonacci sequence for story point values: 1, 2, 3, 5, 8, and 13. The increasing gaps in the sequence reflect the increasing uncertainty in larger estimates. A 1-point story is something small and well-understood. A 13-point story is a large, complex piece of work that should probably be broken into smaller stories.',
          },
          {
            type: 'list',
            items: [
              '1 point — Trivial change, well understood, minimal risk (e.g., fix a typo, change a label)',
              '2 points — Small task, clear scope, low complexity (e.g., add a form field, update a color)',
              '3 points — Moderate task, some complexity, clear approach (e.g., build a new component, add validation)',
              '5 points — Significant task, multiple parts, some unknowns (e.g., integrate a new API, redesign a page)',
              '8 points — Large task, substantial complexity, considerable risk (e.g., new feature with backend changes)',
              '13 points — Very large task, high uncertainty, should consider splitting (e.g., full module rewrite, new system integration)',
            ],
          },
          {
            type: 'heading',
            text: 'Velocity',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Velocity is the number of story points a team completes in a single sprint. Over time, velocity data creates a reliable baseline for sprint planning. If your team has averaged 25 points per sprint over the last three sprints, you can plan the next sprint with confidence that 25 points is a realistic commitment.',
          },
          {
            type: 'paragraph',
            text: 'AgileFlow tracks velocity automatically. As you complete sprints and mark stories as done, the Analytics page records your historical velocity. The AI assistant can also analyze your velocity trends when you use the /performance command.',
          },
          {
            type: 'heading',
            text: 'Burndown Charts',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A burndown chart shows the amount of work remaining in a sprint over time. The ideal line goes from the total committed points on day one down to zero on the last day. The actual line shows how the team is progressing. If the actual line is above the ideal line, the team is behind schedule. If it is below, the team is ahead.',
          },
          {
            type: 'paragraph',
            text: 'AgileFlow provides burndown data through the Analytics page and sprint tracking features. Use burndown trends to identify when the team is falling behind early in the sprint, rather than discovering it on the last day.',
          },
          {
            type: 'heading',
            text: 'Acceptance Criteria',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Acceptance criteria are specific, testable conditions that a user story must satisfy to be considered complete. They remove ambiguity about what "done" means and give developers clear targets to implement and testers clear criteria to verify.',
          },
          {
            type: 'paragraph',
            text: 'In AgileFlow, every user story has an acceptance criteria field where you can list these conditions. Good acceptance criteria are written in plain language and describe observable outcomes. For example: "When the user clicks Submit, the form data is saved and a confirmation message appears within 2 seconds."',
          },
          {
            type: 'heading',
            text: 'How Agile Concepts Map to AgileFlow',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Product Backlog → Backlog page with prioritized user stories',
              'Sprint → Sprint Planning feature with capacity, dates, and goals',
              'Sprint Planning → Plan Sprint dialog with story selection and capacity indicator',
              'Daily Standup → Kanban view showing current work status at a glance',
              'Sprint Review → Board analytics showing completion rates and task distribution',
              'Sprint Retrospective → AI /performance command and analytics data for team reflection',
              'User Story → Backlog story with title, description, priority, points, and acceptance criteria',
              'Task Board → AgileFlow Board with Table, Kanban, Calendar, and Timeline views',
              'Velocity → Automatically tracked story points completed per sprint in Analytics',
              'Burndown → Sprint progress tracking with committed vs. completed point comparisons',
            ],
          },
          {
            type: 'tip',
            text: 'You do not need to follow Scrum perfectly to benefit from AgileFlow. Many teams use a hybrid approach: they maintain a backlog, run informal sprints, and use Kanban boards for daily work. AgileFlow is flexible enough to support whatever methodology works best for your team.',
          },
        ],
      },
      {
        id: 'keyboard-shortcuts',
        title: 'Keyboard Shortcuts & Navigation',
        description: 'Speed up your workflow with keyboard shortcuts and navigation tips',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow supports keyboard shortcuts to help you navigate faster and perform common actions without reaching for the mouse. Power users can significantly speed up their workflow by learning these shortcuts, especially the global search shortcut which is the fastest way to get anywhere in the application.',
          },
          {
            type: 'heading',
            text: 'Global Search Shortcut',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The most important keyboard shortcut in AgileFlow is the global search. Press Ctrl+K (or Cmd+K on Mac) from any page to instantly open the search dialog. This searches across all boards and tasks, showing results as you type. Click any result to jump directly to that board or task. This is the fastest way to navigate when you know what you are looking for.',
          },
          {
            type: 'shortcut',
            keys: 'Ctrl + K',
            description: 'Open global search dialog from any page',
          },
          {
            type: 'heading',
            text: 'Theme Toggle',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Click the sun or moon icon in the top navigation bar to toggle between light and dark mode. While there is no dedicated keyboard shortcut for this, the icon is always accessible in the top bar for quick access.',
          },
          {
            type: 'heading',
            text: 'Sidebar Navigation',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The sidebar provides single-click access to all major sections. On desktop, the sidebar is always visible. On mobile or narrow windows, tap the hamburger menu icon to open the sidebar. Each sidebar item corresponds to a page: Dashboard, Boards, Backlog, Calendar, Analytics, and AI Chat.',
          },
          {
            type: 'heading',
            text: 'Inline Editing',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When working in the Table view on a board, you can click any cell to edit it directly. For text fields, typing immediately replaces the content. For dropdown fields (Status, Priority, People), clicking opens the selection menu. For date fields, clicking opens the calendar picker. For checkbox fields, a single click toggles the value. Press Enter or Tab to confirm edits and move to the next field.',
          },
          {
            type: 'heading',
            text: 'Drag and Drop',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Drag and drop is a core interaction pattern in AgileFlow. In the Table view, click and hold a task row to drag it to a new position within the same group or into a different group. In the Kanban view, grab a card and drag it to a different column to update its status. In the Backlog, drag stories to reorder them by priority. All drag and drop changes save automatically.',
          },
          {
            type: 'heading',
            text: 'Navigation Tips',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Use Ctrl+K to jump to any board or task without clicking through the sidebar',
              'Click your browser\'s back button to return to the previous page within AgileFlow',
              'Collapse sidebar groups on boards to focus on specific sections of work',
              'Use the view selector tabs (Table, Kanban, Calendar, Timeline) to switch perspectives without losing data',
              'Click on board names in the Dashboard\'s Recent Boards section to jump directly into a board',
              'Use the filter and sort tools on boards to narrow down to exactly the tasks you need',
              'On the Calendar page, use the arrow buttons to navigate between months quickly',
            ],
          },
          {
            type: 'tip',
            text: 'The global search shortcut (Ctrl+K) is the single most powerful navigation tool in AgileFlow. If you only learn one shortcut, make it this one. It lets you jump to any board or task in seconds, regardless of which page you are currently on.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. DASHBOARD
  // ─────────────────────────────────────────────
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your central hub for project overview, metrics, and quick actions',
    icon: 'LayoutGrid',
    articles: [
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        description: 'Understand the layout, data loading, and purpose of every Dashboard section',
        content: [
          {
            type: 'paragraph',
            text: 'The Dashboard is your home screen in AgileFlow. It is the first page you see after logging in, and it is designed to give you a complete snapshot of your project health in a single glance. Rather than forcing you to visit multiple pages to understand what is happening across your projects, the Dashboard aggregates the most important information into one view: key performance metrics, your most recently updated boards, a feed of recent activity, and shortcut buttons for common actions.',
          },
          {
            type: 'heading',
            text: 'Dashboard Layout',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Dashboard is organized into four distinct sections, each serving a specific purpose. These sections are arranged vertically on the page, with the most important information at the top.',
          },
          {
            type: 'list',
            items: [
              'Greeting Banner — At the top of the page, a personalized greeting based on the time of day welcomes you by name. This confirms you are logged into the correct account and provides a human touch to the experience.',
              'Stats Overview — Four KPI (Key Performance Indicator) cards arranged in a row, showing Total Tasks, Active Boards, Team Members, and Completion Rate. These numbers update in real time as you create and complete work.',
              'Recent Boards — A grid of your most recently updated project boards, showing each board\'s title, icon, color, and a link to open it. This gives you quick access to the projects you are currently working on without navigating to the Boards page.',
              'Activity Feed — A chronological stream of recent events across all your projects, showing what changed, what was created, and what was completed. Each entry is timestamped and clickable.',
              'Quick Actions — Shortcut buttons to create a new board or a new user story without leaving the Dashboard. These reduce friction for common tasks.',
            ],
          },
          {
            type: 'heading',
            text: 'Real-Time Data Loading',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When you visit the Dashboard, it fetches the latest data from the server. You may see brief loading indicators (skeleton placeholders or spinners) while data loads. If a network error occurs or the data fails to load, a retry button appears so you can refresh the data without reloading the entire page. This retry mechanism is built into every data section of the Dashboard individually, so a failure in one section does not prevent other sections from loading.',
          },
          {
            type: 'heading',
            text: 'Data Scope',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Dashboard shows data across all your boards and projects. The stats count tasks, boards, and team members from your entire workspace. The Recent Boards section fetches your 10 most recently updated boards. The Activity Feed shows the 20 most recent events. For a complete, unfiltered view of all your projects, navigate to the dedicated Boards, Backlog, or Analytics pages.',
          },
          {
            type: 'tip',
            text: 'Make the Dashboard your starting point each day. A quick look at the stats, recent boards, and activity feed tells you where things stand and what needs your attention, without diving into individual boards.',
          },
        ],
      },
      {
        id: 'stats-metrics',
        title: 'Stats & Metrics',
        description: 'Deep dive into each KPI card: what it measures, how it is calculated, and what to watch for',
        content: [
          {
            type: 'paragraph',
            text: 'The Stats Overview section at the top of the Dashboard displays four metric cards. These are your at-a-glance health indicators, designed to answer the question "How are we doing?" without requiring you to click into any specific board or report. Understanding what each metric measures and what to look for helps you make better decisions about where to focus your team\'s energy.',
          },
          {
            type: 'heading',
            text: 'Total Tasks',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'This card shows the total number of tasks across all your boards, regardless of their status. It includes tasks that are not started, in progress, done, and stuck. This number gives you a sense of the overall scope of work in your workspace. A rapidly growing task count might indicate scope creep or a need to break projects into smaller, more manageable boards.',
          },
          {
            type: 'paragraph',
            text: 'What to watch for: If Total Tasks keeps growing but Completion Rate stays flat or drops, your team may be adding work faster than they can complete it. Consider limiting new task creation until the existing backlog is reduced.',
          },
          {
            type: 'heading',
            text: 'Active Boards',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'This card shows the number of boards in your workspace. Each board represents a project or workstream. This metric helps you understand the breadth of work your team is managing. A high number of active boards might indicate that work is spread across too many projects, making it harder for team members to focus.',
          },
          {
            type: 'paragraph',
            text: 'What to watch for: If you have many active boards but most have very few tasks or have not been updated recently, consider archiving or consolidating inactive boards to reduce noise and improve focus.',
          },
          {
            type: 'heading',
            text: 'Team Members',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'This card shows the number of people collaborating in your workspace. This includes everyone who has an account and is part of your team, regardless of their role (Admin, Member, or Viewer). This number helps you understand the size of your team for capacity planning purposes.',
          },
          {
            type: 'paragraph',
            text: 'What to watch for: If you have a high number of tasks but a low number of team members, your team may be overloaded. Use this ratio to assess whether you need to bring on additional help or reduce scope. Also cross-reference with the Analytics page\'s team workload chart to see how evenly work is distributed.',
          },
          {
            type: 'heading',
            text: 'Completion Rate',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'This card shows the percentage of tasks marked as "Done" across all your boards. It is calculated as: (number of tasks with Done status / total number of tasks) * 100. This is your single most important health metric because it tells you how much of your total work has been completed.',
          },
          {
            type: 'paragraph',
            text: 'What to watch for: A healthy completion rate depends on where you are in a project cycle. Early in a project, a low rate is normal because work is just starting. Mid-project, you want to see the rate climbing steadily. Near a deadline, a stagnant or declining rate is a red flag. If your completion rate seems low, check the Analytics page for a breakdown of which statuses tasks are stuck in — the "Stuck" status often reveals blockers that need attention.',
          },
          {
            type: 'heading',
            text: 'Interpreting Metrics Together',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The four metrics are most valuable when read together. For example, a high task count with a high completion rate means your team is delivering effectively at scale. A high task count with a low completion rate and few team members suggests the team is overwhelmed. Use these signals to decide whether to focus on finishing existing work, redistributing tasks, or adjusting project scope.',
          },
          {
            type: 'tip',
            text: 'If your completion rate seems low, do not assume the team is underperforming. First check if you have many tasks stuck in "Working on it" or "Stuck" status. These tasks may need unblocking, clarification, or reassignment rather than more effort. The Analytics page provides a detailed status distribution chart.',
          },
        ],
      },
      {
        id: 'activity-feed',
        title: 'Activity Feed',
        description: 'How activity tracking works, what appears in the feed, and how to use it',
        content: [
          {
            type: 'paragraph',
            text: 'The Activity Feed on the Dashboard provides a chronological list of recent events across all your projects. It acts as a team-wide changelog, helping you understand what happened while you were away and what your teammates have been working on. The feed is automatically populated; there is nothing you need to configure or enable.',
          },
          {
            type: 'heading',
            text: 'What Appears in the Feed',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Activity Feed captures a wide range of actions that occur within your workspace. Every time a task, board, story, or sprint is created, modified, or completed, an entry is logged.',
          },
          {
            type: 'list',
            items: [
              'Tasks created, updated, or deleted across any board',
              'Status changes on tasks (e.g., a task moved from "Working on it" to "Done")',
              'Priority changes on tasks',
              'New boards created or existing boards renamed',
              'Column additions and modifications on boards',
              'Sprint creation, start, and completion events',
              'User story creation and updates in the backlog',
              'Team member additions and role changes',
              'Assignment changes when tasks are assigned or reassigned to team members',
            ],
          },
          {
            type: 'heading',
            text: 'Timestamps and Navigation',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Each activity entry includes a relative timestamp such as "2 hours ago", "yesterday", or "3 days ago". This helps you quickly gauge how recent the change is. Activity entries are clickable — click on an entry to navigate directly to the related board or task. This lets you drill down into details without searching for the item manually.',
          },
          {
            type: 'heading',
            text: 'Activity Tracking Mechanism',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Activity is tracked automatically by the system. You do not need to manually log actions or enable tracking for specific boards. Every modification to a board, task, or story generates a log entry with the action type, the affected item, and a timestamp. The Dashboard shows the 20 most recent entries; for board-specific activity history, visit the individual board\'s analytics panel.',
          },
          {
            type: 'heading',
            text: 'Using the Feed Effectively',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Activity Feed is most useful during three scenarios: at the start of your workday to catch up on what happened overnight, before a standup meeting to review recent progress, and after being away for a period to understand what changed in your absence. Make it a habit to scan the feed each morning before diving into your tasks.',
          },
          {
            type: 'tip',
            text: 'The Activity Feed shows changes across all your boards. If you want to see activity for a specific board only, open that board and check its analytics panel, which includes board-specific activity history.',
          },
        ],
      },
      {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Create boards and user stories instantly without leaving the Dashboard',
        content: [
          {
            type: 'paragraph',
            text: 'Quick Actions are shortcut buttons on the Dashboard that let you create new items without navigating to a different page. They are designed for capturing ideas and starting new work quickly, reducing the friction between having an idea and recording it in the system.',
          },
          {
            type: 'heading',
            text: 'Available Quick Actions',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Create Board — Opens the board creation dialog directly from the Dashboard. Fill in a title, optional description, icon, and color, then click "Create Board." The new board appears immediately in the Recent Boards section and on the Boards page.',
              'Create Story — Opens the user story creation dialog from the Dashboard. Write a story title, set priority, add story points and acceptance criteria, then click "Create Story." The story is added to your product backlog and can be assigned to a sprint later.',
            ],
          },
          {
            type: 'heading',
            text: 'When to Use Quick Actions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Quick Actions are ideal when you have a sudden idea or need to capture something quickly. During a meeting, someone might suggest a new project; use Create Board to set it up immediately. During a brainstorming session, use Create Story to log feature ideas into the backlog without interrupting your flow. The dialogs are intentionally streamlined for speed.',
          },
          {
            type: 'paragraph',
            text: 'For more detailed setup such as customizing columns, adding multiple stories at once, or configuring sprint parameters, navigate to the dedicated Boards or Backlog pages where you have access to the full set of tools and options.',
          },
          {
            type: 'heading',
            text: 'What Happens After Creation',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Items created via Quick Actions are fully functional. A board created from the Dashboard is identical to one created from the Boards page; it comes with the default six columns and three groups. A story created from the Dashboard is added to the product backlog with whatever fields you filled in and is immediately available for sprint planning.',
          },
          {
            type: 'tip',
            text: 'Quick Actions are about speed. Do not worry about filling in every field perfectly. You can always edit the board or story later from its dedicated page. The goal is to capture the idea while it is fresh.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. BOARDS & TASKS
  // ─────────────────────────────────────────────
  {
    id: 'boards-tasks',
    title: 'Boards & Tasks',
    description: 'Create boards, manage tasks, and organize your work with views, columns, and groups',
    icon: 'Kanban',
    articles: [
      {
        id: 'creating-board',
        title: 'Creating a Board',
        description: 'Full creation flow, default structure, board settings, and naming best practices',
        content: [
          {
            type: 'paragraph',
            text: 'Boards are the foundation of project management in AgileFlow. Each board represents a project, a workstream, a sprint, or any collection of related tasks. You can create as many boards as you need, and each one operates independently with its own columns, groups, views, and settings. When you create a board, AgileFlow automatically sets up a sensible default structure so you can start working immediately.',
          },
          {
            type: 'heading',
            text: 'How to Create a Board',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Navigate to the Boards page by clicking "Boards" in the left sidebar.',
              'Click the "+ New Board" button in the top-right corner of the page.',
              'Enter a board title. This is the only required field. Choose something descriptive that your team will recognize.',
              'Optionally add a description to explain the board\'s purpose, scope, or goals. This is visible when viewing the board and helps teammates understand the context.',
              'Choose an icon emoji that visually represents the project. This icon appears in the sidebar, board listings, and search results.',
              'Select a color theme for the board header. Different colors help you distinguish boards at a glance when you have many projects.',
              'Click "Create Board" to finalize the creation.',
            ],
          },
          {
            type: 'heading',
            text: 'Default Board Structure',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'After creation, the board opens automatically in the Table view. It comes pre-configured with a structure that covers the most common project management needs, so you do not need to set up anything before adding tasks.',
          },
          {
            type: 'paragraph',
            text: 'The default board includes six columns:',
          },
          {
            type: 'list',
            items: [
              'Task — The title column (always present). This is the name of each task and is the only column that cannot be removed.',
              'Status — A status dropdown with four options: Not Started (gray), Working on it (amber), Done (green), and Stuck (red).',
              'Owner — A People column that lets you assign a team member from a dropdown with avatars and full names.',
              'Priority — A priority dropdown with four levels: Low (light blue), Medium (blue), High (orange), and Critical (red).',
              'Due Date — A date picker column for setting task deadlines.',
              'Notes — A text column for adding descriptions, links, or any additional context.',
            ],
          },
          {
            type: 'paragraph',
            text: 'The default board also includes three groups:',
          },
          {
            type: 'list',
            items: [
              'To Do — For tasks that have not been started yet.',
              'In Progress — For tasks currently being worked on.',
              'Done — For completed tasks.',
            ],
          },
          {
            type: 'heading',
            text: 'Board Settings',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'You can edit a board\'s title, description, icon, and color at any time after creation. Click the board title in the header area to rename it. Use the board settings menu (accessible from the board header) to update the description, icon, or color. These settings are cosmetic and do not affect the board\'s data or functionality.',
          },
          {
            type: 'heading',
            text: 'Naming Best Practices',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Be specific — "Sprint 24: User Authentication" is better than "Sprint 24" or "Auth".',
              'Include the project or team name when you have many boards — "Marketing: Q2 Campaign" or "Frontend: Dashboard Redesign".',
              'Use consistent naming conventions across your team. If everyone names sprints the same way, boards become easier to find and sort.',
              'Keep titles concise but descriptive. The title appears in the sidebar, search results, and dashboard, so it should be recognizable at a glance.',
            ],
          },
          {
            type: 'tip',
            text: 'After creating a board, it opens automatically in the Table view with the default columns and groups. You can immediately start adding tasks without any additional setup. Customize columns and groups later as your workflow evolves.',
          },
        ],
      },
      {
        id: 'board-views',
        title: 'Board Views',
        description: 'Table, Kanban, Calendar, and Timeline views explained in detail with use cases',
        content: [
          {
            type: 'paragraph',
            text: 'Every board in AgileFlow supports four different view types: Table, Kanban, Calendar, and Timeline. You can switch between views at any time using the view selector tabs at the top of the board. All four views display the same underlying data; they simply present it in different visual formats. Changing a task\'s status in the Kanban view updates it in the Table view too. No data is lost or duplicated when switching views.',
          },
          {
            type: 'heading',
            text: 'Table View (Default)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Table view is the default and most detailed view. It displays tasks as rows in a spreadsheet-like grid, with each column representing a data field. This view is best for situations where you need to see and edit multiple data points for many tasks at once. It is the power user\'s view and the one where you will spend most of your time when managing task details.',
          },
          {
            type: 'list',
            items: [
              'Inline Editing — Click any cell to edit its value directly. Each column type has its own editor: dropdowns for Status and Priority, calendar picker for Date, team member selector for People, text input for Notes, and so on.',
              'Column Headers — Each column has a header showing the column name. The headers define the structure of the board.',
              'Groups — Tasks are organized into collapsible groups (the colored header rows like "To Do", "In Progress", "Done"). Click the chevron to collapse or expand a group.',
              'Summary Rows — Each group includes a summary row at the bottom showing aggregated metrics: task counts, status distribution, and totals for numeric columns.',
              'Task Title Click — Click a task\'s title to open the full Task Edit Modal, which shows all fields in a form layout for comprehensive editing.',
            ],
          },
          {
            type: 'paragraph',
            text: 'When to use Table view: Use it for sprint planning sessions where you need to see priorities, assignees, and dates side by side. Use it when you are batch-updating many tasks. Use it when you need the most complete view of all task data at once.',
          },
          {
            type: 'heading',
            text: 'Kanban View',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Kanban view organizes tasks into vertical columns based on a grouping criterion, most commonly the Status field. Each column represents a workflow stage, and tasks appear as cards within those columns. This visual layout is inspired by physical Kanban boards where sticky notes move across a whiteboard as work progresses.',
          },
          {
            type: 'list',
            items: [
              'Drag and Drop — Grab a task card and drag it from one column to another. When you drop a card into a new column, the corresponding field (e.g., Status) updates automatically. The change is saved immediately.',
              'Card Contents — Each Kanban card displays the task title, a colored status or priority badge, the due date (if set), and the assignee\'s avatar. This gives you essential context without opening the task.',
              'Column Counts — Each column header shows the number of tasks in that column, helping you spot overloaded stages at a glance.',
              'Grouping Options — By default, the Kanban view groups by Status (Not Started, Working on it, Done, Stuck). You can change the grouping to People (one column per team member) or Priority (one column per priority level) using the Group By option.',
              'Reordering — Within a column, you can drag cards up or down to set their order. This is useful for indicating relative priority within a single status.',
            ],
          },
          {
            type: 'paragraph',
            text: 'When to use Kanban view: Use it during daily standups to see what everyone is working on. Use it to visualize workflow and spot bottlenecks. Use it when you want a high-level overview of work status without getting into the details of every field. If one column has far more cards than others, that stage is a bottleneck in your workflow.',
          },
          {
            type: 'heading',
            text: 'Calendar View',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Calendar view displays tasks on a monthly calendar based on their due dates. Tasks without a date value do not appear in this view. Each task shows as a colored block on its due date, making it easy to see which days have the most work scheduled and where deadlines cluster.',
          },
          {
            type: 'list',
            items: [
              'Monthly Grid — Tasks are plotted on a standard monthly calendar grid. Each day cell shows the tasks due on that date.',
              'Navigation — Use the left and right arrow buttons in the calendar header to navigate between months. The current month and year are displayed prominently.',
              'Task Display — Tasks appear as compact colored blocks showing their title. The color may correspond to their status or priority.',
              'Click to View — Click on a task in the calendar to see its full details or navigate to it in the Table view.',
              'Date Dependencies — Only tasks with a Due Date or Date column value appear in this view. If a task has no date set, it will not show up.',
            ],
          },
          {
            type: 'paragraph',
            text: 'When to use Calendar view: Use it for deadline-driven projects where timing is critical. Use it during release planning to see how deliverables are distributed across a month. Use it to identify date conflicts where too many tasks are due on the same day, allowing you to redistribute workload.',
          },
          {
            type: 'heading',
            text: 'Timeline View',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Timeline view is a Gantt-style visualization that shows tasks as horizontal bars spanning from a start date to an end date along a time axis. It is the most powerful view for understanding task duration, overlap, and project scheduling. This view requires either a Timeline column (which stores a start and end date range) or two or more Date columns on the board.',
          },
          {
            type: 'list',
            items: [
              'Horizontal Bars — Each task appears as a colored bar spanning from its start date to its end date. Longer bars mean longer tasks. Overlapping bars show parallel work.',
              'Priority Color Coding — Bars are color-coded by priority level: Critical tasks are red, High priority tasks are orange, Medium priority tasks are blue, and Low priority tasks are light blue. This lets you instantly see which tasks are the most important.',
              'Three Zoom Levels — Use the zoom controls to switch between three levels of detail. Week zoom shows individual days with day-of-week labels. Month zoom (the default) shows days with weekday abbreviations across the current month. Quarter zoom shows weeks across a three-month span, ideal for roadmap-level planning.',
              'Navigation Controls — Previous and Next buttons scroll the timeline left and right. A Today button jumps to the current date. Today\'s date is highlighted with a distinct marker for easy reference.',
              'Weekend Backgrounds — Saturday and Sunday columns have a muted (slightly gray) background, visually distinguishing weekends from working days. This helps with realistic scheduling.',
              'Data Requirements — The Timeline view requires tasks to have date range data. If your board has a Timeline column, that column\'s start and end dates are used. If your board has two or more Date columns, you can select which ones represent the start and end dates. Tasks without date range data do not appear.',
            ],
          },
          {
            type: 'paragraph',
            text: 'When to use Timeline view: Use it for project roadmapping to see the big picture of when everything is happening. Use it to identify scheduling conflicts where tasks overlap and might compete for the same resources. Use it during sprint planning to visualize how work is distributed across the sprint period. The Quarter zoom is especially useful for presenting to stakeholders who need to see the multi-month outlook.',
          },
          {
            type: 'tip',
            text: 'Switch views using the view selector tabs at the top of any board. Your view preference is remembered per board, so your Kanban-oriented daily board and your Timeline-oriented roadmap board each remember their last used view.',
          },
        ],
      },
      {
        id: 'managing-columns',
        title: 'Managing Columns',
        description: 'All 11 column types explained with use cases, editors, and management options',
        content: [
          {
            type: 'paragraph',
            text: 'Columns define what data you track for each task on a board. AgileFlow supports 11 different column types, each designed for a specific kind of information. The right column configuration can make your board significantly more useful, so it is worth understanding what each type does and when to use it.',
          },
          {
            type: 'heading',
            text: 'Adding a Column',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Open a board and look for the "+" icon at the end of the column header row.',
              'Click it to open the New Column dialog.',
              'Enter a column name that describes what data this column tracks (e.g., "Sprint Points", "Department", "Reviewed").',
              'Select the column type from the dropdown. Each type is listed with a brief description.',
              'If you selected Dropdown type, you will see fields to define your custom options. Enter labels and pick colors for each option.',
              'Click "Add Column" to add it to the board. The new column appears at the end of the header row, and all existing tasks gain an empty cell for this column.',
            ],
          },
          {
            type: 'heading',
            text: 'All 11 Column Types',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Text — A free-form text field. Click to type any text: descriptions, notes, links, or references. Use it for fields that need flexible, unstructured content like "Notes", "Description", or "Meeting Link". The cell displays the text directly, truncated if it is long.',
              'Status — A predefined set of workflow states with color coding. Options: Not Started (gray), Working on it (amber), Done (green), and Stuck (red). Click the cell to see a dropdown of colored status options. Use it to track where a task is in its lifecycle. This is the column that drives the Kanban view grouping.',
              'Priority — A predefined set of urgency levels with color coding. Options: Low (light blue), Medium (blue), High (orange), and Critical (red). Click the cell to see a dropdown of colored priority options. Use it to indicate how important or urgent a task is relative to others.',
              'Date — A date picker field. Click the cell to open a calendar popup where you can select a date. Use it for deadlines, due dates, start dates, or any date-based tracking. Tasks with dates appear in the Calendar view.',
              'People — A team member assignment field. Click the cell to open a dropdown showing all workspace members with their avatars and full names. Select a person to assign them to the task. Use it for "Owner", "Assignee", "Reviewer", or any role-based assignment.',
              'Number — A numeric input field. Click the cell to type a number. Use it for story points, hours, effort estimates, quantities, or any numeric metric. Group summaries automatically total Number columns.',
              'Budget — A currency-formatted field that displays values with a dollar sign. Click the cell to type a number, and it displays as a formatted dollar amount. Use it for cost tracking, budget allocation, or financial estimates.',
              'Checkbox — A simple boolean toggle. A single click checks or unchecks the box. Use it for yes/no fields like "Approved", "Reviewed", "Deployed", or "Paid". Checked items display a filled checkbox; unchecked items display an empty one.',
              'Dropdown — A custom dropdown with user-defined options. When creating this column, you define the options (each with a label and optional color). Click the cell to see your custom options. Use it when you need a fixed set of choices that are specific to your workflow, like "Department", "Component", or "Sprint".',
              'Tags — A multi-select label field with colored badges. Click the cell to see predefined suggestions (Urgent, Bug, Feature, Marketing, Design) plus any custom tags you create. You can select multiple tags per task. Tags appear as colored badges in the cell. Use it for categorization, labeling, or any scenario where a task can belong to multiple categories.',
              'Timeline — A date range picker with a start date and end date. Click the cell to set both dates. The Timeline view uses this column to render task bars. Use it when you need to track task duration rather than a single date. Essential for Gantt-style timeline planning.',
            ],
          },
          {
            type: 'heading',
            text: 'Column Management',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Column Order — Columns appear in the order they were added. The Task (title) column is always first and cannot be moved or removed.',
              'Hiding Columns — Use the "Hide" menu in the board toolbar to temporarily hide columns you do not need. Hidden columns retain their data; they are just not visible in the current view.',
              'Deleting Columns — Columns can be deleted from the column settings. This permanently removes the column and all its data from every task on the board.',
            ],
          },
          {
            type: 'warning',
            text: 'Deleting a column removes that data field from all tasks on the board permanently. This action cannot be undone. Before deleting, make sure no tasks have important data in that column. Consider hiding the column instead if you might need the data later.',
          },
          {
            type: 'tip',
            text: 'Start with the default columns and add more only when you need them. A board with too many columns can feel cluttered. Use the Hide menu to show only the columns relevant to your current task, and unhide others when needed.',
          },
        ],
      },
      {
        id: 'working-with-tasks',
        title: 'Working with Tasks',
        description: 'Create, edit inline, use the Task Edit Modal, and manage tasks through their lifecycle',
        content: [
          {
            type: 'paragraph',
            text: 'Tasks (also called items) are the core units of work in AgileFlow. Each task is a row on a board with data in each column. Tasks represent anything that needs to be done: code to write, designs to create, meetings to prepare for, bugs to fix, or features to ship. Understanding how to create, edit, and manage tasks efficiently is fundamental to using AgileFlow effectively.',
          },
          {
            type: 'heading',
            text: 'Creating Tasks',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Navigate to a board and find the group where you want the task to live (e.g., "To Do").',
              'Click the "+ Add Item" button at the bottom of the group.',
              'Type a descriptive task title. Be specific and action-oriented: "Implement user login API endpoint" is better than "Login". Good task titles communicate what needs to be done without opening the task.',
              'Press Enter or click the add button to create the task.',
              'The new task appears as a row in the group with empty data cells for each column.',
            ],
          },
          {
            type: 'heading',
            text: 'Inline Editing',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The fastest way to update task data is inline editing. In the Table view, click on any cell to activate its editor. Each column type has its own editor optimized for the data it holds.',
          },
          {
            type: 'list',
            items: [
              'Status — Click to open a colored dropdown. Select Not Started, Working on it, Done, or Stuck. The cell immediately shows the selected status with its color.',
              'Priority — Click to open a colored dropdown. Select Low, Medium, High, or Critical. The cell displays the chosen priority with its color indicator.',
              'Date — Click to open a calendar popup. Navigate to the desired month and click a day to set the date. The cell displays the selected date.',
              'People — Click to open a team member dropdown showing avatars and full names. Select a person to assign them. The cell shows the assignee\'s avatar.',
              'Number and Budget — Click to activate a numeric input. Type a number and press Enter or click away to save. Budget cells format the value with a dollar sign.',
              'Checkbox — A single click toggles the checkbox between checked and unchecked. No additional editor appears.',
              'Dropdown — Click to see your custom options. Select one to set the value.',
              'Tags — Click to see predefined and custom tag options. Select multiple tags; they appear as colored badges in the cell.',
              'Text — Click to activate a text input. Type your content and press Enter or click away to save.',
              'Timeline — Click to open a date range picker. Set the start date and end date for the task.',
            ],
          },
          {
            type: 'heading',
            text: 'Task Edit Modal',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'For a more comprehensive editing experience, click on a task\'s title to open the Task Edit Modal. This dialog presents all the task\'s fields in a form layout, making it easy to review and update multiple fields at once without scrolling across columns.',
          },
          {
            type: 'list',
            items: [
              'The task title appears at the top of the modal and can be edited directly.',
              'Each column on the board appears as a labeled form field with its appropriate editor.',
              'All changes are made within the modal and submitted together.',
              'Click "Save" to apply all changes at once.',
              'Click "Delete" to permanently remove the task. A confirmation prompt appears to prevent accidental deletion.',
              'Click outside the modal or press the X button to close without saving.',
            ],
          },
          {
            type: 'heading',
            text: 'Task Lifecycle',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A typical task moves through several stages during its life. While AgileFlow does not enforce a specific workflow, most teams follow a pattern similar to this:',
          },
          {
            type: 'list',
            items: [
              'Created — A new task is added to a board, usually in the "To Do" group with "Not Started" status.',
              'Assigned — A team member is assigned via the People column. The task now has an owner responsible for its completion.',
              'In Progress — The assignee begins work and updates the status to "Working on it". The task moves to the "In Progress" group.',
              'Blocked (optional) — If the task cannot proceed due to dependencies or issues, the status changes to "Stuck". The task needs attention to unblock it.',
              'Completed — The work is done. The status changes to "Done", and the task moves to the "Done" group.',
            ],
          },
          {
            type: 'tip',
            text: 'Use inline editing for quick, single-field updates like changing a status or assigning a person. Use the Task Edit Modal when you need to review and update multiple fields at once, or when you want a focused, form-style editing experience.',
          },
        ],
      },
      {
        id: 'groups-organization',
        title: 'Groups & Organization',
        description: 'Create groups, collapse sections, use Group By, and understand group summaries',
        content: [
          {
            type: 'paragraph',
            text: 'Groups are sections within a board that organize tasks into logical clusters. They act as categories, phases, swimlanes, or any other organizational scheme that makes sense for your project. Groups give structure to your task list, making large boards manageable by dividing them into focused sections. Without groups, a board with hundreds of tasks would be overwhelming; with groups, it becomes navigable.',
          },
          {
            type: 'heading',
            text: 'Creating Groups',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click the "New Group" button in the board toolbar at the top of the board.',
              'Enter a name for the group. Choose something that describes the category of tasks it will contain (e.g., "Frontend Tasks", "Bug Fixes", "Sprint Backlog", "Blocked", "Ready for QA").',
              'Choose a color for the group header. Colors help you visually distinguish groups from each other, especially on boards with many sections.',
              'Click "Create" to add the group to the board. It appears on the board ready to receive tasks.',
            ],
          },
          {
            type: 'heading',
            text: 'Collapsing and Expanding Groups',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Each group has a chevron icon in its header row that toggles between expanded and collapsed states. Collapsing a group hides its tasks, leaving just the group header visible. This is invaluable for reducing visual clutter when you are focused on specific sections of work. For example, you might collapse the "Done" group to focus on active tasks, or collapse all groups except the one you are currently working in.',
          },
          {
            type: 'heading',
            text: 'Group By Options',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The "Group By" menu in the board toolbar lets you automatically reorganize all tasks into groups based on a column value. Instead of manually maintaining groups, you can let AgileFlow dynamically create groups for each unique value in a field.',
          },
          {
            type: 'list',
            items: [
              'Group by Status — Creates one group for each status value: "Not Started", "Working on it", "Done", and "Stuck". Tasks automatically sort into the group matching their status.',
              'Group by Priority — Creates one group for each priority level: "Low", "Medium", "High", and "Critical". Useful for seeing the most urgent work at the top.',
              'Group by Assignee — Creates one group for each team member. Tasks are grouped by who is assigned to them. This is excellent for workload review and standup meetings.',
              'Group by Date — Creates groups based on due date ranges such as "This Week", "Next Week", "This Month", or "Overdue". Useful for deadline-focused planning.',
            ],
          },
          {
            type: 'heading',
            text: 'Group Summaries',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Each group includes a summary row at the bottom that shows aggregated metrics for the tasks in that group. Summaries include the total task count, a visual breakdown of status distribution (showing colored segments for each status), and totals for numeric columns like Number and Budget. These summaries update automatically as you add, remove, or modify tasks.',
          },
          {
            type: 'heading',
            text: 'Color Coding',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Group header colors serve a practical purpose beyond aesthetics. When you have many groups, colors provide instant visual orientation. Teams often adopt color conventions: red for blocked items, green for completed work, blue for active sprints, and yellow for upcoming tasks. Consistent color usage across boards makes navigating between projects faster.',
          },
          {
            type: 'tip',
            text: 'Combine Group By with filters to create powerful views. For example, group by Priority and filter to show only tasks assigned to you. Or group by Assignee and filter to show only "Working on it" and "Stuck" status. These combinations are especially useful in meetings.',
          },
        ],
      },
      {
        id: 'filtering-sorting',
        title: 'Filtering & Sorting',
        description: 'Filter by status, priority, person, and date; sort by any column; use the Hide menu',
        content: [
          {
            type: 'paragraph',
            text: 'As boards grow with tasks, finding the right information becomes essential. AgileFlow provides a powerful filter panel, per-column sorting, and a column visibility menu to help you narrow down to exactly the tasks you need. Filtering and sorting do not modify your data; they temporarily change what is displayed, so you can always remove filters to see everything again.',
          },
          {
            type: 'heading',
            text: 'Filter Panel',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Click the "Filter" button in the board toolbar to open the filter panel. The panel slides open and presents filter categories with checkboxes for each option.',
          },
          {
            type: 'list',
            items: [
              'Status Filter — Check one or more status values to show only tasks with those statuses. For example, check "Working on it" and "Stuck" to see only active and blocked tasks.',
              'Priority Filter — Check one or more priority levels to show only tasks with those priorities. For example, check "Critical" and "High" to focus on the most urgent work.',
              'Person Filter — Select specific team members to see only tasks assigned to those people. This is useful for reviewing one person\'s workload or preparing for a one-on-one meeting.',
              'Date Filter — Filter by due date ranges to see tasks due within a specific timeframe, such as "this week" or "overdue".',
            ],
          },
          {
            type: 'heading',
            text: 'AND/OR Filter Logic',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Understanding how filters combine is important for getting the results you expect. Within a single category, filters use OR logic: selecting "High" and "Critical" priority shows tasks that are High OR Critical. Across categories, filters use AND logic: selecting "High" priority AND "Working on it" status shows tasks that are both High priority AND in "Working on it" status. This means each additional category you filter on narrows the results further.',
          },
          {
            type: 'heading',
            text: 'Person Filter Shortcut',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Person Filter is a dedicated filter button in the board toolbar (separate from the full filter panel) that provides quick access to filtering by team member. Click the people icon and select a name to instantly see only that person\'s tasks. This is the fastest way to view a single team member\'s workload without opening the full filter panel.',
          },
          {
            type: 'heading',
            text: 'Column Sorting',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Click any column header to sort the board by that column. Click again to toggle between ascending and descending order. A sort indicator appears in the column header showing the current sort direction. For example, sort by Priority to see Critical tasks at the top, or sort by Due Date to see the earliest deadlines first.',
          },
          {
            type: 'paragraph',
            text: 'The Sort Menu in the board toolbar provides additional sorting options and allows you to configure more specific sort behavior when clicking column headers is not sufficient.',
          },
          {
            type: 'heading',
            text: 'Hide Menu',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The "Hide" menu in the board toolbar lets you temporarily hide columns you do not need. This simplifies the visual layout without removing any data. Hidden columns retain their values; they are just not displayed in the current view. You can unhide them at any time to bring them back.',
          },
          {
            type: 'paragraph',
            text: 'This is particularly useful when your board has many columns but you only need to see a few for your current task. For example, during a status review meeting, you might hide the Notes, Budget, and Checkbox columns to focus on Task, Status, Priority, and Owner.',
          },
          {
            type: 'tip',
            text: 'Combine filters with the Group By feature for powerful analysis views. For example, filter to show only "Stuck" tasks and group by Assignee to see which team members have the most blocked items. This combination surfaces problems quickly.',
          },
        ],
      },
      {
        id: 'drag-and-drop',
        title: 'Drag and Drop',
        description: 'Reorder tasks, move between groups, update Kanban status, and understand permission constraints',
        content: [
          {
            type: 'paragraph',
            text: 'Drag and drop is a core interaction pattern in AgileFlow that lets you physically move tasks to reorganize your board. It works in both the Table view and the Kanban view, providing an intuitive, visual way to update task positions and statuses without clicking through menus or editing fields.',
          },
          {
            type: 'heading',
            text: 'Table View: Reordering Tasks',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'In the Table view, drag and drop lets you rearrange the order of tasks within a group and move tasks between groups.',
          },
          {
            type: 'list',
            items: [
              'Click and hold on a task row to pick it up. A visual indicator shows that the task is being dragged.',
              'Drag the task up or down within the same group to change its position relative to other tasks.',
              'Drag the task into a different group to move it. The task will be added to the new group at the position where you drop it.',
              'Release the mouse button to finalize the move. The new position is saved automatically.',
            ],
          },
          {
            type: 'heading',
            text: 'Kanban View: Moving Between Columns',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'In the Kanban view, drag and drop is used primarily to update task status by moving cards between columns.',
          },
          {
            type: 'list',
            items: [
              'Each Kanban column represents a status value (e.g., "Not Started", "Working on it", "Done", "Stuck").',
              'Click and hold on a task card to pick it up.',
              'Drag the card to a different column to change its status. As you drag, the target column highlights to show where the card will land.',
              'The task\'s Status field updates automatically when you drop the card into the new column. No additional save action is required.',
              'Within a column, drag cards up or down to reorder them. This lets you set relative priority within a single status.',
            ],
          },
          {
            type: 'heading',
            text: 'Auto-Save Behavior',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'All drag and drop changes are saved automatically and immediately to the server. You do not need to click a save button after moving tasks. Your team members will see the updated positions the next time they load or refresh the board.',
          },
          {
            type: 'heading',
            text: 'Permission Constraints',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Drag and drop respects the role-based permission system. Users with the Viewer role cannot drag or drop tasks. The drag handle does not appear for viewers, and attempting to drag has no effect. This prevents read-only users from accidentally or intentionally modifying task positions. Only Members and Admins can use drag and drop to reorganize boards.',
          },
          {
            type: 'warning',
            text: 'If you are unable to drag tasks, check your role. Viewers have read-only access and cannot reorder or move tasks. Ask an Admin to upgrade your role to Member if you need editing capabilities.',
          },
          {
            type: 'tip',
            text: 'The Kanban view is especially useful during daily standup meetings. As each team member reports their progress, they can drag their task cards from "Working on it" to "Done" in real time, giving the whole team a visual update.',
          },
        ],
      },
      {
        id: 'unassigned-tasks',
        title: 'Unassigned Tasks View',
        description: 'Find tasks without owners and assign them quickly with the dropdown',
        content: [
          {
            type: 'paragraph',
            text: 'The Unassigned Tasks view is a dedicated section on the Board page that automatically surfaces all tasks that have no assignee in the People column. It acts as a safety net, ensuring that no work items slip through the cracks without an owner. Unowned tasks are a common problem in growing projects, and this view makes them impossible to miss.',
          },
          {
            type: 'heading',
            text: 'How It Works',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow scans all tasks on the current board and identifies any task where the People (Owner) column is empty. These tasks are collected and displayed in the Unassigned Tasks section, separate from the regular board groups.',
          },
          {
            type: 'list',
            items: [
              'Each unassigned task card shows the task title, the group it belongs to, its current status with a colored badge, its priority level, and its due date (if set).',
              'A quick "Assign" button is prominently displayed on each task card.',
              'Click the Assign button to open a team member dropdown showing all workspace members with their avatars and full names.',
              'Select a person from the dropdown to assign them to the task instantly. The task is updated immediately and disappears from the unassigned list.',
            ],
          },
          {
            type: 'heading',
            text: 'When to Use the Unassigned Tasks View',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'During sprint planning — Ensure every task in the sprint has an owner before the sprint starts.',
              'After creating tasks in bulk — When you add many tasks at once (e.g., importing from a meeting agenda), some may lack assignees.',
              'During daily standups — Check if any new tasks have been created without owners and assign them on the spot.',
              'During backlog grooming — Review the board for housekeeping and ensure all tasks are properly assigned.',
              'Before a deadline — Make sure no unowned tasks are blocking progress or will be missed.',
            ],
          },
          {
            type: 'heading',
            text: 'AI-Assisted Assignment',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'If you are unsure who should own a task, you can use the AI assistant\'s /assign command for intelligent suggestions. The AI considers team workload, expertise, and task context to recommend the best person for the job. This is especially useful for large teams where workload distribution is hard to track manually.',
          },
          {
            type: 'tip',
            text: 'Make it a team habit to check the Unassigned Tasks view at the start of each sprint and during daily standups. Unowned tasks are tasks nobody is accountable for, and they are the most likely to be forgotten.',
          },
        ],
      },
      {
        id: 'board-analytics',
        title: 'Board Analytics Panel',
        description: 'Track board health with charts for status, workload, priority, completion, and AI insights',
        content: [
          {
            type: 'paragraph',
            text: 'Every board in AgileFlow has a built-in analytics panel that provides a data-driven view of the board\'s health and progress. The analytics panel is not a separate page; it is a slide-out panel accessible directly from the board, so you can review metrics without losing context of your tasks.',
          },
          {
            type: 'heading',
            text: 'Opening the Analytics Panel',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Click the bar chart icon in the board header (next to the view selector and toolbar) to toggle the analytics panel open. The panel slides in from the side, overlaying or pushing the board content depending on the screen width. Click the icon again or the close button to dismiss it.',
          },
          {
            type: 'heading',
            text: 'Key Metrics',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The top of the analytics panel displays summary cards with the board\'s most important numbers. These provide a quick pulse check without requiring you to interpret charts.',
          },
          {
            type: 'list',
            items: [
              'Total Tasks — The total number of tasks on this board across all groups. Gives you a sense of the board\'s scope.',
              'Completion Rate — The percentage of tasks with "Done" status. This tells you how much of the board\'s work has been completed.',
              'Overdue Tasks — The number of tasks whose due date has passed but whose status is not "Done". These are your red flags that need immediate attention.',
            ],
          },
          {
            type: 'heading',
            text: 'Charts and Visualizations',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Below the summary cards, the analytics panel shows several charts that break down the board\'s data in different ways.',
          },
          {
            type: 'list',
            items: [
              'Status Distribution — A chart (typically a donut or bar chart) showing how many tasks are in each status: Not Started, Working on it, Done, and Stuck. This is the quickest way to see the overall workflow balance.',
              'Team Workload — A chart showing how many tasks are assigned to each team member. Use this to identify team members who are overloaded or underutilized. Balanced workload distribution leads to better team performance.',
              'Priority Breakdown — A chart showing the distribution of tasks by priority level: Low, Medium, High, and Critical. If most of your tasks are marked Critical, either your project is genuinely urgent or your team needs to recalibrate how they use priority levels.',
            ],
          },
          {
            type: 'heading',
            text: 'Info Tooltips',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Each metric and chart in the analytics panel includes an information tooltip (an "i" icon). Hover over it to see a brief explanation of what that metric measures and how it is calculated. These tooltips are especially helpful for team members who are new to project analytics and want to understand what the numbers mean.',
          },
          {
            type: 'heading',
            text: 'AI Explain Button',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The analytics panel includes an "AI Explain" button that sends the board\'s analytics data to the AI assistant and returns a natural-language interpretation. Instead of reading charts yourself, you can click this button and get a plain-English summary like: "This board has 45 tasks with a 62% completion rate. 8 tasks are overdue, mostly in the Frontend group. The team workload is heavily skewed toward two members who own 70% of the remaining tasks." This is particularly useful when presenting board status to stakeholders or during sprint review meetings.',
          },
          {
            type: 'tip',
            text: 'Open the analytics panel during sprint reviews and retrospectives. The combination of status distribution, team workload, and priority breakdown charts provides the data you need for productive discussions about what went well and what needs improvement.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. BACKLOG & SPRINT MANAGEMENT
  // ─────────────────────────────────────────────
  {
    id: 'backlog-sprints',
    title: 'Backlog & Sprint Management',
    description: 'Manage your product backlog, write user stories, and plan agile sprints',
    icon: 'ListOrdered',
    articles: [
      {
        id: 'understanding-backlog',
        title: 'Understanding the Product Backlog',
        description: 'What a backlog is, why it matters, and how it serves as your single source of truth',
        content: [
          {
            type: 'paragraph',
            text: 'The product backlog is one of the most important concepts in agile project management, and it is the foundation of effective sprint planning in AgileFlow. At its core, a backlog is an ordered list of everything that might be needed in the product. It is the single source of truth for all planned work, and it is owned and maintained by the product owner (though the entire team contributes to it).',
          },
          {
            type: 'heading',
            text: 'What Is a Product Backlog?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A product backlog is a prioritized list of user stories, features, bug fixes, technical debt, and improvements that the team may work on in future sprints. Items at the top of the backlog are the highest priority and should be well-defined, estimated, and ready to pull into the next sprint. Items further down the list may be less refined and more loosely defined; they will be detailed later as they approach the top.',
          },
          {
            type: 'paragraph',
            text: 'Think of the backlog as a living document that evolves continuously. New items are added as the team discovers new requirements, stakeholders request features, or bugs are reported. Existing items are re-prioritized as business needs change. Completed items are removed after their sprints finish. The backlog is never "done" because there is always more the product could do.',
          },
          {
            type: 'heading',
            text: 'Why the Backlog Matters',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Single Source of Truth — Every piece of planned work lives in one place. Team members, stakeholders, and managers can all look at the same backlog to understand what is coming next. There are no hidden lists, side spreadsheets, or email threads with requirements.',
              'Prioritization — The backlog forces you to make explicit decisions about what matters most. Not everything can be done at once, so ranking items by priority ensures the most valuable work gets done first.',
              'Sprint Planning Input — When it is time to plan a sprint, you pull stories from the top of the backlog. A well-maintained backlog makes sprint planning fast and focused because the next batch of work is already identified and estimated.',
              'Stakeholder Transparency — Anyone can look at the backlog to see what the team plans to work on, what is coming in future sprints, and how priorities have been set. This reduces "when will my feature be done?" questions.',
              'Capacity Planning — By estimating stories with story points, the backlog gives you data to predict how many sprints it will take to deliver a set of features. This helps with roadmap planning and release forecasting.',
            ],
          },
          {
            type: 'heading',
            text: 'The Backlog in AgileFlow',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'In AgileFlow, the Backlog page (accessible from the sidebar) is where you manage your product backlog. It displays all user stories, sorted by priority, with filtering and search tools. From this page, you can create new stories, edit existing ones, estimate effort with story points, define acceptance criteria, and plan sprints by pulling stories from the backlog into time-boxed iterations.',
          },
          {
            type: 'paragraph',
            text: 'The Backlog page also shows stats cards at the top summarizing key backlog health metrics such as total stories, stories by priority, and stories assigned to active sprints. These stats help you understand the size and shape of your backlog at a glance.',
          },
          {
            type: 'heading',
            text: 'Backlog Maintenance',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A healthy backlog requires regular maintenance, often called "backlog grooming" or "backlog refinement." This is a recurring activity where the team reviews the backlog to ensure items are up to date, correctly prioritized, and sufficiently detailed for upcoming sprints. AgileFlow makes grooming efficient with search, filtering, drag-to-reorder, and inline editing of story details.',
          },
          {
            type: 'tip',
            text: 'Schedule a backlog grooming session at least once per sprint (ideally mid-sprint). During grooming, remove outdated stories, update estimates for stories whose scope has changed, ensure the top 10-15 stories are fully detailed with acceptance criteria, and re-rank items based on current business priorities.',
          },
        ],
      },
      {
        id: 'user-stories',
        title: 'User Stories',
        description: 'Write effective user stories with the standard format, story points, acceptance criteria, and lifecycle',
        content: [
          {
            type: 'paragraph',
            text: 'User stories are the building blocks of your product backlog. Each story represents a piece of functionality or a requirement described from the user\'s perspective. User stories deliberately focus on the "what" and "why" rather than the "how," giving the development team flexibility in implementation while ensuring the end result delivers value to users.',
          },
          {
            type: 'heading',
            text: 'The User Story Format',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The standard user story format follows a simple template: "As a [type of user], I want [some goal or action] so that [some benefit or reason]." This three-part structure forces you to think about who the feature is for, what they need, and why it matters. For example: "As a project manager, I want to export board data to CSV so that I can share progress reports with stakeholders who don\'t use AgileFlow."',
          },
          {
            type: 'paragraph',
            text: 'Not every story needs to follow this exact template, but the template ensures that stories are user-centered and value-driven. Stories that skip the "so that" clause often lack clear justification, which can lead to building features nobody actually needs.',
          },
          {
            type: 'heading',
            text: 'Creating a User Story in AgileFlow',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Navigate to the Backlog page from the sidebar.',
              'Click the "+ New Story" button at the top of the page to open the story creation form.',
              'Enter a title that describes the feature. Use the "As a... I want... so that..." format when possible, or write a concise feature description.',
              'Add a detailed description explaining the story\'s scope, requirements, and any relevant context. This helps developers understand the intent beyond the title.',
              'Set the priority level. AgileFlow provides four levels, each with a distinct color for quick visual identification:',
            ],
          },
          {
            type: 'list',
            items: [
              'Critical (red) — Must be done immediately, blocking other work or affecting users in production.',
              'High (orange) — Important for the current sprint or release, should be completed soon.',
              'Medium (blue) — Valuable work that should be done but is not time-sensitive.',
              'Low (light blue) — Nice-to-have improvements or future considerations.',
            ],
          },
          {
            type: 'steps',
            items: [
              'Assign story points to estimate the effort required. AgileFlow uses the Fibonacci scale: 1, 2, 3, 5, 8, 13. Choose the value that best represents the relative effort compared to other stories your team has completed.',
              'Add acceptance criteria. These are specific, testable conditions that define when the story is complete. Write each criterion as a clear, verifiable statement.',
              'Optionally link the story to a board if it relates to a specific project.',
              'Click "Create Story" to add the story to the product backlog.',
            ],
          },
          {
            type: 'heading',
            text: 'Story Points: The Fibonacci Scale',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Story points estimate relative effort, not hours. A 3-point story takes roughly three times the effort of a 1-point story, but the actual calendar time may vary depending on complexity, uncertainty, and who works on it. The Fibonacci sequence (1, 2, 3, 5, 8, 13) is used because the gaps between numbers increase, reflecting the increasing uncertainty in larger estimates.',
          },
          {
            type: 'list',
            items: [
              '1 point — Trivial, well-understood work. A few minutes to a couple of hours of effort. Examples: fixing a typo, changing a color value, updating a label.',
              '2 points — Small, clear scope, low risk. A few hours of focused work. Examples: adding a form field, updating a component\'s styling, writing a unit test.',
              '3 points — Moderate complexity with a clear approach. Half a day to a day of effort. Examples: building a new UI component, adding form validation logic, implementing a simple API endpoint.',
              '5 points — Significant work with multiple parts and some unknowns. One to two days of effort. Examples: integrating a third-party API, redesigning a page layout, implementing search functionality.',
              '8 points — Large and complex. Multiple days of effort with notable risk. Examples: building a new feature with both frontend and backend work, implementing authentication, creating a data visualization dashboard.',
              '13 points — Very large with high uncertainty. Should likely be broken into smaller stories. Examples: full module rewrites, new system integrations, features requiring research and experimentation.',
            ],
          },
          {
            type: 'heading',
            text: 'Acceptance Criteria Best Practices',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Acceptance criteria are the bridge between a story\'s intent and its implementation. They remove ambiguity by defining exactly what "done" means for each story. Good acceptance criteria have several characteristics:',
          },
          {
            type: 'list',
            items: [
              'Specific — Each criterion describes one verifiable behavior. "The form works correctly" is too vague. "When the user submits the form with valid data, a success message appears within 2 seconds" is specific.',
              'Testable — You should be able to test each criterion with a clear pass/fail result. If you cannot write a test for it, the criterion needs to be more specific.',
              'Independent — Each criterion should be verifiable on its own, without depending on other criteria.',
              'Outcome-focused — Describe what the user experiences, not how the code is implemented. "The user sees a loading spinner while data loads" is good. "Use React Query with staleTime of 5000ms" is implementation detail, not acceptance criteria.',
            ],
          },
          {
            type: 'heading',
            text: 'Story Lifecycle',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A user story moves through several stages from creation to completion.',
          },
          {
            type: 'list',
            items: [
              'Backlog — The story has been created and lives in the product backlog. It is not yet assigned to any sprint. It may need further refinement, estimation, or acceptance criteria.',
              'Planned — The story has been selected during sprint planning and assigned to an upcoming sprint. The team has committed to completing it within the sprint.',
              'In Progress — The sprint is active and work on the story has begun. Team members are implementing the feature and checking off acceptance criteria.',
              'Done — All acceptance criteria are met, the work has been reviewed, and the story is considered complete. It contributes to the sprint\'s velocity.',
            ],
          },
          {
            type: 'heading',
            text: 'Story Detail Modal',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Click on any story in the backlog to open the Story Detail Modal. This modal shows all the story\'s fields in a comprehensive form: title, description, priority, story points, acceptance criteria, linked board, and sprint assignment. You can edit any field and save your changes. The modal is where you do detailed story work like refining acceptance criteria or updating estimates.',
          },
          {
            type: 'tip',
            text: 'When estimating story points, do it as a team. Individual estimates are often biased; team-based estimation (like planning poker) produces more accurate results because different perspectives catch complexity that one person might miss. If the team cannot agree on an estimate, the story probably needs to be discussed more or broken into smaller pieces.',
          },
        ],
      },
      {
        id: 'sprint-planning',
        title: 'Sprint Planning',
        description: 'Create sprints, set capacity, select stories, use the capacity indicator, and follow best practices',
        content: [
          {
            type: 'paragraph',
            text: 'Sprint planning is the ceremony where the team decides what work to take on during the next sprint. A sprint is a fixed-length iteration, typically one to four weeks, during which the team works to complete a set of user stories. The goal of sprint planning is to select the right amount of work that the team can realistically finish within the sprint period. In AgileFlow, sprint planning happens on the Backlog page through the Sprint Planning feature.',
          },
          {
            type: 'heading',
            text: 'What Is a Sprint?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A sprint is a time-boxed period of work. Unlike open-ended project timelines, sprints have a fixed start and end date. This creates urgency, focus, and a regular cadence for delivering value. At the end of each sprint, the team has a set of completed stories to show, velocity data to track progress, and lessons learned to improve their process.',
          },
          {
            type: 'paragraph',
            text: 'Most teams run two-week sprints, but AgileFlow supports any duration. Shorter sprints (one week) provide faster feedback but leave less time for complex work. Longer sprints (three to four weeks) allow more work to be completed but delay feedback and can lead to scope creep. Choose a sprint length that works for your team and stick with it to build consistent velocity data.',
          },
          {
            type: 'heading',
            text: 'Creating a Sprint',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Navigate to the Backlog page from the sidebar.',
              'Click the "Plan Sprint" button to open the Sprint Planning Modal.',
              'Enter a sprint name that identifies this iteration (e.g., "Sprint 12", "January Week 2", "Release 3.0 Sprint 1").',
              'Set the start date for the sprint. This is when work begins.',
              'Set the end date for the sprint. This is the deadline by which all committed stories should be completed.',
              'Set the team capacity in story points. This number represents the total effort the team can handle during this sprint. Base it on historical velocity data if available; otherwise, start with a conservative estimate.',
              'Define a sprint goal — a brief statement describing the key objective or theme for this sprint (e.g., "Complete user authentication flow" or "Ship analytics dashboard v1").',
              'Select stories from the backlog to include in the sprint. You can drag stories from the backlog list into the sprint, or use checkboxes to select them.',
              'Watch the capacity indicator as you add stories. It shows the total committed story points compared to the sprint capacity.',
              'Click "Create Sprint" to finalize the sprint plan.',
            ],
          },
          {
            type: 'heading',
            text: 'The Capacity Indicator',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The capacity indicator is a visual progress bar that shows how many story points you have committed to the sprint relative to the team\'s capacity. It uses a traffic-light color system to warn you about overcommitment.',
          },
          {
            type: 'list',
            items: [
              'Green — Committed points are under 80% of capacity. The sprint has a healthy buffer. This is the ideal zone; it accounts for unexpected tasks, meetings, and other overhead that eat into productive time.',
              'Yellow — Committed points are between 80% and 100% of capacity. You are approaching the limit. Consider whether the team can realistically handle this workload or if some stories should be moved back to the backlog.',
              'Red — Committed points exceed 100% of capacity. The sprint is overcommitted. Unless the team has a strong track record of exceeding their capacity, remove some stories to bring the commitment back to a sustainable level.',
            ],
          },
          {
            type: 'heading',
            text: 'Sprint Planning Best Practices',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Use historical velocity as your capacity guide. If your team has completed 20-25 story points per sprint over the last three sprints, set capacity to 22. Do not set capacity based on hope or pressure.',
              'Prioritize stories from the top of the backlog. The product owner has already ranked them by value, so pulling from the top ensures you work on the most important things first.',
              'Ensure all selected stories have clear acceptance criteria. Vague stories lead to scope creep during the sprint and disputes about what "done" means.',
              'Leave a buffer. Do not fill capacity to exactly 100%. Unexpected bugs, production issues, and meetings will consume some capacity. Aim for 75-85% of capacity.',
              'The sprint goal should be achievable even if not every story is completed. Pick a goal that represents the minimum valuable outcome and plan additional stories around it.',
              'If the team cannot agree on whether a story fits in the sprint, it probably does not. Err on the side of committing to less work and finishing it all, rather than overcommitting and leaving work incomplete.',
            ],
          },
          {
            type: 'warning',
            text: 'Overcommitting a sprint is one of the most common mistakes in agile teams. When a team consistently takes on more than they can finish, it leads to incomplete work, demoralized team members, unreliable velocity data, and stakeholders who lose confidence in estimates. Use the capacity indicator as a hard constraint, not a suggestion.',
          },
          {
            type: 'tip',
            text: 'If this is your first sprint and you have no velocity data, start conservatively. It is much better to finish early and pull in extra work than to finish late and carry over incomplete stories. After two or three sprints, you will have enough velocity data to plan with confidence.',
          },
        ],
      },
      {
        id: 'sprint-execution',
        title: 'Sprint Execution',
        description: 'Track sprint progress, monitor velocity, complete sprints, and handle incomplete stories',
        content: [
          {
            type: 'paragraph',
            text: 'Once a sprint is created, the team shifts from planning to execution. Sprint execution is about maintaining visibility into progress, identifying blockers early, and ensuring the team stays on track to meet the sprint goal. AgileFlow provides several tools to monitor sprint health throughout the iteration.',
          },
          {
            type: 'heading',
            text: 'Sprint Progress Tracking',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Backlog page shows active sprints at the top of the view with a progress summary. This gives you a quick snapshot of where the sprint stands at any point during the iteration.',
          },
          {
            type: 'list',
            items: [
              'Committed Points — The total story points of all stories assigned to this sprint. This number is set during sprint planning and should not change during the sprint (adding scope mid-sprint is a red flag).',
              'Completed Points — The story points of stories marked as "Done" within this sprint. This number grows as the team completes work.',
              'Remaining Points — The difference between committed and completed points. This tells you how much work is left.',
              'Progress Bar — A visual bar that fills as stories are completed, giving you an at-a-glance view of sprint health.',
              'Story Cards — Each story within the sprint is displayed as a card showing its title, priority (with color coding), story points, and current status badge. You can quickly see which stories are in progress and which are still waiting.',
            ],
          },
          {
            type: 'heading',
            text: 'Velocity Tracking',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Velocity is the total number of story points the team completes in a sprint. AgileFlow tracks velocity automatically; you do not need to calculate it manually. Every time a story is marked as Done within a sprint, its story points are counted toward that sprint\'s velocity.',
          },
          {
            type: 'paragraph',
            text: 'Over time, velocity data creates a reliable baseline for future sprint planning. If your team has averaged 22 story points per sprint over the last four sprints, you can plan the next sprint with high confidence that 22 points is achievable. Velocity trends also reveal team health: rising velocity suggests the team is improving, while declining velocity might indicate burnout, growing technical debt, or process issues.',
          },
          {
            type: 'paragraph',
            text: 'The Analytics page displays historical velocity data, allowing you to see trends across multiple sprints. Use this data in sprint planning to set realistic capacity targets.',
          },
          {
            type: 'heading',
            text: 'Completing a Sprint',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When the sprint end date arrives, it is time to close the sprint and review the results. Completing a sprint in AgileFlow records the sprint\'s velocity, updates historical metrics, and handles any incomplete stories.',
          },
          {
            type: 'list',
            items: [
              'Review all stories in the sprint. Verify that stories marked "Done" truly meet their acceptance criteria.',
              'Identify incomplete stories — any story not in "Done" status when the sprint ends.',
              'Decide what to do with incomplete stories: move them back to the product backlog for re-prioritization, or roll them into the next sprint if they are still high priority and partially complete.',
              'Record the sprint\'s actual velocity (completed story points) for historical tracking.',
              'Discuss what went well and what did not as input for the sprint retrospective.',
            ],
          },
          {
            type: 'heading',
            text: 'Rolling Over Incomplete Stories',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Incomplete stories at the end of a sprint are a normal part of agile development. Not every sprint will be perfect. The key is to handle rollovers intentionally rather than automatically. Before rolling a story into the next sprint, ask: Is this story still the highest priority? Has the scope changed? Should the story points be re-estimated based on what the team learned while working on it?',
          },
          {
            type: 'paragraph',
            text: 'Rolling too many stories between sprints is a warning sign. If more than 20% of committed points consistently roll over, the team is overcommitting. Reduce capacity in the next sprint planning session and investigate what is causing incomplete work.',
          },
          {
            type: 'tip',
            text: 'Hold a brief sprint review at the end of each sprint, even if it is just 15 minutes. Demonstrate completed stories to stakeholders, review the velocity number, and note any patterns. The AI assistant with the /performance command can generate a quick summary of team metrics to guide the discussion.',
          },
        ],
      },
      {
        id: 'backlog-prioritization',
        title: 'Backlog Prioritization',
        description: 'Strategies for ordering, filtering, and grooming your product backlog',
        content: [
          {
            type: 'paragraph',
            text: 'A well-prioritized backlog is the engine that drives effective sprint planning. When the backlog is properly ordered, the team always knows what to work on next, sprint planning sessions are fast and focused, and stakeholders have clear visibility into the product roadmap. Prioritization is not a one-time activity; it is an ongoing process that requires regular attention.',
          },
          {
            type: 'heading',
            text: 'Prioritization Strategies',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'There are several approaches to prioritizing backlog items, and most teams use a combination of these strategies based on their context.',
          },
          {
            type: 'list',
            items: [
              'Business Value — Prioritize stories that deliver the most value to users or the business. Features that drive revenue, reduce costs, or solve critical user pain points should be at the top.',
              'Risk and Uncertainty — Tackle high-risk or uncertain stories early. Building the hardest parts first reveals problems while there is still time to adjust. Leaving risky work to the end is a recipe for surprises.',
              'Dependencies — Identify stories that block other stories and prioritize them higher. If Story B cannot start until Story A is done, Story A needs to be scheduled first.',
              'Effort vs. Value — Use the priority field in combination with story points. High-value, low-effort stories (often called "quick wins") should be prioritized because they deliver maximum value for minimum investment.',
              'Stakeholder Input — Regularly consult with stakeholders, customers, and team members about priorities. The product owner makes the final call, but informed input leads to better decisions.',
            ],
          },
          {
            type: 'heading',
            text: 'Filtering and Searching the Backlog',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Backlog page provides several tools to help you find and manage stories efficiently.',
          },
          {
            type: 'list',
            items: [
              'Search Bar — Type keywords to filter stories by title. This is the fastest way to find a specific story in a large backlog.',
              'Priority Filter — Use the priority dropdown to show only stories of a specific priority level. For example, show only "Critical" and "High" stories when preparing for sprint planning.',
              'Status Indicators — Each story card shows its current status (Backlog, Planned, In Progress, Done) with a colored badge, making it easy to scan the backlog and understand the state of each item.',
            ],
          },
          {
            type: 'heading',
            text: 'Drag-to-Reorder',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Stories in the backlog support drag-and-drop reordering. Click and hold a story card, then drag it up or down to change its position. Items at the top of the backlog are considered the highest priority and will be pulled into sprints first. This physical reordering is often more intuitive than assigning numeric priority scores, because it forces you to make relative comparisons: "Is this story more or less important than the one above it?"',
          },
          {
            type: 'heading',
            text: 'Backlog Grooming Sessions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Backlog grooming (also called backlog refinement) is a regular team activity where you review and improve the quality of backlog items. During grooming, the team:',
          },
          {
            type: 'list',
            items: [
              'Reviews and re-ranks stories based on current priorities',
              'Removes outdated or duplicate stories that are no longer relevant',
              'Adds missing acceptance criteria to stories near the top of the backlog',
              'Breaks large stories (8 or 13 points) into smaller, more manageable stories',
              'Estimates or re-estimates story points based on new information',
              'Discusses requirements and edge cases to reduce ambiguity before sprint planning',
            ],
          },
          {
            type: 'paragraph',
            text: 'Most teams groom the backlog once per sprint, typically mid-sprint. This ensures the top of the backlog is always ready for the next sprint planning session.',
          },
          {
            type: 'heading',
            text: 'Stats Cards',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Backlog page displays stats cards at the top showing key metrics about your backlog health. These include the total number of stories, a breakdown by priority level, stories assigned to active sprints, and unestimated stories. Use these stats to gauge the overall health of your backlog: a high number of unestimated stories means the backlog needs grooming, while a lopsided priority distribution might indicate that priorities need to be recalibrated.',
          },
          {
            type: 'tip',
            text: 'Keep the top 10-15 stories in the backlog fully detailed with acceptance criteria, story points, and clear titles. These are the stories most likely to be pulled into the next sprint. Stories further down the list can be less refined; you will detail them as they move up.',
          },
        ],
      },
      {
        id: 'sprint-retrospectives',
        title: 'Sprint Retrospectives',
        description: 'Use AgileFlow data and AI insights to run effective retrospectives and improve your process',
        content: [
          {
            type: 'paragraph',
            text: 'A sprint retrospective is a team meeting held at the end of each sprint where the team reflects on what went well, what did not go well, and what they can improve in the next sprint. Retrospectives are one of the most valuable ceremonies in agile because they create a structured opportunity for continuous improvement. Even high-performing teams benefit from regular retrospectives because there is always something to optimize.',
          },
          {
            type: 'heading',
            text: 'Why Retrospectives Matter',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Without retrospectives, teams tend to repeat the same mistakes sprint after sprint. A sprint where 30% of stories rolled over might happen once due to bad luck, but if it happens three sprints in a row, there is a systemic problem that needs to be addressed. Retrospectives surface these patterns and give the team a forum to discuss and resolve them.',
          },
          {
            type: 'list',
            items: [
              'Process Improvement — Identify bottlenecks, communication gaps, and workflow inefficiencies that slow the team down.',
              'Team Morale — Give every team member a voice. People who feel heard are more engaged and productive.',
              'Accountability — When the team agrees on improvement actions, they hold themselves accountable in the next retrospective.',
              'Data-Driven Decisions — Use sprint metrics (velocity, completion rate, rollover count) to ground discussions in facts rather than feelings.',
            ],
          },
          {
            type: 'heading',
            text: 'Using AgileFlow Data for Retrospectives',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow provides several data sources that make retrospectives more productive and objective. Instead of relying solely on memory, the team can reference concrete metrics.',
          },
          {
            type: 'list',
            items: [
              'Sprint Velocity — Compare this sprint\'s velocity to previous sprints. Was it higher, lower, or consistent? If velocity dropped, discuss why.',
              'Completion Rate — What percentage of committed stories were completed? A high completion rate suggests good planning; a low rate suggests overcommitment or blockers.',
              'Rollover Stories — Which stories were not completed? Were they too large, poorly defined, or blocked by external dependencies?',
              'Status Distribution — How much time did tasks spend in "Stuck" status? A lot of stuck tasks indicates the team is encountering blockers that need systemic solutions.',
              'Team Workload Charts — Was work evenly distributed across team members, or were some people overloaded while others had capacity?',
              'Board Analytics — The board analytics panel shows status distribution, team workload, and priority breakdown for each board. Open it during the retro to review project-specific metrics.',
            ],
          },
          {
            type: 'heading',
            text: 'The AI /performance Command',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow\'s AI assistant includes a /performance command specifically designed to support retrospectives. When you type /performance in the AI chat (either the floating panel or the full AI Chat page), the AI analyzes your recent sprint data and generates a natural-language summary of team performance. This summary typically includes velocity trends, completion rates, areas of concern, and actionable suggestions for improvement.',
          },
          {
            type: 'paragraph',
            text: 'The /performance command is valuable because it synthesizes multiple data points into a coherent narrative. Instead of manually reviewing charts and doing mental math, you get a pre-analyzed report that you can share with the team at the start of the retrospective as a conversation starter.',
          },
          {
            type: 'heading',
            text: 'Running an Effective Retrospective',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A typical retrospective follows a structured format to ensure productive discussion.',
          },
          {
            type: 'steps',
            items: [
              'Open the AI Chat and run the /performance command to generate a sprint summary. Share the results with the team.',
              'Review the board analytics panel for each active board. Note completion rates, overdue tasks, and workload distribution.',
              'Discuss "What went well?" — Identify practices, tools, or behaviors that contributed to successful outcomes. Celebrate wins.',
              'Discuss "What did not go well?" — Identify pain points, blockers, communication issues, or process failures. Be specific and constructive.',
              'Discuss "What can we improve?" — For each problem identified, brainstorm concrete, actionable improvements. Avoid vague goals like "communicate better"; instead, commit to specific changes like "add a 15-minute sync every Tuesday and Thursday."',
              'Pick 1-3 improvement actions to implement in the next sprint. Trying to fix everything at once is overwhelming; focused improvements are more likely to stick.',
              'Document the agreed actions and review them at the start of the next retrospective to check progress.',
            ],
          },
          {
            type: 'heading',
            text: 'Common Retrospective Topics',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Sprint overcommitment — Are we consistently taking on more than we can finish? Should we reduce capacity by 10-15%?',
              'Story quality — Were stories well-defined with clear acceptance criteria, or did the team spend time clarifying requirements mid-sprint?',
              'Blockers — Were there recurring blockers (waiting on external teams, unclear requirements, environment issues)? How can we prevent them?',
              'Testing gaps — Did any bugs escape because acceptance criteria were incomplete or untested?',
              'Workload balance — Was work distributed fairly, or was one person carrying most of the load?',
              'Communication — Were standups effective? Did the team surface problems early enough to address them?',
            ],
          },
          {
            type: 'tip',
            text: 'Keep retrospectives to 30-60 minutes. Longer meetings lose energy and focus. If a topic needs deep discussion, schedule a separate session for it. The retrospective should identify the issues; dedicated follow-up sessions can address them in detail.',
          },
          {
            type: 'warning',
            text: 'Retrospectives only work if the team follows through on improvement actions. If you identify problems but never implement solutions, the team will lose faith in the process and stop engaging. Hold yourselves accountable by reviewing last sprint\'s action items at the start of every new retrospective.',
          },
        ],
      },
    ],
  },
// ─────────────────────────────────────────────
  // 5. CALENDAR & SCHEDULING
  // ─────────────────────────────────────────────
  {
    id: 'calendar',
    title: 'Calendar & Scheduling',
    description: 'Plan meetings, milestones, and deadlines on a shared calendar',
    icon: 'Calendar',
    articles: [
      {
        id: 'calendar-overview',
        title: 'Calendar Overview',
        description: 'Navigate the monthly calendar view and understand event types',
        content: [
          {
            type: 'paragraph',
            text: 'The Calendar page is your team\'s shared scheduling hub. It provides a monthly grid view of all events across your workspace, from daily standups and sprint ceremonies to project milestones and hard deadlines. The calendar is designed to give you a quick visual overview of what is coming up, what is happening today, and how your team\'s time is distributed across different types of activities.',
          },
          {
            type: 'paragraph',
            text: 'Unlike task due dates on boards (which track when work is due), the calendar is specifically for time-based events — things that happen at a particular date and time. Think of boards as your "what needs to get done" tool and the calendar as your "when things are happening" tool. Together, they give you a complete picture of your team\'s commitments.',
          },
          {
            type: 'heading',
            text: 'Monthly Grid Layout',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The calendar displays one month at a time in a traditional grid layout. Each cell represents a single day, with rows for each week. The current month and year are displayed prominently in the header area. Days that belong to the previous or next month appear dimmed at the edges of the grid, providing context for how weeks flow across month boundaries.',
          },
          {
            type: 'list',
            items: [
              'Each day cell shows the date number and any events scheduled for that day',
              'Events appear as small colored dots or badges within the day cell, color-coded by event type',
              'If a day has multiple events, a badge displays the total event count so you can see busy days at a glance',
              'Today\'s date is highlighted with a distinct background color and border, making it immediately identifiable',
              'Weekdays and weekends are displayed equally — AgileFlow does not hide weekend days',
            ],
          },
          {
            type: 'heading',
            text: 'Navigating Between Months',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Navigation controls in the calendar header let you move backward and forward through months. These controls are designed to be intuitive and quick.',
          },
          {
            type: 'list',
            items: [
              'Left arrow button — moves to the previous month',
              'Right arrow button — moves to the next month',
              'Today button — jumps back to the current month regardless of how far you have navigated, centering on today\'s date',
              'The month and year label updates automatically as you navigate',
            ],
          },
          {
            type: 'tip',
            text: 'If you have navigated several months ahead while planning future sprints or milestones, click the "Today" button to instantly return to the current month without having to click the back arrow repeatedly.',
          },
          {
            type: 'heading',
            text: 'Today Highlighting',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The current date is always visually emphasized in the calendar grid. This serves as an anchor point so you can quickly orient yourself relative to upcoming events. When you open the calendar, your eye is naturally drawn to today\'s highlighted cell, and you can scan forward to see what is coming next.',
          },
          {
            type: 'heading',
            text: 'Event Types and Color Coding',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow supports eight distinct event types, each assigned a specific color. This color coding is consistent throughout the application — in the calendar grid, in event details, and in the upcoming events list. Learning the color associations helps you scan the calendar quickly and understand your schedule at a glance.',
          },
          {
            type: 'list',
            items: [
              'Meeting (blue) — team meetings, standups, one-on-ones, and sync calls',
              'Milestone (green) — significant project deliverables and achievement markers',
              'Deadline (red) — hard deadlines, submission dates, and non-negotiable due dates',
              'Review (purple) — code reviews, design reviews, sprint reviews, and feedback sessions',
              'Retrospective (yellow) — sprint retrospectives, team reflections, and process improvement sessions',
              'Planning (sky blue) — sprint planning, roadmap sessions, and strategy meetings',
              'Holiday (orange) — team holidays, company days off, and individual time off',
              'Other (gray) — miscellaneous events that do not fit the categories above',
            ],
          },
          {
            type: 'heading',
            text: 'Clicking on Dates',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The calendar is interactive — clicking on a date opens the event creation form with that date pre-filled. This is the fastest way to add an event for a specific day. If a date already has events, clicking on an event dot or badge opens that event\'s details, where you can view, edit, or delete it.',
          },
          {
            type: 'heading',
            text: 'Upcoming Events List',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Below the calendar grid, an upcoming events list displays events in chronological order. This list shows events from today forward, giving you a linear timeline view that complements the grid layout. Each entry in the list shows the event title, type badge, date, time (if set), and any other relevant details. This is especially useful when you want to see what is next without scanning the entire calendar grid.',
          },
          {
            type: 'tip',
            text: 'Use the upcoming events list as your daily briefing. Check it at the start of each day to see what meetings, deadlines, and milestones are coming up in the near future.',
          },
        ],
      },
      {
        id: 'creating-events',
        title: 'Creating Events',
        description: 'Add meetings, milestones, deadlines, and other events to the calendar',
        content: [
          {
            type: 'paragraph',
            text: 'Creating calendar events is one of the most common actions in AgileFlow. Events help your team stay aligned on schedules, deadlines, and ceremonies. There are two ways to create an event: using the dedicated button or clicking directly on a calendar date. Both methods open the same creation form — the only difference is whether the date is pre-filled.',
          },
          {
            type: 'heading',
            text: 'Method 1: The New Event Button',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Navigate to the Calendar page from the left sidebar.',
              'Click the "+ New Event" button located in the top area of the calendar page.',
              'The event creation dialog opens. Fill in the event details (described below).',
              'Click "Create Event" to save the event to the calendar.',
            ],
          },
          {
            type: 'heading',
            text: 'Method 2: Click on a Date',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Navigate to the Calendar page from the left sidebar.',
              'Click on any date cell in the calendar grid.',
              'The event creation dialog opens with the selected date already filled in.',
              'Complete the remaining fields and click "Create Event" to save.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Clicking on a date is the faster approach when you already know when the event should occur. It saves you the step of manually selecting a date in the form.',
          },
          {
            type: 'heading',
            text: 'Event Creation Fields',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The event creation form includes several fields that let you fully describe the event. Only the title and date are required — all other fields are optional but recommended for clarity.',
          },
          {
            type: 'list',
            items: [
              'Title (required) — a clear, descriptive name for the event. Good titles include context, such as "Sprint 12 Planning — Frontend Team" rather than just "Planning".',
              'Event Type (required) — select from the eight available types: Meeting, Milestone, Deadline, Review, Retrospective, Planning, Holiday, or Other. The type determines the event\'s color on the calendar.',
              'Date (required) — the day the event occurs. Pre-filled if you clicked on a date in the calendar.',
              'Start Time (optional) — when the event begins. Leave blank for all-day events.',
              'End Time (optional) — when the event ends. Should be after the start time.',
              'All-Day Toggle — switch this on for events that span the entire day, such as holidays, milestones, or deadlines. When toggled on, the start and end time fields are hidden.',
              'Location (optional) — the physical location or virtual meeting link (Zoom, Google Meet, etc.).',
              'Attendees (optional) — select team members who should attend. They will see the event on their calendar.',
              'Description (optional) — additional context, agenda items, preparation notes, or any other information attendees should know.',
            ],
          },
          {
            type: 'heading',
            text: 'All-Day Events',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'All-day events represent activities or markers that apply to an entire day rather than a specific time window. When you toggle the "All Day" switch, the start and end time fields disappear because they are not relevant. All-day events appear at the top of the date cell in the calendar grid, making them prominent and easy to notice.',
          },
          {
            type: 'paragraph',
            text: 'Common all-day events include project milestones (marking the completion of a phase), deadlines (the final day something is due), holidays (company or personal days off), and multi-day conferences or off-sites.',
          },
          {
            type: 'heading',
            text: 'Tips for Effective Event Creation',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Use descriptive titles that include the team or project name — "Sprint 24 Planning" is better than "Planning"',
              'Always set the correct event type so the color coding is meaningful for your team',
              'Add attendees so team members can see events relevant to them',
              'Include a brief agenda or purpose in the description field to help attendees prepare',
              'For recurring ceremonies (daily standups, sprint planning), create events for each occurrence so they appear on the calendar',
            ],
          },
          {
            type: 'warning',
            text: 'Events are visible to all team members in the workspace. Do not include sensitive personal information in event titles or descriptions. Use the location field for meeting links rather than putting them in the title.',
          },
        ],
      },
      {
        id: 'managing-events',
        title: 'Managing Events',
        description: 'Edit, delete, and organize your calendar events',
        content: [
          {
            type: 'paragraph',
            text: 'Once events are on the calendar, you will often need to update them — changing times, adding attendees, or canceling events altogether. AgileFlow makes event management straightforward with click-to-edit functionality and clear delete confirmations.',
          },
          {
            type: 'heading',
            text: 'Viewing Event Details',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Click on any event in the calendar grid or in the upcoming events list to open its details. The event detail view shows all the information you entered when creating the event, including the title, type, date, times, location, attendees, and description.',
          },
          {
            type: 'heading',
            text: 'Editing Events',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click on the event you want to edit in the calendar grid or upcoming events list.',
              'The event detail dialog opens, showing all current information.',
              'Click the "Edit" button to enter edit mode.',
              'Modify any fields — title, type, date, times, location, attendees, or description.',
              'Click "Save" to apply your changes.',
            ],
          },
          {
            type: 'paragraph',
            text: 'All changes take effect immediately and are visible to all team members. If you change the event type, its color on the calendar updates automatically to match the new type.',
          },
          {
            type: 'heading',
            text: 'Deleting Events',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click on the event you want to delete to open its details.',
              'Click the "Delete" button.',
              'A confirmation dialog appears asking you to confirm the deletion.',
              'Click "Confirm" or "Delete" to permanently remove the event.',
            ],
          },
          {
            type: 'warning',
            text: 'Deleting an event is permanent and cannot be undone. The event is removed from the calendar for all team members. If you are unsure, consider changing the event\'s date or adding a note to the description instead of deleting it.',
          },
          {
            type: 'heading',
            text: 'Color Coding for Quick Scanning',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Every event on the calendar is color-coded based on its type. This is one of the most useful features for managing a busy calendar because it lets you instantly distinguish between meetings (blue), deadlines (red), milestones (green), and other event types without reading each title. When scanning a week or month, the color distribution tells you whether you are heavy on meetings, approaching many deadlines, or have a balanced schedule.',
          },
          {
            type: 'heading',
            text: 'Upcoming Events List',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The upcoming events list below the calendar provides a chronological view of events starting from today. This list is particularly useful for day-to-day planning because events are sorted by date and time, giving you a clear picture of what is next. Each entry shows the event\'s color-coded type badge, title, date, and time, making it easy to scan without opening each event.',
          },
          {
            type: 'tip',
            text: 'Regularly review the upcoming events list at the start of each week. It helps you prepare for upcoming deadlines, schedule necessary meetings, and avoid conflicts in your team\'s calendar.',
          },
        ],
      },
      {
        id: 'event-types-deep-dive',
        title: 'Event Types Deep Dive',
        description: 'Understand each event type, its purpose, color meaning, and when to use it',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow includes eight carefully chosen event types that cover the full range of activities in an agile team\'s calendar. Each type has a dedicated color and is designed for a specific category of event. Using the correct event type is important because it enables visual scanning — when everyone on your team categorizes events consistently, the calendar becomes a powerful communication tool where colors tell the story at a glance.',
          },
          {
            type: 'heading',
            text: 'Meeting (Blue)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Meetings are the most common event type. Use this for any gathering where team members come together to discuss, align, or make decisions. The blue color was chosen because meetings are a neutral, everyday activity — present but not alarming.',
          },
          {
            type: 'list',
            items: [
              'Daily standups — brief check-ins where each team member shares what they did, what they will do, and any blockers',
              'One-on-ones — private conversations between a manager and a direct report',
              'Team sync meetings — regular alignment sessions for a project or department',
              'Client meetings — external-facing discussions with stakeholders or customers',
              'Ad-hoc discussions — unplanned meetings that arise from urgent issues',
            ],
          },
          {
            type: 'tip',
            text: 'Keep meeting titles specific. "Backend Team Standup" is better than "Standup", and "Q2 Roadmap Review with Product" is better than "Review Meeting". Specific titles make the calendar useful even at a glance.',
          },
          {
            type: 'heading',
            text: 'Milestone (Green)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Milestones mark significant achievements or deliverables in a project\'s lifecycle. They are not about time spent — they are about outcomes reached. Green signifies completion and progress, making milestone markers feel positive and forward-looking on the calendar.',
          },
          {
            type: 'list',
            items: [
              'Feature completion dates — when a major feature is expected to be finished',
              'Release dates — when a version ships to production or users',
              'Phase transitions — the boundary between project phases (e.g., "Design Complete, Development Begins")',
              'Demo dates — when work will be presented to stakeholders',
              'Go-live dates — when a product or feature becomes available to end users',
            ],
          },
          {
            type: 'paragraph',
            text: 'Milestones are typically set as all-day events because they represent a date marker rather than a timed activity. They are visible checkpoints that help the team understand the bigger picture of where a project is heading.',
          },
          {
            type: 'heading',
            text: 'Deadline (Red)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Deadlines are non-negotiable dates by which something must be completed. The red color is intentional — it signals urgency and importance. When you see red on the calendar, it should trigger awareness that something critical is due.',
          },
          {
            type: 'list',
            items: [
              'Submission deadlines — reports, proposals, or deliverables due to external parties',
              'Compliance dates — regulatory or legal deadlines that cannot be moved',
              'Client deliverable due dates — work promised to clients by a specific date',
              'Budget or funding deadlines — financial commitments tied to dates',
              'Contract renewal dates — time-sensitive administrative deadlines',
            ],
          },
          {
            type: 'warning',
            text: 'Reserve the Deadline type for hard, immovable dates. If you overuse red for soft deadlines, the visual urgency loses its meaning. Use Milestone (green) for target dates that have some flexibility.',
          },
          {
            type: 'heading',
            text: 'Review (Purple)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Reviews are events where work is examined, evaluated, or critiqued. The purple color distinguishes them from regular meetings — reviews have a specific purpose of assessing quality or progress.',
          },
          {
            type: 'list',
            items: [
              'Code reviews — team sessions for reviewing pull requests or architecture decisions',
              'Design reviews — evaluating mockups, prototypes, or UX flows',
              'Sprint reviews — demonstrating completed work to stakeholders at the end of a sprint',
              'Performance reviews — evaluating individual or team performance',
              'Architectural reviews — assessing system design decisions and trade-offs',
            ],
          },
          {
            type: 'heading',
            text: 'Retrospective (Yellow)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Retrospectives are dedicated sessions where the team reflects on how they worked during a sprint or project phase. The goal is continuous improvement — identifying what went well, what did not, and what to change. Yellow conveys a reflective, thoughtful tone.',
          },
          {
            type: 'list',
            items: [
              'Sprint retrospectives — end-of-sprint reflection sessions (the most common use)',
              'Project retrospectives — post-mortem analysis after a project concludes',
              'Process improvement workshops — focused sessions on improving specific workflows',
              'Incident retrospectives — post-incident reviews after outages or critical bugs',
            ],
          },
          {
            type: 'tip',
            text: 'Schedule retrospectives immediately after sprint reviews. The sprint review shows what was built, and the retrospective reflects on how it was built. This sequence keeps insights fresh.',
          },
          {
            type: 'heading',
            text: 'Planning (Sky Blue)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Planning events are forward-looking sessions where the team decides what to work on next. Sky blue is a lighter, more optimistic shade that differentiates planning from regular meetings (darker blue). Planning sessions are about the future — setting goals, prioritizing work, and committing to deliverables.',
          },
          {
            type: 'list',
            items: [
              'Sprint planning — selecting user stories from the backlog for the upcoming sprint',
              'Roadmap planning — defining features and priorities for the next quarter or release',
              'Capacity planning — assessing team availability and allocating work accordingly',
              'Release planning — coordinating what goes into a specific release',
              'Backlog grooming sessions — refining, estimating, and prioritizing backlog items',
            ],
          },
          {
            type: 'heading',
            text: 'Holiday (Orange)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Holiday events mark days when team members are unavailable. Orange is a warm, neutral color that signals reduced availability without the urgency of red. Tracking holidays on the calendar is important for sprint planning and workload distribution.',
          },
          {
            type: 'list',
            items: [
              'Company-wide holidays — national holidays, company days off',
              'Individual time off — vacation days, personal days, sick leave',
              'Team off-sites — days when the team is away from normal work',
              'Conference attendance — when team members are at industry events',
              'Reduced availability — half-days or partial availability',
            ],
          },
          {
            type: 'paragraph',
            text: 'Knowing who is out and when is critical for sprint planning. If half the team is on holiday during a sprint, velocity will be lower. Adding holidays to the calendar helps the team plan realistically.',
          },
          {
            type: 'heading',
            text: 'Other (Gray)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Other type is a catch-all for events that do not fit neatly into the seven specific categories. Gray is intentionally neutral — it does not draw attention or imply any particular urgency. Use it sparingly, and consider whether one of the specific types might be more appropriate.',
          },
          {
            type: 'list',
            items: [
              'Social events — team lunches, celebrations, happy hours',
              'Training sessions — workshops, courses, or learning events',
              'Administrative tasks — account setup, tool migrations, office logistics',
              'External events — industry webinars, community meetups',
            ],
          },
          {
            type: 'tip',
            text: 'If you find yourself using "Other" frequently, consider whether the events share a common theme. Consistent use of the specific event types makes your calendar much more informative for the whole team.',
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // 6. ANALYTICS & REPORTING
  // ─────────────────────────────────────────────
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    description: 'Visualize progress, track performance, and make data-driven decisions',
    icon: 'BarChart3',
    articles: [
      {
        id: 'analytics-dashboard',
        title: 'Analytics Dashboard',
        description: 'Overview of analytics capabilities and how to access them',
        content: [
          {
            type: 'paragraph',
            text: 'Analytics in AgileFlow help you move beyond gut feelings and make decisions based on real data. Instead of guessing whether your team is on track or wondering where bottlenecks exist, analytics give you concrete numbers, charts, and trends that reveal the true state of your projects.',
          },
          {
            type: 'paragraph',
            text: 'AgileFlow provides analytics at two levels: workspace-level analytics (accessible from the Analytics page in the sidebar) and board-level analytics (accessible from the analytics panel within any board). Both levels complement each other — workspace analytics show the big picture across all projects, while board analytics zoom in on a specific project\'s health.',
          },
          {
            type: 'heading',
            text: 'Accessing Workspace Analytics',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click "Analytics" in the left sidebar navigation.',
              'The Analytics page loads with charts and metrics spanning all your boards and tasks.',
              'Use the available filters and tabs to focus on specific data dimensions.',
            ],
          },
          {
            type: 'heading',
            text: 'Accessing Board-Level Analytics',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Open any board from the Boards page.',
              'Click the bar chart icon in the board header toolbar.',
              'The Analytics panel slides open on the right side, showing metrics specific to that board.',
            ],
          },
          {
            type: 'heading',
            text: 'What Analytics Cover',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Task distribution — how tasks are spread across statuses, priorities, and team members',
              'Team performance — individual and team-level completion rates, workload balance, and productivity trends',
              'Sprint analytics — velocity tracking, burndown charts, and sprint completion rates over time',
              'Board health — total tasks, completion rates, overdue items, and progress indicators',
            ],
          },
          {
            type: 'heading',
            text: 'Why Analytics Matter',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'In agile development, the ability to inspect and adapt is fundamental. Analytics provide the "inspect" part of that equation. When you can see that tasks are piling up in the "Working" column, or that one team member has three times the workload of others, or that sprint velocity is declining, you can take corrective action before problems become serious. Teams that regularly review their analytics tend to deliver more predictably and maintain healthier work-life balance.',
          },
          {
            type: 'tip',
            text: 'Make analytics review part of your regular routine. Check workspace analytics at the start of each week and board analytics during standups. The data is most useful when reviewed frequently, not just at the end of a sprint.',
          },
        ],
      },
      {
        id: 'task-distribution',
        title: 'Task Distribution',
        description: 'Understand how tasks are distributed across statuses, priorities, and team members',
        content: [
          {
            type: 'paragraph',
            text: 'Task distribution analytics show you how your work is spread across different dimensions — status, priority, and team members. This is one of the most fundamental analytics views because it answers the question: "Where is all our work right now?" Understanding distribution patterns helps you identify bottlenecks, imbalances, and potential risks before they impact delivery.',
          },
          {
            type: 'heading',
            text: 'Status Distribution',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The status distribution chart shows how many tasks are in each workflow state (Not Started, Working On It, Stuck, Done, and any custom statuses). This chart typically appears as a donut or bar chart, giving you an immediate visual sense of your project\'s progress.',
          },
          {
            type: 'list',
            items: [
              'A healthy distribution shows a moderate number of tasks in "Working" and a growing proportion in "Done"',
              'Too many tasks in "Not Started" may indicate the team has not begun enough work or the sprint was overcommitted',
              'A large number of "Stuck" tasks is a red flag that needs immediate attention — it means blockers are preventing progress',
              'If most tasks are "Done" early in a sprint, the team may have capacity for additional work or the sprint was undercommitted',
              'An even split between all statuses mid-sprint is generally a sign of steady, healthy progress',
            ],
          },
          {
            type: 'heading',
            text: 'Priority Distribution',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The priority distribution chart breaks down tasks by urgency level: Critical, High, Medium, and Low. This view helps you assess whether your team is focusing on the right things and whether your backlog is properly prioritized.',
          },
          {
            type: 'list',
            items: [
              'A project dominated by "Critical" and "High" priority tasks may indicate poor prioritization or a genuine crisis',
              'A balanced mix of priorities (with most tasks at Medium) suggests a well-maintained backlog',
              'Too many "Low" priority tasks in an active sprint may mean the team is not working on what matters most',
              'If critical tasks are not being completed first, it suggests the team needs to re-evaluate their work order',
            ],
          },
          {
            type: 'heading',
            text: 'Board-Level Breakdown',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'At the workspace level, task distribution can be viewed per board, showing you which projects have the most work, which are closest to completion, and which might need attention. This cross-board view is invaluable for managers overseeing multiple projects.',
          },
          {
            type: 'heading',
            text: 'Reading Distribution Patterns',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Distribution charts tell a story when you learn to read them. The shape of the distribution — whether it is evenly spread, clustered at one end, or bimodal — reveals important information about your team\'s workflow health.',
          },
          {
            type: 'list',
            items: [
              'Healthy pattern — tasks flow steadily from left to right (Not Started → Working → Done) with no pile-ups',
              'Bottleneck pattern — a large concentration of tasks in one status (usually "Working" or "Stuck") indicates a blockage in the workflow',
              'Front-loaded pattern — most tasks in "Not Started" suggests the team has not yet ramped up or is overwhelmed with scope',
              'Tail-heavy pattern — most tasks in "Done" early in a sprint means capacity is available for more work',
              'Priority inversion — low-priority tasks completing while high-priority items remain stuck signals a prioritization issue',
            ],
          },
          {
            type: 'tip',
            text: 'Compare task distribution snapshots at the beginning, middle, and end of each sprint. The movement patterns reveal whether your team works steadily or in bursts, which affects how you plan future sprints.',
          },
        ],
      },
      {
        id: 'team-performance',
        title: 'Team Performance',
        description: 'Track individual and team productivity, workload balance, and completion rates',
        content: [
          {
            type: 'paragraph',
            text: 'Team performance analytics provide visibility into how work is distributed among team members and how effectively each person is completing their assignments. This data is not meant for punishment or surveillance — it exists to help teams work more sustainably, identify when someone needs help, and ensure workloads are fair.',
          },
          {
            type: 'heading',
            text: 'Per-Member Metrics',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'For each team member, AgileFlow tracks several key metrics that together paint a picture of their workload and output.',
          },
          {
            type: 'list',
            items: [
              'Tasks Assigned — the total number of tasks currently assigned to this person across all boards. A high number may indicate overload.',
              'Tasks Completed — the number of tasks this person has moved to "Done" status. This shows output over the selected time period.',
              'Completion Rate — the percentage of assigned tasks that have been completed. A rate below 50% may indicate blockers or overcommitment.',
              'Active Tasks — tasks currently in a "Working" status, showing what the person is actively focused on right now.',
            ],
          },
          {
            type: 'heading',
            text: 'Workload Analysis',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The workload analysis chart visualizes task distribution across all team members, making imbalances immediately visible. When one bar is dramatically taller than others, it signals an uneven distribution that should be addressed.',
          },
          {
            type: 'list',
            items: [
              'Overloaded members — significantly more tasks than average. Risk of burnout, missed deadlines, and quality issues. Consider redistributing work.',
              'Underutilized members — significantly fewer tasks than average. They may have capacity to take on more work or could help overloaded colleagues.',
              'Balanced team — similar task counts across members with proportional completion rates. This is the ideal state for sustainable delivery.',
            ],
          },
          {
            type: 'heading',
            text: 'Identifying and Addressing Overload',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Workload imbalance is one of the most common problems in project teams. It happens naturally as certain people become go-to experts for specific areas, and tasks gravititate toward them. Without analytics, this imbalance often goes unnoticed until burnout or missed deadlines make it obvious.',
          },
          {
            type: 'steps',
            items: [
              'Review the workload chart weekly to spot imbalances early.',
              'If one person has more than 1.5x the average task count, flag it in standup.',
              'Use the /assign AI command to get suggestions for redistributing tasks based on skills and availability.',
              'During sprint planning, use the workload chart to guide assignment decisions — assign new tasks to people with more capacity.',
              'Track completion rates alongside task counts. A person with many tasks and a high completion rate may be fine, while someone with fewer tasks and a low rate may be struggling.',
            ],
          },
          {
            type: 'heading',
            text: 'Using Performance Data for Planning',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Team performance data from past sprints is one of the best inputs for future planning. If you know that your team consistently completes 30 story points per sprint, you can plan the next sprint with confidence. If you see that a particular team member completes tasks 20% faster than average, you can factor that into capacity planning.',
          },
          {
            type: 'list',
            items: [
              'Use historical completion rates to set realistic sprint goals',
              'Factor in individual velocities when assigning complex tasks',
              'Identify training opportunities — if someone\'s completion rate drops for a specific type of task, they may need support or pairing',
              'Celebrate improvements in team metrics during retrospectives to reinforce positive patterns',
            ],
          },
          {
            type: 'warning',
            text: 'Performance metrics should never be used to rank or shame team members. They exist to make workloads visible, identify people who need help, and improve planning accuracy. Always use these numbers in the context of supporting your team.',
          },
        ],
      },
      {
        id: 'sprint-analytics',
        title: 'Sprint Analytics',
        description: 'Track velocity, burndown, and completion rates across sprints',
        content: [
          {
            type: 'paragraph',
            text: 'Sprint analytics are the heartbeat of agile project management. They track how much work your team accomplishes in each sprint and whether the pace is sustainable, improving, or declining. For teams practicing Scrum or sprint-based agile, these metrics are essential for planning, retrospectives, and stakeholder communication.',
          },
          {
            type: 'heading',
            text: 'Understanding Velocity',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Velocity is the amount of work your team completes in a single sprint, typically measured in story points. It is one of the most important agile metrics because it provides a data-driven basis for planning future sprints. Rather than guessing how much work the team can handle, you use historical velocity to make informed commitments.',
          },
          {
            type: 'list',
            items: [
              'Velocity is calculated by summing the story points of all tasks completed (moved to "Done") during a sprint',
              'Only fully completed tasks count — partially done work does not contribute to velocity',
              'Track velocity across multiple sprints to establish a reliable average. Three to five sprints of data usually provides a stable baseline.',
              'Velocity naturally varies from sprint to sprint. Small fluctuations are normal — look for trends rather than reacting to individual sprint numbers.',
            ],
          },
          {
            type: 'heading',
            text: 'Velocity Trends',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A velocity trend chart plots your team\'s velocity over multiple sprints, revealing patterns that are invisible when looking at one sprint at a time.',
          },
          {
            type: 'list',
            items: [
              'Stable velocity (flat line) — your team has found a sustainable pace. This is the ideal state and means your sprint planning is accurate.',
              'Increasing velocity (upward trend) — the team is becoming more efficient, possibly due to better processes, fewer blockers, or improved tooling. Enjoy it, but watch for burnout.',
              'Decreasing velocity (downward trend) — something is slowing the team down. Common causes: increasing technical debt, more meetings, scope creep, team changes, or burnout.',
              'Erratic velocity (up and down) — inconsistent delivery that makes planning difficult. Investigate causes: varying team availability, inconsistent estimation, or unplanned work disrupting sprints.',
            ],
          },
          {
            type: 'heading',
            text: 'Burndown Charts',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A burndown chart shows how much work remains in a sprint over time. The horizontal axis represents the sprint duration (days), and the vertical axis represents the remaining work (story points or task count). Two lines tell the story: the ideal line and the actual line.',
          },
          {
            type: 'list',
            items: [
              'Ideal line — a straight diagonal from the total work at sprint start to zero at sprint end. It represents the theoretical perfect pace where work is completed evenly each day.',
              'Actual line — the real remaining work as tasks are completed. This line moves down (work completed), stays flat (no progress), or occasionally moves up (scope added mid-sprint).',
            ],
          },
          {
            type: 'heading',
            text: 'Reading Burndown Patterns',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The shape of the actual line compared to the ideal line reveals how your team is working throughout the sprint. Learning to read these patterns is one of the most valuable skills for a Scrum Master or team lead.',
          },
          {
            type: 'list',
            items: [
              'Actual tracks ideal closely — the team is delivering at a steady, predictable pace. This is the healthiest pattern.',
              'Flat sections (horizontal line) — no tasks were completed during this period. The team may be blocked, stuck in meetings, or working on tasks that are not yet ready to close. Investigate the cause.',
              'Steep drops (sharp downward line) — a burst of task completions in a short period. This may mean the team works in batches or that tasks were completed earlier but not updated until later. Frequent steep drops suggest inconsistent workflow.',
              'Actual above ideal — the team is behind schedule. If this persists past the sprint midpoint, the team is unlikely to complete all planned work.',
              'Actual below ideal — the team is ahead of schedule. They may have capacity for additional work, or the sprint was undercommitted.',
              'Line goes up — work was added to the sprint (scope creep). This makes it harder to complete the original commitment and should be discussed in the retrospective.',
            ],
          },
          {
            type: 'heading',
            text: 'Sprint Completion Rate',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The sprint completion rate is the percentage of planned work that was actually completed by the end of the sprint. A rate of 100% means the team delivered everything they committed to. Rates consistently below 70% suggest the team is overcommitting, while rates consistently above 95% may mean the team has more capacity than they are using.',
          },
          {
            type: 'list',
            items: [
              '90-100% — excellent sprint execution, the team is committing accurately and delivering reliably',
              '70-90% — acceptable range, with some room for improvement in estimation or capacity planning',
              '50-70% — concerning range, the team may be overcommitting, facing too many interruptions, or dealing with significant blockers',
              'Below 50% — immediate attention needed. Either the estimation process is broken, external factors are disrupting the sprint, or the team lacks capacity for the committed scope',
            ],
          },
          {
            type: 'heading',
            text: 'Using Sprint Data for Future Planning',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The true value of sprint analytics is not in measuring past performance — it is in improving future planning. Every sprint produces data that makes the next sprint more predictable.',
          },
          {
            type: 'list',
            items: [
              'Use average velocity from the last 3-5 sprints as the baseline for the next sprint\'s commitment',
              'If completion rate is consistently low, reduce the amount of work planned rather than pushing the team harder',
              'If burndowns show flat sections on specific days (like meeting-heavy days), account for reduced capacity on those days',
              'Track which types of tasks take longer than estimated and adjust story point values accordingly',
              'Share sprint analytics in retrospectives to ground discussions in data rather than opinions',
            ],
          },
          {
            type: 'tip',
            text: 'Velocity is a planning tool, not a performance measure. Never compare velocity between different teams — each team\'s point scale is unique. A team with velocity 20 is not "worse" than a team with velocity 50; they simply estimate differently.',
          },
        ],
      },
      {
        id: 'board-analytics-panel',
        title: 'Board Analytics Panel',
        description: 'Access detailed metrics and charts for individual boards',
        content: [
          {
            type: 'paragraph',
            text: 'Every board in AgileFlow has a built-in analytics panel that provides project-specific metrics without leaving the board view. This panel gives you a focused look at a single project\'s health, making it ideal for team leads who want to quickly assess progress during standups or check-ins.',
          },
          {
            type: 'heading',
            text: 'Opening the Analytics Panel',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Open any board from the Boards page.',
              'Look for the bar chart icon in the board header toolbar (next to the view selector and other controls).',
              'Click the bar chart icon to toggle the analytics panel open.',
              'The panel slides open, displaying stat cards and charts specific to this board.',
              'Click the icon again to close the panel when you are done.',
            ],
          },
          {
            type: 'heading',
            text: 'Stat Cards',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'At the top of the analytics panel, three stat cards provide key numbers at a glance. Each card includes an information tooltip (hover over the info icon) that explains what the metric means and why it matters.',
          },
          {
            type: 'list',
            items: [
              'Total Tasks — the total number of tasks on the board across all groups and statuses. This gives you a sense of the project\'s scope. The tooltip explains that this includes tasks in every status, from Not Started to Done.',
              'Completion Rate — the percentage of tasks that have been moved to "Done" status, displayed with a progress bar for quick visual assessment. A rising completion rate over time indicates steady progress. The tooltip clarifies that only tasks with "Done" status count as completed.',
              'Overdue Tasks — the number of tasks whose due date has passed but are not yet marked as "Done". This is a critical health indicator — overdue tasks represent broken commitments. The tooltip explains that reducing this number should be a priority.',
            ],
          },
          {
            type: 'heading',
            text: 'Info Tooltips',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Each stat card has a small info icon (usually a circled "i") that displays a tooltip when hovered. These tooltips provide context about what the metric measures, how it is calculated, and what constitutes a healthy value. They are designed to help team members who are new to project analytics understand what the numbers mean without needing to consult external documentation.',
          },
          {
            type: 'heading',
            text: 'Distribution Charts',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Below the stat cards, the analytics panel displays distribution charts that break down the board\'s tasks by different dimensions.',
          },
          {
            type: 'list',
            items: [
              'Status Distribution — shows how many tasks are in each status (Not Started, Working On It, Stuck, Done). Helps identify bottlenecks and workflow health.',
              'Team Distribution — shows how tasks are distributed among team members. Helps spot workload imbalances where one person has too many or too few tasks.',
              'Priority Distribution — shows the breakdown by priority level (Critical, High, Medium, Low). Helps assess whether the team is focused on the most important work.',
            ],
          },
          {
            type: 'heading',
            text: 'AI Explain Button',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The analytics panel includes an "AI Explain" button that sends the current board data to the AI assistant and returns a natural-language summary of what the analytics reveal. Instead of interpreting the charts yourself, you can click this button to get a narrative explanation like "Your board has 45 tasks with a 62% completion rate. There are 5 overdue items, mostly assigned to two team members. The priority distribution is healthy, but the 8 stuck tasks suggest blockers that need to be discussed in the next standup."',
          },
          {
            type: 'steps',
            items: [
              'Open the board analytics panel by clicking the bar chart icon.',
              'Scroll down to find the "AI Explain" button.',
              'Click it to send your board data to the AI assistant.',
              'The AI generates a summary that interprets the metrics, identifies patterns, and suggests actions.',
            ],
          },
          {
            type: 'tip',
            text: 'Use the AI Explain button during sprint reviews or stakeholder updates. It generates a ready-made summary that you can share verbally or paste into a message. It saves time translating charts into words.',
          },
        ],
      },
      {
        id: 'using-ai-for-analytics',
        title: 'Using AI for Analytics',
        description: 'Leverage AI to interpret metrics and generate actionable insights',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow\'s AI assistant is not just for task management — it is also a powerful analytics tool. The AI can interpret your project data, generate narrative summaries, answer questions about metrics, and suggest improvements based on what the numbers reveal. This is especially valuable for team members who are less comfortable reading charts or for generating quick reports without manual analysis.',
          },
          {
            type: 'heading',
            text: 'AI Explain Buttons on Analytics',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Throughout the analytics interface — both on the workspace Analytics page and within board analytics panels — you will find "AI Explain" buttons. These buttons pass the current data context to the AI and request an interpretation. The AI analyzes the numbers, identifies notable patterns, and returns a plain-language summary with actionable suggestions.',
          },
          {
            type: 'paragraph',
            text: 'The AI Explain feature is context-aware. When triggered from a board analytics panel, it focuses on that specific board\'s data. When triggered from the workspace Analytics page, it considers data across all boards. This means the insights are always relevant to what you are looking at.',
          },
          {
            type: 'heading',
            text: 'The /performance Command',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The /performance command in the AI assistant generates a comprehensive team performance summary. It pulls data from all boards and all team members to create a report that covers workload distribution, completion rates, overdue items, and potential issues.',
          },
          {
            type: 'steps',
            items: [
              'Open the AI assistant (floating panel or AI Chat page).',
              'Type /performance and press Enter.',
              'The AI fetches current workspace data and generates a performance report.',
              'Review the report, which includes individual member metrics, team-level trends, and recommendations.',
            ],
          },
          {
            type: 'heading',
            text: 'Getting Narrative Summaries',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Beyond the specific commands, you can ask the AI free-form questions about your project data. The AI has access to your workspace context — boards, tasks, statuses, assignments, and sprint data — and can answer questions in natural language.',
          },
          {
            type: 'list',
            items: [
              '"How is the current sprint going?" — the AI summarizes completion progress, remaining work, and any risks',
              '"Which tasks are overdue?" — the AI lists overdue items with their assignees and how overdue they are',
              '"Who has the most work right now?" — the AI ranks team members by current task load',
              '"Are we on track to finish the sprint?" — the AI compares completed work to the remaining timeline and gives an assessment',
              '"What should we focus on this week?" — the AI prioritizes based on deadlines, priority levels, and blocking dependencies',
            ],
          },
          {
            type: 'heading',
            text: 'Asking Follow-Up Questions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'After the AI provides an analytics summary, you can ask follow-up questions to dig deeper. The AI maintains conversation context, so you do not need to re-explain what you are asking about. For example, if the AI reports that Sprint 12 has a 65% completion rate, you can follow up with "Why is it lower than Sprint 11?" or "Which tasks are blocking progress?" and the AI will provide additional analysis.',
          },
          {
            type: 'tip',
            text: 'Use Thinking mode (the brain icon) for complex analytics questions that require deeper analysis. Thinking mode uses more capable models that are better at reasoning through multi-step calculations and identifying subtle patterns in data.',
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // 7. AI ASSISTANT
  // ─────────────────────────────────────────────
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Get intelligent help with task management, analysis, and team insights',
    icon: 'Bot',
    articles: [
      {
        id: 'using-ai-assistant',
        title: 'Using the AI Assistant',
        description: 'Access the AI through the floating panel or full-page chat',
        content: [
          {
            type: 'paragraph',
            text: 'The AI assistant is one of AgileFlow\'s most powerful features. It understands your project context — your boards, tasks, team members, sprints, and analytics — and can help you with everything from quick questions to in-depth analysis. The assistant is available in two different interfaces, each designed for different use cases.',
          },
          {
            type: 'heading',
            text: 'Two Ways to Access the AI',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow provides two distinct ways to interact with the AI assistant, each optimized for different workflows.',
          },
          {
            type: 'list',
            items: [
              'Floating Panel — a compact chat panel that overlays the current page. Ideal for quick questions while you are working on a board, reviewing analytics, or doing any other task. It stays out of your way but is always accessible.',
              'AI Chat Page — a dedicated full-page experience accessible from the sidebar. Designed for longer conversations, complex analysis, session management, and deep dives into your project data. Use this when you want to focus on the AI conversation.',
            ],
          },
          {
            type: 'heading',
            text: 'Opening the Floating Panel',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Look for the chat bubble icon in the bottom-right corner of any page.',
              'Click the icon to open the floating AI panel.',
              'Type your question or command in the text input area.',
              'Press Enter to send your message.',
              'The AI responds within the panel while you continue viewing your current page.',
            ],
          },
          {
            type: 'heading',
            text: 'Opening the AI Chat Page',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click "AI Chat" in the left sidebar navigation.',
              'The full-page chat interface loads with a centered message area.',
              'Type your question in the text area at the bottom.',
              'Press Enter to send (or Shift+Enter for a new line within your message).',
              'View responses in the scrollable conversation area.',
            ],
          },
          {
            type: 'heading',
            text: 'What You Can Ask',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The AI assistant can help with a wide range of project management tasks. It automatically loads your workspace data so responses are grounded in your actual projects, not generic advice.',
          },
          {
            type: 'list',
            items: [
              'Task management questions — "What tasks are overdue?", "Who has the most work?", "What should I work on next?"',
              'Sprint planning — "How much work is left in the sprint?", "Are we on track?", "What is our velocity?"',
              'Team insights — "How is the team performing?", "Who is overloaded?", "Show me completion rates"',
              'Analytics interpretation — "Explain the burndown chart", "Why is our velocity dropping?", "What do the analytics suggest?"',
              'Process guidance — "How should I set up a Kanban board?", "What is a good sprint length?", "How do story points work?"',
              'Quick actions — use slash commands like /assign, /sprint, and /performance for structured outputs',
            ],
          },
          {
            type: 'heading',
            text: 'Quick Action Buttons',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Both the floating panel and AI Chat page display suggestion chips — pre-built prompts you can click instead of typing. These chips cover common questions and commands, making it faster to get insights without having to formulate your own prompt. They are especially useful when you are new to the AI assistant and want to see what it can do.',
          },
          {
            type: 'heading',
            text: 'Response Modes: Fast vs Thinking',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The AI assistant operates in two modes, each using different underlying models optimized for different types of questions.',
          },
          {
            type: 'list',
            items: [
              'Fast Mode (Zap icon) — uses lightweight, fast models like Claude Haiku 4.5, Gemini 2.5 Flash, and GPT-4o Mini. Responses come back in seconds. Best for simple questions, quick lookups, status checks, and straightforward commands. This is the default mode.',
              'Thinking Mode (Brain icon) — uses more capable models designed for deeper analysis and complex reasoning. Responses may take slightly longer but are more thorough. Best for complex analytics questions, multi-step planning, detailed performance analysis, and situations where you need nuanced insights.',
            ],
          },
          {
            type: 'paragraph',
            text: 'You can toggle between modes using the mode selector button next to the text input. The Zap icon represents Fast mode and the Brain icon represents Thinking mode. The current mode is visually indicated so you always know which mode is active.',
          },
          {
            type: 'tip',
            text: 'Start with Fast mode for most interactions. Switch to Thinking mode when you need the AI to reason through complex scenarios, compare multiple options, or analyze trends across many data points. Fast mode handles 80% of typical questions well.',
          },
        ],
      },
      {
        id: 'ai-commands',
        title: 'AI Commands',
        description: 'Use slash commands for structured task assignment, sprint planning, and performance analysis',
        content: [
          {
            type: 'paragraph',
            text: 'While you can ask the AI assistant any free-form question, slash commands provide structured, predictable outputs for common project management needs. Each command triggers a specific analysis that considers multiple factors from your workspace data and returns a formatted, actionable response.',
          },
          {
            type: 'heading',
            text: 'The /assign Command',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The /assign command asks the AI to recommend task assignments based on your team\'s current workload, skills, and availability. Instead of manually reviewing each person\'s task list and trying to balance the distribution, you let the AI analyze all the relevant factors and suggest optimal assignments.',
          },
          {
            type: 'list',
            items: [
              'What it considers: current task count per team member, completion rates, active vs completed work, task priority levels, and overall workload balance',
              'What it returns: specific suggestions for which team member should handle unassigned or pending tasks, with reasoning for each recommendation',
              'When to use it: during sprint planning, when new tasks are created, when someone is out and their tasks need redistribution, or when you suspect workload imbalance',
            ],
          },
          {
            type: 'paragraph',
            text: 'To use the /assign command, simply type "/assign" in the AI chat input and press Enter. The AI fetches your current workspace data, analyzes team workloads, and returns assignment suggestions. You can follow up with questions like "Why do you recommend assigning the login feature to Sarah?" and the AI will explain its reasoning.',
          },
          {
            type: 'heading',
            text: 'The /sprint Command',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The /sprint command generates sprint planning recommendations. It analyzes your backlog, team capacity, historical velocity, and current commitments to suggest what should go into the next sprint.',
          },
          {
            type: 'list',
            items: [
              'What it considers: backlog priority order, story point estimates, team velocity from previous sprints, current team capacity, dependencies between tasks, and deadline pressure',
              'What it returns: a recommended sprint scope with specific user stories or tasks, estimated total story points, risk assessment, and suggestions for handling dependencies',
              'When to use it: before sprint planning meetings, when prioritizing the backlog, when deciding whether to add or remove items from an active sprint',
            ],
          },
          {
            type: 'paragraph',
            text: 'Type "/sprint" in the AI chat to trigger this command. The AI evaluates your workspace and produces a sprint plan recommendation that you can use as a starting point for your planning discussion. It is not meant to replace the team\'s judgment — it provides a data-informed suggestion that the team can then discuss and refine.',
          },
          {
            type: 'heading',
            text: 'The /performance Command',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The /performance command generates a comprehensive team performance summary. It pulls metrics from all boards and team members to create a report covering productivity, workload distribution, and potential issues.',
          },
          {
            type: 'list',
            items: [
              'What it considers: task completion rates per member, workload distribution, overdue task counts, sprint completion percentages, and trend data from recent sprints',
              'What it returns: a formatted performance report with per-member statistics, team-level metrics, highlights (who is excelling), concerns (who might need support), and actionable recommendations',
              'When to use it: before retrospectives, during one-on-one meetings with team members, when preparing status reports for stakeholders, or weekly as part of your team health check routine',
            ],
          },
          {
            type: 'paragraph',
            text: 'Type "/performance" in the AI chat to generate the report. The output is typically detailed enough to share directly in retrospective meetings or status updates. It saves significant time compared to manually compiling metrics from multiple boards and analytics views.',
          },
          {
            type: 'heading',
            text: 'Combining Commands with Follow-Up Questions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Slash commands are most powerful when combined with follow-up questions. After running /performance, you might ask "Why has Ahmed\'s completion rate dropped?" or after /sprint, you might ask "What happens if we add the payment feature to this sprint?". The AI maintains context from the command output and can reason about your follow-up questions using the same data.',
          },
          {
            type: 'tip',
            text: 'Use slash commands as conversation starters, not final answers. Run /assign to get initial recommendations, then discuss them with your team and ask the AI follow-up questions to refine the assignments based on factors the AI might not know about (like someone learning a new technology).',
          },
        ],
      },
      {
        id: 'ai-chat-page',
        title: 'AI Chat Page',
        description: 'Use the full-page AI experience with session history, streaming, and advanced features',
        content: [
          {
            type: 'paragraph',
            text: 'The AI Chat page is a dedicated, full-page interface for extended conversations with the AI assistant. While the floating panel is great for quick questions, the Chat page is designed for longer, more complex interactions — multi-step analysis, planning sessions, and detailed discussions where you need space and context.',
          },
          {
            type: 'heading',
            text: 'Accessing the AI Chat Page',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click "AI Chat" in the left sidebar navigation.',
              'The full-page chat interface loads.',
              'Start typing in the message input area at the bottom of the screen.',
            ],
          },
          {
            type: 'heading',
            text: 'Interface Layout',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The AI Chat page has a clean, centered layout optimized for conversation. The main message area takes up most of the screen, with messages displayed in a scrollable thread. Your messages appear on one side and the AI\'s responses on the other, similar to a messaging application.',
          },
          {
            type: 'list',
            items: [
              'Centered message area — the conversation thread occupies the main content area, with comfortable reading width',
              'Message input — an auto-expanding text area at the bottom that grows as you type longer messages',
              'Mode toggle — the Fast/Thinking mode selector (Zap/Brain icons) is accessible next to the input area',
              'Session history sidebar — a collapsible panel listing previous chat sessions for easy access',
              'Suggestion chips — pre-built prompts displayed when the conversation is empty or after a response',
            ],
          },
          {
            type: 'heading',
            text: 'Session Management',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Unlike the floating panel, the AI Chat page supports full session management. Your conversations are saved and organized so you can return to them later.',
          },
          {
            type: 'list',
            items: [
              'Sessions are automatically created when you start a new conversation',
              'Previous sessions appear in the sidebar history, listed with their title and timestamp',
              'Click any session in the history to reload that conversation and continue where you left off',
              'Rename sessions to make them easier to find later (e.g., "Sprint 12 Planning" or "Q2 Roadmap Analysis")',
              'Delete sessions you no longer need to keep your history clean',
              'Start a new session at any time to begin a fresh conversation without losing previous ones',
            ],
          },
          {
            type: 'heading',
            text: 'Streaming Responses',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The AI Chat page displays responses as they stream in — you see the text appear in real-time rather than waiting for the entire response to finish generating. This provides immediate feedback and lets you start reading while the AI is still working on the full answer.',
          },
          {
            type: 'list',
            items: [
              'Responses appear word by word or sentence by sentence as the AI generates them',
              'A stop button appears while the AI is generating, allowing you to cancel the response if it is going in the wrong direction',
              'Click the stop button to halt generation immediately — you keep whatever has been generated so far',
              'Stopping a response does not count as an error; you can send a new message to redirect the conversation',
            ],
          },
          {
            type: 'heading',
            text: 'Keyboard Support',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Enter — sends the current message',
              'Shift + Enter — inserts a new line within the message (for multi-line prompts without sending)',
              'The text input auto-expands as you type, accommodating longer messages without scrolling within the input',
            ],
          },
          {
            type: 'heading',
            text: 'When to Use the Chat Page vs the Floating Panel',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Use the AI Chat page when you want to have an extended conversation with multiple follow-up questions',
              'Use the AI Chat page when you want to save the conversation for later reference',
              'Use the AI Chat page for complex analysis that produces long responses you need to read carefully',
              'Use the floating panel for quick, one-off questions while working on a board',
              'Use the floating panel when you do not want to leave your current page',
              'Use the floating panel for fast status checks and simple commands',
            ],
          },
          {
            type: 'tip',
            text: 'Name your AI Chat sessions descriptively. When you revisit session history weeks later, "Sprint 14 retrospective analysis" is much more useful than "New chat" or "Untitled session".',
          },
        ],
      },
      {
        id: 'how-ai-works',
        title: 'How the AI Works',
        description: 'Understand the multi-model architecture, fallback system, and data handling',
        content: [
          {
            type: 'paragraph',
            text: 'Understanding how the AI assistant works behind the scenes helps you use it more effectively and set appropriate expectations for its capabilities. AgileFlow\'s AI is powered by a multi-model architecture that balances speed, quality, and reliability.',
          },
          {
            type: 'heading',
            text: 'Multi-Model Architecture',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Instead of relying on a single AI model, AgileFlow uses multiple language models through a service called OpenRouter. This architecture provides several advantages: if one model is slow or unavailable, the system automatically falls back to another; different models can be used for different tasks; and the system can balance cost and performance.',
          },
          {
            type: 'heading',
            text: 'Fast Mode Models',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When you use Fast mode (the Zap icon), your request is routed to lightweight, fast-response models. These models are optimized for quick answers and can handle most everyday project management questions in seconds.',
          },
          {
            type: 'list',
            items: [
              'Claude Haiku 4.5 — Anthropic\'s fast, efficient model designed for quick tasks and simple analysis',
              'Gemini 2.5 Flash — Google\'s fast model optimized for speed and responsiveness',
              'GPT-4o Mini — OpenAI\'s compact model balancing capability with speed',
            ],
          },
          {
            type: 'heading',
            text: 'Thinking Mode Models',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Thinking mode (the Brain icon) routes your request to more capable models designed for deeper analysis, complex reasoning, and multi-step problem-solving. These models take slightly longer but produce more thorough, nuanced responses. The specific models used in Thinking mode are selected for their strength in analytical and reasoning tasks.',
          },
          {
            type: 'heading',
            text: 'Automatic Fallback',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'If the primary model for your selected mode is unavailable or experiencing high latency, the system automatically falls back to the next available model. This cascading fallback ensures that you always get a response, even if a specific AI provider is having issues. The fallback is seamless — you do not need to do anything, and you may not even notice it happened.',
          },
          {
            type: 'heading',
            text: 'Context-Aware Responses',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The AI assistant does not operate in a vacuum. When you send a message, the system automatically loads relevant workspace data — your boards, tasks, team members, sprints, and recent activity — and includes it as context for the AI model. This is why the AI can answer questions like "Who has the most overdue tasks?" without you needing to specify which board or which team. The AI sees your actual data and responds based on it.',
          },
          {
            type: 'list',
            items: [
              'Board data — names, descriptions, task counts, and statuses from your boards',
              'Task data — individual task details including status, priority, assignee, and due dates',
              'Team data — team member names, roles, and current assignments',
              'Sprint data — active and past sprint details, velocity, and completion rates',
            ],
          },
          {
            type: 'heading',
            text: 'Data Privacy',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Your workspace data is sent to third-party AI model providers (Anthropic, Google, OpenAI) to generate responses. The data is used only for generating the immediate response and is not stored or used for training by the AI providers. AgileFlow sends only the minimum data needed for the AI to understand your question. Sensitive information like passwords and authentication tokens is never included in AI requests.',
          },
          {
            type: 'warning',
            text: 'While AI providers do not store your data for training, your workspace information (task titles, team member names, sprint details) is transmitted to external servers to generate responses. Avoid putting highly sensitive or confidential information in task titles, descriptions, or other fields if this is a concern for your organization.',
          },
        ],
      },
      {
        id: 'ai-best-practices',
        title: 'AI Best Practices',
        description: 'Tips for getting the most accurate and useful responses from the AI',
        content: [
          {
            type: 'paragraph',
            text: 'The AI assistant is a powerful tool, but like any tool, the results depend on how you use it. These best practices will help you get more accurate, useful, and actionable responses from the AI.',
          },
          {
            type: 'heading',
            text: 'Be Specific in Your Questions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The more specific your question, the more useful the response. Vague questions produce vague answers. Compare these two approaches:',
          },
          {
            type: 'list',
            items: [
              'Vague: "How is the project going?" — The AI gives a generic overview that may not address what you actually want to know.',
              'Specific: "What is the completion rate for Sprint 12, and are there any overdue tasks blocking the release?" — The AI provides targeted metrics and actionable information.',
              'Vague: "Help with assignments." — The AI does not know which tasks or which team members you mean.',
              'Specific: "Suggest assignments for the 5 unassigned tasks on the Payment Board, considering current workloads." — The AI can provide concrete, useful recommendations.',
            ],
          },
          {
            type: 'heading',
            text: 'Use Slash Commands for Structured Output',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When you want a specific type of analysis, use the slash commands (/assign, /sprint, /performance) rather than asking free-form questions. Slash commands trigger pre-defined analysis workflows that produce consistently formatted, comprehensive outputs. They are the most reliable way to get structured data from the AI.',
          },
          {
            type: 'heading',
            text: 'Choose the Right Mode',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Use Fast mode for: quick status checks, simple questions, task lookups, basic commands, and anything where speed matters more than depth',
              'Use Thinking mode for: complex multi-factor analysis, sprint planning discussions, deep performance evaluations, trend analysis across multiple sprints, and questions that require weighing trade-offs',
              'Rule of thumb: if you can answer the question in one sentence, use Fast mode. If it requires a paragraph or more, consider Thinking mode.',
            ],
          },
          {
            type: 'heading',
            text: 'How Context Works',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The AI automatically loads your workspace data before generating a response. This means it knows about your boards, tasks, team members, and sprints without you needing to explain them. However, the AI does not know about things outside AgileFlow — external tools, private conversations, company policies, or context that is not captured in your task data. If the AI needs information that is not in AgileFlow, provide it in your message.',
          },
          {
            type: 'heading',
            text: 'Iterate and Follow Up',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Do not treat AI interactions as one-shot queries. The best results come from conversation — ask an initial question, review the response, and then follow up with clarifying or deepening questions. The AI maintains context within a session, so each follow-up builds on what came before.',
          },
          {
            type: 'list',
            items: [
              'Start broad: "How is the team performing this sprint?"',
              'Narrow down: "Tell me more about the stuck tasks you mentioned."',
              'Get actionable: "What do you suggest we do about the blocked items?"',
              'Validate: "Would reassigning the API task to Jendawy help unblock things?"',
            ],
          },
          {
            type: 'heading',
            text: 'Limitations to Keep in Mind',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'The AI can only see data that exists in AgileFlow. If tasks are tracked in other tools, the AI cannot factor them in.',
              'AI suggestions are recommendations, not decisions. Always apply human judgment before acting on AI output, especially for assignments and sprint planning.',
              'The AI does not have real-time awareness of changes happening while you are chatting. If you update tasks mid-conversation, the AI may reference stale data until you start a new message.',
              'Complex calculations or very large datasets may occasionally produce approximate rather than exact numbers. Verify critical metrics manually if precision matters.',
              'The AI does not remember conversations between separate sessions. Each new session starts with a fresh context (though it always has access to your current workspace data).',
            ],
          },
          {
            type: 'tip',
            text: 'Treat the AI as a knowledgeable colleague, not an authority. It is excellent at summarizing data, identifying patterns, and suggesting options, but it does not understand the full context of your team dynamics, organizational politics, or domain-specific nuances that affect real-world decisions.',
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // 8. TEAM COLLABORATION
  // ─────────────────────────────────────────────
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    description: 'Manage your team, roles, permissions, and communication',
    icon: 'Users',
    articles: [
      {
        id: 'inviting-members',
        title: 'Inviting Team Members',
        description: 'Add people to your workspace with email invitations and role selection',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow is designed for team collaboration, and the first step is getting your teammates onto the platform. The invitation process is straightforward — you invite people by email, select their role, and they create an account to join your workspace.',
          },
          {
            type: 'heading',
            text: 'How to Invite a Team Member',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Navigate to the Admin panel (accessible from the sidebar if you have Admin privileges).',
              'Click the "Invite Members" or "Invite" button.',
              'Enter the email address of the person you want to invite.',
              'Select a role for the new member — either Member (default, full create/edit access) or Admin (full access plus user management).',
              'Click "Send Invite" to send the invitation.',
            ],
          },
          {
            type: 'heading',
            text: 'What Happens After Inviting',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When you send an invitation, the invited person receives instructions to create an account on AgileFlow using the email address you specified. Once they sign up, they automatically join your workspace with the role you selected.',
          },
          {
            type: 'list',
            items: [
              'The invited person must create an account using the exact email address that was invited',
              'Their assigned role (Member or Admin) takes effect immediately upon account creation',
              'New members are automatically set to the "Member" role if no specific role is selected during invitation',
              'They can immediately see shared boards, tasks, and events after signing in',
              'Their auto-generated avatar (initials with a unique color) appears in people columns and team lists',
            ],
          },
          {
            type: 'heading',
            text: 'Managing Invitations',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Admin panel shows the status of all team members and allows you to manage the roster. You can search for specific members, filter by role, and update roles or information as your team evolves.',
          },
          {
            type: 'tip',
            text: 'Invite team members with the "Member" role by default. This gives them full ability to create boards, manage tasks, and collaborate without the risk of accidental administrative changes. Upgrade to Admin only for people who need to manage users and workspace settings.',
          },
          {
            type: 'warning',
            text: 'Only Admins can invite new members and manage roles. If you are a Member or Viewer, you will not see the invitation options. Ask your workspace Admin to add new teammates.',
          },
        ],
      },
      {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        description: 'Understand what Admins, Members, and Viewers can and cannot do',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow uses a role-based access control system with three roles: Admin, Member, and Viewer. Each role has a clearly defined set of capabilities, ensuring that people have exactly the level of access they need. Understanding these roles is important for workspace security and smooth collaboration.',
          },
          {
            type: 'heading',
            text: 'Admin Role',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Admins have full, unrestricted access to every feature in AgileFlow. They are the workspace owners and managers who oversee the team, configure settings, and maintain the platform.',
          },
          {
            type: 'list',
            items: [
              'Can create, edit, and delete boards, tasks, groups, and columns',
              'Can create, edit, and delete calendar events',
              'Can drag and drop tasks in Kanban view and reorder items in table view',
              'Can access and use the AI assistant with all commands',
              'Can view all analytics at workspace and board level',
              'Can access the Admin panel for user management',
              'Can invite new team members and select their roles',
              'Can edit other users\' profiles — change names, roles, and departments',
              'Can reset other users\' passwords',
              'Can manage workspace-wide settings and preferences',
              'Can see admin-specific statistics: Total Members, Admins, Members, Active This Week',
            ],
          },
          {
            type: 'heading',
            text: 'Member Role',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Members are the standard role for active team contributors. They can do everything needed for daily project work but cannot manage other users or access administrative features. This is the default role for newly invited team members.',
          },
          {
            type: 'list',
            items: [
              'Can create, edit, and delete boards, tasks, groups, and columns',
              'Can create, edit, and delete calendar events',
              'Can drag and drop tasks in Kanban view and reorder items in table view',
              'Can access and use the AI assistant with all commands',
              'Can view analytics at workspace and board level',
              'Can edit their own profile settings and preferences',
              'Cannot access the Admin panel',
              'Cannot invite new members or manage other users\' roles',
              'Cannot reset other users\' passwords',
              'Cannot modify workspace-level administrative settings',
            ],
          },
          {
            type: 'heading',
            text: 'Viewer Role',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Viewers have read-only access to the workspace. They can see boards, tasks, calendar events, and analytics, but they cannot create, edit, or modify anything. This role is ideal for stakeholders, clients, or anyone who needs visibility without the ability to make changes.',
          },
          {
            type: 'list',
            items: [
              'Can view boards, tasks, groups, and columns in read-only mode',
              'Can view calendar events but cannot create, edit, or delete them',
              'Can view analytics at workspace and board level',
              'Cannot create, edit, or delete boards, tasks, groups, or columns',
              'Cannot drag and drop tasks — Kanban drag is disabled for Viewers',
              'Cannot add items — the "+ Add Item" button is hidden or disabled',
              'Cannot modify any cell values in the table view',
              'Cannot access the Admin panel or manage users',
              'Can edit only their own profile settings',
            ],
          },
          {
            type: 'heading',
            text: 'Changing Roles',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Only an Admin can change user roles.',
              'Go to the Admin panel from the sidebar.',
              'Find the user whose role you want to change (use the search or filter by role).',
              'Click "Edit" on that user\'s entry.',
              'Select the new role from the role dropdown.',
              'Save the changes. The new role takes effect immediately.',
            ],
          },
          {
            type: 'warning',
            text: 'Be cautious when assigning the Admin role. Admins can manage all users, reset passwords, and make workspace-wide changes. Only give Admin access to people who genuinely need administrative capabilities.',
          },
          {
            type: 'tip',
            text: 'Use the Viewer role for external stakeholders who need to monitor progress without making changes. It provides full visibility while ensuring they cannot accidentally modify tasks, move items, or disrupt the team\'s workflow.',
          },
        ],
      },
      {
        id: 'permission-enforcement',
        title: 'Permission Enforcement',
        description: 'How permissions affect the user interface and what controls are shown or hidden',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow does not just check permissions on the server — it enforces them visually in the user interface. When a user lacks permission to perform an action, the corresponding button, control, or interaction is either hidden entirely or displayed in a disabled state. This approach prevents confusion and accidental actions by making the available actions clear at a glance.',
          },
          {
            type: 'heading',
            text: 'Board and Task Permissions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The board is where permission differences are most visible. Admins and Members see a fully interactive board with editable cells, add buttons, and delete controls. Viewers see the same data but in a read-only presentation.',
          },
          {
            type: 'list',
            items: [
              'Admins and Members: clickable cells, editable fields, "+ Add Item" buttons, delete icons, drag handles on rows',
              'Viewers: cells display data but do not respond to clicks, no add/edit/delete buttons appear, cursor does not change to indicate editability',
            ],
          },
          {
            type: 'heading',
            text: 'Kanban Drag-and-Drop',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'In Kanban view, permission enforcement is particularly important because drag-and-drop is the primary interaction method. Moving a card between columns changes the task\'s status, which is a data modification.',
          },
          {
            type: 'list',
            items: [
              'Admins and Members: cards are draggable. Grab a card and move it between columns to change its status, priority, or assignment.',
              'Viewers: cards are not draggable. The drag handle does not appear, and attempting to drag does nothing. Cards are static and informational only.',
            ],
          },
          {
            type: 'heading',
            text: 'Calendar Permissions',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Admins and Members: can click dates to create events, can click events to edit or delete them, see the "+ New Event" button',
              'Viewers: can view events on the calendar and see event details, but cannot create, edit, or delete events. Creation controls are hidden.',
            ],
          },
          {
            type: 'heading',
            text: 'Settings and Admin Panel',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'All roles: can access Settings and edit their own profile, notification preferences, and theme',
              'Admins only: can access the Admin panel, see user management controls, invite members, edit other users, and reset passwords',
              'Members and Viewers: the Admin panel link is not visible in the sidebar navigation',
            ],
          },
          {
            type: 'heading',
            text: 'Analytics and AI',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Analytics and AI features are available to all roles. Viewing analytics and asking the AI assistant questions does not modify data, so there is no permission restriction. All users can view charts, run AI commands, and access the AI Chat page regardless of their role.',
          },
          {
            type: 'tip',
            text: 'If you are a Viewer and need to make a change (like updating a task status or creating an event), ask your workspace Admin to upgrade your role to Member. Role changes take effect immediately.',
          },
        ],
      },
      {
        id: 'activity-tracking',
        title: 'Activity Tracking',
        description: 'Monitor what is happening across your workspace and who made changes',
        content: [
          {
            type: 'paragraph',
            text: 'Activity tracking in AgileFlow provides a record of what is happening across your workspace. It answers the questions "who did what, and when?" which is essential for accountability, coordination, and understanding how your projects are evolving. Activity data appears in several places throughout the application.',
          },
          {
            type: 'heading',
            text: 'What Gets Tracked',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Task creation — when a new task is added to a board, including who created it',
              'Status changes — when a task moves between statuses (e.g., from "Working" to "Done")',
              'Assignment changes — when a task is assigned or reassigned to a team member',
              'Task updates — edits to priority, due date, description, and other fields',
              'Board creation and updates — new boards, name changes, and configuration updates',
              'Calendar events — creation, modification, and deletion of events',
              'Sprint activity — sprint creation, items added/removed, sprint start/completion',
            ],
          },
          {
            type: 'heading',
            text: 'Where to View Activity',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Dashboard — the activity feed on the Dashboard shows recent activity across all your boards, providing a workspace-wide timeline',
              'Board Analytics — the analytics panel within a board shows activity specific to that project, including task movements and completion events',
              'Admin Panel — admins can view activity statistics including "Active This Week" counts and user-level activity summaries',
            ],
          },
          {
            type: 'heading',
            text: 'Timestamps and User Attribution',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Every tracked activity includes a timestamp (when it happened) and user attribution (who did it). This combination lets you reconstruct the timeline of changes to any task or project. Timestamps are displayed relative to the current time for recent activity (e.g., "2 hours ago") and as full dates for older activity.',
          },
          {
            type: 'heading',
            text: 'Using Activity Data for Accountability',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Activity tracking creates transparency. When everyone can see who is working on what and when changes happen, it naturally encourages ownership and follow-through. Team members know their contributions are visible, and managers can verify progress without micromanaging.',
          },
          {
            type: 'list',
            items: [
              'Review the Dashboard activity feed during standups to catch up on overnight progress',
              'Check board analytics before one-on-one meetings to understand a team member\'s recent work',
              'Use Admin panel activity statistics to identify inactive users who may need onboarding help or re-engagement',
              'Reference activity timestamps when discussing timeline questions like "when was this task completed?"',
            ],
          },
          {
            type: 'tip',
            text: 'Activity tracking works best when the team consistently updates task statuses in AgileFlow. If work is done but statuses are not updated, the activity feed will not reflect reality. Encourage your team to update task statuses as part of their daily workflow.',
          },
        ],
      },
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Stay informed with real-time alerts for tasks, mentions, sprints, and more',
        content: [
          {
            type: 'paragraph',
            text: 'Notifications keep you informed about what is happening in your workspace without requiring you to constantly check every board and calendar. AgileFlow supports multiple notification types, each designed to alert you about different kinds of events. Effective notification management means you stay informed about important changes while avoiding notification fatigue.',
          },
          {
            type: 'heading',
            text: 'Notification Types',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow categorizes notifications into seven types, each with a distinct purpose and visual style.',
          },
          {
            type: 'list',
            items: [
              'Info — general informational updates about your workspace, such as system announcements or feature updates',
              'Success — positive confirmations that an action was completed, like a task being marked as Done or a sprint being completed',
              'Warning — alerts about potential issues that may need attention, such as approaching deadlines or capacity concerns',
              'Error — notifications about problems that require action, like failed operations or system errors',
              'Task — updates related to tasks you are involved with, including status changes, assignments, and due date modifications',
              'Mention — notifications when someone mentions you in a task description, comment, or discussion',
              'Sprint — sprint-related updates including sprint starts, sprint ends, items being added to or removed from sprints',
            ],
          },
          {
            type: 'heading',
            text: 'Accessing Notifications',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The notification center is accessible from the bell icon in the top navigation bar. When you have unread notifications, a badge appears on the bell showing the count of unread items.',
          },
          {
            type: 'steps',
            items: [
              'Click the bell icon in the top navigation bar.',
              'The notification panel opens, showing your recent notifications sorted by time.',
              'Unread notifications are visually distinct from read ones.',
              'Click on any notification to navigate to the relevant item (task, board, event, etc.).',
              'Click "Mark all as read" to clear the unread badge and mark everything as seen.',
            ],
          },
          {
            type: 'heading',
            text: 'Auto-Refresh',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Notifications refresh automatically every 30 seconds while you are using AgileFlow. This means you do not need to manually refresh the page to see new notifications — they appear in the notification panel and update the badge count automatically. If something important happens while you are working, you will see the badge update within half a minute.',
          },
          {
            type: 'heading',
            text: 'Click to Navigate',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Notifications are not just informational — they are actionable. Clicking on a notification navigates you directly to the relevant item. If you receive a notification about a task assignment, clicking it takes you to that board and highlights the task. If you receive a sprint notification, clicking it takes you to the sprint view. This makes notifications a fast way to jump to where action is needed.',
          },
          {
            type: 'heading',
            text: 'Configuring Notification Preferences',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'You can control which notifications you receive from Settings → Notifications. This is covered in detail in the "Notification Preferences" article under Settings. The key categories you can toggle include email notifications, task assignments, mentions, due date reminders, sprint updates, and daily digest emails.',
          },
          {
            type: 'tip',
            text: 'Keep Task and Mention notifications enabled at minimum. These are the most actionable notification types — they tell you when work is assigned to you and when someone needs your attention. You can safely disable Info and Success notifications if they feel too noisy.',
          },
          {
            type: 'warning',
            text: 'If you disable all notifications, you may miss important updates like task reassignments, deadline changes, or sprint completions. Review your notification settings periodically to make sure you are receiving the alerts that matter to your role.',
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // 9. SETTINGS & PREFERENCES
  // ─────────────────────────────────────────────
  {
    id: 'settings',
    title: 'Settings & Preferences',
    description: 'Customize your profile, theme, notifications, privacy, and account',
    icon: 'Settings',
    articles: [
      {
        id: 'profile-settings',
        title: 'Profile Settings',
        description: 'Edit your name, job title, department, bio, and skills',
        content: [
          {
            type: 'paragraph',
            text: 'Your profile is how you appear to other team members throughout AgileFlow. When you are assigned to a task, mentioned in a conversation, or listed in team analytics, your profile information is what others see. A complete, accurate profile makes collaboration smoother because teammates can quickly identify who you are, what you do, and how to reach you.',
          },
          {
            type: 'heading',
            text: 'Accessing Profile Settings',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click "Settings" in the left sidebar navigation (or access it from the user dropdown menu at the bottom of the sidebar).',
              'The Settings page opens with the "Profile" tab selected by default.',
              'Edit any field and click "Save Changes" when you are done.',
            ],
          },
          {
            type: 'heading',
            text: 'Profile Fields',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Full Name — your display name throughout AgileFlow. This appears in task assignments, people columns, team lists, and activity feeds. Use your real name so teammates can identify you.',
              'Email — your email address associated with your account. This is used for sign-in and for notification emails. It is set during account creation.',
              'Job Title — your role or position (e.g., "Frontend Developer", "Product Manager", "Scrum Master"). Displayed in team views and helps others understand your function.',
              'Department — the team or department you belong to (e.g., "Engineering", "Design", "Product"). Useful for filtering and organizing team members across a larger organization.',
              'Bio — a brief description of yourself, your responsibilities, or your expertise. This is optional but helpful for new team members trying to understand who does what.',
              'Skills — tags representing your areas of expertise (e.g., "React", "Python", "UX Design", "Data Analysis"). Skills help the AI assistant make better task assignment recommendations and help team leads assign work to the right people.',
            ],
          },
          {
            type: 'heading',
            text: 'Auto-Generated Avatar',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow automatically generates a visual avatar for every user based on their initials and a unique color. For example, if your name is "Sarah Kim", your avatar will display "SK" on a distinct background color. This avatar appears everywhere your identity is shown — in people columns, task assignments, team lists, and the sidebar. The color is algorithmically assigned to be unique and consistent, so each team member gets a different color that never changes.',
          },
          {
            type: 'heading',
            text: 'Why Profile Matters for Collaboration',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A complete profile is not just cosmetic — it directly impacts how effectively you collaborate. When the AI assistant considers task assignments via the /assign command, it factors in skills listed in profiles. When a teammate is trying to figure out who owns a specific domain area, job titles and departments help them find the right person. When new members join the team, profiles give them a quick orientation to who does what.',
          },
          {
            type: 'tip',
            text: 'Fill in your skills carefully. The AI assistant uses this information when generating task assignment suggestions. The more accurate your skills list, the better the AI recommendations will be for matching tasks to people.',
          },
        ],
      },
      {
        id: 'theme-appearance',
        title: 'Theme & Appearance',
        description: 'Switch between Light, Dark, and System theme modes',
        content: [
          {
            type: 'paragraph',
            text: 'AgileFlow supports three theme options to match your visual preference and working environment. Whether you prefer the crispness of light mode, the reduced eye strain of dark mode, or automatic matching with your operating system, AgileFlow adapts to you.',
          },
          {
            type: 'heading',
            text: 'Available Themes',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Light Mode — a bright, white-background interface with dark text. This is the default theme and works well in well-lit environments. Charts and color coding are most vivid in light mode.',
              'Dark Mode — a dark-background interface with light text. Reduces eye strain in low-light environments, reduces screen glare, and can save battery on OLED displays. All UI elements, charts, and color coding are adapted for dark backgrounds.',
              'System — automatically matches your operating system\'s theme preference. If your OS is set to dark mode, AgileFlow uses dark mode. If your OS is in light mode, AgileFlow uses light mode. It also switches automatically if your OS changes (e.g., on a schedule).',
            ],
          },
          {
            type: 'heading',
            text: 'Quick Toggle (Top Bar)',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The fastest way to switch between light and dark mode is the toggle icon in the top navigation bar. Look for the sun icon (when in dark mode) or moon icon (when in light mode). Clicking it instantly switches to the opposite theme.',
          },
          {
            type: 'steps',
            items: [
              'Locate the sun or moon icon in the top navigation bar (right side).',
              'Click the icon to toggle between light and dark mode.',
              'The theme changes immediately without a page reload.',
              'Your preference is saved and persists across sessions.',
            ],
          },
          {
            type: 'heading',
            text: 'Settings Page Option',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Go to Settings from the sidebar.',
              'Switch to the "Preferences" tab.',
              'Find the Theme or Appearance section.',
              'Select Light, Dark, or System from the available options.',
              'Save your changes.',
            ],
          },
          {
            type: 'paragraph',
            text: 'The Settings page is the only place where you can select the "System" option (auto-detect). The top bar quick toggle only switches between Light and Dark directly.',
          },
          {
            type: 'heading',
            text: 'Dark Mode Details',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Dark mode is not simply an inverted light mode — every component in AgileFlow has been designed with specific dark mode colors. Backgrounds use dark grays rather than pure black for comfortable readability. Text uses off-white rather than pure white to reduce contrast glare. Charts, badges, status indicators, and event colors are all adjusted to maintain visibility and aesthetics on dark backgrounds.',
          },
          {
            type: 'tip',
            text: 'If you work in varying lighting conditions throughout the day, use the "System" theme and set your operating system to switch between light and dark mode on a schedule. AgileFlow will follow automatically.',
          },
        ],
      },
      {
        id: 'notification-preferences',
        title: 'Notification Preferences',
        description: 'Control which notifications you receive and how they are delivered',
        content: [
          {
            type: 'paragraph',
            text: 'Notification preferences let you fine-tune which alerts you receive, helping you stay informed without being overwhelmed. AgileFlow offers granular control over each notification category so you can enable the ones that matter and disable the ones that do not.',
          },
          {
            type: 'heading',
            text: 'Accessing Notification Preferences',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Go to Settings from the sidebar.',
              'Switch to the "Notifications" tab.',
              'Toggle each notification category on or off.',
              'Save your changes.',
            ],
          },
          {
            type: 'heading',
            text: 'Notification Categories',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Each category can be independently enabled or disabled. Here is what each one controls:',
          },
          {
            type: 'list',
            items: [
              'Email Notifications — master toggle for all email-based alerts. When disabled, you only receive in-app notifications. When enabled, critical alerts are also sent to your email.',
              'Task Assignments — notifications when a task is assigned to you or when your assignment changes. This is one of the most important categories for active contributors.',
              'Mentions — alerts when someone mentions you by name in a task description, comment, or note. Mentions indicate that someone specifically needs your attention.',
              'Due Date Reminders — warnings when tasks assigned to you are approaching their due date or have become overdue. Helps you stay ahead of deadlines.',
              'Sprint Updates — notifications about sprint events: when a sprint starts, when items are added or removed, and when a sprint is completed.',
              'Daily Digest — a once-daily email summary of activity across your workspace. Useful if you prefer a single, comprehensive update rather than individual notifications throughout the day.',
            ],
          },
          {
            type: 'heading',
            text: 'Recommended Defaults',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The right configuration depends on your role and how you prefer to stay informed. Here are recommendations for common scenarios:',
          },
          {
            type: 'list',
            items: [
              'Active developers — enable Task Assignments, Mentions, and Due Date Reminders. These are directly actionable and relevant to daily work. Consider disabling the daily digest if you check AgileFlow regularly.',
              'Team leads and managers — enable all categories. You need visibility into sprint changes, team assignments, and overall activity.',
              'Stakeholders and Viewers — enable Daily Digest and Sprint Updates. This provides a summary view without the noise of individual task notifications.',
              'Everyone — keep Mentions enabled. When someone mentions you by name, it means they specifically need your attention, and missing it can block their work.',
            ],
          },
          {
            type: 'tip',
            text: 'Start with most notifications enabled and turn off categories that feel noisy over time. It is better to receive a few extra notifications at first than to miss important updates because something was disabled.',
          },
        ],
      },
      {
        id: 'privacy-settings',
        title: 'Privacy Settings',
        description: 'Control your visibility, profile exposure, and activity tracking preferences',
        content: [
          {
            type: 'paragraph',
            text: 'Privacy settings give you control over how much of your information is visible to other team members and what is tracked about your activity. While AgileFlow is a collaborative tool where some visibility is necessary for teamwork, these settings let you adjust the balance between transparency and personal privacy.',
          },
          {
            type: 'heading',
            text: 'Accessing Privacy Settings',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Go to Settings from the sidebar.',
              'Switch to the "Privacy" tab.',
              'Adjust each privacy control as desired.',
              'Save your changes.',
            ],
          },
          {
            type: 'heading',
            text: 'Profile Visibility Levels',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Your profile visibility determines who can see your full profile details (bio, skills, department, job title). The three levels offer progressively more privacy.',
          },
          {
            type: 'list',
            items: [
              'Public — your full profile is visible to everyone in the workspace. Anyone can see your bio, skills, job title, and department. Best for open, transparent teams.',
              'Team — your full profile is visible only to members of your workspace. This is functionally similar to Public in most single-workspace setups but provides a conceptual boundary.',
              'Private — only your name and avatar are visible to others. Your bio, skills, and other details are hidden. Use this if you prefer minimal exposure.',
            ],
          },
          {
            type: 'heading',
            text: 'Show Email Toggle',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'This toggle controls whether your email address is visible to other team members. When enabled, teammates can see your email in your profile. When disabled, your email is hidden and only you (and Admins) can see it.',
          },
          {
            type: 'paragraph',
            text: 'Consider keeping this enabled if your team communicates via email frequently, or disable it if you prefer that teammates reach out through AgileFlow rather than direct email.',
          },
          {
            type: 'heading',
            text: 'Activity Tracking Toggle',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Activity Tracking toggle controls whether your actions in AgileFlow are visible in activity feeds. When enabled, actions like completing a task, updating a status, or creating an event appear in the Dashboard activity feed and board analytics. When disabled, your actions are still recorded for system purposes but are not displayed in public-facing activity feeds.',
          },
          {
            type: 'paragraph',
            text: 'Most team members should keep this enabled because activity visibility is important for team coordination. Disabling it means teammates cannot easily see your recent contributions, which can lead to miscommunication about who is working on what.',
          },
          {
            type: 'tip',
            text: 'In most team settings, the default privacy levels (Public visibility, email shown, activity tracking on) work well. Only adjust these if you have a specific reason to restrict visibility. Excessive privacy settings can actually hinder collaboration.',
          },
        ],
      },
      {
        id: 'account-management',
        title: 'Account Management',
        description: 'Manage passwords, sessions, and account security',
        content: [
          {
            type: 'paragraph',
            text: 'Account management covers the administrative aspects of your AgileFlow account — your password, active sessions, and security settings. Keeping your account secure is important because your AgileFlow workspace may contain sensitive project information, team data, and business-critical tasks.',
          },
          {
            type: 'heading',
            text: 'Password Management',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow uses Supabase Authentication for secure credential management. Your password is never stored in plain text — it is cryptographically hashed and verified through Supabase\'s auth service.',
          },
          {
            type: 'list',
            items: [
              'To reset your own password, use the "Forgot Password" link on the login page. You will receive an email with a password reset link.',
              'Admins can trigger a password reset for any team member from the Admin panel. This is useful when someone is locked out of their account.',
              'Choose a strong password — at least 8 characters with a mix of letters, numbers, and special characters.',
            ],
          },
          {
            type: 'heading',
            text: 'Session Management',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow maintains an active session after you sign in, so you do not need to log in every time you visit the application. Sessions persist through browser cookies managed by Supabase. If you sign in on multiple devices or browsers, each one maintains its own session.',
          },
          {
            type: 'heading',
            text: 'Signing Out',
            level: 2,
          },
          {
            type: 'steps',
            items: [
              'Click on the user dropdown menu at the bottom of the left sidebar.',
              'Click "Sign Out" or "Logout".',
              'Your session is terminated and you are redirected to the login page.',
              'To access AgileFlow again, you will need to sign in with your email and password.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Signing out invalidates your current session token. If you are signed in on other devices, those sessions remain active. To sign out everywhere, you would need to sign out on each device individually.',
          },
          {
            type: 'heading',
            text: 'Account Security Best Practices',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Use a unique password for AgileFlow — do not reuse passwords from other services',
              'If you suspect your account has been compromised, reset your password immediately using the login page "Forgot Password" feature',
              'Sign out when using shared or public computers',
              'Keep your email address up to date — it is used for password resets and notification delivery',
              'If you are an Admin, regularly review the team roster in the Admin panel and remove accounts that are no longer needed',
              'Report any suspicious activity (unexpected notifications, tasks you did not create, settings changes you did not make) to your workspace Admin immediately',
            ],
          },
          {
            type: 'warning',
            text: 'If you lose access to the email address associated with your AgileFlow account, contact your workspace Admin. They can reset your password from the Admin panel, allowing you to regain access.',
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // 10. TROUBLESHOOTING & FAQ
  // ─────────────────────────────────────────────
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & FAQ',
    description: 'Solve common issues, find answers to frequent questions, and learn best practices',
    icon: 'HelpCircle',
    articles: [
      {
        id: 'common-issues',
        title: 'Common Issues',
        description: 'Solutions for frequently encountered problems in AgileFlow',
        content: [
          {
            type: 'paragraph',
            text: 'Most issues in AgileFlow have straightforward solutions. This guide covers the problems users encounter most frequently, along with step-by-step troubleshooting for each one. If your issue is not listed here, check the FAQ section or reach out to your workspace Admin.',
          },
          {
            type: 'heading',
            text: 'Board Not Loading',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'If a board is not loading or showing a blank screen, the issue is usually related to network connectivity, browser cache, or a temporary server issue.',
          },
          {
            type: 'steps',
            items: [
              'Refresh the page using your browser\'s refresh button or pressing F5 (Ctrl+R on Windows, Cmd+R on Mac).',
              'Check your internet connection — try loading another website to confirm connectivity.',
              'Clear your browser cache: go to browser settings → clear browsing data → clear cached images and files.',
              'Try a different browser to rule out browser-specific issues.',
              'If the issue persists, the AgileFlow server may be experiencing temporary downtime. Wait a few minutes and try again.',
            ],
          },
          {
            type: 'heading',
            text: 'Tasks Not Saving',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'If you edit a task and the changes do not persist after refreshing, the issue is typically a network interruption or a permissions problem.',
          },
          {
            type: 'steps',
            items: [
              'Check your internet connection — changes require an active connection to save to the server.',
              'Verify your role — if you are a Viewer, you cannot save changes. Ask an Admin to check your role.',
              'Look for error messages — toast notifications or console messages may indicate what went wrong.',
              'Try making the change again. If it fails repeatedly, clear your browser cache and sign in again.',
              'Check if other users are experiencing the same issue — it may be a server-side problem.',
            ],
          },
          {
            type: 'heading',
            text: 'Drag and Drop Not Working',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'If you cannot drag tasks in Kanban view or reorder items in table view, the most common cause is a permissions issue.',
          },
          {
            type: 'list',
            items: [
              'Check your role — Viewers cannot drag and drop. The drag handle will not appear for users with the Viewer role. Ask an Admin to upgrade you to Member if you need edit access.',
              'Ensure you are clicking and holding the drag handle (the grip icon), not just clicking the card body.',
              'Try refreshing the page — occasionally, the drag-and-drop library needs a fresh page load to initialize correctly.',
              'If drag works in some columns but not others, check if the target column has any restrictions or if the board has reached a column limit.',
              'Disable browser extensions temporarily — some ad blockers or accessibility extensions can interfere with drag-and-drop functionality.',
            ],
          },
          {
            type: 'heading',
            text: 'AI Assistant Not Responding',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'If the AI assistant does not generate a response, shows an error, or takes an unusually long time, several factors could be at play.',
          },
          {
            type: 'list',
            items: [
              'Wait a moment and try again — the AI model providers (Anthropic, Google, OpenAI) occasionally experience high load or temporary outages. The automatic fallback system will try alternative models.',
              'Check your internet connection — the AI requires an active connection to communicate with external model providers.',
              'Try switching between Fast and Thinking modes — if one mode is having issues, the other uses different models that may be available.',
              'If the response is stuck "generating" for more than 30 seconds, click the stop button and send your message again.',
              'Clear the chat and start a new session if the conversation has become very long — extremely long conversation histories can slow down AI responses.',
            ],
          },
          {
            type: 'heading',
            text: 'Calendar Events Not Appearing',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Make sure you are viewing the correct month — use the navigation arrows or "Today" button to return to the current month.',
              'Check the event date — the event may have been created for the wrong date. Look in the upcoming events list below the calendar for a chronological view.',
              'Refresh the page to ensure the latest data is loaded from the server.',
              'Verify that the event was actually saved — if your connection dropped during creation, the event may not have been saved. Try creating it again.',
              'Check your role — while Viewers can see events, permission issues in rare cases might affect visibility. Ask an Admin to verify.',
            ],
          },
          {
            type: 'tip',
            text: 'When troubleshooting any issue, always check your browser\'s developer console (F12 → Console tab) for error messages. These messages provide technical details that can help identify the root cause and are useful if you need to escalate the issue.',
          },
        ],
      },
      {
        id: 'faq',
        title: 'Frequently Asked Questions',
        description: 'Answers to the most commonly asked questions about AgileFlow',
        content: [
          {
            type: 'paragraph',
            text: 'This section answers questions that AgileFlow users ask most frequently. If your question is not covered here, try asking the AI assistant — it has access to your workspace context and can provide personalized answers.',
          },
          {
            type: 'heading',
            text: 'Can I change my email address?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Your email address is tied to your Supabase authentication account and serves as your login credential. Changing it is not supported through the AgileFlow interface directly. If you need to change your email, contact your workspace Admin to discuss options, which may involve creating a new account with the new email and transferring your data.',
          },
          {
            type: 'heading',
            text: 'How do I delete my account?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Account deletion is managed at the administrative level. Contact your workspace Admin to request account removal. They can remove your user record from the Admin panel. Note that tasks you created and any activity history associated with your account will remain in the workspace after deletion to maintain data integrity for the team.',
          },
          {
            type: 'heading',
            text: 'How do I export my data?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow does not currently have a built-in data export feature. However, you can use the board views to copy data manually, or ask the AI assistant to summarize your data in a format that can be pasted into a spreadsheet or document. For larger exports, workspace Admins with database access can export data directly from the Supabase dashboard.',
          },
          {
            type: 'heading',
            text: 'Can multiple people edit the same board at the same time?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Yes, multiple team members can work on the same board simultaneously. Each person\'s changes are saved to the server independently. However, AgileFlow does not support real-time collaborative editing (like Google Docs) — changes made by one user do not appear instantly on another user\'s screen. You may need to refresh the page to see changes made by teammates. Data conflicts are rare because tasks are updated at the cell level, and it is uncommon for two people to edit the exact same cell at the exact same time.',
          },
          {
            type: 'heading',
            text: 'Is my data secure?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow takes security seriously. Your data is stored in a Supabase-managed PostgreSQL database with Row Level Security (RLS) policies that ensure users can only access data within their own workspace. Authentication is handled through Supabase Auth with encrypted password storage. All communication between your browser and the server uses HTTPS encryption. AI requests are sent to third-party providers (Anthropic, Google, OpenAI) over encrypted connections and are not stored or used for model training.',
          },
          {
            type: 'heading',
            text: 'What happens when a sprint ends?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When a sprint is completed, tasks that were marked as "Done" during the sprint are recorded as completed. Tasks that were not finished can be carried over to the next sprint. Sprint analytics (velocity, burndown, completion rate) are calculated and stored, becoming part of your team\'s historical data. The sprint remains viewable in your sprint history for reference and analytics purposes. You can then create a new sprint and pull items from the backlog.',
          },
          {
            type: 'heading',
            text: 'How do I change someone\'s role?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Only Admins can change user roles. To change someone\'s role, go to the Admin panel, find the user (use search or filter by current role), click "Edit" on their entry, select the new role from the dropdown, and save. The change takes effect immediately — the user\'s interface updates to reflect their new permissions the next time they load a page or navigate within AgileFlow.',
          },
          {
            type: 'heading',
            text: 'Why can I not see the Admin panel?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The Admin panel is only visible to users with the Admin role. If you need Admin access, ask a current Admin in your workspace to upgrade your role. If no one in your workspace has Admin access (which can happen if the original Admin\'s account was deleted), you will need to access the Supabase dashboard directly to modify user roles at the database level.',
          },
          {
            type: 'heading',
            text: 'How do I create recurring events?',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'AgileFlow does not currently support automatically recurring events. For ceremonies that repeat every sprint (standups, planning, retrospectives), you need to create each event individually. A practical approach is to create all events for a sprint period at once during sprint planning, so they are on the calendar for the entire sprint duration.',
          },
          {
            type: 'tip',
            text: 'If you have a question that is not covered here, try asking the AI assistant. Type your question in the AI Chat page or floating panel, and the AI will provide an answer based on your workspace context and AgileFlow\'s capabilities.',
          },
        ],
      },
      {
        id: 'tips-best-practices',
        title: 'Tips & Best Practices',
        description: 'Practical advice for getting the most out of AgileFlow',
        content: [
          {
            type: 'paragraph',
            text: 'After using AgileFlow for a while, patterns emerge around what works well and what does not. This collection of best practices is based on common workflows and team configurations. Following these recommendations will help you and your team get more value out of the platform.',
          },
          {
            type: 'heading',
            text: 'Board Naming Conventions',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'Consistent board naming makes it easier to find projects and understand their purpose at a glance. Adopt a naming convention that works for your team and enforce it.',
          },
          {
            type: 'list',
            items: [
              'Include the project or product name: "AgileFlow — Frontend" rather than just "Frontend"',
              'Add the phase or sprint if applicable: "Payment Module — Sprint 14" or "Mobile App — Design Phase"',
              'Use prefixes for board types: "[Active]", "[Backlog]", "[Archive]" to distinguish between current and historical boards',
              'Keep names concise but descriptive — long names get truncated in the sidebar and board lists',
              'Avoid generic names like "Tasks", "Board 1", or "New Board" that do not convey any meaning',
            ],
          },
          {
            type: 'heading',
            text: 'Column Setup Recommendations',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'The columns you add to a board define what information you track for each task. The right column setup depends on your workflow, but here are proven configurations for common scenarios.',
          },
          {
            type: 'list',
            items: [
              'Minimum viable setup: Status, Priority, People (Assignee), Date (Due Date) — these four columns cover 80% of task tracking needs',
              'Development teams: add Tags (for labels like "Bug", "Feature", "Tech Debt"), Number (for story points), and Timeline (for start/end dates)',
              'Design teams: add Dropdown (for design stage: Wireframe, Mockup, Prototype, Final), Text (for design tool links), and Checkbox (for approval status)',
              'Project management: add Budget (for cost tracking), Number (for hours estimated), and Text (for notes or blockers)',
              'Avoid adding too many columns upfront — start lean and add columns as needs emerge. Unused columns create clutter.',
            ],
          },
          {
            type: 'heading',
            text: 'When to Use Each View',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Table View — best for data-heavy work: entering details, bulk updates, filtering, and sorting. Use it for sprint planning and backlog grooming where you need to see and edit many fields at once.',
              'Kanban View — best for workflow visualization: daily standups, tracking work-in-progress, and spotting bottlenecks. Use it when the primary concern is "what status is everything in?"',
              'Calendar View — best for timeline awareness: seeing when tasks are due, avoiding scheduling conflicts, and planning around deadlines. Use it when the primary concern is "when is everything happening?"',
              'Timeline View — best for project planning: understanding task duration, dependencies, and parallel work streams. Use it when planning multi-week efforts or coordinating across teams.',
            ],
          },
          {
            type: 'heading',
            text: 'Sprint Planning Tips',
            level: 2,
          },
          {
            type: 'list',
            items: [
              'Use velocity data from the last 3-5 sprints to determine how much work to commit to. Do not rely on optimistic estimates.',
              'Leave 10-20% capacity buffer for unplanned work, bug fixes, and meetings. Never plan at 100% capacity.',
              'Prioritize ruthlessly — if everything is high priority, nothing is. Ensure the sprint has a clear goal with a few must-do items and several nice-to-have items.',
              'Break large tasks into smaller ones. Tasks that take longer than 2-3 days are harder to track and more likely to slip.',
              'Run the /sprint AI command before your planning meeting to get data-informed suggestions as a starting point.',
              'Review the burndown chart mid-sprint to assess whether you are on track and make adjustments early rather than at the last minute.',
            ],
          },
          {
            type: 'heading',
            text: 'Backlog Grooming Schedule',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'A well-maintained backlog is essential for effective sprint planning. Without regular grooming, the backlog becomes a dumping ground of outdated, vague, and conflicting items that slow down planning sessions.',
          },
          {
            type: 'list',
            items: [
              'Schedule a backlog grooming session once per sprint (or every two weeks for longer sprints)',
              'During grooming: review top items for clarity, add or update story point estimates, remove items that are no longer relevant, and re-prioritize based on current goals',
              'Keep the backlog ordered — the top items should be ready for the next sprint (clear description, estimated, and prioritized)',
              'Items below the top 2-3 sprints worth of work can be less refined. Do not waste time detailing items you will not work on for months.',
              'Use the AI /sprint command to help identify which backlog items should be prioritized next',
            ],
          },
          {
            type: 'heading',
            text: 'Team Onboarding Checklist',
            level: 2,
          },
          {
            type: 'paragraph',
            text: 'When a new member joins your AgileFlow workspace, a structured onboarding process helps them get productive quickly. Share this checklist with new team members.',
          },
          {
            type: 'steps',
            items: [
              'Create your account using the email address your Admin invited.',
              'Complete your profile in Settings: add your name, job title, department, bio, and skills.',
              'Set your preferred theme (Light, Dark, or System) using the toggle in the top bar.',
              'Configure your notification preferences in Settings → Notifications.',
              'Explore the Dashboard to see an overview of the workspace, boards, and activity.',
              'Open each board you will be working on and familiarize yourself with the columns, groups, and tasks.',
              'Try switching between views (Table, Kanban, Calendar, Timeline) on a board to see how each one presents the data.',
              'Visit the Calendar page to see upcoming events and scheduled ceremonies.',
              'Open the AI Chat page from the sidebar and ask a question like "What are the current active sprints?" to test the AI assistant.',
              'Use Ctrl+K (or Cmd+K) to try the global search feature.',
            ],
          },
          {
            type: 'tip',
            text: 'The best way to learn AgileFlow is to use it daily. Start with the basics — check the Dashboard, update your task statuses, and review the calendar — and gradually explore advanced features like analytics, AI commands, and sprint planning as you become comfortable.',
          },
        ],
      },
    ],
  },];
