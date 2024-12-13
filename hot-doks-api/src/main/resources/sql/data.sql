-- Function to get random staff member
CREATE OR REPLACE FUNCTION get_random_staff()
RETURNS text AS $$
BEGIN
    RETURN (ARRAY['Fred', 'Zech'])[1 + floor(random() * 2)];
END;
$$ LANGUAGE plpgsql;

-- Function to get random French name
CREATE OR REPLACE FUNCTION get_random_french_name()
RETURNS text AS $$
BEGIN
    RETURN (ARRAY[
        'Léa', 'Emma', 'Louise', 'Alice', 'Chloé',
        'Lucas', 'Gabriel', 'Louis', 'Jules', 'Hugo',
        'Manon', 'Camille', 'Sarah', 'Juliette', 'Charlotte',
        'Thomas', 'Nathan', 'Théo', 'Antoine', 'Pierre'
    ])[1 + floor(random() * 20)];
END;
$$ LANGUAGE plpgsql;

-- Function to get payment type with 17% CASH, 83% CARD distribution
CREATE OR REPLACE FUNCTION get_payment_type()
RETURNS VARCHAR AS $$
BEGIN
    RETURN CASE 
        WHEN random() < 0.17 THEN 'CASH'
        ELSE 'CARD'
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to get random hotdog type
CREATE OR REPLACE FUNCTION random_hotdog_type() RETURNS VARCHAR AS $$
DECLARE
  types VARCHAR[] := ARRAY['CLASSIC', 'ALSACE', 'NEWYORK'];
BEGIN
  RETURN types[floor(random() * array_length(types, 1) + 1)];
END;
$$ LANGUAGE plpgsql;

-- Function to get hotdog price
CREATE OR REPLACE FUNCTION get_hotdog_price(type VARCHAR) RETURNS FLOAT AS $$
BEGIN
  CASE type
    WHEN 'CLASSIC' THEN RETURN 7.5;
    WHEN 'ALSACE' THEN RETURN 8.0;
    WHEN 'NEWYORK' THEN RETURN 8.0;
    ELSE RETURN 7.5;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to generate sample data
CREATE OR REPLACE FUNCTION generate_sample_data()
RETURNS void AS $$
DECLARE
    customer_names text[] := ARRAY['Delphine', 'Killian'];
    hotdog_types text[] := ARRAY['CLASSIC', 'ALSACE', 'NEWYORK'];
    current_order_id bigint;
    i integer;
    j integer;
    random_customer text;
    random_type text;
    random_quantity integer;
    order_timestamp timestamp;
    preparation_minutes double precision;
    base_timestamp timestamp;
    hour_fraction double precision;
    preparation_curve double precision;
    orders_to_generate integer := 300;
    ordered_count integer := 5;
    in_preparation_count integer := 2;
    hotdog_id integer := 1;
    total_price float;
    order_total_price float;
BEGIN
    -- Create temporary table to store orders before assigning final status
    DROP TABLE IF EXISTS temp_orders;
    CREATE TEMP TABLE temp_orders (
        id SERIAL PRIMARY KEY,
        ordered_by text,
        order_time timestamp,
        hotdog_count int
    );

    -- Create temporary table for final orders
    DROP TABLE IF EXISTS temp_orders_final;
    CREATE TEMP TABLE temp_orders_final (
        id bigint,
        hotdog_count int
    );

    -- Set base timestamp to today at 17:00
    base_timestamp := date_trunc('day', NOW()) + interval '17 hours';
    
    -- Generate all orders first
    FOR i IN 1..orders_to_generate LOOP
        -- Calculate a timestamp between 17:00 and 23:00
        hour_fraction := random();
        -- Apply a curve to concentrate orders during peak hours
        hour_fraction := power(hour_fraction, 0.7);
        order_timestamp := base_timestamp + (hour_fraction * interval '6 hours');
        
        -- Calculate preparation time curve
        hour_fraction := extract(epoch from (order_timestamp - base_timestamp)) / extract(epoch from interval '6 hours');
        preparation_curve := 1 - 4 * power(hour_fraction - 0.5, 2);
        preparation_minutes := 2 + 14 * GREATEST(0, preparation_curve);
        
        -- Randomly select customer
        random_customer := customer_names[1 + floor(random() * array_length(customer_names, 1))];
        
        -- Store in temporary table
        INSERT INTO temp_orders (
            ordered_by,
            order_time,
            hotdog_count
        ) VALUES (
            random_customer,
            order_timestamp,
            1 + floor(random() * 3)
        );
    END LOOP;

    -- Now insert into real orders table with status based on order_time
    INSERT INTO orders (
        id,
        ordered_by,
        prepared_by,
        order_time,
        preparation_time,
        order_status,
        customer_name,
        payment_type,
        total_price
    )
    WITH ordered_temp_orders AS (
        SELECT *,
            ROW_NUMBER() OVER (ORDER BY order_time DESC) as row_num
        FROM temp_orders
    )
    SELECT 
        id,
        ordered_by,  -- Use the ordered_by from temp_orders
        CASE WHEN row_num <= ordered_count THEN NULL ELSE get_random_staff() END,
        order_time,
        CASE 
            WHEN row_num <= ordered_count THEN NULL
            WHEN row_num <= ordered_count + in_preparation_count THEN order_time + interval '2 minutes'
            ELSE order_time + ((random() * 0.2 + 0.9) * (2 + 14 * GREATEST(0, 1 - 4 * power(
                extract(epoch from (order_time - base_timestamp)) / extract(epoch from interval '6 hours') - 0.5, 2
            ))) * interval '1 minute')
        END,
        CASE 
            WHEN row_num <= ordered_count THEN 'ORDERED'
            WHEN row_num <= ordered_count + in_preparation_count THEN 'IN_PREPARATION'
            ELSE 'READY'
        END,
        get_random_french_name(),
        get_payment_type(),
        0.0::FLOAT
    FROM ordered_temp_orders
    ORDER BY order_time;

    -- Get the generated order IDs and hotdog counts
    INSERT INTO temp_orders_final (id, hotdog_count)
    SELECT o.id, t.hotdog_count
    FROM orders o
    JOIN temp_orders t ON t.order_time = o.order_time;

    -- Generate hotdogs for each order
    FOR current_order_id, random_quantity IN SELECT id, hotdog_count FROM temp_orders_final LOOP
        order_total_price := 0.0;
        FOR j IN 1..random_quantity LOOP
            random_type := hotdog_types[1 + floor(random() * array_length(hotdog_types, 1))];
            order_total_price := order_total_price + get_hotdog_price(random_type);
            
            INSERT INTO hotdogs (
                id,
                order_id,
                type,
                with_ketchup,
                with_mustard,
                with_mayo,
                with_onions,
                is_vege,
                comment,
                price
            ) VALUES (
                hotdog_id,
                current_order_id,
                random_type,
                random() < 0.7, -- 70% chance of having ketchup
                random() < 0.6, -- 60% chance of having mustard
                random() < 0.5, -- 50% chance of having mayo
                random() < 0.8, -- 80% chance of having onions
                random() < 0.05, -- 5% chance of being vegetarian
                CASE 
                    WHEN random() < 0.3 THEN 'Extra ' || 
                        CASE (floor(random() * 4))::int
                            WHEN 0 THEN 'ketchup'
                            WHEN 1 THEN 'mustard'
                            WHEN 2 THEN 'mayo'
                            ELSE 'onions'
                        END
                    ELSE NULL
                END,
                get_hotdog_price(random_type)
            );
            hotdog_id := hotdog_id + 1;
        END LOOP;
        
        -- Update order with total price
        UPDATE orders 
        SET total_price = order_total_price 
        WHERE id = current_order_id;
    END LOOP;

    -- Clean up
    DROP TABLE IF EXISTS temp_orders;
    DROP TABLE IF EXISTS temp_orders_final;
    DROP FUNCTION IF EXISTS get_random_staff();
    DROP FUNCTION IF EXISTS get_random_french_name();
    DROP FUNCTION IF EXISTS get_payment_type();
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate sample data
SELECT generate_sample_data();

-- Update sequences to match the highest IDs
SELECT setval('seq_order', COALESCE((SELECT MAX(id) FROM orders), 1));
SELECT setval('seq_hotdog', COALESCE((SELECT MAX(id) FROM hotdogs), 1));
