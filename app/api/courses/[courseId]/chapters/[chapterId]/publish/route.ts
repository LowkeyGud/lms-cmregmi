import Chapter from "@/database/chapter.modal";
import Course from "@/database/course.modal";
import MuxData from "@/database/muxdata.modal";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    connectToDatabase();
    const ownCourse = await Course.findOne({ _id: params.courseId, userId });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await Chapter.findOne({ _id: params.chapterId, courseId: params.courseId });
    const muxData = await MuxData.findOne({ chapterId: params.chapterId });

    if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter = await Chapter.findOneAndUpdate(
      { _id: params.chapterId, courseId: params.courseId },
      { isPublished: true },
      { new: true, useFindAndModify: false }
    );

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
