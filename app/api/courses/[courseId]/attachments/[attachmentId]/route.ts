import Attachment from "@/database/attachment.modal";
import Course from "@/database/course.modal";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();
    const courseId = params.courseId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    connectToDatabase();
    const courseOwner = await Course.findOne({ _id: courseId, userId });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Assuming params.courseId and params.attachmentId are defined
    const attachmentId = params.attachmentId;

    const attachment = await Attachment.findOneAndDelete({
      attachmentId,
      courseId,
    });

    await Course.findByIdAndUpdate(courseId, {
      $pull: { attachments: attachmentId },
    }).exec();

    return NextResponse.json(attachment.toObject());
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
