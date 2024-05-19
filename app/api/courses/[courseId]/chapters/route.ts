import Chapter from "@/database/chapter.modal";
import Course from "@/database/course.modal";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseId = params.courseId; // Assuming params.courseId and userId are defined

    const courseOwner = await Course.findOne({ _id: courseId, userId });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await Chapter.findOne({ courseId })
      .sort({ position: -1 }) // Sort by position in descending order
      .exec();

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = new Chapter({
      title,
      courseId,
      position: newPosition,
    });

    await chapter.save();

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
