const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Coin X backend is running 🚀');
});

//Test Db connection
app.get('/db-test', async (req, res)=> {
  try{
    const result = await pool.query('SELECT NOW()');
    res.json({DB_TIME: result.rows[0].now});
  } catch(err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});