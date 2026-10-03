"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Lock,
  PenSquare,
  PlayCircle,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SliderToggle } from "@/components/ui/toggle-mode";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1600&auto=format&fit=crop";
const STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop";

const features = [
  {
    icon: PlayCircle,
    title: "Gated course player",
    text: "Mux video, attachments, and completion tracking. Unpaid chapters stay locked until checkout completes.",
  },
  {
    icon: CreditCard,
    title: "Stripe enrollment",
    text: "Checkout sessions reconciled by webhook into exactly one purchase — no double-fulfillment on retries.",
  },
  {
    icon: PenSquare,
    title: "Instructor studio",
    text: "Author courses with drag-reorderable chapters, Mux uploads, attachments, and one-click publish.",
  },
  {
    icon: BarChart3,
    title: "Search & analytics",
    text: "Learners find courses by category; instructors measure revenue and completion with live charts.",
  },
];

const steps = [
  {
    icon: Search,
    title: "Browse the catalog",
    text: "Search courses by title or category and preview the curriculum before you commit.",
  },
  {
    icon: CreditCard,
    title: "Enroll in seconds",
    text: "Pay once through Stripe Checkout. Your purchase unlocks every chapter instantly.",
  },
  {
    icon: PlayCircle,
    title: "Watch & progress",
    text: "Stream lessons, download attachments, and toggle completion as your progress bar climbs.",
  },
];

export const LandingView = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="LMS CR logo"
              width={32}
              height={32}
            />
            <span className="text-lg font-bold tracking-tight">LMS CR</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <SliderToggle />
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">
                  Get started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm">
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  Open dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent dark:from-violet-600/20" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 md:grid-cols-2 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Instructor studio · Mux video · Stripe enrollment
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Sell courses without rebuilding the{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                classroom
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              LMS CR bundles authoring, video hosting, payments, and progress
              tracking into one modern marketplace — so instructors publish
              faster and learners keep watching.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SignedOut>
                <Link href="/sign-up">
                  <Button size="lg">
                    Start learning free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Go to dashboard
                  </Button>
                </Link>
              </SignedIn>
              <a href="#how-it-works">
                <Button size="lg" variant="outline">
                  See how it works
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <p className="text-xl font-bold text-foreground">9</p>
                <p>data models</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xl font-bold text-foreground">1-click</p>
                <p>Stripe checkout</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xl font-bold text-foreground">Locked</p>
                <p>chapter gating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border shadow-2xl">
              <Image
                src={HERO_IMAGE}
                alt="Student learning online"
                width={1280}
                height={800}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-6 md:-left-8"
            >
              <Card className="shadow-lg">
                <CardContent className="flex items-center gap-2 p-3 text-sm">
                  <PlayCircle className="h-5 w-5 text-violet-600" />
                  <span className="font-medium">Mux video · 87% watched</span>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 bottom-6 md:-right-8"
            >
              <Card className="shadow-lg">
                <CardContent className="flex items-center gap-2 p-3 text-sm">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Checkout unlocks chapters</span>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6 text-sm font-semibold text-muted-foreground">
          <span>Stripe</span>
          <span>Mux</span>
          <span>UploadThing</span>
          <span>Clerk</span>
          <span>MongoDB</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Badge variant="outline" className="mb-3">
          Why LMS CR
        </Badge>
        <h2 className="max-w-xl text-3xl font-bold tracking-tight">
          Everything a course marketplace needs, wired together
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Authoring, video, files, payments, fulfillment, progress, and
          analytics — one system where a double-charged webhook or an unlocked
          paid chapter never happens.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t bg-muted/40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
          <div className="overflow-hidden rounded-2xl border shadow-xl">
            <Image
              src={STUDIO_IMAGE}
              alt="Learners collaborating on a course"
              width={1280}
              height={800}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
          </div>
          <div>
            <Badge variant="outline" className="mb-3">
              How it works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              From browse to progress in three steps
            </h2>
            <div className="mt-8 space-y-6">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <step.icon className="h-4 w-4 text-violet-600" />
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA + footer */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-12 text-center text-white shadow-xl md:py-16">
          <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight">
            Ready to teach — or start learning?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Create your first course with drag-and-drop chapters, or enroll in
            one and watch your progress climb.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" variant="secondary">
                  Create free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Sign in
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Open dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="LMS CR logo"
              width={24}
              height={24}
            />
            <span className="font-semibold text-foreground">LMS CR</span>
            <span>· Modern LMS Solution</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/sign-up" className="transition-colors hover:text-foreground">
              Sign up
            </Link>
            <Link href="/sign-in" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
};
