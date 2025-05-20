
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type UserRole = 'super_admin' | 'admin' | 'usuario';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signUp: (email: string, password: string, username?: string) => Promise<{
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  hasRole: (requiredRole: UserRole) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  // Función para obtener el rol del usuario desde Supabase
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_role', {
        _user_id: userId
      });
      
      if (error) {
        console.error('Error al obtener el rol del usuario:', error);
        return;
      }
      
      setUserRole(data as UserRole);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Usamos setTimeout para evitar problemas de bloqueo con Supabase
          setTimeout(() => {
            fetchUserRole(currentSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRole(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        navigate('/');
      }
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { 
          data: { username } 
        } 
      });
      if (!error) {
        // No redirecting on signup as user needs to verify email first
        // or we could add a verification required page here
      }
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };
  
  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole: UserRole): boolean => {
    if (!userRole) return false;
    
    // Lógica de jerarquía de roles
    switch (requiredRole) {
      case 'usuario':
        // Cualquier rol puede acceder a funciones de 'usuario'
        return true;
      case 'admin':
        // Solo 'admin' y 'super_admin' pueden acceder a funciones de 'admin'
        return userRole === 'admin' || userRole === 'super_admin';
      case 'super_admin':
        // Solo 'super_admin' puede acceder a funciones de 'super_admin'
        return userRole === 'super_admin';
      default:
        return false;
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
