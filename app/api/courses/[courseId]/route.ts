import Category from "@/database/category.modal";
import Course from "@/database/course.modal";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import console from "console";
import { NextResponse } from "next/server";

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
        throw new Error('Course not found');
    }

    const oldCategoryId = course.categoryId;

    await Course.findByIdAndUpdate(
      { _id: courseId, userId: userId },
      {
        ...values,
      },
      { new: true }
    )

    if (oldCategoryId) {
        // Remove course from the old category
        await Category.findByIdAndUpdate(oldCategoryId, { $pull: { courses: courseId } }).exec();
    }

    if(values.categoryId){
      await Category.findByIdAndUpdate(values.categoryId, {
        $addToSet: { courses : courseId}
      })
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
