# MedCare Connect — Healthcare Support Web App

A mini healthcare support web app built as an internship assignment for **Jarurat Care** — Full Stack Developer (AI-Enabled) Internship.

---

## 🌐 Live Demo
> Add your Netlify live link here after deployment

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (custom properties, Grid, Flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| AI | Groq API — LLaMA 3.3 70B (free, ultra-fast inference) |
| Serverless | Netlify Functions (API proxy) |
| Fonts | Google Fonts — Cormorant Garamond + DM Sans |
| Hosting | Netlify (static + serverless) |

No frameworks, no build tools — pure, deployable HTML/CSS/JS.

---

## 🤖 AI Feature — Healthcare FAQ Chatbot

### What it does
An embedded AI assistant powered by **Groq's LLaMA 3.3 70B** model that handles patient and volunteer queries in real-time with extremely fast response times.

### How it works
1. User types a question in the chat window (or taps a suggestion chip)
2. The frontend sends the message to `/api/chat` — our own serverless Netlify Function
3. The function securely calls the **Groq API** server-side (API key never exposed)
4. LLaMA 3.3 70B responds and the reply is returned to the frontend
5. Conversation history is maintained client-side for multi-turn context

### Why Groq?
- **Completely free** — 14,400 requests/day, no billing required
- **Ultra-fast** — Groq's custom LPU hardware delivers near-instant responses
- **Powerful model** — LLaMA 3.3 70B matches GPT-4 class quality
- **India-friendly** — works without regional restrictions

### API Key Security
- The `GROQ_API_KEY` is stored as a **Netlify environment variable** — never in code or GitHub
- All Groq requests are proxied through `netlify/functions/chat.js`
- The `.gitignore` excludes `.env` so no secrets are ever committed

### System Prompt Design
The chatbot is constrained via a system prompt to:
- Answer questions about MedCare Connect's specific services
- Guide patients/volunteers through registration steps
- Provide general (non-diagnostic) health information
- Redirect emergencies to **108** (India's emergency helpline)
- Always recommend professional consultation for medical concerns

### NGO Use Case
In rural and semi-urban areas of Northeast India, many patients don't know what kind of help they need or how to ask for it. An AI chatbot available 24/7 can:
- Triage patient queries before human volunteers respond
- Answer repetitive FAQs (service availability, registration, costs)
- Provide basic health guidance in simple, accessible language
- Reduce volunteer workload by filtering informational vs. urgent requests
- Be extended in future to support regional languages (Assamese, Bengali, Bodo)

---

## 📋 Features

### Forms
- **Patient Support Registration** — Name, age, contact, location, type of support, preferred contact time
- **Volunteer Registration** — Profession, skills (checkboxes), availability (range slider), motivation
- **Contact Form** — General inquiries, partnerships, donations, feedback
- All forms show a success modal on submission

### UI/UX
- Fixed navigation with blur backdrop
- Animated hero section with floating gradient orbs
- Impact statistics (patients supported, volunteers, districts)
- Tab-based form switching with smooth transitions
- Typing indicator in chatbot
- Quick-reply suggestion chips
- Fully responsive (mobile-friendly)

---

## 🚀 Deployment on Netlify

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/medcare-connect.git
git push -u origin main
```

### Step 2 — Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from GitHub**
2. Select your repository
3. Build settings: leave everything blank (static site)
4. Click **Deploy**

### Step 3 — Add Environment Variable
1. Go to **Site Settings → Environment Variables**
2. Add: `GROQ_API_KEY` = your Groq API key
3. Trigger a redeploy — done ✅

Get your free Groq API key at [console.groq.com](https://console.groq.com) — no billing required.

---

## 📁 Project Structure

```
medcare-connect/
├── index.html                  # Main app
├── style.css                   # All styles
├── app.js                      # Frontend logic + chatbot
├── netlify.toml                # Routes /api/chat → function
├── .gitignore                  # Excludes .env
└── netlify/
    └── functions/
        └── chat.js             # Serverless proxy (Groq API)
```

---

## 🏥 NGO Context

**MedCare Connect** is a conceptual non-profit initiative aimed at:
- Connecting underserved patients in Assam & Northeast India with volunteer healthcare workers
- Providing free medical consultations, mental health support, and home nursing care
- Leveraging AI (Groq + LLaMA 3.3 70B) to scale support without proportionally scaling staff costs

---

*Built with care for communities that need it most.*