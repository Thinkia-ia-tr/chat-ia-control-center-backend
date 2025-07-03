-- Actualizar el contador de mensajes para todas las conversaciones
-- Esto cuenta los mensajes reales de cada conversación y actualiza el campo messages
UPDATE conversations 
SET messages = (
  SELECT COUNT(*) 
  FROM messages m 
  WHERE m.conversation_id = conversations.id
);

-- Crear un trigger para mantener automáticamente el contador actualizado
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrementar el contador cuando se añade un mensaje
    UPDATE conversations 
    SET messages = messages + 1 
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrementar el contador cuando se elimina un mensaje
    UPDATE conversations 
    SET messages = GREATEST(messages - 1, 0) 
    WHERE id = OLD.conversation_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger para INSERT
DROP TRIGGER IF EXISTS trigger_update_message_count_insert ON messages;
CREATE TRIGGER trigger_update_message_count_insert
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_message_count();

-- Crear el trigger para DELETE
DROP TRIGGER IF EXISTS trigger_update_message_count_delete ON messages;
CREATE TRIGGER trigger_update_message_count_delete
    AFTER DELETE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_message_count();