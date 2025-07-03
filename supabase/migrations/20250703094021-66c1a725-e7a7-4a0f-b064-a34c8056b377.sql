-- Normalizar formato de números de teléfono eliminando "+" y espacios
UPDATE conversations 
SET client = REPLACE(REPLACE(client::text, '+', ''), ' ', '')::jsonb
WHERE client::text ~ '^\"+34|^\"+\d+|\s';