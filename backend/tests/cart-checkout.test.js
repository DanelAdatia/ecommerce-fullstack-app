const request = require('supertest');
const app = require('../src/server');
const { store } = require('../src/store');

beforeEach(() => {
  // reset in-memory store before each test
  store.carts = new Map();
  store.orders = [];
  store.discountCodes = [];
  store.config.N = 2; // default nth order for testing
});

test('add to cart and checkout without discount', async () => {
  const user = 'user1';
  await request(app)
    .post(`/cart/${user}/add`)
    .send({ id: 'p1', name: 'Prod1', price: 100, qty: 2 })
    .expect(200);

  const res = await request(app)
    .post(`/checkout/${user}`)
    .send({})
    .expect(200);

  expect(res.body.order.total).toBe(200);
  expect(store.orders.length).toBe(1);
});

test('generate discount on nth order and apply it', async () => {
  const uA = 'uA';
  const uB = 'uB';
  const uC = 'uC';

  // first order (1)
  await request(app)
    .post(`/cart/${uA}/add`)
    .send({ id: 'a', name: 'A', price: 100, qty: 1 });

  await request(app)
    .post(`/checkout/${uA}`)
    .send({});

  // second order (2)
  await request(app)
    .post(`/cart/${uB}/add`)
    .send({ id: 'b', name: 'B', price: 200, qty: 1 });

  await request(app)
    .post(`/checkout/${uB}`)
    .send({});

  // Now orders = 2, config.N = 2 → admin should generate discount
  const gen = await request(app)
    .post('/admin/generate-discount')
    .send({})
    .expect(200);

  const code = gen.body.discount.code;
  expect(typeof code).toBe('string');

  // apply the discount on a new third order (uC)
  await request(app)
    .post(`/cart/${uC}/add`)
    .send({ id: 'c', name: 'C', price: 300, qty: 1 });

  const res = await request(app)
    .post(`/checkout/${uC}`)
    .send({ discountCode: code })
    .expect(200);

  expect(res.body.order.discountAmount).toBe(30); // 10% of 300
  expect(store.discountCodes.find(d => d.code === code).used).toBe(true);
});

test('discount code cannot be reused', async () => {
  const u0 = 'u0';
  const uA = 'uA';
  const uB = 'uB';

  store.config.N = 1; // generate discount on every order after the first

  // Create at least one order so generate-discount works
  await request(app)
    .post(`/cart/${u0}/add`)
    .send({ id: 'z', name: 'Z', price: 50, qty: 1 });

  await request(app)
    .post(`/checkout/${u0}`)
    .send({});

  // Now discount should generate
  const gen = await request(app)
    .post('/admin/generate-discount')
    .send({})
    .expect(200);

  const code = gen.body.discount.code;

  // Use coupon for uA
  await request(app)
    .post(`/cart/${uA}/add`)
    .send({ id: 'x', name: 'X', price: 100, qty: 1 });

  await request(app)
    .post(`/checkout/${uA}`)
    .send({ discountCode: code })
    .expect(200);

  // Try to reuse for uB → should fail
  await request(app)
    .post(`/cart/${uB}/add`)
    .send({ id: 'y', name: 'Y', price: 50, qty: 1 });

  const bad = await request(app)
    .post(`/checkout/${uB}`)
    .send({ discountCode: code })
    .expect(400);

  expect(bad.body.error).toMatch(/already used|Invalid/);
});