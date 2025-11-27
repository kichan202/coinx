const express = require('express');
const pool = require('../db');
const router = express.Router();

// Create a new transaction (transfer between wallets   )
router.post('/', async (req, res) => {
  const { from_wallet_id, to_wallet_id, type, amount } = req.body;
    if (!from_wallet_id || !to_wallet_id || !type || !amount) {
        return res.status(400).json({ error: 'from_wallet_id, to_wallet_id, type, and amount are required' });
    }

    if(amount <= 0){
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try{
        // Start a transaction
        await pool.query('BEGIN');
        //check senders balance
        const fromWallet = await pool.query(
            'SELECT balance FROM wallets WHERE id = $1',
            [from_wallet_id]
        );
        if(fromWallet.rows.length === 0){
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Sender wallet not found' });
        }

        if(fromWallet.rows[0].balance < amount){
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Insufficient balance in sender wallet' });
        }
        // Deduct amount from sender's wallet
        await pool.query(
            'UPDATE wallets SET balance = balance - $1 WHERE id = $2',
            [amount, from_wallet_id]
        );

        // Add amount to receiver's wallet
        await pool.query(
            'UPDATE wallets SET balance = balance + $1 WHERE id = $2',
            [amount, to_wallet_id]
        );

        //record the transaction
        const result = await pool.query(
            'INSERT INTO transactions (from_wallet_id, to_wallet_id, wallet_id, type, amount) VALUES ($1, $2, $3, $4, $5) RETURNING id, from_wallet_id, to_wallet_id, type, amount, created_at',
            [from_wallet_id, to_wallet_id, from_wallet_id, type, amount]   
        );

        // Commit the transaction
        await pool.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch(err){
        await pool.query('ROLLBACK');
        console.error('Create transaction error:', err); 
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get transaction by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, from_wallet_id, to_wallet_id, type, amount, created_at FROM transactions WHERE id = $1',
            [id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(result.rows[0]);
    } catch(err){
        console.error('Get transaction error:', err);  
        res.status(500).json({ error: 'Internal server error' });
    } 
});

module.exports = router;