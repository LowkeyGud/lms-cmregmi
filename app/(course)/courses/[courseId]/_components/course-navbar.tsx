import { NavbarRoutes } from "@/components/navbar-routes";
import { SafeProfile } from "@/types/indes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CourseNavbarProps {
  course: any;
  progressCount: number;
  currentProfile?: SafeProfile | null;
};


export const CourseNavbar = ({
  course,
  progressCount,
  currentProfile
}: CourseNavbarProps) => {

  return (

    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="outline">
            Go to dashboard
          </Button>
        </Link>
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/search`}>
          <Button variant="ghost">
            All Courses
          </Button>
        </Link>
      </div>
      <NavbarRoutes currentProfile={currentProfile} />
    </div>

  )
}