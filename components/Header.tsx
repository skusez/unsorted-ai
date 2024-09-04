import { BrainIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="px-4 md:px-6 h-14 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center">
        <BrainIcon className="h-6 w-6 text-primary" />
        <span className="sr-only">Decentralized AI Research</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {["About", "Contribute", "Rewards", "Team"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium hover:underline underline-offset-4 "
          >
            {item}
          </Link>
        ))}
        <Button size="sm">Connect Wallet</Button>
      </nav>
    </header>
  );
}
