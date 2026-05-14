import { User } from "@/api/entities/User";
import { Board } from "@/api/entities/Board";
import { Item } from "@/api/entities/Item";
import { UserStory } from "@/api/entities/UserStory";
import { suggestAssignees, suggestSprintComposition } from "@/lib/ai-assignment";
import { createPageUrl } from "@/utils";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export const AI_TOOLS = [
  {
    type: "function",
    function: {
      name: "listTeamMembers",
      description:
        "List all team members with their profiles, skills, roles, and current task workload. " +
        "Use when the user asks who is on the team, who is available, or before assigning tasks. " +
        "PROCESS: Call this before assignTask or suggestAssignment to confirm member IDs.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "listBoards",
      description:
        "List all boards available to the current user, including their column structure and groups. " +
        "Use when the user references a board by name, asks to see boards, or before creating/updating tasks. " +
        "PROCESS: Call this first when you need a board_id or want to understand a board's columns.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "createBoard",
      description:
        "Create a new board with a custom column set and groups. " +
        "Use when the user asks to create, add, or set up a new board. " +
        "PROCESS: Confirm the title and desired columns with the user if not specified. " +
        "Default columns will be applied if none are provided.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Board title (required)" },
          description: { type: "string", description: "Optional description for the board" },
          columns: {
            type: "array",
            description: "Column definitions. Each entry needs title and type. Defaults are Status, Person, Text, Priority if omitted.",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                type: {
                  type: "string",
                  enum: ["text", "status", "person", "date", "number", "checkbox", "priority", "tags", "dropdown", "budget"],
                },
              },
              required: ["title", "type"],
            },
          },
          groups: {
            type: "array",
            description: "Group (section) names. Defaults to ['Tasks'] if omitted.",
            items: { type: "object", properties: { title: { type: "string" } }, required: ["title"] },
          },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "createTask",
      description:
        "Create a new task on a board with full details. " +
        "Use when the user asks to add, create, or make a new task or item. " +
        "PROCESS: First call listBoards to get the board_id and column structure. " +
        "Call listTeamMembers if the user wants to assign someone. Then call this tool. " +
        "ALWAYS set a priority (default to 'Medium' if unspecified). " +
        "ALWAYS set status to 'To Do' if unspecified. " +
        "ALWAYS include a description if the task context is clear.",
      parameters: {
        type: "object",
        properties: {
          board_id: { type: "string", description: "UUID of the board to create the task on" },
          title: { type: "string", description: "Title of the task" },
          description: { type: "string", description: "Task description with details, acceptance criteria, or context. Always provide this." },
          group_id: { type: "string", description: "Optional group ID within the board; defaults to the first group" },
          status: { type: "string", description: "Task status (default: 'To Do'). Options: 'To Do', 'In Progress', 'Done'" },
          assignee_name: { type: "string", description: "Full name of the person to assign (use the exact name from listTeamMembers)" },
          priority: { type: "string", description: "Priority level (default: 'Medium'). Options: 'Critical', 'High', 'Medium', 'Low'" },
        },
        required: ["board_id", "title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateTask",
      description:
        "Update properties of an existing task such as title, description, status, assignee, or priority. " +
        "Use when the user asks to change, edit, update, or modify a task. " +
        "PROCESS: Call listTasks or getTaskDetails to confirm the task_id first if the user only gave a title.",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of the task to update (required)" },
          title: { type: "string", description: "New title for the task" },
          description: { type: "string", description: "New description text for the task" },
          status: { type: "string", description: "New status value (e.g. 'To Do', 'In Progress', 'Done')" },
          assignee_name: { type: "string", description: "Full name of the new assignee (use the exact name from listTeamMembers)" },
          priority: { type: "string", description: "New priority value (e.g. 'Critical', 'High', 'Medium', 'Low')" },
          updates: {
            type: "object",
            description: "Freeform map of column_id to value for any other column types",
            additionalProperties: true,
          },
        },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deleteTask",
      description:
        "Permanently delete a task from a board. " +
        "Use only when the user explicitly asks to delete or remove a task. " +
        "PROCESS: Confirm the task exists via getTaskDetails first, then call this tool.",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of the task to delete (required)" },
        },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTaskDetails",
      description:
        "Fetch detailed information about a specific task, including all column values resolved to human-readable labels and assignee name. " +
        "Use when the user asks about a specific task or before updating/deleting one. " +
        "PROCESS: Use this to confirm a task exists and inspect its current state.",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of the task to inspect (required)" },
        },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "assignTask",
      description:
        "Assign an existing task to a team member by searching for their name. " +
        "Use when the user says 'assign [task] to [person]'. " +
        "PROCESS: This tool resolves the assignee by name search. After updating, it re-reads the task to verify the change was saved.",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of the task to assign" },
          assignee_name: { type: "string", description: "Full or partial name of the person to assign" },
        },
        required: ["task_id", "assignee_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "listTasks",
      description:
        "List tasks on a board with resolved column names and assignee display names. " +
        "Use when the user asks to see tasks, show what's on a board, or find tasks by status or person. " +
        "PROCESS: Call listBoards first to get the board_id if the user referred to the board by name.",
      parameters: {
        type: "object",
        properties: {
          board_id: { type: "string", description: "UUID of the board to list tasks from" },
          status: { type: "string", description: "Filter by status value (e.g. 'In Progress')" },
          assignee_id: { type: "string", description: "Filter by assignee UUID" },
        },
        required: ["board_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateBoard",
      description:
        "Update a board's title or description. " +
        "Use when the user asks to rename or edit a board's metadata. " +
        "PROCESS: Call listBoards to confirm the board_id before calling this.",
      parameters: {
        type: "object",
        properties: {
          board_id: { type: "string", description: "UUID of the board to update (required)" },
          title: { type: "string", description: "New title for the board" },
          description: { type: "string", description: "New description for the board" },
        },
        required: ["board_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deleteBoard",
      description:
        "Permanently delete a board and all its tasks. " +
        "Use only when the user explicitly asks to delete or remove a board. " +
        "PROCESS: Confirm the board exists via listBoards first. This is irreversible.",
      parameters: {
        type: "object",
        properties: {
          board_id: { type: "string", description: "UUID of the board to delete (required)" },
        },
        required: ["board_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggestAssignment",
      description:
        "Recommend the best team member to assign a task to, scored by skills match, current workload, and completion history. " +
        "Use when the user asks who should do a task or wants an AI-driven assignment recommendation. " +
        "PROCESS: Returns ranked candidates with scores and reasoning. The top candidate's ID is included — " +
        "pass it directly to assignTask or createTask if the user confirms.",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of an existing task to find the best assignee for" },
          board_id: { type: "string", description: "UUID of the board (required if no task_id)" },
          task_title: { type: "string", description: "Task title or description (used if no task_id)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggestSprintPlan",
      description:
        "Suggest which backlog stories to include in the next sprint, optimized for team capacity and story priorities. " +
        "Use when the user asks for a sprint plan, sprint recommendations, or what to work on next sprint. " +
        "PROCESS: Reads all backlog stories automatically. Optionally accepts a capacity in story points.",
      parameters: {
        type: "object",
        properties: {
          capacity: { type: "number", description: "Sprint capacity in story points (default: 40)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getPageContext",
      description:
        "Returns information about the page the user is currently viewing, including the page name, URL path, and any " +
        "relevant query parameters (e.g. board ID on the Board page, sprint context on Backlog). " +
        "Use when you need to know what the user is looking at before giving contextual help or navigation advice. " +
        "Accepts no parameters.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "navigateToPage",
      description:
        "Navigates the user to a different page in the application. " +
        "Use when the user asks to go to a page, open a section, or switch views. " +
        "Valid page names: Dashboard, Boards, Board, Analytics, Backlog, Calendar, Performance, Settings, Admin, Help, Chat.",
      parameters: {
        type: "object",
        properties: {
          page_name: {
            type: "string",
            description: "Name of the page to navigate to. Must be one of: Dashboard, Boards, Board, Analytics, Backlog, Calendar, Performance, Settings, Admin, Help, Chat.",
            enum: ["Dashboard", "Boards", "Board", "Analytics", "Backlog", "Calendar", "Performance", "Settings", "Admin", "Help", "Chat"],
          },
        },
        required: ["page_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "explainAnalytics",
      description:
        "Explains an analytics chart or metric in plain language. " +
        "Use when the user asks what a chart means, how a metric is calculated, or needs help interpreting data. " +
        "Supported metrics: velocity, burndown, task_distribution, completion_rate, workload, cycle_time, sprint_progress, backlog_health.",
      parameters: {
        type: "object",
        properties: {
          metric_name: {
            type: "string",
            description: "The metric or chart to explain. One of: velocity, burndown, task_distribution, completion_rate, workload, cycle_time, sprint_progress, backlog_health.",
            enum: ["velocity", "burndown", "task_distribution", "completion_rate", "workload", "cycle_time", "sprint_progress", "backlog_health"],
          },
        },
        required: ["metric_name"],
      },
    },
  },
];

export async function executeTool(name, args) {
  try {
    switch (name) {
      case "listTeamMembers": {
        const [users, allItems, allBoards] = await Promise.all([
          User.listAll(),
          Item.list(),
          Board.list("-updated_date"),
        ]);

        // Find all person-type column IDs across all boards
        const personColIds = new Set();
        for (const board of allBoards || []) {
          for (const col of board.columns || []) {
            if (col.type === "person" || col.type === "people") {
              personColIds.add(col.id);
            }
          }
        }

        // Count tasks per person by matching name or UUID in person columns
        const workloadMap = {};
        for (const item of allItems || []) {
          const data = item.data || {};
          for (const [colId, val] of Object.entries(data)) {
            if (personColIds.has(colId) && typeof val === "string" && val.length > 0) {
              workloadMap[val] = (workloadMap[val] || 0) + 1;
            }
          }
        }

        return users.map(u => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: u.role,
          job_title: u.job_title || null,
          department: u.department || null,
          description: u.description || null,
          skills: u.skills || [],
          active_tasks: (workloadMap[u.full_name] || 0) + (workloadMap[u.id] || 0),
        }));
      }

      case "listBoards": {
        const boards = await Board.list("-updated_date");
        return boards.map(b => ({
          id: b.id,
          title: b.title,
          description: b.description,
          columns: (b.columns || []).map(c => ({ id: c.id, title: c.title, type: c.type })),
          groups: (b.groups || []).map(g => ({ id: g.id, title: g.title })),
        }));
      }

      case "createBoard": {
        const { title, description, columns, groups } = args;

        const defaultColumns = [
          { id: generateId(), title: "Status", type: "status" },
          { id: generateId(), title: "Person", type: "person" },
          { id: generateId(), title: "Text", type: "text" },
          { id: generateId(), title: "Priority", type: "status" },
        ];

        const resolvedColumns = columns && columns.length > 0
          ? columns.map(c => ({ id: generateId(), title: c.title, type: c.type }))
          : defaultColumns;

        const defaultGroups = [{ id: generateId(), title: "Tasks" }];
        const resolvedGroups = groups && groups.length > 0
          ? groups.map(g => ({ id: generateId(), title: g.title }))
          : defaultGroups;

        try {
          const created = await Board.create({
            title,
            description: description || "",
            columns: resolvedColumns,
            groups: resolvedGroups,
          });
          return {
            success: true,
            board_id: created.id,
            title: created.title,
            columns: resolvedColumns.map(c => ({ id: c.id, title: c.title, type: c.type })),
            groups: resolvedGroups.map(g => ({ id: g.id, title: g.title })),
          };
        } catch (err) {
          return { error: `Failed to create board: ${err.message}` };
        }
      }

      case "createTask": {
        const { board_id, title, description, group_id, status, assignee_name, priority } = args;

        let boards;
        try {
          boards = await Board.filter({ id: board_id });
        } catch {
          return { error: `Could not access board (${board_id}). It may not exist or belong to another user.` };
        }
        const board = boards?.[0];
        if (!board) return { error: `Board not found (${board_id}).` };

        const columns = board.columns || [];
        const targetGroup = group_id || board.groups?.[0]?.id || "default";
        const taskData = { board_id, title, group_id: targetGroup, data: {} };

        // Set status — default to "To Do" if not provided
        const statusCol = columns.find(c => c.type === "status" && !c.title.toLowerCase().includes("priority"));
        if (statusCol) taskData.data[statusCol.id] = status || "To Do";

        // Set priority — default to "Medium" if not provided
        const priorityCols = columns.filter(c => c.type === "status");
        const priorityCol = priorityCols.find(c => c.title.toLowerCase().includes("priority")) || priorityCols[1];
        if (priorityCol) taskData.data[priorityCol.id] = priority || "Medium";

        // Set description in the first text column
        if (description) {
          const textCol = columns.find(c => c.type === "text");
          if (textCol) taskData.data[textCol.id] = description;
        }

        // Assign person by name (stores the display name, not UUID)
        if (assignee_name) {
          const personCol = columns.find(c => c.type === "person" || c.type === "people");
          if (personCol) {
            // Verify the person exists
            const users = await User.search(assignee_name);
            if (users && users.length > 0) {
              taskData.data[personCol.id] = users[0].full_name || assignee_name;
            } else {
              return { error: `No team member found matching "${assignee_name}". Use listTeamMembers to see available members.` };
            }
          }
        }

        try {
          const created = await Item.create(taskData);
          const result = {
            success: true,
            task_id: created.id,
            title: created.title,
            board: board.title,
          };
          if (assignee_name) result.assigned_to = taskData.data[columns.find(c => c.type === "person" || c.type === "people")?.id] || assignee_name;
          if (description) result.description = description;
          result.status = taskData.data[statusCol?.id] || "To Do";
          result.priority = taskData.data[priorityCol?.id] || "Medium";
          return result;
        } catch (err) {
          return { error: `Failed to create task: ${err.message}` };
        }
      }

      case "updateTask": {
        const { task_id, title, description, status, assignee_name, priority, updates } = args;

        let task;
        try {
          task = await Item.get(task_id);
        } catch {
          return { error: `Task not found (${task_id}).` };
        }
        if (!task) return { error: `Task not found (${task_id}).` };

        let board;
        try {
          const boards = await Board.filter({ id: task.board_id });
          board = boards?.[0];
        } catch {
          return { error: "Could not access the board this task belongs to." };
        }

        const columns = board?.columns || [];
        const patch = {};
        if (title !== undefined) patch.title = title;

        const mergedData = { ...(task.data || {}) };

        if (status !== undefined) {
          const statusCol = columns.find(c => c.type === "status" && !c.title.toLowerCase().includes("priority"));
          if (statusCol) mergedData[statusCol.id] = status;
        }
        if (description !== undefined) {
          const textCol = columns.find(c => c.type === "text");
          if (textCol) mergedData[textCol.id] = description;
        }
        if (assignee_name !== undefined) {
          const personCol = columns.find(c => c.type === "person" || c.type === "people");
          if (personCol) {
            if (assignee_name === "") {
              mergedData[personCol.id] = "";
            } else {
              const users = await User.search(assignee_name);
              if (users && users.length > 0) {
                mergedData[personCol.id] = users[0].full_name || assignee_name;
              } else {
                return { error: `No team member found matching "${assignee_name}".` };
              }
            }
          }
        }
        if (priority !== undefined) {
          const priorityCols = columns.filter(c => c.type === "status");
          const priorityCol = priorityCols.find(c => c.title.toLowerCase().includes("priority")) || priorityCols[1];
          if (priorityCol) mergedData[priorityCol.id] = priority;
        }
        if (updates && typeof updates === "object") {
          Object.assign(mergedData, updates);
        }

        patch.data = mergedData;

        try {
          const updated = await Item.update(task_id, patch);
          return { success: true, task_id: updated.id, title: updated.title, data: updated.data };
        } catch (err) {
          return { error: `Failed to update task: ${err.message}` };
        }
      }

      case "deleteTask": {
        const { task_id } = args;

        let task;
        try {
          task = await Item.get(task_id);
        } catch {
          return { error: `Task not found (${task_id}).` };
        }
        if (!task) return { error: `Task not found (${task_id}).` };

        try {
          await Item.delete(task_id);
          return { success: true, deleted_task: task.title };
        } catch (err) {
          return { error: `Failed to delete task: ${err.message}` };
        }
      }

      case "getTaskDetails": {
        const { task_id } = args;

        let task;
        try {
          task = await Item.get(task_id);
        } catch {
          return { error: `Task not found (${task_id}).` };
        }
        if (!task) return { error: `Task not found (${task_id}).` };

        let board;
        try {
          const boards = await Board.filter({ id: task.board_id });
          board = boards?.[0];
        } catch {
          board = null;
        }

        const resolvedData = {};
        let assigneeName = null;

        if (board?.columns && task.data) {
          for (const [colId, val] of Object.entries(task.data)) {
            const col = board.columns.find(c => c.id === colId);
            const label = col ? col.title : colId;
            resolvedData[label] = val;

            if ((col?.type === "person" || col?.type === "people") && typeof val === "string") {
              // If value looks like a UUID, resolve to name
              if (val.length === 36 && val.includes('-')) {
                try {
                  const user = await User.getById(val);
                  if (user) assigneeName = user.full_name;
                } catch { /* non-fatal */ }
              } else {
                assigneeName = val;
              }
            }
          }
        }

        return {
          id: task.id,
          title: task.title,
          board_id: task.board_id,
          board_title: board?.title || null,
          group_id: task.group_id,
          assignee: assigneeName,
          fields: resolvedData,
          created_date: task.created_date,
        };
      }

      case "assignTask": {
        const { task_id, assignee_name } = args;

        const users = await User.search(assignee_name);
        if (!users || users.length === 0) {
          return { error: `No team member found matching "${assignee_name}". Use listTeamMembers to see all members.` };
        }
        const assignee = users[0];

        let task;
        try {
          task = await Item.get(task_id);
        } catch {
          return { error: `Task not found (${task_id}).` };
        }
        if (!task) return { error: `Task not found (${task_id}).` };

        let boards;
        try {
          boards = await Board.filter({ id: task.board_id });
        } catch {
          return { error: "Could not access the board this task belongs to." };
        }
        const board = boards?.[0];
        if (!board) return { error: "Board not found for this task." };

        const personCol = board.columns?.find(c => c.type === "person" || c.type === "people");
        if (!personCol) return { error: "This board does not have a Person column for assignments." };

        const assigneeName = assignee.full_name || assignee.email || assignee_name;
        const mergedData = { ...(task.data || {}), [personCol.id]: assigneeName };
        await Item.update(task_id, { data: mergedData });

        // Verify the update was persisted
        let verified;
        try {
          verified = await Item.get(task_id);
        } catch {
          return { error: "Task was updated but verification read failed." };
        }

        const savedAssignee = verified?.data?.[personCol.id];
        if (savedAssignee !== assigneeName) {
          return { error: "Assignment was submitted but the saved value did not match. Please try again." };
        }

        return {
          success: true,
          task: task.title,
          assigned_to: assignee.full_name,
          assignee_id: assignee.id,
          verified: true,
        };
      }

      case "listTasks": {
        const { board_id, status, assignee_id } = args;

        let items;
        try {
          items = await Item.filter({ board_id });
        } catch {
          return { error: `Could not access tasks for board (${board_id}).` };
        }

        let boards;
        try {
          boards = await Board.filter({ id: board_id });
        } catch {
          boards = [];
        }
        const board = boards[0];
        const columns = board?.columns || [];
        const statusCol = columns.find(c => c.type === "status");
        const personCol = columns.find(c => c.type === "person" || c.type === "people");

        let filtered = items || [];
        if (status && statusCol) {
          filtered = filtered.filter(i => i.data?.[statusCol.id] === status);
        }
        if (assignee_id && personCol) {
          filtered = filtered.filter(i => i.data?.[personCol.id] === assignee_id);
        }

        // Resolve assignee values — could be UUIDs or names
        const assigneeValues = [...new Set(
          filtered.map(i => personCol && i.data?.[personCol.id]).filter(Boolean)
        )];
        const assigneeMap = {};
        await Promise.all(
          assigneeValues.map(async val => {
            // If value looks like a UUID, resolve to name
            if (typeof val === 'string' && val.length === 36 && val.includes('-')) {
              try {
                const u = await User.getById(val);
                if (u) assigneeMap[val] = u.full_name;
              } catch { /* non-fatal */ }
            } else {
              assigneeMap[val] = val; // Already a name
            }
          })
        );

        return filtered.map(i => {
          const resolvedFields = {};
          for (const col of columns) {
            const val = i.data?.[col.id];
            if (val !== undefined && val !== null) {
              resolvedFields[col.title] = col.type === "person" ? (assigneeMap[val] || val) : val;
            }
          }
          return {
            id: i.id,
            title: i.title,
            group_id: i.group_id,
            assignee: personCol ? (assigneeMap[i.data?.[personCol.id]] || null) : null,
            fields: resolvedFields,
          };
        });
      }

      case "updateBoard": {
        const { board_id, title, description } = args;

        let boards;
        try {
          boards = await Board.filter({ id: board_id });
        } catch {
          return { error: `Board not found (${board_id}).` };
        }
        const board = boards?.[0];
        if (!board) return { error: `Board not found (${board_id}).` };

        const patch = {};
        if (title !== undefined) patch.title = title;
        if (description !== undefined) patch.description = description;

        if (Object.keys(patch).length === 0) {
          return { error: "No fields to update were provided." };
        }

        try {
          const updated = await Board.update(board_id, patch);
          return { success: true, board_id: updated.id, title: updated.title, description: updated.description };
        } catch (err) {
          return { error: `Failed to update board: ${err.message}` };
        }
      }

      case "deleteBoard": {
        const { board_id } = args;

        let boards;
        try {
          boards = await Board.filter({ id: board_id });
        } catch {
          return { error: `Board not found (${board_id}).` };
        }
        const board = boards?.[0];
        if (!board) return { error: `Board not found (${board_id}).` };

        try {
          await Board.delete(board_id);
          return { success: true, deleted_board: board.title };
        } catch (err) {
          return { error: `Failed to delete board: ${err.message}` };
        }
      }

      case "suggestAssignment": {
        const { task_id, board_id, task_title } = args;

        let task;
        let targetBoardId;

        if (task_id) {
          task = await Item.get(task_id);
          if (!task) return { error: "Task not found." };
          targetBoardId = task.board_id;
        } else if (board_id && task_title) {
          task = { title: task_title, data: {} };
          targetBoardId = board_id;
        } else {
          return { error: "Provide either task_id, or both board_id and task_title." };
        }

        let boards;
        try {
          boards = await Board.filter({ id: targetBoardId });
        } catch {
          return { error: "Could not access the board." };
        }
        const board = boards?.[0];
        if (!board) return { error: "Board not found." };

        const [members, allItems] = await Promise.all([
          User.listAll(),
          Item.filter({ board_id: targetBoardId }),
        ]);

        const suggestions = suggestAssignees(task, members, allItems, board.columns || []);
        const top = suggestions.slice(0, 5);
        const topCandidate = top[0];

        return {
          task: task.title,
          top_candidate_id: topCandidate?.member?.id || null,
          suggestions: top.map(s => ({
            name: s.member.name,
            id: s.member.id,
            role: s.member.role,
            score: Math.round(s.score * 100),
            competency: Math.round(s.competency * 100),
            availability: Math.round(s.availability * 100),
            performance: Math.round(s.performance * 100),
            reasoning: s.reasoning,
          })),
        };
      }

      case "suggestSprintPlan": {
        const { capacity } = args;

        const [stories, members] = await Promise.all([
          UserStory.list("-created_date"),
          User.listAll(),
        ]);

        const backlogStories = (stories || []).filter(s => !s.sprint_id);
        if (backlogStories.length === 0) {
          return { message: "No stories in the backlog to plan with." };
        }

        const plan = suggestSprintComposition(backlogStories, members, capacity);

        return {
          plan: plan.selected,
          totalPoints: plan.totalPoints,
          capacity: plan.capacity,
          reasoning: plan.reasoning,
        };
      }

      case "getPageContext": {
        const pathname = window.location.pathname;
        const search = window.location.search;
        const params = new URLSearchParams(search);

        // Derive a human-readable page name from the path
        const segment = pathname.split("/").filter(Boolean).pop() || "Dashboard";
        const pageNameMap = {
          dashboard: "Dashboard",
          boards: "Boards",
          board: "Board",
          analytics: "Analytics",
          backlog: "Backlog",
          calendar: "Calendar",
          performance: "Performance",
          settings: "Settings",
          admin: "Admin",
          help: "Help",
          chat: "Chat",
        };
        const pageName = pageNameMap[segment.toLowerCase()] || segment;
        const queryParams = Object.fromEntries(params.entries());

        const context = { page: pageName, path: pathname, queryParams };

        // Attach board ID when on the Board detail page
        if (pageName === "Board" && queryParams.id) {
          context.board_id = queryParams.id;
        }

        return context;
      }

      case "navigateToPage": {
        const { page_name } = args;
        const url = createPageUrl(page_name);
        window.location.href = url;
        return { success: true, navigating_to: page_name, url };
      }

      case "explainAnalytics": {
        const { metric_name } = args;

        const explanations = {
          velocity: "Sprint velocity measures how many story points the team completes per sprint. It is calculated as the average of completed points across recent sprints. Higher velocity means the team is delivering more work per cycle. Use it to forecast how much the team can commit to in the next sprint.",
          burndown: "A burndown chart tracks remaining work (story points or tasks) over the days of a sprint. The ideal line shows a straight decline to zero by the last day. If the actual line is above the ideal, the team is behind; below means ahead of schedule. It helps spot scope creep or blockers early.",
          task_distribution: "Task distribution shows how tasks are spread across statuses (To Do, In Progress, Done) or across team members. It reveals bottlenecks — for example, if most tasks are stuck In Progress — and highlights whether work is evenly balanced across the team.",
          completion_rate: "Completion rate is the percentage of tasks or stories that were finished versus planned within a sprint or time period. A rate below 80% often signals overcommitment, unclear requirements, or blockers that need addressing.",
          workload: "Workload shows the number of active tasks assigned to each team member. It helps identify who is overloaded and who has capacity for more work, enabling more balanced sprint planning and fairer task assignment.",
          cycle_time: "Cycle time measures how long a task takes from when work starts (In Progress) to when it is done. Shorter cycle times indicate smoother flow and fewer blockers. Tracking it over time reveals whether the team's process is improving.",
          sprint_progress: "Sprint progress shows how much of the current sprint's committed work has been completed. It is usually expressed as a percentage of story points or task count. It gives a quick read on whether the sprint is on track to finish all committed work by the deadline.",
          backlog_health: "Backlog health reflects the quality and readiness of the product backlog. A healthy backlog has stories that are prioritized, estimated, and clearly defined. Warning signs include a large number of unestimated stories, stale items that have not been updated, or a backlog that is growing faster than the team can deliver.",
        };

        const explanation = explanations[metric_name];
        if (!explanation) {
          return { error: `Unknown metric "${metric_name}". Supported: ${Object.keys(explanations).join(", ")}.` };
        }

        return { metric: metric_name, explanation };
      }

      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    return { error: `Tool "${name}" failed: ${err.message}` };
  }
}
