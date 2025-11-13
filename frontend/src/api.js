// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' }
});

export async function addToCart(userId, item) {
  const res = await api.post(`/cart/${userId}/add`, item);
  return res.data;
}

export async function getCart(userId) {
  const res = await api.get(`/cart/${userId}`);
  return res.data;
}

export async function checkout(userId, payload = {}) {
  const res = await api.post(`/checkout/${userId}`, payload);
  return res.data;
}

export async function generateDiscount(n) {
  const res = await api.post('/admin/generate-discount', n ? { n } : {});
  return res.data;
}

export async function getStats() {
  const res = await api.get('/admin/stats');
  return res.data;
}