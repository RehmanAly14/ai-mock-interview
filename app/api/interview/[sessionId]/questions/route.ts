import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInterviewQuestions } from "@/lib/generate-questions";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    const interview = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
      include: {
        questions: {
          include: {
            answers: {
              include: {
                feedback: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 }
      );
    }

    if (interview.questions.length === 0) {
      const generatedQuestions = await generateInterviewQuestions({
        role: interview.role,
        difficulty: interview.difficulty,
      });

     await prisma.question.createMany({
  data: generatedQuestions.map((item) => ({
    content: item.question,
    type: item.type,
    sessionId: interview.id,
  })),
});
    }

    const savedQuestions = await prisma.question.findMany({
      where: {
        sessionId: interview.id,
      },
      include: {
        answers: {
          include: {
            feedback: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
     questions: savedQuestions.map((question) => ({
  id: question.id,
  type: question.type,
  content: question.content,
  answer: question.answers[0]
    ? {
        id: question.answers[0].id,
        content: question.answers[0].content,
        feedback: question.answers[0].feedback
          ? {
              score: question.answers[0].feedback.score,
              strengths: question.answers[0].feedback.strengths,
              category: question.answers[0].feedback.category,
              improvements: question.answers[0].feedback.improvements,
              improvedAnswer: question.answers[0].feedback.improvedAnswer,
            }
          : null,
      }
    : null,
})),
    });
  } catch (error) {
    console.error("GENERATE_QUESTIONS_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}