import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const role = body.role?.trim();
    const difficulty = body.difficulty?.trim();

    if (!role || !difficulty) {
      return NextResponse.json(
        { error: "Role and difficulty are required" },
        { status: 400 }
      );
    }

    const interview = await prisma.interviewSession.create({
      data: {
        role,
        difficulty,
        userId: session.user.id,
        status: "in_progress",
      },
    });

    return NextResponse.json({ sessionId: interview.id });
  } catch (error) {
    console.error("INTERVIEW_START_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create interview session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
