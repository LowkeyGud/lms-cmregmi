import Attachment from "@/database/attachment.modal";
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
    const { url, originalFilename } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseId = params.courseId; // Assuming params.courseId and userId are defined

    const courseOwner = await Course.findOne({ _id: courseId, userId });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    var name = url ? url.split("/").pop() : "Untitled";
    if (originalFilename) {
      name = originalFilename;
    }

    const attachment = new Attachment({
      url,
      name,
      courseId,
    });

    // Save the attachment
    const savedAttachment = await attachment.save();

    // Add the attachment to the course
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { attachments: savedAttachment._id } },
      { new: true, useFindAndModify: false }
    );

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
