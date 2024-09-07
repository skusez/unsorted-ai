import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Fragment } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <div className="flex min-h-[100dvh]  flex-col">
        <Header />
        <main className="flex-1 mx-auto">{children}</main>
        <Footer />
      </div>
    </Fragment>
  );
}
