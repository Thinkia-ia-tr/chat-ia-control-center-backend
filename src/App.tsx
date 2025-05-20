
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Conversations from "./pages/Conversations";
import ConversationDetail from "./pages/ConversationDetail";
import Referrals from "./pages/Referrals";
import ProductInsights from "./pages/ProductInsights";
import ProductManagement from "./pages/ProductManagement";
import UserManagement from "./pages/UserManagement";
import AIChat from "./pages/AIChat";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import { useReferralEmails } from "./hooks/useReferralEmails";

const queryClient = new QueryClient();

const App = () => {
  // Hook para suscribirse a nuevas referencias
  useReferralEmails();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Rutas de autenticación - públicas */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* Rutas protegidas - requieren autenticación básica (cualquier rol puede acceder) */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/conversaciones" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
              <Route path="/conversaciones/:id" element={<ProtectedRoute><ConversationDetail /></ProtectedRoute>} />
              <Route path="/derivaciones" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
              <Route path="/insights" element={<ProtectedRoute><ProductInsights /></ProtectedRoute>} />
              
              {/* Rutas que requieren rol de administrador o superior */}
              <Route path="/productos" element={
                <RoleProtectedRoute requiredRole="admin">
                  <ProductManagement />
                </RoleProtectedRoute>
              } />
              
              <Route path="/usuarios" element={
                <RoleProtectedRoute requiredRole="admin">
                  <UserManagement />
                </RoleProtectedRoute>
              } />
              
              {/* Rutas que requieren rol de super administrador */}
              <Route path="/ia-chat" element={
                <RoleProtectedRoute requiredRole="super_admin">
                  <AIChat />
                </RoleProtectedRoute>
              } />
              
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Redirección a login y página no encontrada */}
              <Route path="/auth" element={<Navigate to="/auth/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
