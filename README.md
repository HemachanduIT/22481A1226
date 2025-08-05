# URL Shortener Full Stack Project

A full-stack URL shortener app with analytics and logging middleware built using:

- ⚙️ Backend: Node.js, Express, MongoDB  
- 🎨 Frontend: React (Vite) + Material UI  
- 🧾 Logging: Winston + Morgan Middleware

---

## 🔗 Repository Structure

```
22481A1220/
├── Backend_Test_Submission/      # Express.js backend
├── Frontend_Test_Submission/     # React frontend (Vite + MUI)
└── Logging_MiddleWare/           # Custom logging middleware
```

---

## ⚙️ Backend Setup (Express + MongoDB)

### 📁 Navigate to backend
```bash
cd Backend_Test_Submission
```

### 📦 Install dependencies
```bash
npm install
```

### 🧪 Setup `.env`
Create a `.env` file using `.env.example` as reference:
```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
BASE_URL=http://localhost:3000
```

### 🚀 Start backend server
```bash
npm run dev
```
Runs on `http://localhost:3001`

---

## 💻 Frontend Setup (React + MUI)

### 📁 Navigate to frontend
```bash
cd Frontend_Test_Submission
```

### 📦 Install dependencies
```bash
npm install
```

### 🧪 Setup `.env`
Create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:3001
```

### 🚀 Start frontend
```bash
npm run dev
```

Runs on `http://localhost:5173`

---

## 📜 Logging Middleware Setup

### 📁 Navigate to middleware
```bash
cd Logging_MiddleWare
```

### 📦 Install dependencies
```bash
npm install
```

### 🧪 Setup `.env`
```env
PORT=8080
```

### 🚀 Start server
```bash
npm start
```

Logs are saved to:
- `combined.log`
- `error.log`

---

## 📎 Repo

GitHub: [https://github.com/0x4nud33p/22481A1220](https://github.com/HemachanduIT/22481A1226)