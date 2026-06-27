<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=Sagar%20Mishra%20%E2%80%94%20Portfolio&fontSize=40&fontColor=ffffff&fontAlignY=38&desc=Personal%20Developer%20Portfolio%20%7C%20Live%20at%20sagarxdev.netlify.app&descColor=a78bfa&descAlignY=58&animation=fadeIn" width="100%"/>

</div>

<div align="center">

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-sagarxdev.netlify.app-a78bfa?style=for-the-badge)](https://sagarxdev.netlify.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)

</div>

<div align="center">

### 🔗 [➡️ View Live Demo — sagarxdev.netlify.app](https://sagarxdev.netlify.app/)

</div>

---

## 📌 Overview

A modern, full-featured **personal developer portfolio** built with **Next.js 16**, **React 19**, and **TypeScript**. The portfolio dynamically fetches live GitHub data, features a 3D interactive background powered by **Three.js**, an integrated **AI Assistant**, and a secure **Admin Dashboard** — all deployed on Netlify.

---

## ✨ Features

| Feature | Description |
|:---|:---|
| 🌐 **Live GitHub Integration** | Fetches real-time profile & repositories via GitHub API with ISR (5-min revalidation) |
| 🎮 **3D Interactive Background** | Three.js powered animated 3D scene & globe |
| 🤖 **AI Assistant** | Built-in AI assistant for visitor interaction |
| 🗂️ **Project Showcase** | Cards with modals displaying live project details |
| 🔐 **Admin Dashboard** | JWT-secured admin panel for content management |
| 📱 **Fully Responsive** | Mobile-first design across all screen sizes |
| ⚡ **ISR Caching** | Smart fallback static data when GitHub API is unavailable |

---

## 🛠️ Tech Stack

### Core
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)

### Styling
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)

### 3D & Visuals
![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=threedotjs)
![Lucide](https://img.shields.io/badge/Lucide%20React-icons-6d28d9?style=flat-square)

### Auth & Security
![JWT](https://img.shields.io/badge/JWT-Auth-d97706?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcryptjs-hashing-gray?style=flat-square)

### Deployment
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)

---

## 🗂️ Project Structure

```
PORTFOLIO/
├── app/
│   ├── admin/          # Secure admin dashboard (JWT protected)
│   ├── api/            # Next.js API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (GitHub data fetching + ISR)
├── components/
│   ├── PortfolioClient.tsx     # Main portfolio UI
│   ├── AIAssistant.tsx         # AI chat assistant
│   ├── Background3D.tsx        # Three.js animated background
│   ├── Globe3D.tsx             # Interactive 3D globe
│   ├── ProjectCard.tsx         # Project display card
│   ├── ProjectModal.tsx        # Detailed project modal
│   └── AdminDashboardClient.tsx
├── lib/
│   └── github.ts       # GitHub API integration
├── data/               # Static fallback data
└── public/             # Static assets
```

---

## 🚀 Projects Showcased

| Project | Tech | Description |
|:---|:---|:---|
| **QuickBite** | JS, MERN, Stripe | Full food delivery app with JWT auth & Stripe payments |
| **SmartScribe** | JS, OpenAI, MERN | AI study assistant — summaries, flashcards & quizzes |
| **ChatWave** | JS, Socket.io, MERN | Real-time chat with group channels & typing indicators |
| **Quill** | HTML, CSS, JS | Minimal journaling app with category-based log system |
| **Brick Breaker** | Java, AWT/Swing | Desktop game with collision physics & dynamic levels |
| **WeatherForecast** | HTML, CSS, JS | Live weather dashboard using Weather API |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js `v18+`
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/SagarXdev23/MY_PORTFOLIO.git
cd MY_PORTFOLIO

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GITHUB_TOKEN=your_github_personal_access_token
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🌐 Deployment

This project is deployed on **Netlify** using the `@netlify/plugin-nextjs` adapter.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

Configure the following in your Netlify dashboard:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Environment variables:** Same as `.env.local`

---

## 📬 Connect

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-sagarxdev.netlify.app-a78bfa?style=for-the-badge)](https://sagarxdev.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-SagarXdev23-121011?style=for-the-badge&logo=github)](https://github.com/SagarXdev23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sagar-mishra-5035a4280/)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=100&section=footer" width="100%"/>

</div>
