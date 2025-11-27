CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('buy','send','receive','withdraw')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending','completed','failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);