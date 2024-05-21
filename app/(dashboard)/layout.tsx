import { Metadata } from "next";
import React from "react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  title: "LMS CR | Dashboard",
  description: "Modern LMS Solution",
  icons: {
    icon: "/icons/newLogo.svg"
  }
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50 dark:bg-gray-900">
        <Navbar />
      </div>

      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 dark:bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-screen dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
