const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cart');

const app = express();
app.use(bodyParser.json());
app.use('/cart', cartRoutes);


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
