const express = require('express');
const transactionsRouter = require('./routes/transactions');
const walletsRouter = require('./routes/wallets');

const app = express();
app.use(express.json());
app.use('/transactions', transactionsRouter);
app.use('/wallets', walletsRouter);

module.exports = app;