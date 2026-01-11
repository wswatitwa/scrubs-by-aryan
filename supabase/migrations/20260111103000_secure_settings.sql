-- 1. Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- 2. Clean Up Old Policies (Idempotency)
DROP POLICY IF EXISTS "Public Read Settings" ON store_settings;
DROP POLICY IF EXISTS "Staff Update Settings" ON store_settings;

-- 3. Public Read (App needs to know Embroidery Fee)
CREATE POLICY "Public Read Settings" 
ON store_settings 
FOR SELECT 
USING (true);

-- 4. Staff Update (Singleton Config Row)
CREATE POLICY "Staff Update Settings" 
ON store_settings 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);
