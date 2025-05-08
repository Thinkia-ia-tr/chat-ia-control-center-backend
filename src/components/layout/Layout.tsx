
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1">
          <div className="p-6 overflow-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
