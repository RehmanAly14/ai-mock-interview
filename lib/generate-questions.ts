type GenerateQuestionsParams = {
  role: string;
  difficulty: string;
};

type GeneratedQuestion = {
  type: string;
  question: string;
};

const fallbackQuestionBank: Record<
  string,
  Record<string, GeneratedQuestion[]>
> = {
  frontend: {
    junior: [
      { type: "conceptual", question: "What is the DOM and how does JavaScript interact with it?" },
      { type: "conceptual", question: "What is the difference between let, const, and var?" },
      { type: "practical", question: "How would you build a simple responsive navbar?" },
      { type: "debugging", question: "A button click is not triggering in your React app. How would you debug it?" },
      { type: "conceptual", question: "What is React and why is it used?" },
      { type: "conceptual", question: "What is the difference between props and state in React?" },
      { type: "practical", question: "How would you fetch data from an API in React?" },
      { type: "scenario", question: "A page is loading slowly on mobile devices. What would you check first?" },
      { type: "debugging", question: "A CSS style is not applying to a component. How would you investigate?" },
      { type: "practical", question: "How would you structure reusable UI components in a small project?" },
    ],
    mid: [
      { type: "conceptual", question: "How does the virtual DOM work in React?" },
      { type: "conceptual", question: "Explain the difference between SSR and CSR." },
      { type: "practical", question: "How would you optimize performance in a React application?" },
      { type: "debugging", question: "A React component is re-rendering too often. How would you debug it?" },
      { type: "practical", question: "How would you implement code splitting in a Next.js app?" },
      { type: "scenario", question: "A feature works locally but breaks in production. How would you approach the issue?" },
      { type: "conceptual", question: "What are React hooks and why are they useful?" },
      { type: "practical", question: "How would you manage shared state across multiple components?" },
      { type: "debugging", question: "An API response is correct but the UI is not updating. What might be wrong?" },
      { type: "scenario", question: "How would you redesign a frontend app that has become difficult to maintain?" },
    ],
    senior: [
      { type: "system_design", question: "How would you design a scalable frontend architecture for a large product?" },
      { type: "conceptual", question: "Explain how React reconciliation works." },
      { type: "practical", question: "How would you design a reusable component system for multiple teams?" },
      { type: "scenario", question: "How would you migrate a legacy frontend to a modern stack with minimal risk?" },
      { type: "debugging", question: "A production build is significantly slower than expected. How would you investigate?" },
      { type: "system_design", question: "How would you structure state management in a large multi-page application?" },
      { type: "practical", question: "What strategies would you use to improve frontend performance at scale?" },
      { type: "scenario", question: "How would you handle conflicting UI requirements from design and engineering?" },
      { type: "conceptual", question: "What trade-offs would you consider when choosing SSR, SSG, or CSR?" },
      { type: "debugging", question: "How would you debug a memory leak in a frontend app?" },
    ],
  },
  backend: {
    junior: [
      { type: "conceptual", question: "What is a REST API?" },
      { type: "conceptual", question: "What is the difference between GET and POST requests?" },
      { type: "practical", question: "How would you create a simple login endpoint?" },
      { type: "conceptual", question: "What is the difference between SQL and NoSQL?" },
      { type: "conceptual", question: "What is authentication versus authorization?" },
      { type: "debugging", question: "An API is returning 500 errors. How would you debug it?" },
      { type: "practical", question: "How would you validate input data in an API?" },
      { type: "scenario", question: "A client says your API is too slow. What would you check first?" },
      { type: "conceptual", question: "What is middleware in backend frameworks?" },
      { type: "practical", question: "How would you structure routes and controllers in a backend app?" },
    ],
    mid: [
      { type: "practical", question: "How would you design a REST API for a blog platform?" },
      { type: "conceptual", question: "What are database indexes and why are they useful?" },
      { type: "conceptual", question: "What is the difference between synchronous and asynchronous code?" },
      { type: "practical", question: "How do you secure an API?" },
      { type: "debugging", question: "A background job is failing intermittently. How would you investigate?" },
      { type: "scenario", question: "Your service starts timing out during peak traffic. What would you do?" },
      { type: "practical", question: "How would you design error handling in an API?" },
      { type: "conceptual", question: "When would you use caching?" },
      { type: "debugging", question: "A query is suddenly slow in production. How would you debug it?" },
      { type: "scenario", question: "How would you handle a breaking API change for existing clients?" },
    ],
    senior: [
      { type: "system_design", question: "How would you design a scalable backend system for millions of users?" },
      { type: "conceptual", question: "Explain database sharding." },
      { type: "practical", question: "How would you design rate limiting for a public API?" },
      { type: "system_design", question: "How would you design a distributed job queue?" },
      { type: "conceptual", question: "Explain caching strategies in backend systems." },
      { type: "scenario", question: "How would you migrate a monolith into services without breaking production?" },
      { type: "debugging", question: "A service has high CPU usage but low request volume. How would you investigate?" },
      { type: "practical", question: "How would you design observability for a critical backend system?" },
      { type: "system_design", question: "How would you design an authentication service for a large platform?" },
      { type: "scenario", question: "How would you handle database failover in production?" },
    ],
  },
};

function normalizeRole(role: string) {
  const r = role.toLowerCase();

  if (r.includes("front")) return "frontend";
  if (r.includes("back")) return "backend";

  return "frontend";
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getFallbackQuestions(role: string, difficulty: string): GeneratedQuestion[] {
  const normalizedRole = normalizeRole(role);
  const roleQuestions = fallbackQuestionBank[normalizedRole] || fallbackQuestionBank.frontend;

  return roleQuestions[difficulty] || roleQuestions.junior;
}

async function generateFromGroq(
  role: string,
  difficulty: string
): Promise<GeneratedQuestion[]> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const prompt = `
Generate exactly 5 unique mock interview questions for a ${difficulty} ${role} developer interview.

Requirements:
- Mix conceptual, practical, debugging, scenario, and system design questions
- Return ONLY valid JSON
- Format must be an array of 5 objects
- Each object must have:
  - "type": one of ["conceptual", "practical", "debugging", "scenario", "system_design"]
  - "question": the question text
- No markdown
- No numbering
- No explanation

Example:
[
  { "type": "conceptual", "question": "Explain the event loop in JavaScript." },
  { "type": "debugging", "question": "A Node server becomes slow after 10k requests. How would you investigate?" }
]
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
          content:
            "You generate interview questions and return strict JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq request failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Groq returned an empty response");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Failed to parse Groq response as JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Groq returned invalid question format");
  }

  const cleanedQuestions = parsed
    .filter(
      (item): item is { type: string; question: string } =>
        !!item &&
        typeof item === "object" &&
        typeof item.type === "string" &&
        typeof item.question === "string"
    )
    .map((item) => ({
      type: item.type.trim().toLowerCase(),
      question: item.question.trim(),
    }))
    .filter(
      (item) =>
        item.question.length > 0 &&
        ["conceptual", "practical", "debugging", "scenario", "system_design"].includes(
          item.type
        )
    );

  const uniqueQuestions = Array.from(
    new Map(cleanedQuestions.map((item) => [item.question, item])).values()
  );

  const finalQuestions = shuffleArray(uniqueQuestions).slice(0, 5);

  if (finalQuestions.length < 5) {
    throw new Error("Not enough valid questions returned");
  }

  return finalQuestions;
}

export async function generateInterviewQuestions({
  role,
  difficulty,
}: GenerateQuestionsParams): Promise<GeneratedQuestion[]> {
  try {
    return await generateFromGroq(role, difficulty);
  } catch (error) {
    console.error("GROQ_FALLBACK_TRIGGERED:", error);
    return shuffleArray(getFallbackQuestions(role, difficulty)).slice(0, 10);
  }
}