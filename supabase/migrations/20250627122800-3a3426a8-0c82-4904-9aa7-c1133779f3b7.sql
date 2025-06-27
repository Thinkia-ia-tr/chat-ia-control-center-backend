
-- Eliminar TODAS las políticas RLS existentes
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Obtener todas las políticas RLS de todas las tablas
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I CASCADE', 
                      policy_record.policyname, 
                      policy_record.schemaname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- Deshabilitar RLS en todas las tablas
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_mentions DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE referral_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE registration_invitations DISABLE ROW LEVEL SECURITY;

-- Eliminar restricciones de clave foránea (excepto las que van a auth.users)
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;
ALTER TABLE product_mentions DROP CONSTRAINT IF EXISTS product_mentions_conversation_id_fkey;
ALTER TABLE product_mentions DROP CONSTRAINT IF EXISTS product_mentions_message_id_fkey;
ALTER TABLE product_mentions DROP CONSTRAINT IF EXISTS product_mentions_product_id_fkey;
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_conversation_id_fkey;
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referral_type_id_fkey;

-- Cambiar tipos de datos de UUID a TEXT (excepto los que referencian auth.users)
ALTER TABLE conversations ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE messages ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE messages ALTER COLUMN conversation_id TYPE TEXT USING conversation_id::TEXT;
ALTER TABLE product_types ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE product_mentions ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE product_mentions ALTER COLUMN conversation_id TYPE TEXT USING conversation_id::TEXT;
ALTER TABLE product_mentions ALTER COLUMN message_id TYPE TEXT USING message_id::TEXT;
ALTER TABLE product_mentions ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;
ALTER TABLE referral_types ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE referrals ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE referrals ALTER COLUMN conversation_id TYPE TEXT USING conversation_id::TEXT;
ALTER TABLE referrals ALTER COLUMN referral_type_id TYPE TEXT USING referral_type_id::TEXT;

-- NO cambiamos user_roles.user_id ni profiles.id porque referencian auth.users
-- Sólo cambiamos user_roles.id y registration_invitations.id
ALTER TABLE user_roles ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE registration_invitations ALTER COLUMN id TYPE TEXT USING id::TEXT;
-- NO cambiamos registration_invitations.created_by porque referencia auth.users

-- Recrear las restricciones de clave foránea
ALTER TABLE messages ADD CONSTRAINT messages_conversation_id_fkey 
    FOREIGN KEY (conversation_id) REFERENCES conversations(id);
ALTER TABLE product_mentions ADD CONSTRAINT product_mentions_conversation_id_fkey 
    FOREIGN KEY (conversation_id) REFERENCES conversations(id);
ALTER TABLE product_mentions ADD CONSTRAINT product_mentions_message_id_fkey 
    FOREIGN KEY (message_id) REFERENCES messages(id);
ALTER TABLE product_mentions ADD CONSTRAINT product_mentions_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES product_types(id);
ALTER TABLE referrals ADD CONSTRAINT referrals_conversation_id_fkey 
    FOREIGN KEY (conversation_id) REFERENCES conversations(id);
ALTER TABLE referrals ADD CONSTRAINT referrals_referral_type_id_fkey 
    FOREIGN KEY (referral_type_id) REFERENCES referral_types(id);
