import { BrainIcon } from "lucide-react";
import Link from "next/link";
import UserMenu from "./UserMenu";

const links = [
  { name: "About", href: "#about" },
  { name: "Contribute", href: "#contribute" },
  { name: "Rewards", href: "#rewards" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Header() {
  return (
    <header className="px-4 md:px-6 h-14 flex items-center justify-between bg-background border-b">
      <Link href="/" className="flex items-center justify-center">
        <BrainIcon className="h-6 w-6 text-primary" />
        <span className="sr-only">Decentralized AI Research</span>
      </Link>
      <nav className="flex items-center space-x-4">
        {links.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            {item.name}
          </Link>
        ))}
        <UserMenu />
      </nav>
    </header>
  );
}
