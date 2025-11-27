const express = require('express');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());

//health check route
app.get('/', (req, res) => {
  res.send('Coin X backend is running 🚀');
});

//Module routes
app.use('/users', userRoutes);

/**Test Db connection
app.get('/db-test', async (req, res)=> {
  try{
    const result = await pool.query('SELECT NOW()');
    res.json({DB_TIME: result.rows[0].now});
  } catch(err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});
**/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});