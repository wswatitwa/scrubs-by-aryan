-- Enable Realtime for Products explicitly
-- We will run this again to be absolutely sure the publication is active.
-- Sometimes 'DO' blocks might be skipped if permissions are weird in certain environments, though unlikely.
-- We will just use the direct command which is generally safe to re-run (or at least ensures intent).

-- Ensure REPLICA IDENTITY is FULL (Important for receiving full rows on updates)
ALTER TABLE products REPLICA IDENTITY FULL;

-- Add table to publication if not already added. 
-- Since we can't easily do 'IF NOT EXISTS' in simple SQL without DO block, we'll try the drop/add approach or just the alter.
-- Standard safer way in migration is:
ALTER PUBLICATION supabase_realtime ADD TABLE products;
-- If it errors "already exists", it's fine, but let's wrap it to be clean.

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  EXCEPTION WHEN duplicate_object THEN
    -- Table already in publication, ignore
    NULL;
  END;
END $$;
