const store = {
  carts: new Map(),
  orders: [],
  discountCodes: [],
  config: { N: 3 },
};

function getCart(userId) {
  if (!store.carts.has(userId)) {
    store.carts.set(userId, { items: [] });
  }
  return store.carts.get(userId);
}

function addToCart(userId, item) {
  const cart = getCart(userId);

  const existing = cart.items.find((i) => i.id === item.id);
  if (existing) {
    existing.qty = Number(existing.qty || 0) + Number(item.qty || 0);
  } else {
    cart.items.push({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty),
    });
  }
  return cart;
}

function clearCart(userId) {
  store.carts.set(userId, { items: [] });
}

function currentOrdersCount() {
  return store.orders.length;
}

function generateDiscountIfAllowed(n) {
  const N = n || store.config.N;
  const cnt = currentOrdersCount();

  if (cnt > 0 && cnt % N === 0) {
    const code = `DISC-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const entry = {
      code,
      percent: 10,
      used: false,
      createdAt: new Date().toISOString(),
    };
    store.discountCodes.push(entry);
    return entry;
  }
  return null;
}

function findDiscount(code) {
  return store.discountCodes.find((d) => d.code === code);
}

function markDiscountUsed(code) {
  const d = findDiscount(code);
  if (!d) return false;
  d.used = true;
  return true;
}

function createOrder(userId, items, total, discountCode, discountAmount) {
  const order = {
    id: Math.random().toString(36).substring(2, 10),
    userId,
    items,
    total,
    discountCode: discountCode || null,
    discountAmount: discountAmount || 0,
    createdAt: new Date().toISOString(),
  };
  store.orders.push(order);
  return order;
}

function calculateTotal(items) {
  return items.reduce((acc, it) => acc + Number(it.price) * (Number(it.qty) || 1), 0);
}

function adminStats() {
  const itemsPurchasedCount = store.orders.reduce(
    (acc, o) => acc + (o.items ? o.items.reduce((s, i) => s + (i.qty || 1), 0) : 0),
    0
  );
  const totalPurchaseAmount = store.orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalDiscountGiven = store.orders.reduce((acc, o) => acc + (o.discountAmount || 0), 0);
  return {
    itemsPurchasedCount,
    totalPurchaseAmount,
    discountCodes: store.discountCodes,
    totalDiscountGiven,
  };
}

// ensure module.exports exports everything needed
module.exports = {
  store,
  getCart,
  addToCart,
  clearCart,
  currentOrdersCount,
  generateDiscountIfAllowed,
  findDiscount,
  markDiscountUsed,
  createOrder,
  calculateTotal,
  adminStats
};
