
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading state
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" replace />;
  }

  // Render the layout with the outlet for authenticated users
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
