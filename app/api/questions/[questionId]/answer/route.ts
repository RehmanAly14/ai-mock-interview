import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 1. Define the Context type correctly for Next.js 15
type RouteContext = {
  params: Promise<{
    questionId: string;
  }>;
};

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. ✅ FIX: Await the params before destructuring
    const { questionId } = await params;

    const body = await req.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "Answer content is required" }, { status: 400 });
    }

    // 3. Find the question and verify the user owns the session
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        session: {
          userId: session.user.id,
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found or access denied" }, { status: 404 });
    }

    // 4. Create or Update the answer
    // Using upsert ensures we don't create duplicate answers for one question
    const answer = await prisma.answer.upsert({
      where: {
        questionId: questionId,
      },
      update: {
        content,
      },
      create: {
        content,
        questionId: questionId,
        sessionId: question.sessionId,
      },
    });

    return NextResponse.json({
      message: "Answer saved successfully",
      answer,
    });
  } catch (error) {
    console.error("SAVE_ANSWER_ERROR:", error);
    return NextResponse.json(
      { 
        error: "Failed to save answer", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}