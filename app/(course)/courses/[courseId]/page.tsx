import { getCourseWithPublishedChapters } from "@/lib/actions/course.action";
import console from "console";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
    params
}: {
    params: { courseId: string; }
}) => {
    const course = await getCourseWithPublishedChapters(params.courseId)

    console.log("333");

    console.log(course);


    if (!course) {
        return redirect("/");
    }

    return redirect(`/courses/${course._id}/chapters/${course.chapters[0]._id}`);
}

export default CourseIdPage;