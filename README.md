# 📘 Telecom Inventory Management System (TIMS)  
*A MERN Stack Project*  

![MERN](https://img.shields.io/badge/MERN-Fullstack-blue?logo=mongodb&logoColor=green)  
![License](https://img.shields.io/badge/license-MIT-green)  
![Status](https://img.shields.io/badge/status-Completed-success)  

---

## 📖 Overview
The **Telecom Inventory Management System (TIMS)** is a full-stack web application that enables telecom companies to manage their **products, suppliers, stock levels, transactions, and alerts**.  

It features **role-based dashboards** for Admin, Manager, and Staff, with authentication and access control using **JWT**.  

---

## ✨ Features

### ✅ Minimum Viable Product
- User Authentication with **JWT**  
- Role-Based Dashboards  
  - **Admin** → Manage Users, Products, Suppliers  
  - **Manager** → Manage Products, Suppliers, Transactions  
  - **Staff** → View Products & Perform Transactions  
- Product Management (CRUD + Stock In/Out + Reorder Alerts)  
- Supplier Management (CRUD + Order History)  
- Transactions Log (Stock In/Out)  
- Low Stock Alerts (based on Reorder Point)  
- Search & Filter for Products  

### ⭐ Additional
- User Profile → update name & password  
- Sidebar + Topbar Dashboard Layout  
- Toast notifications (success/error/info)  
- Responsive design (desktop/tablet/mobile)  

---

## 🛠 Tech Stack
**Frontend** → React, React Router, Axios, Bootstrap, React-Toastify  
**Backend** → Node.js, Express.js, JWT, bcrypt.js  
**Database** → MongoDB (Mongoose ODM)  
**Tools** → Postman (API testing)  

---

## 📊 Role Dashboards

| Role   | Access Pages                                |
|--------|---------------------------------------------|
| Admin  | Products, Suppliers, Alerts                 |
| Manager| Products, Suppliers, Transactions, Alerts   |
| Staff  | Products, Transactions, Alerts              |

---

## 📂 Project Structure
```
inventory-telecom/
 ├── backend/
 │   ├── models/         # Mongoose models
 │   ├── routes/         # Express routes
 │   ├── middleware/     # Auth middleware
 │   └── server.js       # Entry point
 ├── frontend/
 │   ├── src/
 │   │   ├── api/        # Axios instance
 │   │   ├── components/ # Reusable components
 │   │   ├── layouts/    # Dashboard layout
 │   │   ├── pages/      # Login, Products, etc.
 │   │   ├── utils/      # Permissions, helpers
 │   │   ├── App.js
 │   │   └── index.js
 └── README.md
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repo
```bash
git clone https://github.com/sujithachalla97/inventory-telecom.git
cd inventory-telecom
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```
Create `.env`:
```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```
Run server:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

---

## 🔑 API Testing (Postman)

### Register
```
POST /api/auth/register
{
  "name": "Manager",
  "email": "manager@example.com",
  "password": "123456",
  "role": "manager"
}
```

### Login
```
POST /api/auth/login
{
  "email": "manager@example.com",
  "password": "123456"
}
```

Use `Authorization: Bearer <token>` for secure routes.  

---

## 📸 Screenshots
👉 *(Add your actual UI screenshots here)*  
- Login Page  
- Admin Dashboard  
- Products Page  
- Low Stock Alerts  

---

## 📌 Future Enhancements
- Import/Export data (CSV/Excel)  
- Dashboard charts (stock trends, supplier stats)  
- Demand forecasting using ML  

---

## 🏆 Credits
- Built by **[Sujitha Challa](https://github.com/sujithachalla97)**  
- Case study inspired by **Lumen Technologies TIMS**  
