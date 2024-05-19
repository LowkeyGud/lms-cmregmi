import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

import { auth } from "@clerk/nextjs/server";
import Course from "@/database/course.modal";
import Chapter from "@/database/chapter.modal";
import MuxData from "@/database/muxdata.modal";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
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

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await Course.findOne({ _id: params.courseId, userId });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await Chapter.findOneAndUpdate(
      { _id: params.chapterId, courseId: params.courseId },
      { ...values },
      { new: true }
    );

    if (values.videoUrl) {
      const existingMuxData = await MuxData.findOne({
        chapterId: params.chapterId,
      });

      if (existingMuxData) {
        try {
          await video.assets.delete(existingMuxData.assetId);
          await MuxData.deleteOne({ _id: existingMuxData._id });
        } catch (error) {
          console.log("[Mux Asset Delete]", error);
        }
      }

      try {
        const asset = await video.assets.create({
          input: values.videoUrl,
          playback_policy: ["public"],
          test: false,
        });

        if (asset) {
          await MuxData.create({
            chapterId: params.chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
          });
        }
      } catch (error) {
        console.log("[Mux Asset Create]", error);
      }
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
