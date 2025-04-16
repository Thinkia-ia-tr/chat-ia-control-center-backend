
-- Migrate existing client data to new format
UPDATE conversations 
SET client = jsonb_build_object('type', 'email', 'value', client);
