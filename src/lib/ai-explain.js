const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

const EXPLAIN_MODELS = [
  'openai/gpt-4o-mini',
  'google/gemini-2.5-flash',
  'anthropic/claude-haiku-4.5',
];

const EXPLAIN_SYSTEM_PROMPT = `You are an analytics assistant embedded in AgileFlow, a project management platform.

You explain dashboard metrics, charts, and widgets in plain language for project managers and team leads.

Structure your response EXACTLY like this:

### What's Happening
[Plain language summary in 2-3 sentences using actual numbers from the data]

### Key Insight
[Single most important takeaway, 1-2 sentences]

### Suggested Action
[One specific, actionable recommendation, 1 sentence]

---suggestions---
- [Follow-up question 1]
- [Follow-up question 2]
- [Follow-up question 3]

Rules:
- Keep the explanation under 150 words (excluding suggestions)
- Use actual numbers from the widget data provided
- Be specific: name items, percentages, counts
- Each suggestion MUST start with "- " (dash space)
- Suggestions should be relevant follow-up questions the user might ask`;

export function parseExplainResponse(raw) {
  const delimiterIndex = raw.indexOf('---suggestions---');

  if (delimiterIndex === -1) {
    return { content: raw.trim(), suggestions: [] };
  }

  const content = raw.slice(0, delimiterIndex).trim();
  const suggestionsBlock = raw.slice(delimiterIndex + 17).trim();

  const suggestions = suggestionsBlock
    .split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.trim().slice(2))
    .filter(s => s.length > 0);

  return { content, suggestions };
}

export async function explainInsight(widgetTitle, widgetData, onChunk) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('AI features need an API key. Set VITE_OPENROUTER_API_KEY in .env.local');
  }

  const userMessage = `Explain the "${widgetTitle}" widget data. Here is the current data:\n\n${JSON.stringify(widgetData, null, 2)}`;

  const messages = [
    { role: 'system', content: EXPLAIN_SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  let lastError = null;

  for (const model of EXPLAIN_MODELS) {
    try {
      const response = await fetch(OPENROUTER_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AgileFlow AI Insights',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1024,
          temperature: 0.5,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        lastError = new Error(`Model ${model} returned ${response.status}: ${errText}`);
        continue;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              onChunk?.(accumulated);
            }
          } catch {
            // partial JSON, skip
          }
        }
      }

      if (accumulated) return accumulated;

    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('All AI models failed. Please try again.');
}

export async function askFollowUp(widgetTitle, widgetData, conversationHistory, question, onChunk) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('AI features need an API key.');
  }

  const systemContent = `You are an analytics assistant for AgileFlow, a project management platform. The user is asking a follow-up question about the "${widgetTitle}" widget.

Widget data: ${JSON.stringify(widgetData)}

Answer concisely (under 150 words). Use markdown. Be specific with numbers.

End your response with:
---suggestions---
- [Follow-up question 1]
- [Follow-up question 2]`;

  const messages = [
    { role: 'system', content: systemContent },
    ...conversationHistory,
    { role: 'user', content: question },
  ];

  for (const model of EXPLAIN_MODELS) {
    try {
      const response = await fetch(OPENROUTER_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AgileFlow AI Insights',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1024,
          temperature: 0.5,
          stream: true,
        }),
      });

      if (!response.ok) continue;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              onChunk?.(accumulated);
            }
          } catch {
            // partial JSON
          }
        }
      }

      if (accumulated) return accumulated;
    } catch {
      continue;
    }
  }

  throw new Error('Failed to get AI response. Please try again.');
}
