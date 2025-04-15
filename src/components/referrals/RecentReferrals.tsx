
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

// Define the type for referral data
interface ReferralData {
  id: number;
  type: string;
  client: string;
  status: string;
  date: string;
}

// Ejemplo de datos para la tabla
const generateMockReferrals = () => {
  const types = ["Asesor Comercial", "Atención al Cliente", "Soporte Técnico", "Presupuestos", "Colaboraciones"];
  const statuses = ["Pendiente", "En Proceso", "Completada"];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    client: `Cliente ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'dd/MM/yyyy HH:mm', { locale: es }),
  }));
};

const mockReferrals = generateMockReferrals();

const columns = [
  {
    header: "Cliente",
    accessorKey: "client",
  },
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }: { row: { original: ReferralData } }) => (
      <span className="font-medium">{row.original.type}</span>
    ),
  },
  {
    header: "Estado",
    accessorKey: "status",
    cell: ({ row }: { row: { original: ReferralData } }) => {
      const status = row.original.status;
      let color = "bg-yellow-500";
      if (status === "Completada") color = "bg-green-500";
      else if (status === "En Proceso") color = "bg-blue-500";
      
      return (
        <Badge variant="outline" className="font-medium">
          <div className={`w-2 h-2 rounded-full ${color} mr-2`} />
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Fecha",
    accessorKey: "date",
  },
];

interface RecentReferralsProps {
  selectedType?: string;
}

export function RecentReferrals({ selectedType }: RecentReferralsProps) {
  const filteredReferrals = selectedType
    ? mockReferrals.filter(ref => ref.type === selectedType)
    : mockReferrals;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Últimas Derivaciones</h2>
      <DataTable
        columns={columns}
        data={filteredReferrals}
      />
    </div>
  );
}
