-- Transactional Order Creation RPC
-- This function ensures atomic stock checking and deduction before order creation.

CREATE OR REPLACE FUNCTION create_order_transaction(
    p_order JSONB,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item JSONB;
    product_record RECORD;
    v_order_id TEXT;
    v_stock INT;
BEGIN
    -- 1. Loop through items to check and deduct stock
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Lock product row for update
        SELECT id, stock, name INTO product_record
        FROM products
        WHERE id = (item->>'id')
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID % not found', (item->>'id');
        END IF;

        -- Check stock
        IF product_record.stock < (item->>'quantity')::INT THEN
            RAISE EXCEPTION 'Insufficient stock for product: % (Available: %, Requested: %)', 
                product_record.name, product_record.stock, (item->>'quantity');
        END IF;

        -- Deduct stock
        UPDATE products
        SET stock = stock - (item->>'quantity')::INT
        WHERE id = (item->>'id');
    END LOOP;

    -- 2. Insert Order
    -- We assume p_order contains all necessary fields matching the orders table
    INSERT INTO orders (
        id,
        customer_name,
        customer_phone,
        location,
        items,
        subtotal,
        shipping_fee,
        total,
        status,
        mpesa_code,
        shipping_method,
        notes,
        created_at
    ) VALUES (
        p_order->>'id',
        p_order->>'customerName',
        p_order->>'customerPhone',
        p_order->>'location',
        p_items, -- We store the items JSON as provided
        (p_order->>'subtotal')::NUMERIC,
        (p_order->>'shippingFee')::NUMERIC,
        (p_order->>'total')::NUMERIC,
        p_order->>'status',
        p_order->>'mpesaCode',
        p_order->>'shippingMethod',
        p_order->>'notes',
        (p_order->>'createdAt')::TIMESTAMPTZ
    )
    RETURNING id INTO v_order_id;

    -- Return success
    RETURN jsonb_build_object('success', true, 'orderId', v_order_id);

EXCEPTION
    WHEN OTHERS THEN
        -- Verify if it's our custom error or strict SQL error
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
