import Chapter from "@/database/chapter.modal";
import Course from "@/database/course.modal";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();
    console.log(list);

    const ownCourse = await Course.findOne({
      _id: params.courseId,
      userId: userId,
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await Chapter.updateOne(
        { _id: item.id },
        { $set: { position: item.position } }
      );
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
