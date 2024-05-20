import UserProgress from "@/database/userprogress.modal";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await UserProgress.findOneAndUpdate(
      {
        userId,
        chapterId: params.chapterId,
      },
      {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
      {
        new: true, // return the updated document
        upsert: true, // create the document if it doesn't exist
        setDefaultsOnInsert: true, // apply schema defaults if creating
      }
    );

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
