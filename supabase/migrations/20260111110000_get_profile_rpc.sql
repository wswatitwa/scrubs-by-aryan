-- Create a secure function to fetch profile bypassing RLS
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- <--- This is the Magic Key. It bypasses RLS.
AS $$
DECLARE
  profile_data jsonb;
BEGIN
  SELECT row_to_json(sp)::jsonb INTO profile_data
  FROM staff_profiles sp
  WHERE sp.id = auth.uid();
  
  RETURN profile_data;
END;
$$;
