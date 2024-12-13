-- Drop existing triggers
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_hotdogs_updated_at ON hotdogs;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS generate_sample_data();

-- Drop existing foreign keys
ALTER TABLE IF EXISTS hotdogs DROP CONSTRAINT IF EXISTS fk_order;

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS hotdogs;
DROP TABLE IF EXISTS orders;

-- Drop existing sequences
DROP SEQUENCE IF EXISTS seq_order;
DROP SEQUENCE IF EXISTS seq_hotdog;

-- Drop existing types
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS hotdog_type;
DROP TYPE IF EXISTS payment_type;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS seq_order START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_hotdog START WITH 1 INCREMENT BY 1;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_order'),
    ordered_by VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    payment_type VARCHAR(50) CHECK (payment_type IN ('CASH', 'CARD')),
    prepared_by VARCHAR(255),
    order_time TIMESTAMP NOT NULL,
    preparation_time TIMESTAMP,
    order_status VARCHAR(50) NOT NULL CHECK (order_status IN ('ORDERED', 'IN_PREPARATION', 'READY')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price FLOAT
);

-- Create hotdogs table
CREATE TABLE IF NOT EXISTS hotdogs (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_hotdog'),
    order_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CLASSIC', 'ALSACE', 'NEWYORK')),
    with_ketchup BOOLEAN DEFAULT FALSE,
    with_mustard BOOLEAN DEFAULT FALSE,
    with_mayo BOOLEAN DEFAULT FALSE,
    with_onions BOOLEAN DEFAULT FALSE,
    is_vege BOOLEAN DEFAULT FALSE,
    comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price FLOAT,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_ordered_by ON orders(ordered_by);
CREATE INDEX IF NOT EXISTS idx_orders_prepared_by ON orders(prepared_by);
CREATE INDEX IF NOT EXISTS idx_orders_order_time ON orders(order_time);
CREATE INDEX IF NOT EXISTS idx_hotdogs_order_id ON hotdogs(order_id);
CREATE INDEX IF NOT EXISTS idx_hotdogs_type ON hotdogs(type);

-- Create trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotdogs_updated_at
    BEFORE UPDATE ON hotdogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add table comments
COMMENT ON TABLE orders IS 'Table storing hotdog orders';
COMMENT ON COLUMN orders.id IS 'Primary key for the order';
COMMENT ON COLUMN orders.ordered_by IS 'Name of the customer who placed the order';
COMMENT ON COLUMN orders.customer_name IS 'Name of the customer who placed the order';
COMMENT ON COLUMN orders.payment_type IS 'Type of payment used for the order (CASH, CARD)';
COMMENT ON COLUMN orders.prepared_by IS 'Name of the staff member preparing the order';
COMMENT ON COLUMN orders.order_time IS 'Timestamp when the order was placed';
COMMENT ON COLUMN orders.preparation_time IS 'Timestamp when order preparation started';
COMMENT ON COLUMN orders.order_status IS 'Current status of the order (ORDERED, IN_PREPARATION, READY)';
COMMENT ON COLUMN orders.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN orders.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN orders.total_price IS 'Total price of the order';

COMMENT ON TABLE hotdogs IS 'Table storing individual hotdogs within orders';
COMMENT ON COLUMN hotdogs.id IS 'Primary key for the hotdog';
COMMENT ON COLUMN hotdogs.order_id IS 'Foreign key referencing the order this hotdog belongs to';
COMMENT ON COLUMN hotdogs.type IS 'Type of hotdog (CLASSIC, ALSACE, NEWYORK)';
COMMENT ON COLUMN hotdogs.with_ketchup IS 'Whether the hotdog includes ketchup';
COMMENT ON COLUMN hotdogs.with_mustard IS 'Whether the hotdog includes mustard';
COMMENT ON COLUMN hotdogs.with_mayo IS 'Whether the hotdog includes mayonnaise';
COMMENT ON COLUMN hotdogs.with_onions IS 'Whether the hotdog includes onions';
COMMENT ON COLUMN hotdogs.is_vege IS 'Whether the hotdog is vegetarian';
COMMENT ON COLUMN hotdogs.comment IS 'Additional comments or special instructions for the hotdog';
COMMENT ON COLUMN hotdogs.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN hotdogs.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN hotdogs.price IS 'Price of the hotdog';
