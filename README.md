# 🚨 Incident Management System

A full-stack **Incident Management System** built with **React (frontend)**, **Node.js + Express (backend)**, and **Sequelize (SQLite for local development)**.  
This application allows users to **register, login, report incidents, manage incidents, and reset passwords** with JWT-based authentication.  

---

## ✨ Features
- 🔐 User authentication (Register, Login, JWT auth)  
- 📝 Report new incidents with priority  
- 📊 View and manage incidents (sorted by priority and date)  
- 🔄 Forgot/Reset password (with reset link displayed for demo)  
- 📍 Auto-fill city & country from **Pincode API** on registration  
- 🎨 Modern Bootstrap UI with React  

---

## 🛠 Tech Stack
- **Frontend**: React (Vite), Bootstrap  
- **Backend**: Node.js, Express.js  
- **Database**: Sequelize ORM with SQLite (easy local setup)  
- **Auth**: JWT (JSON Web Tokens)  

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/apuu1503/incident-management.git
cd incident-management
2️⃣ Setup Backend
cd backend
npm install

Configure Environment

Create a .env file inside backend/ with the following content:

PORT=4000
JWT_SECRET=supersecretkey
TOKEN_EXPIRY=7d
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

Run Backend
npm run dev


Backend will be available at 👉 http://localhost:4000

3️⃣ Setup Frontend
cd ../frontend
npm install

Configure API Base URL

Inside frontend/src/api.js, update:

const BASE_URL = "http://localhost:4000/api";

Run Frontend
npm run dev


Frontend will be available at 👉 http://localhost:5173

🚀 Usage

Register a new account

Login with your credentials

Report incidents with title, description, and priority

View & manage incidents (auto-sorted by priority and latest date)

Forgot password → enter email → copy reset link → reset password

📂 Project Structure
incident-management/
│── backend/        # Express API + Sequelize ORM
│── frontend/       # React app
│── README.md       # Documentation

📌 Notes

Passwords are stored as plain text in this demo (for simplicity). Replace with bcrypt for production.

City & country fields are auto-fetched using India Postal Pincode API
.
```
🧑‍💻 Author

Developed by Apurva Sukale 🚀


---

✅ This is **complete** — copy, paste, push to GitHub.  

Do you also want me to add **example test users & incidents (seed data)** instructions, so someone cloning your repo can instantly
