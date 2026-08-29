# GenCanvas AI — AI Creative Studio & Image Generator

GenCanvas AI is a full-stack AI Image Generation and Creative Studio platform built with React, Vite, Node.js, Express, and MongoDB.

---

## 🚀 How to Run the App (Anytime)

### Option 1: One-Click Startup (Windows)
Double-click [`start-app.bat`](file:///c:/projects/GenCanvas-AI-main/start-app.bat) in the project root folder. It will automatically start both the backend server and frontend client!

---

### Option 2: Running via Terminal

Open two terminal windows:

#### Terminal 1 — Start the Backend Server:
```powershell
cd c:\projects\GenCanvas-AI-main\server
npm start
```
*Backend runs on: `http://localhost:8080`*

#### Terminal 2 — Start the Frontend Client:
```powershell
cd c:\projects\GenCanvas-AI-main\client
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🌟 Key Features

1. **Authentication System**: Sign Up, Sign In, Remember Me, and Quick 1-Click Demo Login.
2. **AI Image Creation Studio**: Multi-style prompt generator (*Cyberpunk, 3D Render, Anime, Photorealistic, etc.*), aspect ratios (*1:1, 16:9, 9:16, 4:3*), and "Surprise Me" prompts.
3. **Instant High-Res Downloads**: 1-click download of generated images directly to your computer.
4. **Auto-Stored Gallery**: Every created image is automatically saved and displayed in the Community Gallery.
5. **Favorites Collection**: Save and organize your favorite AI artworks with MongoDB sync.
6. **User Profile & Dynamic Navbar**: Dynamic account profile, stats, and user avatar dropdown with logout.

---

## 🗄️ Database & Environment Configuration

Backend configuration is stored in [`server/.env`](file:///c:/projects/GenCanvas-AI-main/server/.env):
```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.aab3xam.mongodb.net/gencanvas?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=gencanvas_super_secret_jwt_key_2026
```
*(Data is persistently stored in MongoDB Atlas cloud, so your accounts, posts, and favorites will never be lost when you stop the server).*
