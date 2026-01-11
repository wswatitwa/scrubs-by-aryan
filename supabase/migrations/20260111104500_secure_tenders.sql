-- 1. Enable RLS
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;

-- 2. Public Submit (Inquiry Form)
CREATE POLICY "Public Submit Tender" 
ON tenders 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 3. Staff Manage (View/Edit Tenders)
CREATE POLICY "Staff Manage Tenders" 
ON tenders 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
