export const MODULE_HELP = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Your command center",
    sections: [
      {
        heading: "What is the Dashboard?",
        body: "The Dashboard gives you a bird's-eye view of everything happening across your projects. It shows your boards, recent activity, and key metrics at a glance so you can quickly decide what to work on next.",
      },
      {
        heading: "Stats Overview",
        body: "The four stat cards at the top summarize your workspace:\n• **Total Boards** — how many project boards you have\n• **Completed Tasks** — tasks marked as \"Done\" across all boards\n• **Pending Tasks** — tasks that still need work (Not Started, Working, or Stuck)\n• **Total Tasks** — every task regardless of status",
      },
      {
        heading: "Recent Boards",
        body: "Shows your most recently updated boards. Click any board to jump straight into it. The lock icon means it's private (only you can see it), and the globe icon means it's visible to your team.",
      },
      {
        heading: "Activity Feed",
        body: "The colored dots next to each task show its current status:\n• 🟢 **Green** — Done\n• 🟡 **Amber** — Working on it\n• 🔴 **Red** — Stuck / blocked\n• ⚪ **Gray** — Not started or no status",
      },
      {
        heading: "Quick Actions",
        body: "Shortcuts to common tasks. Create a new board, invite a team member, check the calendar, or jump to analytics — all in one click.",
      },
      {
        heading: "Ask AI",
        body: "Click the \"Ask AI\" button on any stat card or section to get an AI-powered explanation of what the data means and what you should do about it.",
      },
    ],
  },

  board: {
    title: "Board",
    subtitle: "Your project workspace",
    sections: [
      {
        heading: "What is a Board?",
        body: "A Board is a project workspace where you organize tasks into groups and columns. Think of it like a spreadsheet designed for project management — each row is a task, and each column tracks a property (status, priority, due date, assignee, etc.).",
      },
      {
        heading: "Views",
        body: "Switch between different ways to visualize your tasks:\n• **Table** — spreadsheet-style rows and columns, best for detailed editing\n• **Kanban** — cards organized in swim lanes, great for workflow visualization\n• **Calendar** — tasks plotted on a monthly calendar by due date\n• **Timeline** — Gantt-style bars showing task duration over time",
      },
      {
        heading: "Groups",
        body: "Tasks are organized into groups (the colored headers). You can create groups to categorize work — e.g., \"Frontend\", \"Backend\", \"Design\". Click the group name to collapse/expand it. Drag tasks between groups to reorganize.",
      },
      {
        heading: "Columns",
        body: "Each column represents a property of your tasks. Available column types (11 total):\n• **Status** — workflow states like Not Started, Working, Done, Stuck\n• **Priority** — urgency levels: Critical, High, Medium, Low\n• **People** — assignee selector with team member dropdown showing avatars and names\n• **Date** — deadlines and due dates\n• **Number** — numeric values like effort estimates\n• **Budget** — currency-formatted dollar amounts\n• **Text** — freeform text notes\n• **Tags** — colored badge labels with predefined suggestions (Urgent, Bug, Feature, etc.) and custom tags\n• **Checkbox** — simple yes/no toggle\n• **Dropdown** — pick from a predefined list with custom colors\n• **Timeline** — start and end date range for the Timeline view",
      },
      {
        heading: "Toolbar",
        body: "The toolbar above the table gives you powerful controls:\n• **Search** — find tasks by title instantly\n• **Person filter** — show only tasks assigned to specific people\n• **Filter** — narrow down by status, priority, or other columns\n• **Sort** — reorder tasks by any column (ascending or descending)\n• **Hide** — show or hide columns you don't need right now\n• **Group by** — reorganize tasks into groups based on any column",
      },
      {
        heading: "Adding Tasks",
        body: "Click the \"+ Add Item\" button at the bottom of any group to create a new task. Type a title and press Enter. Then fill in the columns — click any cell to edit it.",
      },
      {
        heading: "Analytics",
        body: "Click the bar chart icon in the board header to open the Analytics panel. It shows completion rates, status distribution, team workload, and priority breakdown for this specific board. Each stat card has an info tooltip explaining the metric, and the AI Explain button provides a narrative summary.",
      },
      {
        heading: "Unassigned Tasks",
        body: "The Unassigned Tasks section surfaces all tasks on the board that don't have an assignee. Each card shows the task title, group, status, priority, and due date with a quick \"Assign\" button to add an owner from the team member dropdown.",
      },
      {
        heading: "Permissions",
        body: "Board actions are gated by your role:\n• **Admin/Member** — full access: add tasks, edit cells, drag items, manage columns and groups\n• **Viewer** — read-only: can view the board and analytics but cannot add, edit, drag, or delete anything. Add/edit buttons and drag handles are hidden.",
      },
    ],
  },

  kanban: {
    title: "Kanban View",
    subtitle: "Visualize your workflow",
    sections: [
      {
        heading: "What is Kanban?",
        body: "Kanban is a visual workflow method where tasks are represented as cards moving through columns. Each column represents a stage of work — typically \"Not Started\", \"In Progress\", and \"Done\". It helps you see bottlenecks at a glance.",
      },
      {
        heading: "How Cards Work",
        body: "Each card represents a task. Cards show the task title, status or priority badge, due date, and assignee. Drag cards between columns to update their status — the change is saved automatically.",
      },
      {
        heading: "Group By",
        body: "Use the \"Group by\" dropdown to change how columns are organized:\n• **Status** — columns for each status (Not Started, Working, Done, Stuck)\n• **People** — columns for each team member, plus an \"Unassigned\" column\n• **Priority** — columns for each priority level",
      },
      {
        heading: "Drag and Drop",
        body: "Drag a card from one column to another to change its status (or assignee, or priority — depending on what you're grouped by). The order within a column doesn't affect anything — it's just for visual organization.",
      },
      {
        heading: "WIP Awareness",
        body: "The number badge on each column header shows how many tasks are in that stage. If one column has significantly more cards than others, it might be a bottleneck — consider reassigning work or breaking tasks down further.",
      },
      {
        heading: "Adding Columns",
        body: "Click \"+ Add Stage\" at the end of the columns to create a new workflow stage. This adds a new status option that becomes available across all views.",
      },
      {
        heading: "Permissions",
        body: "Drag and drop in Kanban is permission-controlled. Viewers see the board in read-only mode and cannot move cards between columns. Admins and Members can drag freely.",
      },
    ],
  },

  timeline: {
    title: "Timeline View",
    subtitle: "See the big picture",
    sections: [
      {
        heading: "What is the Timeline?",
        body: "The Timeline (or Gantt) view shows tasks as horizontal bars spanning from their start date to end date. It helps you visualize how tasks overlap, spot scheduling conflicts, and understand the overall project timeline.",
      },
      {
        heading: "Requirements",
        body: "Tasks need both a start date and an end date (or a Timeline column with a date range) to appear on the timeline. Tasks without dates won't show up — you'll see a message indicating which tasks are missing date information.",
      },
      {
        heading: "Navigation",
        body: "Use the arrow buttons to move forward or backward in time. Click \"Today\" to jump back to the current date. The blue highlight shows today's position on the timeline.",
      },
      {
        heading: "Zoom Levels",
        body: "Change the zoom level to see different time scales (defaults to Month):\n• **Week** — shows individual days with day names and dates, best for sprint-level planning\n• **Month** — shows days with weekday letters, the default view for balanced detail\n• **Quarter** — shows weeks across 3 months, ideal for roadmap and long-term view",
      },
      {
        heading: "Reading the Bars",
        body: "Each horizontal bar represents a task. The bar's color indicates its priority: Critical (red), High (orange), Medium (blue), Low (light blue). Hover over any bar to see the task title and date range. The wider the bar, the longer the task duration. Weekend days have a muted background.",
      },
    ],
  },

  backlog: {
    title: "Product Backlog",
    subtitle: "Plan and prioritize work",
    sections: [
      {
        heading: "What is the Backlog?",
        body: "The Product Backlog is an ordered list of everything that might be needed in the product. It's the single source of requirements — all user stories that haven't been started or assigned to a sprint live here.",
      },
      {
        heading: "User Stories",
        body: "A User Story describes a feature from the user's perspective: \"As a [user], I want [feature] so that [benefit]\". Each story has:\n• **Title** — what the story is about\n• **Priority** — how urgently it's needed (Critical, High, Medium, Low)\n• **Story Points** — estimated effort (common scale: 1, 2, 3, 5, 8, 13)\n• **Acceptance Criteria** — conditions that must be met for the story to be \"done\"",
      },
      {
        heading: "Priority Levels",
        body: "Stories are color-coded by urgency:\n• 🔴 **Critical** — must be done immediately, blocking other work\n• 🟠 **High** — important, should be in the next sprint\n• 🔵 **Medium** — normal priority, plan for upcoming sprints\n• ⚪ **Low** — nice to have, do when capacity allows",
      },
      {
        heading: "Story Points",
        body: "Story Points estimate how much effort a story needs, not how long it takes. The team uses a Fibonacci-like scale (1, 2, 3, 5, 8, 13) where higher numbers mean more complexity and uncertainty. A 1-point story is trivial; a 13-point story should probably be split into smaller stories.",
      },
      {
        heading: "Drag to Prioritize",
        body: "Drag stories up and down to reorder them by priority. Stories at the top are the most important and should be pulled into sprints first. The order helps the team know what to work on next.",
      },
      {
        heading: "Sprint Planning",
        body: "Click \"Plan Sprint\" to create a new sprint and pull stories into it. During planning, select stories from the backlog based on the team's capacity (measured in story points). Stories move out of the backlog when assigned to a sprint.",
      },
      {
        heading: "Stats Cards",
        body: "The four cards at the top summarize your backlog:\n• **Total Stories** — stories waiting to be worked on\n• **Story Points** — total effort estimate of all backlog stories\n• **Critical Priority** — stories that need immediate attention\n• **Ready for Sprint** — stories fully defined and ready to be pulled into a sprint",
      },
    ],
  },

  calendar: {
    title: "Team Calendar",
    subtitle: "Schedule and track events",
    sections: [
      {
        heading: "What is the Calendar?",
        body: "The Team Calendar shows all events, meetings, milestones, and deadlines in a monthly view. It helps you plan around important dates and avoid scheduling conflicts.",
      },
      {
        heading: "Event Types",
        body: "Events are color-coded by type:\n• 🔵 **Meeting** — team meetings, standups, and 1-on-1s\n• 🟢 **Milestone** — key project deliverables and checkpoints\n• 🔴 **Deadline** — hard deadlines that can't be moved\n• 🟣 **Review** — code reviews, design reviews, sprint reviews\n• 🟡 **Retrospective** — sprint retros to discuss improvements\n• 🔵 **Planning** — sprint planning and roadmap sessions\n• 🟠 **Holiday** — team holidays and days off\n• ⚪ **Other** — anything else",
      },
      {
        heading: "Creating Events",
        body: "Click any day on the calendar to create an event on that date. Or use the \"New Event\" button at the top. Fill in the title, type, time, location, and attendees.",
      },
      {
        heading: "Navigating",
        body: "Use the left/right arrows to move between months. Click \"Today\" to jump back to the current month. Today's date is highlighted with a ring around the number.",
      },
      {
        heading: "Upcoming Events",
        body: "Below the calendar grid, you'll see a list of upcoming events sorted by date. Click any event to view its full details — time, location, attendees, and description.",
      },
      {
        heading: "Tips",
        body: "• Click an event on the calendar to see details and delete it\n• The badge on each day shows how many events are scheduled\n• Events with a time show the start time; all-day events just show the title\n• Use the legend at the top to quickly identify event types by color",
      },
    ],
  },

  settings: {
    title: "Settings",
    subtitle: "Customize your experience",
    sections: [
      {
        heading: "Profile",
        body: "Your profile is visible to team members. Add your job title, department, and skills so the AI assistant can suggest better task assignments. The \"About\" field is a short bio that appears on your profile page.",
      },
      {
        heading: "Notifications",
        body: "Control what notifications you receive:\n• **Email Notifications** — master toggle for all email alerts\n• **Task Assignments** — when someone assigns a task to you\n• **Mentions** — when someone @mentions you\n• **Due Date Reminders** — alerts before deadlines\n• **Sprint Updates** — sprint start/end notifications\n• **Daily Digest** — one daily email summarizing all activity",
      },
      {
        heading: "Preferences",
        body: "Customize the interface:\n• **Theme** — Light, Dark, or Auto (matches your system setting)\n• **Timezone** — affects calendar events and due date calculations\n• **Date Format** — how dates are displayed (e.g., MM/DD/YYYY)\n• **Week Starts On** — whether your calendar week starts on Sunday or Monday",
      },
      {
        heading: "Privacy",
        body: "Control who sees your information:\n• **Public** — visible to everyone in the workspace\n• **Team** — visible only to your team members\n• **Private** — visible only to you and workspace admins\n\n\"Show Email\" controls whether your email is visible. \"Activity Tracking\" allows the platform to track your usage for analytics features like the daily digest.",
      },
    ],
  },

  admin: {
    title: "Admin Panel",
    subtitle: "Manage your workspace",
    sections: [
      {
        heading: "What is the Admin Panel?",
        body: "The Admin Panel is where workspace administrators manage users, roles, and permissions. Only users with the Admin role can access this page.",
      },
      {
        heading: "User Roles",
        body: "There are three roles with different access levels:\n• **Admin** — full system access: manage users, change roles, reset passwords, delete boards, access all data\n• **Member** — can create boards, add tasks, edit their own data, and collaborate with the team (default role for new users)\n• **Viewer** — read-only access: can view boards and tasks but cannot create, edit, or drag items",
      },
      {
        heading: "Stats Cards",
        body: "The cards at the top show workspace health:\n• **Total Members** — everyone registered in your workspace\n• **Admins** — users with full administrative access\n• **Members** — users who can create and edit content\n• **Active This Week** — users who logged in or took an action recently",
      },
      {
        heading: "Managing Users",
        body: "Use the search bar to find users by name or email. Filter by role to see specific groups. Click the three-dot menu (⋮) on any user row to:\n• **Edit** — change their name, role, or department\n• **Reset Password** — send a password reset email\n\nBe careful changing roles — downgrading someone from Admin to Member removes their ability to manage other users. Changing someone to Viewer makes the entire platform read-only for them.",
      },
      {
        heading: "Inviting Members",
        body: "Click \"Invite Member\" to get a sign-up link. Share this link with people you want to join the workspace. They'll create their own account and appear in the user list with the default Member role.",
      },
      {
        heading: "Project Advisors",
        body: "The Advisors section at the bottom of the Admin page lists project advisors and mentors. This is informational and helps the team know who to consult for guidance.",
      },
    ],
  },

  aiChat: {
    title: "AI Chat",
    subtitle: "Your intelligent project assistant",
    sections: [
      {
        heading: "What is AI Chat?",
        body: "AI Chat is a full-page conversational interface for the AI assistant. Access it from the sidebar to have extended conversations about your projects, get recommendations, and analyze performance data.",
      },
      {
        heading: "Response Modes",
        body: "Toggle between two modes in the header:\n• **Fast Mode** (⚡) — quick answers using lightweight models like Claude Haiku 4.5 and GPT-4o Mini\n• **Thinking Mode** (🧠) — deeper analysis using thinking-optimized models for complex planning and recommendations",
      },
      {
        heading: "Chat Sessions",
        body: "Previous conversations are saved in the sidebar for reference. You can load, rename, or delete past sessions. Each new conversation starts fresh but has full access to your workspace data.",
      },
      {
        heading: "Commands",
        body: "Three slash commands for structured analysis:\n• **/assign** — AI-suggested task assignments based on team workload and skills\n• **/sprint** — sprint planning recommendations using backlog and velocity data\n• **/performance** — comprehensive team performance summary with metrics and trends",
      },
      {
        heading: "Tips",
        body: "• Use Thinking mode for complex planning and Fast mode for quick questions\n• The assistant auto-loads your boards, tasks, sprints, and team data for context\n• Press Enter to send, Shift+Enter for a new line\n• Click the stop button to cancel a long-running response",
      },
    ],
  },

  calendarView: {
    title: "Calendar View (Board)",
    subtitle: "Tasks on a calendar",
    sections: [
      {
        heading: "What is Calendar View?",
        body: "The Board Calendar View plots your board's tasks on a monthly calendar based on their due dates. It's different from the Team Calendar — this only shows tasks from the current board, not team events.",
      },
      {
        heading: "How it Works",
        body: "Tasks with a due date appear on the calendar at their deadline. The colored dot next to each task indicates its priority. Click a task to view its details.",
      },
      {
        heading: "Tips",
        body: "• Tasks without due dates won't appear in this view\n• Switch to Table view to add due dates to tasks\n• The badge on each day shows the total count of tasks due\n• Use this view during sprint planning to spot deadline clusters",
      },
    ],
  },

  analytics: {
    title: "Board Analytics",
    subtitle: "Understand your board's health",
    sections: [
      {
        heading: "What are Analytics?",
        body: "The Analytics panel gives you insight into how your board is performing. It calculates metrics from your actual task data — completion rates, workload distribution, overdue items, and more. Each section includes info tooltips explaining the metric and an AI Explain button for deeper analysis.",
      },
      {
        heading: "Overview Cards",
        body: "Three summary cards at the top, each with an info tooltip:\n• **Total Tasks** — all items on this board\n• **Completion Rate** — percentage of tasks marked \"Done\" (progress bar shows visually)\n• **Overdue Tasks** — tasks past their due date that aren't done yet (these need attention!)\n\nClick the AI Explain button in the header for an AI-powered narrative of your board's health.",
      },
      {
        heading: "Status Distribution",
        body: "Shows how tasks are spread across workflow states. A healthy board typically has most tasks in \"Done\" or \"Working\". If many tasks are \"Stuck\", it signals blockers that need resolution.",
      },
      {
        heading: "Team Workload",
        body: "Shows how many tasks each team member has. Look for imbalances — if one person has significantly more tasks, consider redistributing work to avoid burnout.",
      },
      {
        heading: "Priority Distribution",
        body: "Breaks down tasks by urgency level. If most tasks are Critical or High priority, it may indicate scope creep or poor prioritization — not everything can be urgent. A healthy mix has more Medium/Low items than Critical ones.",
      },
    ],
  },
};
