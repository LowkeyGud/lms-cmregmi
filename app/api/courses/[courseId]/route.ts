import Category from "@/database/category.modal";
import Course from "@/database/course.modal";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import console from "console";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const { courseId } = params;

    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await Course.findOne({ _id: courseId, userId: userId });
    if (!course) {
      throw new Error("Course not found");
    }

    const oldCategoryId = course.categoryId;

    await Course.findByIdAndUpdate(
      { _id: courseId, userId: userId },
      {
        ...values,
      },
      { new: true }
    );

    if (oldCategoryId) {
      // Remove course from the old category
      await Category.findByIdAndUpdate(oldCategoryId, {
        $pull: { courses: courseId },
      }).exec();
    }

    if (values.categoryId) {
      await Category.findByIdAndUpdate(values.categoryId, {
        $addToSet: { courses: courseId },
      });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await Course.findOne({
      _id: params.courseId,
      userId,
    }).populate({
      path: "chapters",
      populate: {
        path: "muxData",
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await video.assets.delete(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await Course.deleteOne({ _id: params.courseId });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
