# Davidson's AI Portfolio

A high-performance, visually stunning portfolio for an AI Engineer and Automation Specialist, featuring interactive data visualizations, a portfolio-aware AI assistant (Ndu), and secure chat history storage.

## ✨ Features

- **Interactive AI Assistant (Ndu)**: Built with Google Gemini 2.5 Flash, Ndu can answer questions about your skills, projects, and experience using a live knowledge base.
- **Dynamic Data Store**: A single source of truth (`data/portfolioData.ts`) powers the entire site. Update once, reflect everywhere.
- **Secure Chat History**: A dedicated Node.js backend stores chat conversations locally in a JSON file.
- **Glassmorphic UI**: Premium design with glassmorphism, smooth animations, and a responsive layout.
- **Tech Stack**: React, TypeScript, Vite, Tailwind CSS, Google Generative AI, Recharts, Express (Backend).

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### 2. Installation
```bash
git clone https://github.com/yourusername/davidson-ai-portfolio.git
cd davidson-ai-portfolio
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Running the Application
You need to run **two** terminals to have the full experience (Frontend + Backend).

**Terminal 1: Frontend (Portfolio)**
```bash
npm run dev
```
> Access at http://localhost:3000

**Terminal 2: Backend (Chat Storage)**
```bash
npm run backend
```
> Runs on http://localhost:3001. Required for saving chat history.

## 🛠 Deployment to GitHub Pages (Custom Domain)

This project is configured for deployment to GitHub Pages with the custom domain `dgi.qzz.io`.

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

### Cloudflare Configuration
To connect `dgi.qzz.io`, add the following DNS record in your Cloudflare dashboard:
- **Type**: CNAME
- **Name**: `dgi` (or `@` if using root)
- **Target**: `yourusername.github.io`
- **Proxy Status**: Proxied (Orange Cloud)

## 📁 Project Structure

- `/components`: React UI components (Hero, About, Skills, Chat, etc.)
- `/data`: `portfolioData.ts` (The central brain of the portfolio)
- `/server.mjs`: Node.js backend for saving secure chat history
- `/public`: Static assets (images, CNAME)
