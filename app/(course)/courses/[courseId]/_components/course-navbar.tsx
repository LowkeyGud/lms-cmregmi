import { NavbarRoutes } from "@/components/navbar-routes";
import { SafeProfile } from "@/types/indes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

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

      <div className="p-4 border-b h-full flex items-center  shadow-sm">
        <CourseMobileSidebar
          course={course}
          progressCount={progressCount}
        />
        <NavbarRoutes currentProfile={currentProfile} />      
      </div>

  )
}