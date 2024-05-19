import Category from "@/database/category.modal";
import Chapter from "@/database/chapter.modal";
import Course from "@/database/course.modal";
import Purchase from "@/database/purchase.modal";
import { CourseWithProgressWithCategory } from "@/types/indes";
import mongoose from "mongoose";
import { getProgress } from "./get-progress";
import console from "console";

type GetCourses = {
  userId: string;
  title?: string | "";
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<any[]> => {
  try {
    // Fetch courses with the given conditions

    const courses = categoryId
      ? await Course.find({
          isPublished: true,
          title: { $regex: title || "", $options: "i" },
          categoryId,
        })
          .sort({ createdAt: -1 })
          .exec()
      : await Course.find({
          isPublished: true,
          title: { $regex: title || "", $options: "i" },
        })
          .sort({ createdAt: -1 })
          .exec();

    const coursesWithRelatedData = await Promise.all(
      courses.map(async (course) => {
        const [category, chapters, purchases] = await Promise.all([
          Category.findById(course.categoryId),
          Chapter.find({ courseId: course._id, isPublished: true }, { _id: 1 }),
          Purchase.find({ courseId: course._id, userId }),
        ]);

        course = course.toObject();
        course.category = category;
        course.chapters = chapters;
        course.purchases = purchases;

        return course;
      })
    );

    const coursesWithProgress = await Promise.all(
      coursesWithRelatedData.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null, // make progress possibly null
          };
        }

        const progressPercentage = await getProgress(userId, course._id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
