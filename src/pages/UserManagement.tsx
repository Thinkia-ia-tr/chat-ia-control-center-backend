
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { UsersList } from "@/components/users/UsersList";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

const UserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const copyRegistrationLink = () => {
    const registrationUrl = `${window.location.origin}/auth/register`;
    navigator.clipboard.writeText(registrationUrl)
      .then(() => {
        toast.success("Enlace copiado al portapapeles");
      })
      .catch(() => {
        toast.error("No se pudo copiar el enlace");
      });
  };
  
  return (
    <Layout>
      <PageContainer>
        <div className="flex justify-between items-center">
          <PageHeader
            title="Gestión de Usuarios"
            description="Administra los usuarios y sus roles en el sistema"
          />
          <Button 
            className="flex items-center gap-2" 
            onClick={copyRegistrationLink}
          >
            <Copy size={16} />
            <span>Invitar a registrarse</span>
          </Button>
        </div>
        
        <div className="mt-6">
          <UsersList />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default UserManagement;
