const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cart');

let checkoutRoutes = null;
try {
  // require checkout if implemented; if not, server still starts
  checkoutRoutes = require('./routes/checkout');
} catch (e) {
  // ignore if checkout file not present yet
}

let adminRoutes = null;
try {
  adminRoutes = require('./routes/admin');
} catch (e) {
  // ignore if admin file not present yet
}

const app = express();

app.use(bodyParser.json());
app.use('/cart', cartRoutes);
if (checkoutRoutes) app.use('/checkout', checkoutRoutes);
if (adminRoutes) app.use('/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

app.get('/', (req, res) => {
  res.send('Ecommerce backend (skeleton) is running');
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}

module.exports = app;
