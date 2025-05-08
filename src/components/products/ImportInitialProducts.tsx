
import { useEffect, useState } from "react";
import { useProductManagement } from "@/hooks/useProductManagement";
import { useToast } from "@/components/ui/use-toast";

// Lista de productos a importar
const productList = [
  "Máquina multifunción Multigym 300 PRO",
  "Máquina multifunción Multigym 400 PRO",
  "Discos de Pesas con Asa",
  "Multipower Rack 600",
  "Máquina multifunción Multigym 550 PRO",
  "Cinta de correr Treadmill Force Vibrator 480",
  "Máquina multifunción Multigym 400",
  "Máquina multifunción Multigym 450 PRO",
  "Cinta de Correr Treadmill Force 480 Pro",
  "Máquina multifunción Multigym 500",
  "Smart Bike Pro 8000",
  "Máquina de remo Air Smart Rower",
  "Cinta de andar Ultra Step",
  "Cinta de andar Power Step",
  "Cinta de correr Treadmill Force Vibrator 580",
  "Cinta de Correr Treadmill Force 350 Pro",
  "Smart Bike Advance 4000",
  "Cinta de correr Treadmill Force 550",
  "Tabla de paddle surf Be Wave Artic 10.6",
  "Cinta de andar Treadmill Slim 4000",
  "Cinta de Correr Treadmill Competition 4600",
  "Cinta de Correr Treadmill Force 550 PRO",
  "Ciclo Indoor Sprint 2000",
  "Máquina de Remo Rower Dynamic",
  "Tablas de Paddle Surf Be Wave Carbon",
  "Ciclo Indoor Sprint 2000",
  "Tabla de paddle surf Be Wave Caribbean 10.6",
  "Máquina multifunción Multigym 300",
  "Máquina de esquí Air Ski Xtreme",
  "Tabla de Paddle Surf Be Wave Oasis 10",
  "Elliptical Summit 1400",
  "Hex Dumbbells",
  "Cinta de Correr Treadmill Tempo 4200",
  "Multipower Rack Smith 500",
  "Bicicleta estática Air Bike Fit Pro",
  "Multipower Rack 600",
  "Smart Bike Nitro 6000",
  "Smart Bike Titan 7000",
  "Cinta de Correr Treadmill Runner 4300",
  "Asiento de Kayak Be Wave",
  "Máquina de Remo Rower Endurance Pro",
  "Ciclo Indoor Fit 1000",
  "Máquina de Esquí Air Ski Xtreme & Bicicleta Air Bike Fit Pro",
  "Cinta de correr Treadmill Force 350",
  "Pinzas para Barra de Musculación de 50 mm",
  "Máquina Multifunción Multigym 650 PRO",
  "Ciclo Indoor Fit 1000",
  "Elliptical Ascend 1800",
  "Smart Bike Titan 7000",
  "Barra de Musculación Olímpica 1,8 Metros",
  "Pack Multigym 400 PRO & Smart Bike Advance 4000",
  "Multipower Rack 400",
  "Cinta de Correr Treadmill Active 4100",
  "Smart Bike Nitro 6000",
  "Elliptical Elevate 1000",
  "Máquina de Esquí Air Ski Xtreme & Máquina de remo Air Smart Rower",
  "Banco de pesas Steel Training Bench",
  "Máquina de remo Air Smart Rower",
  "Smart Bike Premium 5000",
  "Smart Bike Advance 4000",
  "Tabla de Paddle Surf Be Wave Atlantic 11",
  "Elliptical Elevate 1000",
  "Smart Bike Pro 8000",
  "Leg Press",
  "Banco de pesas Iron Bench",
  "Máquina de remo Air Smart Rower + Bicicleta estática Air Bike Fit Pro",
  "Barra Olímpica de Musculación de 2 Metros",
  "Tabla de paddle surf Be Wave Dark 10",
  "kayak hinchable be wave kayak 10.8",
  "Strength Tower 100",
  "Mochila impermeable 10L Be Wave",
  "Chaleco Salvavidas Safety Be Wave",
  "Tabla de surf be wave 5.8",
  "Máquina de Remo Rower Dynamic",
  "Tabla Windsurf 10.6 PRO",
  "Banco de pesas Iron Bench + Pesa rusa 9kg",
  "Barra Z de musculación de 1.2 m",
  "Pack Tabla windsurf 10.6 PRO + Vela 5 metros",
  "Tabla Windsurf Be Wave 10.6",
  "Mochila Nomad 90L",
  "Pesa Rusa Kettlebell 9kg",
  "Mochila Nomad 90L",
  "Bicicleta Indoor Air Bike Speed",
  "Tabla de Paddle Surf Be Wave Life 10.8",
  "Multipower Rack Smith 500",
  "Máquina de esquí Air Ski Xtreme",
  "Elliptical Summit 1400",
  "Pack Remo Air Smart Rower & Bicicleta Air Bike Fit Pro & Air Ski Xtreme",
  "Pack de Tabla de Windsurf Be Wave 10.6 Pro + Vela de 3 M",
  "Strength Tower 100",
  "Banco de peso Steel Training Bench",
  "Tabla de paddle surf Be Wave Mediterranean 10",
  "Bomba manual doble acción Be Wave",
  "Tabla windsurf + vela Be Wave 4m",
  "Banco de pesas Titanium Bench",
  "Pack Multigym 450 PRO & Rower Dynamic",
  "Multipower Rack Smith 700",
  "Vela windsurf Be Wave 4m",
  "Pala Paddle Surf Ajustable Full Carbon",
  "Multipower Rack Smith 800",
  "Cometa wing foil be wave 4.0",
  "Pesa Rusa Kettlebell 18kg",
  "Elliptical Ascend 1800"
];

export function ImportInitialProducts() {
  const { bulkAddProducts, getProducts } = useProductManagement();
  const { toast } = useToast();
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    const importProducts = async () => {
      if (hasRun) return;
      
      try {
        // Eliminar duplicados de la lista antes de procesar
        const uniqueProducts = [...new Set(productList)];
        console.log(`Preparando para importar ${uniqueProducts.length} productos únicos`);
        
        const results = await bulkAddProducts.mutateAsync(uniqueProducts);
        
        // Contar productos añadidos y duplicados
        const added = results.filter(r => r.added).length;
        const duplicates = results.filter(r => !r.added && r.reason === "Ya existe").length;
        
        toast({
          title: "Importación completada",
          description: `${added} productos añadidos. ${duplicates} productos ya existían en la base de datos.`,
          duration: 5000,
        });
        
      } catch (error) {
        console.error("Error al importar productos:", error);
        toast({
          title: "Error de importación",
          description: "No se pudieron importar todos los productos.",
          variant: "destructive",
        });
      }
      
      setHasRun(true);
    };

    // Solo ejecutar si hay productos que importar
    if (productList.length > 0 && !hasRun) {
      importProducts();
    }
  }, [bulkAddProducts, hasRun, toast]);

  // Componente invisible
  return null;
}
