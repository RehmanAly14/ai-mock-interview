// @/lib/evaluate-answer.ts

export type EvaluationResult = {
  score: number;
  strengths: string;
  category: string;
  improvements: string;
  improvedAnswer: string;
};

/**
 * Maps the Question Type (from your generator) to a 
 * Professional Analytics Category (for your database/charts).
 */
function mapTypeToCategory(type: string): string {
  switch (type.toLowerCase()) {
    case "conceptual":
      return "Technical Depth";
    case "practical":
      return "Problem Solving";
    case "debugging":
      return "Technical Depth";
    case "scenario":
      return "Communication";
    case "system_design":
      return "System Design";
    default:
      return "Technical Depth";
  }
}

function fallbackEvaluation(
  questionContent: string,
  answer: string,
  questionType: string = "conceptual" // Defaulting to conceptual if type is unknown
): EvaluationResult {
  const trimmed = answer.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  let score = 5;

  // Simple heuristic scoring
  if (wordCount >= 15) score += 1;
  if (wordCount >= 30) score += 1;
  if (trimmed.toLowerCase().includes("because")) score += 1;
  if (trimmed.toLowerCase().includes("example")) score += 1;
  if (trimmed.toLowerCase().includes("performance")) score += 1;

  if (score > 10) score = 10;

  return {
    score,
    strengths: "The answer attempts to address the question and includes some relevant explanation.",
    category: mapTypeToCategory(questionType), 
    improvements: "Add clearer technical reasoning, stronger structure, and a more practical example.",
    improvedAnswer: `A stronger answer to "${questionContent}" should define the concept clearly, explain how it works in practice, and include a short real-world example.`,
  };
}

export async function evaluateAnswer(
  questionContent: string,
  answer: string,
  questionType: string = "conceptual" // Pass the type from the DB
): Promise<EvaluationResult> {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }

    const prompt = `
Evaluate this interview answer for a question of type: ${questionType}.

Question:
"${questionContent}"

Answer:
"${answer}"

You are an expert Technical Interviewer. Analyze the answer and provide structured feedback in JSON format.

Assign a 'category' from this list based on the context:
- "Technical Depth"
- "Problem Solving"
- "Communication"
- "System Design"
- "Culture Fit"

Return the data in this exact JSON structure:
{
  "score": <Integer 1-10>,
  "category": "<One of the categories above>",
  "strengths": "<Briefly state what they did well>",
  "improvements": "<Specific advice>",
  "improvedAnswer": "<A high-quality version of the answer>"
}
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert technical interviewer. Return strict JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Groq request failed");

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("Empty response");

    const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());

    return {
      score: Math.max(1, Math.min(10, Math.round(parsed.score))),
      strengths: parsed.strengths || "Addressed the core question.",
      category: parsed.category || mapTypeToCategory(questionType),
      improvements: parsed.improvements || "Provide more technical detail.",
      improvedAnswer: parsed.improvedAnswer || "Consider using a more structured approach.",
    };
  } catch (error) {
    console.error("AI_FEEDBACK_FALLBACK:", error);
    return fallbackEvaluation(questionContent, answer, questionType);
  }
}