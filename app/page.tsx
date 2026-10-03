import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingView } from "@/components/landing/landing-view";

export const metadata: Metadata = {
  title: "LMS CR | Modern LMS Solution",
  description:
    "Create, sell, and watch courses — instructor studio, Mux video, Stripe enrollment, and progress tracking in one place.",
  icons: {
    icon: "/icons/newLogo.svg",
  },
};

export default function LandingPage() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <LandingView />;
}
