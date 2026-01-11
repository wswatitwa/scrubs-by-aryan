-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 1. Everyone can read reviews
DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;
CREATE POLICY "Public Read Reviews"
ON reviews FOR SELECT
USING (true);

-- 2. Everyone can submit reviews (Guest Reviews allowed for now)
DROP POLICY IF EXISTS "Public Submit Reviews" ON reviews;
CREATE POLICY "Public Submit Reviews"
ON reviews FOR INSERT
WITH CHECK (true);

-- 3. Only Staff can delete reviews (Moderation)
DROP POLICY IF EXISTS "Staff Delete Reviews" ON reviews;
CREATE POLICY "Staff Delete Reviews"
ON reviews FOR DELETE
USING (auth.role() = 'authenticated');

-- 4. Only Staff can update reviews (Moderation/status changes)
DROP POLICY IF EXISTS "Staff Update Reviews" ON reviews;
CREATE POLICY "Staff Update Reviews"
ON reviews FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
