
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { UsersList } from "@/components/users/UsersList";
import Layout from "@/components/layout/Layout";
import CreateInvitation from "@/components/invitations/CreateInvitation";

const UserManagement = () => {
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
        
        <div className="mt-6">
          <UsersList />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default UserManagement;
