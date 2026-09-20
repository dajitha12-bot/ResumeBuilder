# AI Resume Builder & Career Vault Platform

A complete, modern, responsive AI-powered Resume Builder and Career Preparation web application designed specifically for college students, freshers, and job seekers.

The system focuses on **AI-powered resume creation, job description matching, explainable ATS scoring, career knowledge management (Career Vault), claim verification (Resume Truth Guard), and personalized interview preparation**.

---

## 🌟 Unique Differentiating Features

1. **Resume Truth Guard**: Audits AI-generated resume content against your personal Career Vault to detect and flag unverified metrics or unsupported claims before finalizing.
2. **Career Vault & Skill Evidence Visualizer**: Centralized career knowledge base linking skills directly to supporting project and experience proof trees.
3. **AI Project Selector**: Analyzes target Job Descriptions and auto-recommends matching projects with star ratings and explicit rationale.
4. **Explainable ATS Scoring**: Transparent score breakdown (Keyword Match 35, Skills 30, Experience 20, Education 10, Formatting 5) with specific line-item reasons ("Why this score?").
5. **Resume-to-Interview AI**: Generates technical and behavioral interview questions directly from bullet points on your actual resume, categorized by difficulty (Basic, Intermediate, Advanced).
6. **Skill Gap Roadmap**: Identifies missing job skills and suggests a priority-ordered learning path.
7. **Pre-Flight Export Audit**: Verifies section completeness, ATS compatibility, and formatting prior to PDF and DOCX downloads.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), JavaScript, Tailwind CSS, Lucide Icons, `html2pdf.js`, `docx`.
- **Backend**: Node.js, Express.js.
- **Data Storage**: **JSON Files ONLY** (`backend/data/*.json`) using Node.js `fs.promises`. No external databases.
- **AI Integration**: OpenAI API compatible layer with an intelligent, deterministic **Mock AI Fallback Service** when `OPENAI_API_KEY` is not provided.

---

## 📂 Project Structure

```
ai-resume-builder/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── BulletGeneratorModal.jsx
│   │   │   ├── TruthGuardBadge.jsx
│   │   │   ├── EvidenceGraph.jsx
│   │   │   └── PreFlightModal.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── JobAnalyzerATS.jsx
│   │   │   ├── CareerVault.jsx
│   │   │   └── AICareerAssistant.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── exportUtils.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── data/
│   │   ├── users.json
│   │   ├── resumes.json
│   │   ├── career_vault.json
│   │   ├── job_descriptions.json
│   │   ├── ats_analysis.json
│   │   └── resume_versions.json
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── careerRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── atsRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── truthGuard.js
│   │   ├── jobAnalyzer.js
│   │   ├── atsService.js
│   │   ├── careerService.js
│   │   └── resumeService.js
│   ├── utils/
│   │   └── jsonStorage.js
│   ├── server.js
│   └── package.json
│
├── .env.example
├── start_backend.bat
├── start_frontend.bat
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
The backend API will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server will run on `http://localhost:3000`.

---

## 🔑 Demo Account Preloaded Data

The platform comes pre-seeded with demo data for **Ajitha D R**:
- **College**: National Engineering College (III Year B.Tech IT)
- **Projects**: Smart University Event Management, Smart Transit Pass Portal, Ocean Intelligence Platform, AI Zoo Planner
- **Internship**: Full Stack Java Internship (Cognizant)
- **Certifications**: NPTEL Technical English, MongoDB Basics, IoT, Cisco Networking
