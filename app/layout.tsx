import { Afacad, Comfortaa } from "next/font/google";
import { wagmiConfig } from "@/utils/web3/wagmi-config";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import AppKitProvider from "@/lib/providers/AppKitProvider";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/utils/cn";

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
    wagmiConfig,
    headers().get("cookie")
  );
  return (
    <html
      lang="en"
      className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans">
        <AppKitProvider initialState={initialState}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-[100dvh] flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
