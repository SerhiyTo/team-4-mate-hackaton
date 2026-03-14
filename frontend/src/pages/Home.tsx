import {
  ArrowRight,
  ImageIcon,
  Shirt,
  ShoppingBag,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "../assets/landing-img.png";
import landingImg2 from "../assets/landing-img-2.png";
import underline from "../assets/underline.png";
import { cn } from "@/lib/utils";

export function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-4 lg:px-6">
        <Link to="/" className="text-xl font-semibold text-neutral-900">
          Try on AI
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/#about"
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            About
          </Link>
          <Link
            to="/#features"
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Features
          </Link>
          <Link
            to="/#how-it-works"
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            How it works
          </Link>
        </nav>
        <Link
          to="/#try"
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800",
          )}
        >
          Get started
        </Link>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-8 px-3 pb-16 pt-8 lg:grid-cols-2 lg:gap-12 lg:px-6 lg:pt-16">
        <div className="flex flex-col gap-6">
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1.5 text-sm text-violet-900">
            <Sparkles className="size-4" aria-hidden />
            <span>AI-Powered Virtual Fitting Room</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight text-neutral-900 lg:text-5xl xl:text-6xl">
            Clothes that fit
            <br />
            <span className="relative inline-block">your actual body</span>
            <img src={underline} className="block ml-10" />
          </h1>

          {/* Description */}
          <p className="max-w-md text-lg text-neutral-500">
            See how clothes look on your personalized avatar. Perfect fit
            guaranteed, every time. No more returns, no more guesswork.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/#try"
              className={cn(
                "inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-neutral-800",
              )}
            >
              Try it now
            </Link>
            <Link
              to="/#how-it-works"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50",
              )}
            >
              See how it works
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <img
            src={heroImg}
            alt="Person using smartphone with virtual fitting"
            className="max-h-120 w-full object-contain object-center lg:max-h-140 lg:object-right"
          />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-neutral-50 px-3 py-16 lg:px-6 lg:py-24"
      >
        <div className="">
          {/* Tag */}
          <div className="inline-flex w-fit items-center rounded-full bg-violet-100 px-3 py-1.5 text-sm text-violet-900 ml-6">
            Features
          </div>

          {/* Title + description row */}
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <h2 className="text-4xl font-bold leading-tight text-violet-950 lg:text-5xl ml-6">
              One Platform,
              <br />
              <span className="relative inline-block">
                Infinite Possibilities
                <svg
                  className="absolute -bottom-1 left-0 w-full text-violet-600"
                  viewBox="0 0 200 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M0 6 Q50 0 100 6 T200 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="max-w-md text-lg text-neutral-500 lg:mt-0 lg:max-w-sm">
              Whether you're shopping, our AI fitting room transforms the online
              fashion experience.
            </p>
          </div>

          {/* Cards grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-500">B2C Solution</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                Shop with Confidence
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Create your personalized avatar based on your exact measurements.
                See how any outfit looks on your body type before purchasing.
              </p>
            </article>

            <article className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-500">B2B Solution</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                Cut Content Costs
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Eliminate expensive photoshoots. Generate unlimited product
                visuals with AI models customized to represent your diverse
                customer base.
              </p>
            </article>

            <article className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-500">Precision Fit</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                Custom Body Parameters
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Advanced algorithms analyze height, weight, body shape, and
                proportions to generate your unique avatar with millimeter
                accuracy.
              </p>
            </article>

            <article className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-500">Instant Results</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                Real-Time Visualization
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                See results in seconds. Mix and match outfits, try different
                sizes, and find your perfect fit without the wait.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-white px-3 py-16 lg:px-6 lg:py-24"
      >
        <div className="">
          {/* Tag */}
          <div className="inline-flex w-fit items-center rounded-full bg-violet-600 px-3 py-1.5 text-sm font-medium text-white ml-6">
            How it works
          </div>

          {/* Title */}
          <h2 className="mt-6 text-4xl font-bold leading-tight text-violet-950 lg:text-5xl ml-6">
            Simple & Seamless
            <br />
            <span className="relative inline-block">
              In 4 Easy Steps
              <svg
                className="absolute -bottom-1 left-0 w-full text-violet-600"
                viewBox="0 0 200 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M0 6 Q50 0 100 6 T200 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Steps grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <article className="relative rounded-xl bg-neutral-100 p-6">
              <span className="absolute right-4 top-4 text-sm font-medium text-neutral-400">
                01
              </span>
              <div className="flex size-12 items-center justify-center rounded-lg bg-violet-600 text-white">
                <UserPlus className="size-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Create your profile
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Enter your measurements: height, weight, body type, and key
                dimensions. Our AI processes this data securely.
              </p>
            </article>

            <article className="relative rounded-xl bg-neutral-100 p-6">
              <span className="absolute right-4 top-4 text-sm font-medium text-neutral-400">
                02
              </span>
              <div className="flex size-12 items-center justify-center rounded-lg bg-violet-600 text-white">
                <ImageIcon className="size-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Generate Your Avatar
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Watch as our AI creates a photorealistic 3D avatar that
                accurately represents your unique body proportions.
              </p>
            </article>

            <article className="relative rounded-xl bg-neutral-100 p-6">
              <span className="absolute right-4 top-4 text-sm font-medium text-neutral-400">
                03
              </span>
              <div className="flex size-12 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Shirt className="size-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Try On Clothes
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Browse any product and see it instantly appear on your avatar.
                Rotate, zoom, and view from every angle.
              </p>
            </article>

            <article className="relative rounded-xl bg-neutral-100 p-6">
              <span className="absolute right-4 top-4 text-sm font-medium text-neutral-400">
                04
              </span>
              <div className="flex size-12 items-center justify-center rounded-lg bg-violet-600 text-white">
                <ShoppingBag className="size-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Shop with Confidence
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Order items knowing exactly how they'll fit. Say goodbye to
                returns and hello to perfect fits every time.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section id="try" className="px-3 py-16 lg:px-6 lg:py-24">
        <div className="">
          <div className="overflow-hidden rounded-2xl bg-neutral-100 p-8 lg:p-12 pb-0 lg:pb-0 bg-white">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl">
                  Ready to Transform Your Shopping Experience?
                </h2>
                <p className="max-w-lg text-lg text-neutral-600">
                  Join thousands of customers and businesses already using AI
                  fitting rooms.
                </p>
                <Link
                  to="/demo"
                  className={cn(
                    "inline-flex w-fit items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-800"
                  )}
                >
                  Get started free
                </Link>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <img
                  src={landingImg2}
                  alt="Person with shopping bags"
                  className="max-h-96 translate-y-13 w-full object-contain object-center lg:max-h-96 lg:object-right"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-3 py-8 lg:px-6">
        <div className="rounded-2xl bg-white px-4 py-6 shadow-sm lg:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link to="/" className="text-lg font-bold text-neutral-900">
              Logo
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                to="/#about"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                About
              </Link>
              <Link
                to="/#features"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Features
              </Link>
              <Link
                to="/#how-it-works"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                How it works
              </Link>
            </nav>
            <p className="text-sm text-neutral-500">
              © 2026 Logo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
