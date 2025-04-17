
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatsData {
  totalConversations: number;
  totalMessages: number;
  conversationsData: Array<{ date: string; value: number }>;
  messagesData: Array<{ date: string; value: number }>;
}

export function useStats(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['stats', startDate, endDate],
    queryFn: async (): Promise<StatsData> => {
      // Aseguramos que las fechas de fin incluyan todo el día
      let adjustedEndDate;
      if (endDate) {
        adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);
      }

      // Consulta para contar conversaciones
      let conversationsQuery = supabase
        .from('conversations')
        .select('id', { count: 'exact' });
      
      // Consulta para contar mensajes
      let messagesQuery = supabase
        .from('messages')
        .select('id', { count: 'exact' });
      
      // Aplicar filtro de fechas si se proporcionan
      if (startDate && endDate) {
        conversationsQuery = conversationsQuery
          .gte('date', startDate.toISOString())
          .lte('date', adjustedEndDate?.toISOString() || '');
        
        messagesQuery = messagesQuery
          .gte('timestamp', startDate.toISOString())
          .lte('timestamp', adjustedEndDate?.toISOString() || '');
      }
      
      // Ejecutar consultas en paralelo
      const [conversationsResult, messagesResult] = await Promise.all([
        conversationsQuery,
        messagesQuery
      ]);
      
      // Manejar errores
      if (conversationsResult.error) throw conversationsResult.error;
      if (messagesResult.error) throw messagesResult.error;
      
      // Generar datos para gráficos (por día)
      const conversationsData = await generateTimeSeriesData('conversations', 'date', startDate, adjustedEndDate);
      const messagesData = await generateTimeSeriesData('messages', 'timestamp', startDate, adjustedEndDate);
      
      return {
        totalConversations: conversationsResult.count || 0,
        totalMessages: messagesResult.count || 0,
        conversationsData,
        messagesData
      };
    }
  });
}

// Función para generar datos de series temporales agrupados por día
async function generateTimeSeriesData(
  table: 'conversations' | 'messages',
  dateField: 'date' | 'timestamp',
  startDate?: Date,
  endDate?: Date
): Promise<Array<{ date: string; value: number }>> {
  // Si no hay fechas, usar el último mes
  if (!startDate || !endDate) {
    endDate = new Date();
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);
  }
  
  // Crear un mapa para almacenar los conteos por día
  const dateMap = new Map<string, number>();
  
  // Crear una serie de fechas para el período
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    dateMap.set(dateString, 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Consultar la base de datos para obtener conteos por día
  let query = supabase
    .from(table)
    .select(`${dateField}`)
    .gte(dateField, startDate.toISOString())
    .lte(dateField, endDate.toISOString());
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Contar ocurrencias por día
  data?.forEach(record => {
    const date = new Date(record[dateField]);
    const dateString = date.toISOString().split('T')[0];
    
    const current = dateMap.get(dateString) || 0;
    dateMap.set(dateString, current + 1);
  });
  
  // Convertir el mapa a un array de objetos { date, value }
  return Array.from(dateMap.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
