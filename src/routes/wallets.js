const express = require('express');
const pool = require('../db');  

const router = express.Router();

//create waller for a user
router.post('/', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING id, user_id, balance, created_at',
            [user_id, 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create wallet error:', err); 
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get wallet by user id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, user_id, balance, created_at FROM wallets WHERE user_id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Get wallet error:', err);  
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
