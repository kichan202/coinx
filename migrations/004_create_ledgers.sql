CREATE TABLE IF NOT EXISTS ledger (
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    debit_wallet_id INT REFERENCES wallets(id),
    credit_wallet_id INT REFERENCES wallets(id),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);