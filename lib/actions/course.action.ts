"use server";

import Chapter from "@/database/chapter.modal";
import Course from "@/database/course.modal";
import UserProgress from "@/database/userprogress.modal";
import { connectToDatabase } from "../mongoose";
import { GetCourses } from "@/types/indes";
import Category from "@/database/category.modal";
import Purchase from "@/database/purchase.modal";
import { getProgress } from "./progress.action";

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<any[]> => {
  try {
    connectToDatabase();
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

export async function getCourseWithChaptersAndProgress(
  courseId: string,
  userId: string
) {
  try {
    connectToDatabase();
    console.log("55555");

    console.log(courseId);

    // Fetch the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Fetch the published chapters for the course
    const chapters = await Chapter.find({
      courseId,
      isPublished: true,
    }).sort({ position: "asc" });

    // Fetch user progress for each chapter
    const chaptersWithProgress = await Promise.all(
      chapters.map(async (chapter) => {
        const userProgress = await UserProgress.findOne({
          userId,
          chapterId: chapter._id,
        });

        return {
          ...chapter.toObject(),
          userProgress: userProgress ? userProgress.toObject() : null,
        };
      })
    );

    return {
      ...course.toObject(),
      chapters: chaptersWithProgress,
    };
  } catch (error) {
    console.error("Error fetching course with chapters and progress:", error);
    throw error;
  }
}

export async function getCourseWithPublishedChapters(courseId: string) {
  try {
    connectToDatabase();
    // Fetch the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    // Fetch the published chapters for the course
    const chapters = await Chapter.find({
      courseId,
      isPublished: true,
    }).sort({ position: "asc" });

    return {
      ...course.toObject(),
      chapters: chapters.map((chapter) => chapter.toObject()),
    };
  } catch (error) {
    console.error("Error fetching course with chapters:", error);
    throw error;
  }
}
