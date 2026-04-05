import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/evaluate-answer"; // Import your evaluation logic

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

    // 1. Fetch the interview and its questions/answers that lack feedback
    const interview = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
      include: {
        questions: {
          include: {
            answers: {
              where: {
                feedback: { is: null }, // Only target answers without feedback
              },
            },
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

    // 2. Identify all answers that need evaluation
    const pendingEvaluations = interview.questions
      .flatMap((q) => q.answers)
      .filter((a) => a.content.trim().length > 0);

    // 3. Perform Batch Evaluation in parallel for speed
    // This ensures the Radar Chart is fully populated when they reach the report
    if (pendingEvaluations.length > 0) {
      await Promise.all(
        pendingEvaluations.map(async (answer) => {
          // Find the parent question text for context
          const question = interview.questions.find((q) => q.id === answer.questionId);
          
          if (question) {
            const evaluation = await evaluateAnswer(
              question.content,
              answer.content,
              question.type
            );

            return prisma.feedback.create({
              data: {
                ...evaluation,
                answerId: answer.id,
              },
            });
          }
        })
      );
    }

    // 4. Mark interview as completed
    const updatedInterview = await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: "completed" },
    });

    return NextResponse.json({
      message: "Interview evaluated and marked as completed",
      interview: updatedInterview,
    });
  } catch (error) {
    console.error("COMPLETE_INTERVIEW_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to finalize interview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}