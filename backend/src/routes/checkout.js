// backend/src/routes/checkout.js
const express = require('express');
const router = express.Router();

const {
  getCart,
  clearCart,
  findDiscount,
  markDiscountUsed,
  createOrder,
  calculateTotal
} = require('../store');

/**
 * POST /checkout/:userId
 * Body: { discountCode? }
 *
 * - Validates cart
 * - Optionally validates and applies a discount code (single-use)
 * - Creates an order, clears the cart, and returns the order
 */
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { discountCode } = req.body || {};

  const cart = getCart(userId);
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart empty' });
  }

  const items = cart.items;
  const total = calculateTotal(items);

  let discountAmount = 0;
  if (discountCode) {
    const d = findDiscount(discountCode);
    if (!d) return res.status(400).json({ error: 'Invalid discount code' });
    if (d.used) return res.status(400).json({ error: 'Discount code already used' });

    discountAmount = Math.round((d.percent / 100) * total * 100) / 100;
    markDiscountUsed(discountCode);
  }

  const finalTotal = Math.round((total - discountAmount) * 100) / 100;
  const order = createOrder(userId, items, finalTotal, discountCode, discountAmount);

  // clear user's cart after successful order
  clearCart(userId);

  return res.json({ order });
});

module.exports = router;