
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
import { LayoutDashboard, MessageSquare, GitCompareArrows, LineChart, Bot, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Extraer iniciales del usuario para el avatar
  const getInitials = () => {
    if (!user) return "U";
    const email = user.email || "";
    return email.charAt(0).toUpperCase();
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="p-4 flex items-center">
        <Avatar className="rounded-full h-8 w-8 mr-4">
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{user ? user.email : "Invitado"}</span>
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
              />
              <SidebarNavItem 
                icon={<Bot size={20} />} 
                label="IA sobre las conversaciones" 
                to="/ia-chat" 
                isActive={location.pathname === '/ia-chat'}
                disabled
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Cuenta</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarNavItem 
                  icon={<User size={20} />} 
                  label="Mi perfil" 
                  to="/perfil" 
                  isActive={location.pathname === '/perfil'} 
                />
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="flex items-center gap-3 w-full px-3 py-2 text-red-500 hover:bg-red-50"
                    onClick={() => signOut()}
                  >
                    <LogOut size={20} />
                    <span>Cerrar sesión</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
  textColor?: string;
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
          disabled && "text-muted-foreground cursor-not-allowed"
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
