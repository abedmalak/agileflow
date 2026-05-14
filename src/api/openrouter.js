// src/api/openrouter.js

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Model cascade: free/cheap -> paid cheap
const MODEL_CASCADE = [
  'openai/gpt-4o-mini',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-2.5-flash',
  'anthropic/claude-haiku-4.5',
];

async function callModel(model, messages) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured. Set VITE_OPENROUTER_API_KEY in .env.local');
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AgileFlow AI Assistant',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Model ${model} failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.choices) || data.choices.length === 0) {
    throw new Error(`Model ${model} returned an unexpected response structure (no choices)`);
  }

  const content = data.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`Model ${model} returned an empty response`);
  }

  return content;
}

export async function invokeLLM(prompt) {
  const messages = [
    {
      role: 'system',
      content: `You are an AI assistant for AgileFlow, an Agile/Scrum project management application (similar to ClickUp/Monday.com).

The app includes:
- Dashboard: Overview of all boards, tasks, and activities
- Boards: Create and manage project boards with customizable columns, groups, Kanban view, and table view
- Backlog: Manage user stories, story points, and sprint planning
- Calendar: View and schedule team events and deadlines
- Analytics: Track performance metrics, completion rates, and insights
- Settings: Customize theme, notifications, and preferences
- Admin Panel: User management and role assignments (admin only)
- AI Assistant: Context-aware help with access to user's project data

You have access to the user's actual project data which will be included in their messages. Use this data to give specific, actionable advice. For example:
- If they have overdue tasks, proactively mention them
- Suggest sprint planning based on their backlog
- Help them organize and prioritize work

Be concise, helpful, and specific. Use markdown formatting for clarity.`
    },
    { role: 'user', content: prompt }
  ];

  for (const model of MODEL_CASCADE) {
    try {
      return await callModel(model, messages);
    } catch (error) {
      console.warn(`Model ${model} failed:`, error.message);
    }
  }

  throw new Error('All models failed: gpt-4o-mini, llama-3.3-70b, gemini-2.5-flash, claude-haiku-4.5');
}
