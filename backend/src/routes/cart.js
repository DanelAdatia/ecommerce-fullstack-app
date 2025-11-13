const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require('../store');

router.post('/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { id, name, price, qty } = req.body;
  if (!id || !name || price == null || qty == null) {
    return res.status(400).json({ error: 'id, name, price, qty are required' });
  }
  const cart = addToCart(userId, { id, name, price, qty });
  return res.json(cart);
});

router.get("/:userId", (req, res) => {
     const {userId} = req.params;
    const cart = getCart(userId);
    res.json(cart);
})

module.exports = router;