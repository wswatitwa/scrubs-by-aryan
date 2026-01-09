-- Enable Realtime for Products and Categories
begin;
  -- Check if table is already in publication to avoid errors (optional safer approach or just try add)
  -- Simple approach:
  alter publication supabase_realtime add table products;
  alter publication supabase_realtime add table categories;
commit;
