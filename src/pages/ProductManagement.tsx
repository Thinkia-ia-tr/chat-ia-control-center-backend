
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import Layout from "@/components/layout/Layout";
import { ProductList } from "@/components/products/ProductList";
import { BulkAddProducts } from "@/components/products/BulkAddProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductManagement() {
  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Gestión de Productos"
          description="Administra los productos del sistema"
        />
        
        <Tabs defaultValue="list">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Lista de Productos</TabsTrigger>
            <TabsTrigger value="add">Añadir Productos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardContent className="pt-6">
                <ProductList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <BulkAddProducts />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </Layout>
  );
}
