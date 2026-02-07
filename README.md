# Revenue Intelligence Console

A full-stack dashboard application that helps CROs understand revenue performance and identify areas for improvement.

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- npm

### Local Development

**1. Setup Backend**
```bash
cd backend
npm install
Copy-Item .env.example .env  # Windows
# or: cp .env.example .env   # Mac/Linux
npm run seed
npm run dev
```

**2. Setup Frontend**
```bash
cd frontend
npm install
Copy-Item .env.example .env  # Windows
# or: cp .env.example .env   # Mac/Linux
npm start
```

Visit `http://localhost:3000` to see the dashboard.

## 📁 Project Structure

```
.
├── backend/          # Express API (TypeScript)
├── frontend/         # React App (TypeScript)
└── data/             # JSON data files
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript, SQLite
- **Frontend**: React, TypeScript, Material UI, D3.js

## 📡 API Endpoints

- `GET /api/summary` - Current quarter revenue summary
- `GET /api/drivers` - Revenue driver metrics
- `GET /api/risk-factors` - Risk identification
- `GET /api/recommendations` - Actionable recommendations

## 🔧 Environment Variables

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
DB_PATH=./data/revenue.db
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:3001
```

## 📦 Deployment

### Backend (Render)
1. Deploy to [Render](https://render.com)
2. Set environment variables: `NODE_ENV=production`, `DB_PATH=./data/revenue.db`, `FRONTEND_URL=<your-vercel-url>`

### Frontend (Vercel)
1. Deploy to [Vercel](https://vercel.com)
2. Set environment variable: `REACT_APP_API_URL=<your-render-backend-url>`

## 📝 License

ISC
