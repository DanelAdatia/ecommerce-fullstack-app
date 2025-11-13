// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();

const {
  currentOrdersCount,
  generateDiscountIfAllowed,
  adminStats
} = require('../store');

/**
 * POST /admin/generate-discount
 * Body: { n? }  // optional override for the nth rule
 */
router.post('/generate-discount', (req, res) => {
  const { n } = req.body || {};
  const code = generateDiscountIfAllowed(n);
  if (!code) {
    return res.status(400).json({ error: `Condition not satisfied. Current orders: ${currentOrdersCount()}` });
  }
  return res.json({ discount: code });
});

/**
 * GET /admin/stats
 */
router.get('/stats', (req, res) => {
  return res.json(adminStats());
});

module.exports = router;