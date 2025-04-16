
-- Alter the conversations table to use a JSONB column for client
ALTER TABLE conversations 
ALTER COLUMN client TYPE jsonb 
USING jsonb_build_object('type', 'email', 'value', client);
