
import { getCourseWithChaptersAndProgress } from "@/lib/actions/course.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import getSafeProfile from "@/actions/get-safe-profile";
import { CourseNavbar } from "./_components/course-navbar";
import { CourseSidebar } from "./_components/course-sidebar";
import { getProgress } from "@/actions/get-progress";

const CourseLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: { courseId: string };
}) => {
    console.log("55555");
    console.log(params.courseId);

    const { userId } = auth();
    if (!userId) {
        return redirect("/")
    }
    console.log(userId);

    const safeProfile = await getSafeProfile();
    console.log(safeProfile);

    // if (!safeProfile) {
    //     return redirect("/");
    // }



    console.log(params.courseId);
    const course = await getCourseWithChaptersAndProgress(params.courseId, userId);



    if (!course) {
        return redirect("/");
    }

    // @ts-ignore
    const progressCount: number = await getProgress(userId, params.courseId)

    return (

        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                    currentProfile={safeProfile}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>

    )
}

export default CourseLayout