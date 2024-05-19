"use server";

import Chapter from "@/database/chapter.modal";
import Course from "@/database/course.modal";
import UserProgress from "@/database/userprogress.modal";
import mongoose from "mongoose";

export async function getCourseWithChaptersAndProgress(
  courseId: string,
  userId: string
) {
  try {
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
