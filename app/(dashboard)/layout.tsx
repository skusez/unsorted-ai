import { Separator } from "@/components/ui/separator";
import { Header } from "./Header";
import { Sidebar } from "./sidebar/Sidebar";
import { SidebarContextProvider } from "./sidebar/sidebar-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <SidebarContextProvider>
        <Sidebar>
          <Header />
          <Separator />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </Sidebar>
      </SidebarContextProvider>
    </div>
  );
}
