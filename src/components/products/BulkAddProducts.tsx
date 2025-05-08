
import { useState } from "react";
import { useProductManagement } from "@/hooks/useProductManagement";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export function BulkAddProducts() {
  const [productNames, setProductNames] = useState("");
  const [results, setResults] = useState<{ name: string; added: boolean; reason?: string }[]>([]);
  const { bulkAddProducts } = useProductManagement();

  const handleAddProducts = async () => {
    const nameList = productNames
      .split("\n")
      .filter(name => name.trim().length > 0);
    
    if (nameList.length === 0) return;
    
    const response = await bulkAddProducts.mutateAsync(nameList);
    setResults(response);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Productos en Masa</CardTitle>
        <CardDescription>
          Ingresa un producto por línea. Se verificarán duplicados automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Ingresa nombres de productos (uno por línea)"
          value={productNames}
          onChange={(e) => setProductNames(e.target.value)}
          rows={10}
          className="mb-4"
        />

        {results.length > 0 && (
          <div className="border rounded-md p-4 mt-4 max-h-60 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Resultados:</h4>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between text-sm border-b pb-1">
                  <span className="truncate max-w-[60%]">{result.name}</span>
                  <Badge 
                    variant={result.added ? "default" : "destructive"} 
                    className={result.added ? "bg-green-600" : ""}
                  >
                    {result.added ? (
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                    )}
                    {result.added ? "Agregado" : result.reason}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAddProducts}
          disabled={bulkAddProducts.isPending || productNames.trim().length === 0}
        >
          {bulkAddProducts.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Agregar Productos
        </Button>
      </CardFooter>
    </Card>
  );
}
