import Link from "next/link";
import { Progress } from "../../components/ui/progress";

export default function CurrentResearch() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="grid gap-6">
          <div className="grid gap-2 rounded-xl bg-background p-6">
            <div className="flex items-center gap-4">
              <img
                src="/placeholder.svg"
                alt="Event Image"
                width={64}
                height={64}
                className="rounded-full"
                style={{ aspectRatio: "64/64", objectFit: "cover" }}
              />
              <div>
                <h3 className="text-xl font-bold">Current Research Event</h3>
                <p className="text-muted-foreground">
                  Help advance AI research by contributing your data.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Progress
                  value={75}
                  aria-label="Research participation progress"
                />
              </div>
              <div className="text-primary font-bold">75% APR</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Revolutionizing AI Research
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our decentralized platform is transforming the way AI research is
            conducted, empowering individuals to contribute and earn.
          </p>
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
