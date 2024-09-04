import { WalletIcon, DatabaseIcon, AwardIcon } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: WalletIcon,
    title: "Connect Your Wallet",
    description:
      "Link your cryptocurrency wallet to our platform to start earning rewards.",
  },
  {
    icon: DatabaseIcon,
    title: "Contribute Your Data",
    description: "Securely share your data and help advance AI research.",
  },
  {
    icon: AwardIcon,
    title: "Earn Rewards",
    description: "Get paid in cryptocurrency for your valuable contributions.",
  },
];

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Contribute Your Data, Earn Rewards
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our decentralized platform allows you to securely contribute your
            data and earn rewards in cryptocurrency. Your privacy is our top
            priority.
          </p>
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </Link>
        </div>
        <div className="grid gap-6">
          {features.map((feature, index) => (
            <div key={index} className="grid gap-2 rounded-xl bg-muted p-6">
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
