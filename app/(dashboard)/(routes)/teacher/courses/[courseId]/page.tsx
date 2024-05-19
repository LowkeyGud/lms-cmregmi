import { TitleForm } from "@/app/(dashboard)/_components/title-form";
import { IconBadge } from "@/components/icon-badge";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  LayoutDashboard,
  ListChecks,
  File,
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import Category from "@/database/category.modal";
import { CategoryForm } from "./_components/category-form";
import PriceForm from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import Attachment from "@/database/attachment.modal";
import Course from "@/database/course.modal";
import ChaptersForm from "./_components/chapter-form";
import Chapter from "@/database/chapter.modal";
import { Actions } from "./_components/actions";
import { Banner } from "@/components/banner";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  connectToDatabase();

  const course = await Course.findOne({ _id: params.courseId, userId });

  const attachments = await Attachment.find({ courseId: course._id })
    .sort({ createdAt: "desc" })
    .exec();

  const chapters = await Chapter.find({ courseId: course._id }).sort({ position: 'asc' });


  const attachmentsObject = attachments.map((element) => ({
    _id: element._id,
    name: element.name,
    url: element.url,
    courseId: element.courseId,
  }));


  const categories = await Category.find().sort({ name: 1 });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is unpublished. It will not be visible to the students."
        />
      )}
      <div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Course setup</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
            <Actions
              disabled={!isComplete}
              courseId={params.courseId}
              isPublished={course.isPublished}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your course</h2>
              </div>
              <TitleForm initialData={course} courseId={course.id} />
              <DescriptionForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category._id,
                }))}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course chapters DnD not working</h2>
                </div>
                <ChaptersForm
                  initialData={chapters}
                  courseId={course.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Sell your course</h2>
                </div>
                <PriceForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <AttachmentForm
                  attachments={attachmentsObject}
                  courseId={course.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
};

export default CourseIdPage;
