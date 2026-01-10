-- Validate Sub-Category Trigger

CREATE OR REPLACE FUNCTION check_subcategory_validity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    valid_subcats TEXT[];
    cat_exists BOOLEAN;
BEGIN
    -- If no sub_category is specified (NULL or Empty String), we allow it.
    -- (Unless you want to enforce that every product MUST have a sub-category if the category has them? 
    -- For now, we assume optional or enforced by UI).
    IF NEW.sub_category IS NULL OR NEW.sub_category = '' THEN
        RETURN NEW;
    END IF;

    -- Check if category exists and get its sub-categories
    SELECT sub_categories, TRUE INTO valid_subcats, cat_exists
    FROM categories
    WHERE name = NEW.category;

    -- If Category itself starts returning no rows (cat_exists is null)
    IF cat_exists IS NULL THEN
         RAISE EXCEPTION 'Category "%" does not exist.', NEW.category;
    END IF;

    -- Handle NULL column as Empty Array
    IF valid_subcats IS NULL THEN
        valid_subcats := ARRAY[]::TEXT[];
    END IF;

    -- Check if the new sub_category is in the array
    IF NOT (NEW.sub_category = ANY(valid_subcats)) THEN
        RAISE EXCEPTION 'Invalid sub-category "%". The category "%" only allows: %', 
            NEW.sub_category, NEW.category, array_to_string(valid_subcats, ', ');
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_subcategory ON products;

CREATE TRIGGER trg_validate_subcategory
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION check_subcategory_validity();
