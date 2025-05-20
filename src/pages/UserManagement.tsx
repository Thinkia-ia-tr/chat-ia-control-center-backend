
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { UsersList } from "@/components/users/UsersList";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const UserManagement = () => {
  return (
    <Layout>
      <PageContainer>
        <div className="flex justify-between items-center">
          <PageHeader
            title="Gestión de Usuarios"
            description="Administra los usuarios y sus roles en el sistema"
          />
          <Button variant="default">
            <UserPlus className="mr-2 h-4 w-4" />
            Invitar Usuario
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
