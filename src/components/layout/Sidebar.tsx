
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { LayoutDashboard, MessageSquare, GitCompareArrows, LineChart, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <SidebarComponent>
      <SidebarHeader className="p-4 flex items-center">
        <Avatar className="rounded-full h-8 w-8 mr-4">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="font-medium">Username</span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" />
              <SidebarNavItem icon={<MessageSquare size={20} />} label="Conversaciones" to="/conversaciones" />
              <SidebarNavItem icon={<GitCompareArrows size={20} />} label="Derivaciones" to="/derivaciones" />
              <SidebarNavItem icon={<LineChart size={20} />} label="Insights de Productos" to="/insights" />
              <SidebarNavItem icon={<Bot size={20} />} label="IA chat sobre los datos" to="/ia-chat" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

function SidebarNavItem({ icon, label, to }: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="flex items-center gap-3 w-full px-3 py-2">
        <Link to={to} className={cn("hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md flex items-center gap-3 w-full")}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default Sidebar;
