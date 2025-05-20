
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type UserRole = 'super_admin' | 'admin' | 'usuario';

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredRole: UserRole;
}

export default function RoleProtectedRoute({ children, requiredRole }: RoleProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  useEffect(() => {
    // Si el usuario está autenticado pero no tiene el rol requerido
    if (user && !loading && !hasRole(requiredRole)) {
      toast.error(`Acceso denegado: Necesitas rol de ${requiredRole} para acceder a esta página`);
    }
  }, [user, loading, hasRole, requiredRole]);

  if (isChecking) {
    // Puedes mostrar un spinner o indicador de carga aquí
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!user) {
    // Redirige a la página de inicio de sesión si el usuario no está autenticado
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Verifica si el usuario tiene el rol requerido
  if (!hasRole(requiredRole)) {
    // Redirige a la página principal si no tiene los permisos necesarios
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado y tiene el rol requerido, renderiza el contenido protegido
  return <>{children}</>;
}
