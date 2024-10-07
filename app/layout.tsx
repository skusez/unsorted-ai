import Web3Provider from "@/lib/providers/Web3Provider";
import { cn } from "@/lib/utils";
import { wagmiConfig } from "@/utils/web3/wagmi-config";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "./globals.css";
// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Syne } from "next/font/google";
import { Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Unsorted AI",
  description:
    "Contribute your data and earn rewards through our secure, blockchain-powered platform.",
};

const fontHeading = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialState;

  try {
    initialState = cookieToInitialState(wagmiConfig, headers().get("cookie"));
  } catch (error) {
    console.error(error);
  }

  return (
    <html
      lang="en"
      className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      suppressHydrationWarning
    >
      <Web3Provider initialState={initialState}>
        <body className="bg-background text-foreground font-sans">
          {children}
          <Toaster />
        </body>
      </Web3Provider>
    </html>
  );
}
