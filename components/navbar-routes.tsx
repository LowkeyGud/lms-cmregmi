"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { SafeProfile } from "@/types/indes";
import { SliderToggle } from "./ui/toggle-mode";
import { useState } from "react";

interface NavbarRoutesProps {
  currentProfile?: SafeProfile | null
}

export const NavbarRoutes: React.FC<NavbarRoutesProps> = ({
  currentProfile
}) => {

  const pathname = usePathname();
  const [selected, setSelected] = useState("light");

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapters");
  const isSearchPage = pathname === "/search";
  const isTeacher = currentProfile?.role === "ADMIN" || currentProfile?.role === "TEACHER";
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        <SliderToggle />
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
