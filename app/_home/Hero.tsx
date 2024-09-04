import Link from "next/link";

import styles from "./styles/Home.module.css";
import { Button } from "../../components/ui/button";
import { lazy, Suspense } from "react";

const Particles = lazy(() => import("./ParticleDonut"));

export default function Hero() {
  return (
    <section className={`w-full py-12 md:py-24 relative lg:py-32 xl:py-48 `}>
      <div className="container z-10 px-4 md:px-6 flex flex-col items-center justify-center text-center ">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            AI Models Powered by You
          </h1>
          <p className="max-w-[700px] text-lg md:text-xl">
            Contribute your data and earn rewards through our secure,
            blockchain-powered platform.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 min-[400px]:flex-row">
          <Button size="lg" className="w-full min-[400px]:w-auto">
            Get Started
          </Button>
          <Link
            href="#about"
            className="inline-flex h-12 items-center justify-center rounded-md border border-primary px-8 text-sm font-medium  shadow-sm transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
          >
            Learn More
          </Link>
        </div>
      </div>
      <Suspense fallback={<div></div>}>
        <Particles />
      </Suspense>
    </section>
  );
}
