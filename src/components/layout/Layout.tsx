
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex">
          <div className="hidden md:block w-[var(--sidebar-width)]"></div>
          <main className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
