-- Actualizar formato de cliente de JSON a texto directo manteniendo el número original
UPDATE conversations 
SET client = (client->>'value')::jsonb
WHERE jsonb_typeof(client) = 'object' 
  AND client->>'type' = 'phone' 
  AND client ? 'value';