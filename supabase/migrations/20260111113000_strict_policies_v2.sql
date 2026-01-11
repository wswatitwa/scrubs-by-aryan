-- Fix "Function Search Path Mutable" Warning for is_staff()
-- Updated Task 021 component

CREATE OR REPLACE FUNCTION public.is_staff() 
RETURNS boolean 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public, pg_catalog -- <--- Fixed: Immutable search path
AS $$
  SELECT EXISTS (SELECT 1 FROM staff_profiles WHERE id = auth.uid());
$$;
