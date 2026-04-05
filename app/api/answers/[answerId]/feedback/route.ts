import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/evaluate-answer";

type RouteContext = {
  params: Promise<{
    answerId: string;
  }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answerId } = await params;

    const answer = await prisma.answer.findFirst({
      where: {
        id: answerId,
        session: {
          userId: session.user.id,
        },
      },
      include: {
        question: true,
        feedback: true,
      },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    const result = await evaluateAnswer(
      answer.question.content,
      answer.content,
      answer.question.type
    );

    const feedback = await prisma.feedback.upsert({
      where: {
        answerId: answer.id,
      },
      update: {
        score: result.score,
        strengths: result.strengths,
        category: result.category,
        improvements: result.improvements,
        improvedAnswer: result.improvedAnswer,
      },
      create: {
        answerId: answer.id,
        score: result.score,
        strengths: result.strengths,
        category: result.category,
        improvements: result.improvements,
        improvedAnswer: result.improvedAnswer,
      },
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("GENERATE_FEEDBACK_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}