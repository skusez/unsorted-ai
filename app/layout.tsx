import AppKitProvider from "@/lib/providers/AppKitProvider";
import { cn } from "@/lib/utils";
import { getWagmiConfig } from "@/utils/web3/wagmi-config";
import { ThemeProvider } from "next-themes";
import { Afacad, Comfortaa } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Decentralized AI Research",
  description:
    "Contribute your data and earn rewards through our secure, blockchain-powered platform.",
};

const fontHeading = Afacad({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(
    getWagmiConfig(),
    headers().get("cookie")
  );
  return (
    <html
      lang="en"
      className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      suppressHydrationWarning
    >
      <AppKitProvider initialState={initialState}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body className="bg-background text-foreground font-sans">
            {children}
          </body>
        </ThemeProvider>
      </AppKitProvider>
    </html>
  );
}
