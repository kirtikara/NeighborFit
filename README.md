# NeighborFit

A full-stack web application that matches users to Indian neighborhoods based on safety, pollution, cleanliness, greenery, budget, and more.
[🔗 Live Demo]( https://neighbor-fit-oq8u.vercel.app/ )

## 🚀 Features
- User registration and login (JWT authentication)
- City-specific and all-India neighborhood search
- Filter by:
  - Safety
  - Pollution
  - Cleanliness
  - Greenery
  - Budget (₹ per month)
- Real and research-based data for 32+ Indian neighborhoods
- Matching algorithm ranks neighborhoods by user preferences
- Admin panel for adding, editing, and deleting neighborhoods
- Modern, responsive UI with Material-UI
- City images and visual cards for best matches
- Error handling and user-friendly messages
- Secure API (admin-only for sensitive actions)

## 🛠️ Technology Stack
- **Frontend:** React.js (with Material-UI, Axios)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (free tier)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Data Processing:** Node.js scripts (fetches, normalizes, and loads real data)
- **Deployment:** (Ready for) Render.com, Vercel, Railway, or any cloud

🔄 Trade-offs & Decisions

- Focused on Delhi/NCR due to limited public datasets
- Used mock+real data mix to simulate a scalable structure
- Opted for MongoDB over SQL for flexible data modeling

## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd NeighborFit
```

### 2. Install dependencies
- Backend: `cd backend && npm install`
- Frontend: `cd frontend && npm install`

### 3. Run the app
- Backend: `npm start` (in backend folder)
- Frontend: `npm start` (in frontend folder)

---

## Documentation
See `/docs` for problem analysis, research, and technical documentation. 
