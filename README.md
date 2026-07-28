<div align="center">

# 🌍 Voyager

### **Plan less. Explore more.**

An AI-powered, **map-first travel platform** that transforms destinations into intelligent, interactive journeys.

<p>
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gemini-AI-8E75FF?style=for-the-badge"/>
</p>

---

### 🚀 Live Demo

https://voyager-3pd4.vercel.app/

</div>

---

# 📸 Preview

> Replace these with screenshots after deployment.

## Landing Page

<p align="center">
<img src="Screenshot 2026-07-29 010756.png.png" width="900"/>
</p>

---

## Interactive Map

<p align="center">
<img src="screenshots/map.png" width="900"/>
</p>

---

## AI Activity Panel

<p align="center">
<img src="screenshots/details.png" width="900"/>
</p>

---

# ✨ What is Voyager?

Planning a trip today is frustrating.

You open Google Maps.

Then a travel blog.

Then Reddit.

Then weather.

Then another tab for restaurants.

Then Notes.

Then back to Maps.

Voyager brings all of this into one intelligent workspace.

Simply enter a destination and Voyager generates a personalized journey that you can visualize, modify, and explore directly on an interactive map.

---

# 🚀 Features

## 🗺️ Map-First Experience

Unlike traditional itinerary planners, Voyager is built around the map.

Every activity, route, and recommendation is visualized geographically.

---

## 🤖 AI Itinerary Generation

Generate complete multi-day travel plans within seconds.

- Personalized schedules
- Smart activity ordering
- Estimated duration
- Budget estimation

---

## 🌤 Weather Integration

Integrated weather forecasts help travelers make smarter decisions throughout the trip.

---

## 📍 Route Visualization

Every day is displayed as an interactive route.

- Connected paths
- Activity markers
- Timeline synchronization

---

## 💬 AI Trip Editing

Modify your itinerary using natural language.

Examples:

> Replace today's lunch with something local.

> Reduce walking distance.

> Add more cultural places.

---

## 🔐 Authentication

- JWT Authentication

- Protected APIs

- Secure Sessions

---

# 🏗 Architecture

```text
                     React + TypeScript
                             │
          TanStack Query + Zustand + Axios
                             │
                             ▼
                  Spring Boot REST API
                             │
      ┌────────────┬─────────────┬────────────┐
      ▼            ▼             ▼
 Gemini API   Google Maps API   Weather API
                             │
                             ▼
                        PostgreSQL
```

---

# 🛠 Tech Stack

| Frontend | Backend | APIs |
|-----------|----------|------|
| React | Spring Boot | Gemini |
| TypeScript | Spring Security | Google Maps |
| Vite | JWT | OpenWeather |
| Zustand | PostgreSQL | |
| TanStack Query | Maven | |

---

# 📂 Project Structure

```text
Voyager

├── Backend
│
│   ├── controller
│   ├── service
│   ├── repository
│   ├── security
│   ├── config
│   └── dto
│
├── Frontend
│
│   ├── components
│   ├── hooks
│   ├── pages
│   ├── services
│   ├── store
│   └── assets
│
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/gaurang2456/Voyager.git

cd Voyager
```

Backend

```bash
cd Backend

./mvnw spring-boot:run
```

Frontend

```bash
cd Frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Backend

```env
DATABASE_URL=

DATABASE_USERNAME=

DATABASE_PASSWORD=

JWT_SECRET=

GEMINI_API_KEY=

GOOGLE_MAPS_API_KEY=

OPENWEATHER_API_KEY=
```

Frontend

```env
VITE_API_URL=
```

---

# 🎯 Roadmap

- ✅ AI Itinerary Generation

- ✅ Interactive Maps

- ✅ Weather Integration

- ✅ Route Visualization

- ✅ Budget Tracking

- ✅ Secure Authentication

- 🔄 Google Places Integration

- 🔄 Offline Support

- 🔄 Collaborative Trips

- 🔄 AI Route Optimization

---

# 💡 Why Voyager?

Most travel planners produce a static list of places.

Voyager is built around one simple idea:

> **The map is the experience.**

Instead of planning in disconnected apps, travelers can generate, visualize, and refine their journey inside one intelligent workspace.

---

# 🤝 Contributing

Pull requests are welcome.

If you have ideas for improving Voyager, feel free to open an issue.

---


<div align="center">

### ⭐ If you found Voyager interesting, consider giving the repository a star.

Built with Spring Boot, React and a questionable number of iterations over a single route color.

</div>
