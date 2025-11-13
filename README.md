# Full Stack Ecommerce App

This project is a simple ecommerce store.  
It includes adding items to cart, checkout, discount on every Nth order, and admin stats.

---

## 🚀 Tech Used
- **Backend:** Node.js, Express, Jest, Supertest  
- **Frontend:** React (Vite), Axios  
- **Storage:** In-memory (as required)

---

# ⚙️ How to Install & Run

## 1️⃣ Clone the project
```bash
git clone https://github.com/DanelAdatia/ecommerce-fullstack-app.git
cd ecommerce-fullstack-app
```

---

# 🖥️ Backend Setup
```bash
cd backend
npm install
npm run dev     # Backend runs on http://localhost:3001
```

### Run backend tests
```bash
npm test
```

---

# 🎨 Frontend Setup
> Requires **Node 20+** because of Vite.

If using nvm (recommended):
```bash
nvm install 20
nvm use 20
```

Start the frontend:
```bash
cd frontend
npm install
npm run dev     # Frontend runs on http://localhost:5173
```

---

# 📌 Features

### ✔ Cart
- Add products  
- View current cart  

### ✔ Checkout
- Checkout with or without discount code  
- Discount applies to entire order  

### ✔ Discounts
- Generated every **Nth order**  
- 10% discount  
- Discount code is **single-use**  

### ✔ Admin
- Generate discount  
- View stats:
  - Total items purchased  
  - Total purchase amount  
  - Total discount given  
  - All discount codes  

---

# 📁 Project Structure
```
backend/
  src/
  tests/

frontend/
  src/
```

---

# 👩‍💻 Author
**Danel Adatia**
React + Node.js Developer
