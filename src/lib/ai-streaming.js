export function extractTextFromStreamChunk(chunk) {
  let extracted = "";
  let matchedStructuredFormat = false;

  for (const line of chunk.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Vercel AI SDK format: 0:"text"
    if (trimmed.startsWith("0:")) {
      matchedStructuredFormat = true;
      try {
        extracted += JSON.parse(trimmed.slice(2));
      } catch {
        extracted += trimmed.slice(2);
      }
      continue;
    }

    // SSE format: data: {"choices":[{"delta":{"content":"text"}}]}
    if (trimmed.startsWith("data:")) {
      matchedStructuredFormat = true;
      const jsonStr = trimmed.slice(5).trim();
      if (jsonStr === "[DONE]") continue;

      try {
        const parsed = JSON.parse(jsonStr);
        // OpenRouter format
        if (parsed.choices?.[0]?.delta?.content) {
          extracted += parsed.choices[0].delta.content;
        }
        // Generic format
        else if (typeof parsed.content === "string") {
          extracted += parsed.content;
        } else if (typeof parsed.text === "string") {
          extracted += parsed.text;
        }
      } catch {
        // Ignore partial JSON frames
      }
    }
  }

  return matchedStructuredFormat ? extracted : chunk;
}
