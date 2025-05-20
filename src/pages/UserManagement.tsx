
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { UsersList } from "@/components/users/UsersList";
import Layout from "@/components/layout/Layout";
import CreateInvitation from "@/components/invitations/CreateInvitation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const UserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Layout>
      <PageContainer>
        <div className="flex justify-between items-center">
          <PageHeader
            title="Gestión de Usuarios"
            description="Administra los usuarios y sus roles en el sistema"
          />
          <CreateInvitation />
        </div>
        
        <Alert className="my-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Las invitaciones generan un enlace que debes compartir con el usuario. No se envían correos automáticamente.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6">
          <UsersList />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default UserManagement;
