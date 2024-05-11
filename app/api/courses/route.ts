import Course from "@/database/course.modal";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    connectToDatabase();

    const { userId } = auth();
    const { title } = await req.json();

    console.log(userId);
    console.log(title);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await Course.create({
      userId,
      title,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Interdfdfnal Server Error", { status: 500 });
  }
}
