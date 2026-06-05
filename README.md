# QiXing ZhiGu · Drug Overseas-Market Pipeline Assessment Platform (DEMO)

> 启星智谷 · 药物出海管线评估平台

An AI-agent-driven platform that evaluates drug R&D pipelines for **overseas market entry / business development (BD)**. Given a drug candidate, the platform runs a multi-dimensional, evidence-based assessment, recommends target destination markets, produces an investment recommendation, and generates a citation-backed report.

> ⚕️ This is a product prototype for demonstration purposes. All drugs, scores and sources are mock data and do not constitute investment or medical advice.

## ✨ Highlights

- **Multi-dimensional scoring** — pipelines are assessed across six dimensions aligned with a go/no-go decision framework:
  Scientific validity · Clinical feasibility · Regulatory compliance · Commercial viability · IP / Freedom-to-Operate · Overseas-market fit
- **Investment recommendation** — a composite score maps to a clear label (Strongly Recommend / Recommend / Watch Closely / Not Recommended).
- **Destination market analysis** — compares candidate overseas markets by regulatory fit, competitive landscape and execution difficulty.
- **AI research progress with citations** — simulates an AI agent gathering evidence step by step, with a traceable citation list.
- **Configurable models & knowledge bases** — choose the reasoning model, research depth, and which knowledge bases to ground the analysis on.
- **Report export** — assessment results can be exported to a Word document (via `docx`).

## 🧩 Tech Stack

React 18 · Vite 5 · React Router · Tailwind CSS · Recharts · lucide-react · docx

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Then open the URL printed by Vite (default http://localhost:5173).

## 🗂️ Project Structure

```
.
├── index.html
├── src/
│   ├── main.jsx              # App entry
│   ├── App.jsx               # Routes
│   ├── index.css             # Tailwind layers + global styles
│   ├── components/           # Layout, Sidebar, ScoreCard, ScoreRadar,
│   │                         #   DestinationCard, InvestmentCard,
│   │                         #   CitationList, ResearchProgress
│   ├── pages/                # Dashboard, NewAssessment, Report
│   └── data/                 # dimensions, knowledgeBases, mockDrugs, models
├── public/                   # Static assets (favicon)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── 部署说明.md                # Deployment notes (nginx + HTTPS)
└── PRD & assets              # Product Requirements Document (docx / pdf)
```

## 📄 Documentation

- Product Requirements Document: `药物出海评估平台-PRD.docx` / `.pdf`
- Deployment guide: `部署说明.md`
