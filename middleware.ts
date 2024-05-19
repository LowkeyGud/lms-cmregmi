import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoute = createRouteMatcher(["/"]);
const publicRoute = createRouteMatcher(["/api/webhook"]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();
  if (publicRoute(req)) return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
