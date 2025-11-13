// frontend/src/App.jsx
import React, { useState } from 'react';
import { addToCart, getCart, checkout, generateDiscount, getStats } from './api';

function App() {
  const [userId, setUserId] = useState('demoUser');
  const [cart, setCart] = useState({ items: [] });
  const [product, setProduct] = useState({ id: 'p1', name: 'T-shirt', price: 499, qty: 1 });
  const [msg, setMsg] = useState('');
  const [coupon, setCoupon] = useState('');
  const [stats, setStats] = useState(null);

  const onAdd = async () => {
    try {
      await addToCart(userId, product);
      const c = await getCart(userId);
      setCart(c);
      setMsg('Added to cart');
    } catch (e) {
      setMsg('Add failed: ' + (e?.response?.data?.error || e.message));
    }
  };

  const onLoadCart = async () => {
    try {
      const c = await getCart(userId);
      setCart(c);
    } catch {
      setMsg('Load cart failed');
    }
  };

  const onCheckout = async () => {
    try {
      const payload = coupon ? { discountCode: coupon } : {};
      const res = await checkout(userId, payload);
      setMsg(`Order placed. Total: ₹${res.order.total} (Discount: ₹${res.order.discountAmount || 0})`);
      setCart({ items: [] });
      setCoupon('');
    } catch (e) {
      setMsg('Checkout failed: ' + (e?.response?.data?.error || e.message));
    }
  };

  const onGenerate = async () => {
    try {
      const res = await generateDiscount();
      setMsg('Generated discount: ' + res.discount.code);
    } catch (e) {
      setMsg('Generate failed: ' + (e?.response?.data?.error || e.message));
    }
  };

  const onGetStats = async () => {
    try {
      const s = await getStats();
      setStats(s);
    } catch {
      setMsg('Stats failed');
    }
  };

  const cartTotal = cart.items?.reduce((s, it) => s + it.price * it.qty, 0) || 0;

  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui' }}>
      <h1>Simple Ecom Demo</h1>

      <div style={{ marginBottom: 12 }}>
        <label>User ID: </label>
        <input value={userId} onChange={e => setUserId(e.target.value)} />
        <button onClick={onLoadCart} style={{ marginLeft: 8 }}>Load Cart</button>
      </div>

      <section style={{ marginBottom: 12 }}>
        <h3>Add Product</h3>
        <input value={product.id} onChange={e => setProduct(p => ({ ...p, id: e.target.value }))} placeholder="id" />
        <input value={product.name} onChange={e => setProduct(p => ({ ...p, name: e.target.value }))} placeholder="name" />
        <input type="number" value={product.price} onChange={e => setProduct(p => ({ ...p, price: Number(e.target.value) }))} placeholder="price" />
        <input type="number" value={product.qty} onChange={e => setProduct(p => ({ ...p, qty: Number(e.target.value) }))} placeholder="qty" />
        <button onClick={onAdd} style={{ marginLeft: 8 }}>Add to cart</button>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3>Cart (Total: ₹{cartTotal})</h3>
        <ul>
          {cart.items?.length ? cart.items.map((it, i) => <li key={i}>{it.name} — {it.qty} × ₹{it.price}</li>) : <li>empty</li>}
        </ul>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h3>Checkout</h3>
        <input placeholder="coupon (optional)" value={coupon} onChange={e => setCoupon(e.target.value)} />
        <button onClick={onCheckout} style={{ marginLeft: 8 }}>Checkout</button>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h3>Admin</h3>
        <button onClick={onGenerate}>Generate Discount (admin)</button>
        <button onClick={onGetStats} style={{ marginLeft: 8 }}>Get Stats</button>
      </section>

      <div style={{ marginTop: 16, color: 'green' }}>{msg}</div>

      {stats && (
        <div style={{ marginTop: 20 }}>
          <h3>Stats</h3>
          <div>Items purchased: {stats.itemsPurchasedCount}</div>
          <div>Total purchase amount: ₹{stats.totalPurchaseAmount}</div>
          <div>Total discount given: ₹{stats.totalDiscountGiven}</div>
          <div>Discount codes:</div>
          <ul>
            {stats.discountCodes.map((d, i) => <li key={i}>{d.code} — {d.percent}% — used: {d.used ? 'yes' : 'no'}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;