import Chapter from "@/database/chapter.modal";
import Course from "@/database/course.modal";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await Course.findOne({ _id: params.courseId, userId });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const chapters = await Chapter.find({ courseId: params.courseId });

    const hasPublishedChapter = chapters.some((chapter) => chapter.isPublished);

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    course.isPublished = true;
    const publishedCourse = await course.save();

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
