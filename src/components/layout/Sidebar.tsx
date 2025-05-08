
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, GitCompareArrows, LineChart, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/components/auth/UserProfile";

export function Sidebar() {
  const location = useLocation();

  return (
    <SidebarComponent>
      <SidebarHeader className="p-4 flex items-center">
        <UserProfile />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chatbot con IA</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                to="/" 
                isActive={location.pathname === '/'} 
              />
              <SidebarNavItem 
                icon={<MessageSquare size={20} />} 
                label="Conversaciones" 
                to="/conversaciones" 
                isActive={location.pathname === '/conversaciones'} 
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Panel de inteligencia</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem 
                icon={<GitCompareArrows size={20} />} 
                label="Derivaciones" 
                to="/derivaciones" 
                isActive={location.pathname === '/derivaciones'} 
              />
              <SidebarNavItem 
                icon={<LineChart size={20} />} 
                label="Insights de Productos" 
                to="/insights" 
                isActive={location.pathname === '/insights'}
                disabled
              />
              <SidebarNavItem 
                icon={<Bot size={20} />} 
                label="IA chat sobre los datos" 
                to="/ia-chat" 
                isActive={location.pathname === '/ia-chat'}
                disabled
              />
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
  isActive?: boolean;
  disabled?: boolean;
}

function SidebarNavItem({ icon, label, to, isActive, disabled }: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2",
          isActive && "bg-primary text-primary-foreground font-bold",
          disabled && "text-muted-foreground cursor-not-allowed",
          !isActive && !disabled && "hover:text-white"
        )}
        aria-disabled={disabled}
      >
        <Link 
          to={disabled ? '#' : to} 
          className={cn("flex items-center gap-3 w-full")}
          onClick={(e) => disabled && e.preventDefault()}
        >
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default Sidebar;
