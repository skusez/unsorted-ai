import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./sidebar/Sidebar";
import { SidebarContextProvider } from "./sidebar/sidebar-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <div className="flex flex-1">
        <SidebarContextProvider>
          <Sidebar>
            {/* <Separator /> */}
            <main className="flex-1 p-4 sm:p-6 w-full overflow-x-hidden">
              {children}
            </main>
          </Sidebar>
        </SidebarContextProvider>
      </div>
    </div>
  );
}
