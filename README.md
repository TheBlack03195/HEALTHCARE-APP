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
| AI | Google Gemini 2.5 Flash via Generative Language API |
| Serverless | Netlify Functions (API proxy) |
| Fonts | Google Fonts — Cormorant Garamond + DM Sans |
| Hosting | Netlify (static + serverless) |

No frameworks, no build tools — pure, deployable HTML/CSS/JS.

---

## 🤖 AI Feature — Healthcare FAQ Chatbot

### What it does
An embedded AI assistant powered by **Google Gemini 2.5 Flash** that handles patient and volunteer queries in real-time.

### How it works
1. User types a question in the chat window (or taps a suggestion chip)
2. The frontend sends the message to `/api/chat` — our own serverless Netlify Function
3. The function securely calls the **Gemini API** server-side (API key never exposed)
4. Gemini responds and the reply is returned to the frontend
5. Conversation history is maintained client-side for multi-turn context

### API Key Security
- The `GEMINI_API_KEY` is stored as a **Netlify environment variable** — never in code or GitHub
- All Gemini requests are proxied through `netlify/functions/chat.js`
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
2. Add: `GEMINI_API_KEY` = `your_actual_api_key`
3. Trigger a redeploy — done ✅

Get your Gemini API key free at [aistudio.google.com](https://aistudio.google.com)

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
        └── chat.js             # Serverless proxy (Gemini API)
```

---

## 🏥 NGO Context

**MedCare Connect** is a conceptual non-profit initiative aimed at:
- Connecting underserved patients in Assam & Northeast India with volunteer healthcare workers
- Providing free medical consultations, mental health support, and home nursing care
- Leveraging AI (Gemini 2.5 Flash) to scale support without proportionally scaling staff costs

---

*Built with care for communities that need it most.*