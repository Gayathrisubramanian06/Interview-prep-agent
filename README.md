# PrepAI – Smart Interview Practice Bot ⚡

An AI-powered mock interview practice platform featuring domain-specific technical & HR question banks, company-specific preparation, client-side PDF/DOCX resume parsing with targeted question generation, and real-time adaptive difficulty.

Designed with a **Laser Lemon & Night Shift** warm aesthetic (`#0c0b08`, `#d4ff00`, `#ffb830`) and clean vector SVG icons (zero emojis).

---

## 🚀 Features

- **Domain-Specific Preparation**:
  - Web Development (HTML, CSS, JS, React, Node.js)
  - Data Science (Python, SQL, ML, Statistics)
  - Machine Learning & Deep Learning (PyTorch, TensorFlow, NLP, CV)
  - Backend Engineering (Distributed Systems, APIs, Caching, Databases)
  - Frontend Engineering (Core Web Vitals, Design Systems, State Management)
  - DevOps & Cloud (Docker, Kubernetes, CI/CD, AWS)
  - Mobile Development (iOS, Android, React Native, Flutter)
  - Product Management & System Design

- **Company-Specific Prep**:
  - Google, Amazon, Microsoft, Meta, Apple, Netflix, Startups, and General.

- **Intelligent Resume Parsing**:
  - Direct browser client-side extraction for **PDF**, **DOCX**, **TXT**, and **Markdown** resumes.
  - Automatically extracts:
    - 150+ technology keywords & frameworks
    - Key projects & architecture highlights
    - Experience roles & timeline
  - Instant sample resume presets (Full Stack, Data Science, Frontend).

- **Resume-Driven Adaptive Question Engine**:
  - Generates deep-dive questions directly on the candidate's actual projects, listed tech stack, and experience.
  - Dynamically tags questions (`Resume: <Skill/Project>`).
  - Adapts difficulty (`Easy` → `Medium` → `Hard`) based on real-time performance evaluation.

- **Performance Analytics & Report**:
  - Detailed score breakdown across Technical, HR, and Resume topics.
  - Performance chart visualizer.
  - Comprehensive question-by-question review with actionable feedback.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS
- **Design System**: Laser Lemon (`#d4ff00`), Night Shift Amber (`#ffb830`), Glassmorphism, Animated Particle Canvas
- **Libraries**:
  - [PDF.js](https://mozilla.github.io/pdf.js/) for in-browser PDF text extraction
  - [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for in-browser DOCX text extraction

---

## 💻 Running Locally

Simply open `index.html` in any modern web browser, or run a local HTTP server:

```bash
# Using Python
python -m http.server 3000

# Open http://localhost:3000
```
