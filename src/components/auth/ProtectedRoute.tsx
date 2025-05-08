
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (isChecking) {
    // Puedes mostrar un spinner o indicador de carga aquí
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!user) {
    // Redirige a la página de inicio de sesión si el usuario no está autenticado
    // y guarda la ubicación actual para redirigir después del inicio de sesión
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Si el usuario está autenticado, renderiza el contenido protegido
  return <>{children}</>;
}
