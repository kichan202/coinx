//src/routes/users.js

const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try{
        const passwordHash = await bcrypt.hash(password, 10);
        const result =  await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username',
            [username, email, passwordHash]
        );
        res.status(201).json(result.rows[0]);
    } catch(err){
        console.error('Create user error:', err);  // 👈 log full error
        if(err.code === '23505'){ // unique_violation
        return res.status(409).json({ error: 'Username already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, username, email FROM users WHERE id = $1',
            [id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch(err){
        console.error('Get user error:', err);  // 👈 log full error
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
