const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db'); // however you export pg pool

beforeAll(async () => {
  // Clean tables
  await pool.query('DELETE FROM transactions');
  await pool.query('DELETE FROM wallets');

  // Seed wallets
  await pool.query("INSERT INTO wallets (id, user_id, balance) VALUES (1, 1, 100), (2, 2, 50)");
});

afterAll(async () => {
  await pool.end(); // close DB connection
});

describe('Transactions API', () => {
  test('should create a transaction successfully', async () => {
    const res = await request(app)
      .post('/transactions')
      .send({
        from_wallet_id: 1,
        to_wallet_id: 2,
        type: 'send',
        amount: 25
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.amount).toBe("25.00");
  }, 10000); // extend timeout to 10s

  test('should fail if sender wallet has insufficient balance', async () => {
    const res = await request(app)
      .post('/transactions')
      .send({
        from_wallet_id: 1,
        to_wallet_id: 2,
        type: 'send',
        amount: 9999
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Insufficient balance in sender wallet');
  }, 10000);

  test('should return 404 if wallet not found', async () => {
    const res = await request(app)
      .post('/transactions')
      .send({
        from_wallet_id: 999,
        to_wallet_id: 2,
        type: 'send',
        amount: 10
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Sender wallet not found');
  }, 10000);
});