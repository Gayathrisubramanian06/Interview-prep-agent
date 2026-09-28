/* =============================================
   PrepAI – Main Application Logic
   ============================================= */

/* -------- Global State -------- */
let state = {
  selectedDomain: null,
  selectedCompany: null,
  resumeText: '',
  resumeSkills: [],
  resumeProjects: [],
  resumeExperience: [],
  mode: 'technical',       // 'technical' | 'hr' | 'mixed'
  difficulty: 'easy',      // 'easy' | 'medium' | 'hard'
  difficultyScore: 0,       // 0–100 moving score
  questionIndex: 0,
  askedQuestions: new Set(),
  sessionHistory: [],       // { question, answer, score, type, feedback }
  totalScore: 0,
  questionsAnswered: 0,
  timerInterval: null,
  secondsElapsed: 0,
  sidebarOpen: true,
  currentQuestion: null,
  useResume: true,
  useCompany: false,
  useAdaptive: true,
  questionQueue: [],
};

/* -------- Canvas Background -------- */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '212,255,0' : '255,184,48';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212,255,0,${0.12 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* -------- Onboarding: Domain Grid -------- */
function initDomainGrid() {
  const grid = document.getElementById('domain-grid');
  grid.innerHTML = '';
  DOMAINS.forEach(domain => {
    const card = document.createElement('div');
    card.className = 'domain-card';
    card.id = `domain-${domain.id}`;
    card.style.setProperty('--card-color', domain.color);
    card.style.setProperty('--card-color-rgb', domain.colorRgb);
    card.onclick = () => selectDomain(domain.id);
    card.innerHTML = `
      <span class="domain-abbr">${domain.icon}</span>
      <div class="domain-name">${domain.name}</div>
      <div class="domain-tags">${domain.tags}</div>
      <div class="domain-check">&#10003;</div>
    `;
    grid.appendChild(card);
  });
}

function selectDomain(id) {
  document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(`domain-${id}`).classList.add('selected');
  state.selectedDomain = id;
  document.getElementById('btn-domain-next').disabled = false;
}

/* -------- Onboarding: Company Grid -------- */
function initCompanyGrid() {
  const grid = document.getElementById('company-grid');
  grid.innerHTML = '';
  COMPANIES.forEach(company => {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.id = `company-${company.id}`;
    card.onclick = () => selectCompany(company.id);
    card.innerHTML = `
      <span class="company-abbr">${company.logo}</span>
      <span class="company-name">${company.name}</span>
    `;
    grid.appendChild(card);
  });
}

function selectCompany(id) {
  if (state.selectedCompany === id) {
    // Deselect
    document.getElementById(`company-${id}`).classList.remove('selected');
    state.selectedCompany = null;
    return;
  }
  document.querySelectorAll('.company-card').forEach(c => c.classList.remove('selected'));
  if (id) {
    document.getElementById(`company-${id}`)?.classList.add('selected');
  }
  state.selectedCompany = id;
}

function searchCompany(query) {
  const q = query.toLowerCase().trim();
  if (!q) { initCompanyGrid(); return; }
  const grid = document.getElementById('company-grid');
  grid.innerHTML = '';
  COMPANIES.filter(c => c.name.toLowerCase().includes(q)).forEach(company => {
    const card = document.createElement('div');
    card.className = `company-card${state.selectedCompany === company.id ? ' selected' : ''}`;
    card.id = `company-${company.id}`;
    card.onclick = () => selectCompany(company.id);
    card.innerHTML = `<span class="company-abbr">${company.logo}</span><span class="company-name">${company.name}</span>`;
    grid.appendChild(card);
  });
}

/* -------- Step Navigation -------- */
function goToStep(stepId) {
  document.querySelectorAll('.onboard-step').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(stepId);
  target.style.display = '';
  // Force reflow for animation
  void target.offsetWidth;
  target.classList.add('active');
}

/* -------- Resume Handling & Document Parsing -------- */

// Sample resumes for instant 1-click testing
const SAMPLE_RESUMES = {
  fullstack: `ALEX RIVERA — Full Stack Software Engineer
Email: alex.rivera@example.com | Portfolio: github.com/alexrivera

SUMMARY
Full Stack Engineer with 3+ years of experience designing and deploying scalable web apps and microservices.

TECHNICAL SKILLS
• Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
• Frontend: React, Redux Toolkit, Next.js, Tailwind CSS, Webpack
• Backend: Node.js, Express, Django, FastAPI, REST APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis, Prisma ORM
• Cloud & DevOps: Docker, Kubernetes, AWS (S3, EC2, Lambda), CI/CD (GitHub Actions), Nginx
• Tools & Practices: Git, Agile/Scrum, Jest, Cypress, Microservices architecture

EXPERIENCE
Software Engineer | CloudScale Technologies (2022 – Present)
• Architected and shipped a multi-tenant SaaS analytics platform using React, TypeScript, and Node.js microservices.
• Reduced backend API response latency by 45% by implementing Redis distributed caching and optimizing PostgreSQL query indexing.
• Deployed Dockerized container services to AWS ECS with automated GitHub Actions CI/CD pipelines.
• Integrated Stripe payment gateway and WebSockets for live subscription updates and notifications.

Junior Web Developer | InnovateTech Labs (2021 – 2022)
• Built reusable React component libraries and integrated RESTful endpoints with Express and MongoDB.
• Implemented JWT authentication with role-based access control (RBAC) and refresh token rotation.

PROJECTS
• Real-Time Collaborative Canvas: Built a multi-user drawing and whiteboard app using React, Node.js, WebSockets, and Redis Pub/Sub.
• E-Commerce Microservices Engine: Designed distributed services for catalog, cart, and payment with RabbitMQ event messaging and PostgreSQL.

EDUCATION
B.S. in Computer Science — State University (2017 – 2021)`,

  datascience: `PRIYA SHARMA — Data Scientist & Machine Learning Engineer
Email: priya.sharma@example.com | LinkedIn: linkedin.com/in/priyasharma

SUMMARY
Data Scientist with expertise in predictive modeling, NLP, and deploying ML pipelines into production.

TECHNICAL SKILLS
• Languages: Python, SQL, R, Bash
• ML / DL: PyTorch, TensorFlow, Scikit-Learn, XGBoost, LightGBM, Hugging Face Transformers
• Data Processing: Pandas, NumPy, SciPy, Spark, Polars
• MLOps & Cloud: Docker, FastAPI, MLflow, AWS S3, AWS SageMaker, DVC, Airflow
• Visualization: Matplotlib, Seaborn, Tableau, Streamlit
• Core Competencies: Natural Language Processing (NLP), Deep Learning, Classification, Time Series Forecasting

EXPERIENCE
Machine Learning Engineer | Apex Data Labs (2022 – Present)
• Built an end-to-end customer churn prediction pipeline using XGBoost and PyTorch, achieving 93.4% ROC-AUC.
• Deployed real-time inference microservices using FastAPI and Docker on AWS SageMaker with under 40ms p99 latency.
• Automated model retraining and data drift detection workflows using Apache Airflow and MLflow.

Data Analyst | DataCorp Solutions (2021 – 2022)
• Analyzed 10M+ transaction records using SQL and Pandas to discover high-churn customer cohorts.
• Developed interactive executive dashboards in Tableau and Streamlit for cross-functional stakeholders.

PROJECTS
• Financial Sentiment Analyzer: Fine-tuned BERT and RoBERTa models using Hugging Face to predict stock market sentiment from financial news.
• Healthcare Anomaly Detector: Built autoencoder neural networks in PyTorch to identify anomalous medical sensor telemetry.

EDUCATION
M.S. in Data Science & Artificial Intelligence — Tech Institute (2020 – 2022)
B.Tech in Computer Engineering (2016 – 2020)`,

  frontend: `JORDAN LEE — Senior Frontend Engineer
Email: jordan.lee@example.com | GitHub: github.com/jordanlee

SUMMARY
Frontend Specialist with 4+ years of experience crafting high-performance, accessible, and responsive user interfaces.

TECHNICAL SKILLS
• Core: JavaScript (ESNext), TypeScript, HTML5, Modern CSS (Flexbox, Grid, CSS Variables)
• Frameworks: React, Next.js, Vue.js, Nuxt.js, Svelte
• State & Architecture: Redux Toolkit, Zustand, React Query (TanStack Query), GraphQL Apollo Client
• Styling & Design: Tailwind CSS, styled-components, Sass, Figma, Design Systems, Storybook
• Testing & Build: Jest, React Testing Library, Cypress, Vite, Webpack, Vitest, CI/CD
• Performance: Web Vitals, Code Splitting, SSR/SSG, Lighthouse 95+ score optimization

EXPERIENCE
Senior Frontend Developer | NextGen Apps (2022 – Present)
• Spearheaded migration of legacy SPA to Next.js 14 App Router, boosting First Contentful Paint by 60%.
• Built an accessible, WCAG AA-compliant enterprise design system in Storybook used across 12 product teams.
• Optimized Core Web Vitals across e-commerce product pages, increasing organic conversion rate by 18%.

Frontend Developer | PixelCraft Studio (2020 – 2022)
• Developed complex interactive data visualization dashboards using React, D3.js, and Canvas API.
• Mentored 4 junior developers and established automated testing pipelines achieving 85% code coverage.

PROJECTS
• FinTech Portfolio Tracker: Real-time stock portfolio manager built with Next.js, Tailwind CSS, WebSockets, and Chart.js.
• Headless CMS E-Commerce Storefront: Superfast JAMstack shopping experience built with React, GraphQL, and Stripe.

EDUCATION
B.S. in Software Engineering — University of Technology (2016 – 2020)`
};

function loadSampleResume(type) {
  const text = SAMPLE_RESUMES[type] || SAMPLE_RESUMES.fullstack;
  document.getElementById('resume-text').value = text;
  handleResumeTextInput(text);
  
  // Set matching domain if not already chosen
  if (!state.selectedDomain) {
    if (type === 'datascience') selectDomain('datascience');
    else if (type === 'frontend') selectDomain('frontend');
    else selectDomain('webdev');
  }
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('resume-drop-zone').classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  document.getElementById('resume-drop-zone').classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('resume-drop-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processResumeFile(file);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processResumeFile(file);
}

function handleResumeTextInput(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    document.getElementById('resume-preview').classList.add('hidden');
    state.resumeText = '';
    state.resumeSkills = [];
    state.resumeExperience = [];
    state.resumeProjects = [];
    return;
  }
  showResumePreview(trimmed);
}

async function processResumeFile(file) {
  const dropText = document.getElementById('drop-main-text');
  const dropSub = document.getElementById('drop-sub-text');
  
  const originalMain = dropText.textContent;
  const originalSub = dropSub.textContent;
  
  dropText.textContent = `Reading ${file.name}...`;
  dropSub.textContent = 'Extracting and parsing text...';

  try {
    let extractedText = '';
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      extractedText = await parsePdfFile(file);
    } else if (ext === 'docx' || ext === 'doc') {
      extractedText = await parseDocxFile(file);
    } else {
      // Plain text / MD / RTF
      extractedText = await parseTextFile(file);
    }

    if (!extractedText || extractedText.trim().length < 20) {
      // Fallback text reader
      extractedText = await parseTextFile(file);
    }

    document.getElementById('resume-text').value = extractedText;
    showResumePreview(extractedText, file.name);

    dropText.textContent = `Uploaded: ${file.name}`;
    dropSub.textContent = `${(file.size / 1024).toFixed(1)} KB — Parsed successfully`;

  } catch (err) {
    console.error('File parsing error:', err);
    // Fallback plain text read
    try {
      const fallbackText = await parseTextFile(file);
      document.getElementById('resume-text').value = fallbackText;
      showResumePreview(fallbackText, file.name);
      dropText.textContent = `Uploaded: ${file.name}`;
      dropSub.textContent = 'Text extracted';
    } catch (e) {
      dropText.textContent = 'Could not parse file automatically';
      dropSub.textContent = 'Please paste your resume text below directly';
    }
  }
}

function parseTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function parsePdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  // Use PDF.js if loaded
  if (window.pdfjsLib) {
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      if (fullText.trim().length > 30) return fullText;
    } catch (e) {
      console.warn('PDF.js parse warning, trying fallback stream decoder:', e);
    }
  }

  // Pure JS stream string decoder fallback
  const bytes = new Uint8Array(arrayBuffer);
  let rawStr = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if ((b >= 32 && b <= 126) || b === 10 || b === 13) {
      rawStr += String.fromCharCode(b);
    } else {
      rawStr += ' ';
    }
  }

  // Extract readable words of length >= 3
  const words = rawStr.match(/[A-Za-z0-9+#.\-_/]{2,}/g) || [];
  return words.join(' ');
}

async function parseDocxFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  if (window.mammoth) {
    try {
      const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      if (result && result.value && result.value.trim().length > 20) {
        return result.value;
      }
    } catch (e) {
      console.warn('Mammoth docx parse warning:', e);
    }
  }
  return parseTextFile(file);
}

function showResumePreview(text, fileName = '') {
  const preview = document.getElementById('resume-preview');
  preview.classList.remove('hidden');

  const skills = extractSkills(text);
  const projects = extractProjects(text);
  const experience = extractExperience(text);

  state.resumeText = text;
  state.resumeSkills = skills;
  state.resumeProjects = projects;
  state.resumeExperience = experience;

  let skillsHtml = skills.length > 0
    ? `<div class="skills-chip-list">${skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}</div>`
    : `<em style="color:var(--text-muted);">No common tech keywords detected. Type or add skills like Python, React, SQL above.</em>`;

  let projectsHtml = projects.length > 0
    ? `<div class="resume-preview-section">
         <div class="resume-preview-label">Detected Projects &amp; Highlights</div>
         ${projects.slice(0, 3).map(p => `<div class="project-chip">${escapeHtml(p)}</div>`).join('')}
       </div>`
    : '';

  let expHtml = experience.length > 0
    ? `<div class="resume-preview-section">
         <div class="resume-preview-label">Detected Roles &amp; Experience</div>
         ${experience.slice(0, 2).map(e => `<div class="project-chip" style="border-color:rgba(212,255,0,0.3);color:var(--accent);">${escapeHtml(e)}</div>`).join('')}
       </div>`
    : '';

  preview.innerHTML = `
    <div class="resume-preview-header">
      <span class="resume-preview-title">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M13.5 4.5l-7 7L3 8" stroke="#d4ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${fileName ? `Resume Ready: ${escapeHtml(fileName)}` : 'Resume Parsed &amp; Questions Targeted'}
      </span>
      <span style="font-size:11px;color:var(--accent);font-weight:700;">${skills.length} skills identified</span>
    </div>
    <div class="resume-preview-label">Technical Skills Found</div>
    ${skillsHtml}
    ${projectsHtml}
    ${expHtml}
  `;
}

function extractSkills(text) {
  const SKILL_KEYWORDS = [
    // Languages
    'JavaScript','TypeScript','Python','Java','C++','C#','C','Go','Rust','Swift','Kotlin','Ruby','PHP','Scala','R','Dart','SQL','HTML','HTML5','CSS','CSS3','Bash','Shell','PowerShell',
    // Frontend
    'React','Next.js','Vue.js','Vue','Angular','Svelte','Nuxt.js','Redux','Redux Toolkit','Zustand','MobX','GraphQL','Tailwind CSS','Tailwind','Bootstrap','Sass','SCSS','Webpack','Vite','Babel','Material UI','Chakra UI',
    // Backend & API
    'Node.js','Express','NestJS','Django','Flask','FastAPI','Spring Boot','Spring','Ruby on Rails','Laravel','ASP.NET','.NET','gRPC','REST','RESTful','WebSockets','Microservices',
    // Databases & Caches
    'PostgreSQL','MySQL','MongoDB','Redis','Elasticsearch','Cassandra','DynamoDB','SQLite','Firebase','Supabase','Prisma','Mongoose','Oracle','MSSQL',
    // Cloud & DevOps
    'AWS','Amazon Web Services','Azure','GCP','Google Cloud','Docker','Kubernetes','Terraform','Ansible','Jenkins','GitHub Actions','GitLab CI','CI/CD','Nginx','Linux','Serverless','Lambda','ECS','EC2','S3',
    // AI / ML / Data
    'Machine Learning','Deep Learning','Artificial Intelligence','PyTorch','TensorFlow','Scikit-Learn','Keras','Pandas','NumPy','OpenCV','NLP','Computer Vision','LLM','Transformers','Hugging Face','BERT','GPT','LangChain','Spark','Airflow','Tableau','Power BI',
    // Testing & Tools
    'Git','GitHub','GitLab','Jest','Mocha','Cypress','Playwright','Selenium','Postman','Jira','Agile','Scrum','Figma'
  ];

  const found = new Set();
  const lowerText = text.toLowerCase();

  SKILL_KEYWORDS.forEach(skill => {
    // Word boundary match
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_+#])${escaped}([^a-zA-Z0-9_+#]|$)`, 'i');
    if (regex.test(text) || lowerText.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  });

  return Array.from(found);
}

function extractProjects(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const projects = [];

  let inProjectSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(projects|personal projects|academic projects|key projects)/i.test(line)) {
      inProjectSection = true;
      continue;
    }
    if (inProjectSection && /^(education|experience|skills|certifications|awards|summary)/i.test(line)) {
      inProjectSection = false;
    }

    // Capture project bullets or title lines
    if (inProjectSection && line.length > 15 && !/^(projects|technologies|tools):/i.test(line)) {
      projects.push(line.replace(/^[•\-\*]\s*/, ''));
      if (projects.length >= 4) break;
    }

    // Action verb lines anywhere in resume
    if (!inProjectSection && /^(built|developed|designed|engineered|implemented|created|deployed|architected)\s+/i.test(line)) {
      projects.push(line.replace(/^[•\-\*]\s*/, ''));
      if (projects.length >= 4) break;
    }
  }

  return projects.slice(0, 4);
}

function extractExperience(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const experiences = [];

  for (const line of lines) {
    if (
      /\b(software engineer|developer|engineer|data scientist|analyst|intern|lead|architect|consultant|manager|designer)\b/i.test(line) &&
      line.length < 100
    ) {
      experiences.push(line.replace(/^[•\-\*]\s*/, ''));
      if (experiences.length >= 3) break;
    }
  }

  return experiences;
}

function skipResume() {
  state.resumeText = '';
  state.resumeSkills = [];
  state.resumeProjects = [];
  state.resumeExperience = [];
  startInterview();
}

/* -------- Start Interview -------- */
function startInterview() {
  // Ensure resume fields are parsed
  const resumeTextEl = document.getElementById('resume-text');
  state.resumeText = resumeTextEl.value.trim();
  if (state.resumeText) {
    state.resumeSkills = extractSkills(state.resumeText);
    state.resumeProjects = extractProjects(state.resumeText);
    state.resumeExperience = extractExperience(state.resumeText);
  }

  // Auto-detect domain if user didn't pick one
  if (!state.selectedDomain) {
    if (state.resumeSkills.some(s => ['PyTorch','TensorFlow','Pandas','Scikit-Learn','NLP'].includes(s))) {
      state.selectedDomain = 'datascience';
    } else {
      state.selectedDomain = 'webdev';
    }
  }

  // Reset state
  state.questionIndex = 0;
  state.askedQuestions = new Set();
  state.sessionHistory = [];
  state.totalScore = 0;
  state.questionsAnswered = 0;
  state.difficulty = 'easy';
  state.difficultyScore = 10;
  state.questionQueue = [];
  state.secondsElapsed = 0;

  // Transition screens
  document.getElementById('onboarding').classList.remove('active');
  document.getElementById('onboarding').classList.add('hidden');
  const interviewScreen = document.getElementById('interview-screen');
  interviewScreen.classList.remove('hidden');
  interviewScreen.classList.add('active');

  // Update sidebar
  const domain = DOMAINS.find(d => d.id === state.selectedDomain);
  const company = COMPANIES.find(c => c.id === state.selectedCompany);
  document.getElementById('sb-domain').textContent = domain ? `${domain.icon} ${domain.name}` : 'Software';
  document.getElementById('sb-company').textContent = company ? `${company.logo} ${company.name}` : 'General';
  document.getElementById('chat-title').textContent = `Mock Interview${company ? ` @ ${company.name}` : ''}`;
  document.getElementById('chat-subtitle').textContent = `Domain: ${domain?.name || 'Software'} • ${state.mode} mode`;

  // Update sidebar toggles
  document.getElementById('chk-resume').checked = !!state.resumeText;
  document.getElementById('chk-company').checked = !!state.selectedCompany;

  // Start timer
  startTimer();

  // Update difficulty UI
  updateDifficultyUI();

  // Build question queue heavily weighted on resume
  buildQuestionQueue();

  // Start interview
  const messages = document.getElementById('chat-messages');
  messages.innerHTML = '';

  setTimeout(() => {
    const hasResume = state.resumeText && state.resumeSkills.length > 0;
    const skillsList = state.resumeSkills.slice(0, 6).join(', ');

    addBotMessage(`
      <strong>Welcome to your AI Mock Interview!</strong>
      <br/><br/>
      ${hasResume ? `I have thoroughly analyzed your resume. I detected key skills including: <strong>${skillsList}</strong>${state.resumeProjects.length > 0 ? ` and your project work` : ''}.<br/><br/><strong>Our questions will directly test your real resume background, projects, and architecture decisions</strong>, with adaptive difficulty based on how you answer.` : `We will start with foundation questions and adapt difficulty in real time.`}
      <br/><br/>
      Let us begin with your first question. Take your time to structure your response clearly.
    `, 'system');

    setTimeout(() => askNextQuestion(), 1400);
  }, 600);
}

/* -------- Resume-Specific Question Generator -------- */
function generateResumeQuestions(domain) {
  const questions = [];
  const skills = state.resumeSkills || [];
  const projects = state.resumeProjects || [];
  const exp = state.resumeExperience || [];
  const diff = state.difficulty;

  // 1. In-depth questions for each individual skill detected on the resume
  skills.forEach(skill => {
    // Easy level skill questions
    questions.push({
      text: `Your resume lists ${skill}. How does ${skill} work under the hood, and what are its core architectural strengths compared to alternatives?`,
      hint: `Explain fundamental mechanics, lifecycle/execution model, and why you used it.`,
      type: 'technical',
      source: 'resume',
      topic: `${skill} Core`,
      difficulty: 'easy'
    });

    // Medium level skill questions
    questions.push({
      text: `In your experience working with ${skill}, describe a challenging technical bug or performance bottleneck you ran into and how you diagnosed and fixed it.`,
      hint: `Mention the specific symptoms, profiling or debugging tools you used, and the root cause.`,
      type: 'technical',
      source: 'resume',
      topic: `${skill} Debugging`,
      difficulty: 'medium'
    });

    // Hard level skill questions
    questions.push({
      text: `How would you architect a mission-critical, high-throughput system using ${skill} to ensure high availability, zero downtime deployments, and data consistency under heavy load?`,
      hint: `Discuss caching, fault tolerance, connection pooling, horizontal scaling, and failure isolation.`,
      type: 'technical',
      source: 'resume',
      topic: `${skill} Scalability`,
      difficulty: 'hard'
    });
  });

  // 2. Project-based deep dive questions
  projects.forEach((proj, idx) => {
    const projSummary = proj.length > 90 ? proj.substring(0, 90) + '…' : proj;

    questions.push({
      text: `On your resume, you highlighted: "${projSummary}". Can you walk me through the high-level system architecture and explain why you chose that specific technology stack?`,
      hint: `Cover client-server architecture, database choice, API communication, and deployment.`,
      type: 'technical',
      source: 'resume',
      topic: `Project Architecture`,
      difficulty: 'medium'
    });

    questions.push({
      text: `Regarding your project "${projSummary}", what was the most difficult technical trade-off you had to make during implementation, and what would you design differently today?`,
      hint: `Discuss trade-offs (e.g. speed vs complexity, SQL vs NoSQL, synchronous vs asynchronous).`,
      type: 'technical',
      source: 'resume',
      topic: `Project Trade-offs`,
      difficulty: 'hard'
    });
  });

  // 3. Multi-skill synergy questions
  if (skills.length >= 2) {
    for (let i = 0; i < Math.min(skills.length - 1, 3); i++) {
      const s1 = skills[i];
      const s2 = skills[i + 1];
      questions.push({
        text: `Your resume shows hands-on experience with both ${s1} and ${s2}. How did you integrate them in your projects, and how did you handle data flow and error propagation between them?`,
        hint: `Discuss contracts, validation, error handling, and latency.`,
        type: 'technical',
        source: 'resume',
        topic: `${s1} + ${s2}`,
        difficulty: 'medium'
      });
    }
  }

  // 4. Role & Behavioral Experience questions
  exp.forEach(e => {
    questions.push({
      text: `You noted experience as "${e}". Tell me about a time in that role where you had to balance urgent business deadlines with technical debt and code quality.`,
      hint: `Use the STAR format: Situation, Task, Action, and measurable Result.`,
      type: 'hr',
      source: 'resume',
      topic: `Experience`,
      difficulty: 'medium'
    });
  });

  // Fallback broad resume question
  questions.push({
    text: `Looking at your overall resume and background, what is the single most technically complex problem you've solved? Walk me through your step-by-step reasoning.`,
    hint: `Clearly explain the initial problem, why existing solutions failed, your approach, and how you proved it worked.`,
    type: 'technical',
    source: 'resume',
    topic: `Engineering Impact`,
    difficulty: 'medium'
  });

  return questions;
}

/* -------- Question Engine & Adaptive Queue -------- */
function buildQuestionQueue() {
  const domain = DOMAINS.find(d => d.id === state.selectedDomain) || DOMAINS[0];
  const diff = state.difficulty;
  const queue = [];

  const hasResume = state.useResume && state.resumeSkills && state.resumeSkills.length > 0;

  // 1. Add Resume-based questions FIRST if resume exists
  if (hasResume) {
    const resumeQs = generateResumeQuestions(domain);
    // Filter matching current difficulty if possible, or all
    const matchingDiff = resumeQs.filter(q => q.difficulty === diff);
    const otherDiff = resumeQs.filter(q => q.difficulty !== diff);
    
    // Put difficulty-matching resume questions first
    matchingDiff.forEach(q => queue.push(q));
    otherDiff.forEach(q => queue.push(q));
  }

  // 2. Add domain technical questions
  if (state.mode === 'technical' || state.mode === 'mixed') {
    const techQs = domain.technical[diff] || domain.technical.easy || [];
    techQs.forEach(q => {
      queue.push({ text: q.q, hint: q.hint, type: 'technical', source: 'domain', topic: domain.name, difficulty: diff });
    });
  }

  // 3. Add HR questions
  if (state.mode === 'hr' || state.mode === 'mixed') {
    domain.hr.forEach(q => queue.push({ text: q, hint: null, type: 'hr', source: 'domain', topic: 'Behavioral' }));
    GENERAL_HR.forEach(q => queue.push({ text: q, hint: null, type: 'hr', source: 'general', topic: 'HR' }));
  }

  // 4. Add company questions
  if (state.selectedCompany) {
    const company = COMPANIES.find(c => c.id === state.selectedCompany);
    if (company) {
      company.questions.technical.forEach(q => queue.push({ text: q, hint: null, type: 'technical', source: 'company', topic: company.name }));
      company.questions.hr.forEach(q => queue.push({ text: q, hint: null, type: 'hr', source: 'company', topic: company.name }));
    }
  }

  // Prioritize queue: If resume is provided, prioritize resume questions so they are answered first
  if (hasResume) {
    const resumeGroup = queue.filter(q => q.source === 'resume');
    const nonResumeGroup = queue.filter(q => q.source !== 'resume');

    // Shuffle within groups
    for (let i = resumeGroup.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resumeGroup[i], resumeGroup[j]] = [resumeGroup[j], resumeGroup[i]];
    }
    for (let i = nonResumeGroup.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonResumeGroup[i], nonResumeGroup[j]] = [nonResumeGroup[j], nonResumeGroup[i]];
    }

    // Interleave heavily favoring resume (2 resume questions for every 1 domain question)
    const combined = [];
    let rIdx = 0, nrIdx = 0;
    while (rIdx < resumeGroup.length || nrIdx < nonResumeGroup.length) {
      if (rIdx < resumeGroup.length) combined.push(resumeGroup[rIdx++]);
      if (rIdx < resumeGroup.length) combined.push(resumeGroup[rIdx++]);
      if (nrIdx < nonResumeGroup.length) combined.push(nonResumeGroup[nrIdx++]);
    }
    state.questionQueue = combined;
  } else {
    // Normal shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    state.questionQueue = queue;
  }
}

function getNextQuestion() {
  const domain = DOMAINS.find(d => d.id === state.selectedDomain) || DOMAINS[0];
  const diff = state.difficulty;

  let typeFilter = () => true;
  if (state.mode === 'technical') typeFilter = q => q.type === 'technical';
  if (state.mode === 'hr') typeFilter = q => q.type === 'hr';

  let sourceFilter = () => true;
  if (!state.useResume) sourceFilter = q => q.source !== 'resume';

  const available = state.questionQueue.filter(q =>
    !state.askedQuestions.has(q.text) &&
    typeFilter(q) &&
    sourceFilter(q)
  );

  if (available.length === 0) {
    buildQuestionQueue();
    return state.questionQueue.find(q => !state.askedQuestions.has(q.text)) || null;
  }

  // If resume is present, prefer resume questions matching current difficulty
  if (state.useResume && state.resumeSkills && state.resumeSkills.length > 0) {
    const resumeMatch = available.find(q => q.source === 'resume' && (!q.difficulty || q.difficulty === diff));
    if (resumeMatch) return resumeMatch;
    const anyResume = available.find(q => q.source === 'resume');
    if (anyResume) return anyResume;
  }

  // Otherwise return first available matching question
  return available[0];
}

function askNextQuestion() {
  const q = getNextQuestion();
  if (!q) {
    endSession();
    return;
  }

  state.askedQuestions.add(q.text);
  state.currentQuestion = q;

  const typeLabel = {
    technical: `<span class="question-tag qtag-technical">Technical</span>`,
    hr: `<span class="question-tag qtag-hr">HR / Behavioral</span>`
  }[q.type] || '';

  const sourceLabel = q.source === 'resume'
    ? `<span class="question-tag qtag-resume">Resume: ${q.topic || 'Skills'}</span>`
    : q.source === 'company'
    ? `<span class="question-tag qtag-company">${q.topic || 'Company'}</span>`
    : `<span class="question-tag qtag-technical">${q.topic || 'Domain'}</span>`;

  const qNum = state.questionsAnswered + 1;

  addBotMessage(`
    <div style="margin-bottom:8px;display:flex;gap:6px;flex-wrap:wrap;">
      ${typeLabel}
      ${sourceLabel}
    </div>
    <strong>Q${qNum}.</strong> ${q.text}
  `, 'question');

  updateStats();
}

/* -------- Answer Processing -------- */
function submitAnswer() {
  const input = document.getElementById('user-input');
  const answer = input.value.trim();
  if (!answer) return;

  input.value = '';
  input.style.height = 'auto';

  addUserMessage(answer);
  showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator();
    processAnswer(answer);
  }, 1200 + Math.random() * 800);
}

function processAnswer(answer) {
  if (!state.currentQuestion) return;

  const q = state.currentQuestion;
  const evaluation = evaluateAnswer(answer, q);

  // Record history
  state.sessionHistory.push({
    question: q.text,
    answer: answer,
    score: evaluation.score,
    type: q.type,
    source: q.source,
    feedback: evaluation.feedback,
    quality: evaluation.quality
  });

  state.questionsAnswered++;
  state.totalScore += evaluation.score;

  // Show feedback
  const feedbackClass = evaluation.quality === 'good' ? 'good' : evaluation.quality === 'partial' ? 'partial' : 'improve';
  const scorePillClass = evaluation.score >= 75 ? 'high' : evaluation.score >= 45 ? 'mid' : 'low';

  addBotMessage(`
    <div class="feedback-bubble ${feedbackClass}">${evaluation.feedback}</div>
    <div style="margin-top:8px;">
      <span class="score-pill ${scorePillClass}">Score: ${evaluation.score}/100</span>
    </div>
  `, 'feedback');

  // Update adaptive difficulty
  if (state.useAdaptive) {
    updateDifficulty(evaluation.score);
  }

  updateStats();

  // Next question after delay
  setTimeout(() => {
    if (state.questionsAnswered < 20) {
      askNextQuestion();
    } else {
      addBotMessage(`<strong>Great session!</strong> You have completed 20 questions. Let us review your performance.`, 'system');
      setTimeout(() => endSession(), 2000);
    }
  }, 2500);
}

function evaluateAnswer(answer, question) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const answerLower = answer.toLowerCase();

  // Base score from answer length (quality proxy)
  let score = 0;
  if (wordCount < 10) score = 15 + Math.random() * 15;
  else if (wordCount < 30) score = 35 + Math.random() * 20;
  else if (wordCount < 80) score = 55 + Math.random() * 20;
  else if (wordCount < 150) score = 65 + Math.random() * 25;
  else score = 72 + Math.random() * 23;

  // Keyword matching boost
  const keywords = extractKeywords(question.text);
  const matchedKeywords = keywords.filter(kw => answerLower.includes(kw.toLowerCase()));
  const keywordBonus = Math.min(20, matchedKeywords.length * 4);
  score = Math.min(100, score + keywordBonus);

  // STAR format detection for HR questions
  if (question.type === 'hr') {
    const starIndicators = ['situation', 'task', 'action', 'result', 'when i', 'i noticed', 'i decided', 'outcome', 'as a result', 'this led to', 'impact'];
    const starCount = starIndicators.filter(s => answerLower.includes(s)).length;
    score = Math.min(100, score + starCount * 3);
  }

  score = Math.round(score);

  let quality, feedback;

  if (score >= 75) {
    quality = 'good';
    const goodFeedbacks = [
      `Excellent answer! ${matchedKeywords.length > 0 ? `You correctly addressed key concepts including <strong>${matchedKeywords.slice(0,3).join(', ')}</strong>.` : 'Your response was thorough and well-structured.'} ${wordCount > 80 ? 'Great depth of explanation.' : ''}`,
      `Strong response! You demonstrated solid understanding. ${question.hint ? `A great addition would be: <em>${question.hint}</em>` : 'Keep it up!'}`,
      `Well done! Your answer shows clear comprehension. ${matchedKeywords.length > 2 ? `Key terms like <strong>${matchedKeywords[0]}</strong> and <strong>${matchedKeywords[1]}</strong> were well incorporated.` : ''}`,
    ];
    feedback = goodFeedbacks[Math.floor(Math.random() * goodFeedbacks.length)];
  } else if (score >= 45) {
    quality = 'partial';
    const partialFeedbacks = [
      `Good start! Your answer covers the basics${matchedKeywords.length ? ` and you mentioned <strong>${matchedKeywords[0]}</strong>` : ''}. To improve, consider: <em>${question.hint || 'providing a concrete example to illustrate your point'}</em>.`,
      `Partially correct. You're on the right track! Consider adding more depth — ${question.hint || 'try to include a real-world example or explain the tradeoffs'}.`,
      `Decent answer. To reach the next level, focus on: <em>${question.hint || 'being more specific and backing claims with concrete examples'}</em>. Aim for 2-3 key technical terms.`,
    ];
    feedback = partialFeedbacks[Math.floor(Math.random() * partialFeedbacks.length)];
  } else {
    quality = 'improve';
    const improveFeedbacks = [
      `This needs more work. ${question.hint ? `Key insight: <em>${question.hint}</em>` : 'Try to structure your answer with a clear definition, explanation, and example.'} Don't worry — this is exactly what practice is for!`,
      `Let's work on this one. The answer should cover: <em>${question.hint || 'the core concept, a real-world application, and the tradeoffs involved'}</em>. Try again in the next round!`,
      `This is a tough one! ${question.hint ? `Hint: <em>${question.hint}</em>` : 'Start by defining the concept, then explain how it works, and finish with when/why to use it.'}`,
    ];
    feedback = improveFeedbacks[Math.floor(Math.random() * improveFeedbacks.length)];
  }

  return { score, quality, feedback };
}

function extractKeywords(questionText) {
  const stopWords = new Set(['what','how','why','when','where','which','the','a','an','is','are','was','were','do','does','did','you','your','explain','describe','tell','about','with','can','would','should','could','will','have','has','had','for','and','or','but','in','on','at','to','of','from','by','as','this','that','these','those']);
  return questionText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()))
    .slice(0, 8);
}

/* -------- Adaptive Difficulty -------- */
function updateDifficulty(score) {
  // Exponential moving average
  state.difficultyScore = state.difficultyScore * 0.7 + score * 0.3;

  const prev = state.difficulty;

  if (state.difficultyScore >= 72 && state.questionsAnswered >= 2) {
    state.difficulty = state.difficultyScore >= 85 ? 'hard' : 'medium';
  } else if (state.difficultyScore < 40) {
    state.difficulty = 'easy';
  } else if (state.difficultyScore < 65) {
    state.difficulty = 'medium';
  } else {
    state.difficulty = 'hard';
  }

  if (state.difficulty !== prev) {
    updateDifficultyUI();
    const messages = {
      easy: 'Adjusting to easier questions to build confidence.',
      medium: 'Stepping up to Medium difficulty - nice progress!',
      hard: 'Advancing to Hard difficulty challenges.'
    };
    setTimeout(() => {
      addSystemMessage(messages[state.difficulty]);
      buildQuestionQueue();
    }, 300);
  } else {
    updateDifficultyUI();
  }
}

function updateDifficultyUI() {
  const fill = document.getElementById('diff-fill-bar');
  const label = document.getElementById('diff-label');
  const badge = document.getElementById('diff-badge');

  const configs = {
    easy: { width: '33%', bg: 'var(--accent3)', text: 'Easy', badgeClass: '' },
    medium: { width: '66%', bg: 'var(--warn)', text: 'Medium', badgeClass: 'medium' },
    hard: { width: '100%', bg: 'var(--danger)', text: 'Hard', badgeClass: 'hard' }
  };

  const cfg = configs[state.difficulty];
  fill.style.width = cfg.width;
  fill.style.background = cfg.bg;
  label.textContent = cfg.text;
  badge.textContent = cfg.text;
  badge.className = `diff-badge ${cfg.badgeClass}`;
}

/* -------- Chat Message Helpers -------- */
function addBotMessage(html, type = '') {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message bot';
  div.innerHTML = `
    <div class="msg-avatar">
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><rect x="3" y="6" width="18" height="14" rx="3" stroke="#d4ff00" stroke-width="1.8"/><circle cx="8.5" cy="12" r="1.5" fill="#d4ff00"/><circle cx="15.5" cy="12" r="1.5" fill="#d4ff00"/><path d="M8.5 16q3.5 2.5 7 0" stroke="#d4ff00" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>
    </div>
    <div class="msg-content">
      <div class="msg-bubble">${html}</div>
      <div class="msg-meta">${formatTime(new Date())}</div>
    </div>
  `;
  messages.appendChild(div);
  scrollToBottom();
}

function addUserMessage(text) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message user';
  div.innerHTML = `
    <div class="msg-avatar">
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><circle cx="12" cy="8" r="4" stroke="#ffb830" stroke-width="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#ffb830" stroke-width="1.8" stroke-linecap="round"/></svg>
    </div>
    <div class="msg-content">
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-meta">${formatTime(new Date())}</div>
    </div>
  `;
  messages.appendChild(div);
  scrollToBottom();
}

function addSystemMessage(text) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'system-msg';
  div.textContent = text;
  messages.appendChild(div);
  scrollToBottom();
}

function showTypingIndicator() {
  document.getElementById('typing-indicator').classList.remove('hidden');
  scrollToBottom();
}
function hideTypingIndicator() {
  document.getElementById('typing-indicator').classList.add('hidden');
}

function scrollToBottom() {
  const msgs = document.getElementById('chat-messages');
  setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* -------- Stats & Timer -------- */
function updateStats() {
  const asked = state.questionsAnswered;
  const avg = asked > 0 ? Math.round(state.totalScore / asked) : 0;
  document.getElementById('stat-asked').textContent = asked;
  document.getElementById('stat-score').textContent = `${avg}%`;
}

function startTimer() {
  clearInterval(state.timerInterval);
  state.secondsElapsed = 0;
  state.timerInterval = setInterval(() => {
    state.secondsElapsed++;
    const m = Math.floor(state.secondsElapsed / 60).toString().padStart(2, '0');
    const s = (state.secondsElapsed % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').textContent = `${m}:${s}`;
  }, 1000);
}

/* -------- UI Controls -------- */
function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`mode-btn-${mode}`).classList.add('active');
  buildQuestionQueue();
  document.getElementById('chat-subtitle').textContent = `Domain: ${DOMAINS.find(d=>d.id===state.selectedDomain)?.name || '—'} • ${mode} mode`;
}

function updateSettings() {
  state.useResume = document.getElementById('chk-resume').checked;
  state.useCompany = document.getElementById('chk-company').checked;
  state.useAdaptive = document.getElementById('chk-adaptive').checked;
  buildQuestionQueue();
}

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  document.getElementById('sidebar').classList.toggle('collapsed', !state.sidebarOpen);
}

function handleInputKey(e) {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    submitAnswer();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 180) + 'px';
}

function skipQuestion() {
  addSystemMessage('Question skipped.');
  state.currentQuestion = null;
  setTimeout(() => askNextQuestion(), 600);
}

function getHint() {
  if (state.currentQuestion?.hint) {
    addBotMessage(`<strong>Hint:</strong> ${state.currentQuestion.hint}`, 'hint');
  } else {
    addBotMessage(`Think about the core concept, a real-world example, and any tradeoffs involved.`, 'hint');
  }
}

function rephraseQuestion() {
  if (!state.currentQuestion) return;
  addBotMessage(`<strong>Rephrased:</strong> ${state.currentQuestion.text} (Think about this from a practical implementation perspective.)`, 'question');
}

/* -------- End Session / Report -------- */
function endSession() {
  clearInterval(state.timerInterval);

  const interviewScreen = document.getElementById('interview-screen');
  interviewScreen.classList.remove('active');
  interviewScreen.classList.add('hidden');

  const reportScreen = document.getElementById('report-screen');
  reportScreen.classList.remove('hidden');
  reportScreen.classList.add('active');

  generateReport();
}

function generateReport() {
  const history = state.sessionHistory;
  const total = history.length;
  if (total === 0) { document.getElementById('report-summary').innerHTML = '<p>No questions answered.</p>'; return; }

  const avg = Math.round(history.reduce((s, h) => s + h.score, 0) / total);
  const techQs = history.filter(h => h.type === 'technical');
  const hrQs = history.filter(h => h.type === 'hr');
  const avgTech = techQs.length ? Math.round(techQs.reduce((s,h)=>s+h.score,0)/techQs.length) : 0;
  const avgHr = hrQs.length ? Math.round(hrQs.reduce((s,h)=>s+h.score,0)/hrQs.length) : 0;
  const mins = Math.floor(state.secondsElapsed / 60);
  const secs = state.secondsElapsed % 60;

  const grade = avg >= 85 ? { label: 'A', color: '#10b981' }
    : avg >= 70 ? { label: 'B', color: '#06b6d4' }
    : avg >= 55 ? { label: 'C', color: '#f59e0b' }
    : avg >= 40 ? { label: 'D', color: '#ef4444' }
    : { label: 'F', color: '#ef4444' };

  // Summary cards
  document.getElementById('report-summary').innerHTML = `
    <div class="report-stat">
      <div class="report-stat-val" style="color:${grade.color}">${grade.label}</div>
      <div class="report-stat-key">Overall Grade</div>
    </div>
    <div class="report-stat">
      <div class="report-stat-val" style="color:#d4ff00">${avg}%</div>
      <div class="report-stat-key">Avg Score</div>
    </div>
    <div class="report-stat">
      <div class="report-stat-val">${total}</div>
      <div class="report-stat-key">Questions</div>
    </div>
    <div class="report-stat">
      <div class="report-stat-val" style="color:#ffb830">${avgTech}%</div>
      <div class="report-stat-key">Technical</div>
    </div>
    <div class="report-stat">
      <div class="report-stat-val" style="color:#d4ff00">${avgHr}%</div>
      <div class="report-stat-key">HR / Behavioral</div>
    </div>
    <div class="report-stat">
      <div class="report-stat-val">${mins}:${String(secs).padStart(2,'0')}</div>
      <div class="report-stat-key">Time Spent</div>
    </div>
  `;

  // Chart
  drawReportChart(history);

  // Q&A review
  const qaContainer = document.getElementById('report-qa');
  qaContainer.innerHTML = `<h3 style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;margin-bottom:8px;">Question Review</h3>`;
  history.forEach((h, i) => {
    const scorePill = h.score >= 75 ? 'high' : h.score >= 45 ? 'mid' : 'low';
    const typeLabel = h.type === 'technical' ? 'Technical' : 'HR';
    const sourceLabel = h.source === 'resume' ? ' / Resume' : h.source === 'company' ? ` / ${state.selectedCompany || 'Company'}` : '';
    qaContainer.innerHTML += `
      <div class="qa-card">
        <div class="qa-q">Q${i+1}. ${h.question}</div>
        <div class="qa-a">${escapeHtml(h.answer.substring(0, 300))}${h.answer.length > 300 ? '...' : ''}</div>
        <div class="qa-score-row">
          <span class="qa-tag">${typeLabel}${sourceLabel}</span>
          <span class="score-pill ${scorePill}">${h.score}/100</span>
        </div>
        <div class="feedback-bubble ${h.quality === 'good' ? 'good' : h.quality === 'partial' ? 'partial' : 'improve'}" style="margin-top:10px;font-size:13px;">${h.feedback}</div>
      </div>
    `;
  });
}

function drawReportChart(history) {
  const canvas = document.getElementById('report-chart');
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  if (history.length === 0) return;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Draw grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(100 - i * 25), padding.left - 8, y + 4);
  }

  // Draw bars
  const barWidth = Math.min(30, (chartW / history.length) - 6);
  history.forEach((h_item, i) => {
    const x = padding.left + (chartW / history.length) * i + (chartW / history.length - barWidth) / 2;
    const barH = (h_item.score / 100) * chartH;
    const y = padding.top + chartH - barH;

    const color = h_item.score >= 75 ? '#d4ff00' : h_item.score >= 45 ? '#ffb830' : '#ff5252';

    // Bar gradient
    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '44');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, 4);
    ctx.fill();

    // X label
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Q${i+1}`, x + barWidth / 2, h - 8);
  });

  // Draw score line
  ctx.beginPath();
  history.forEach((h_item, i) => {
    const x = padding.left + (chartW / history.length) * i + chartW / history.length / 2;
    const y = padding.top + chartH - (h_item.score / 100) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#d4ff00';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function printReport() {
  window.print();
}

function resetToHome() {
  clearInterval(state.timerInterval);

  // Reset state
  Object.assign(state, {
    selectedDomain: null, selectedCompany: null, resumeText: '', resumeSkills: [],
    resumeProjects: [], resumeExperience: [], mode: 'technical', difficulty: 'easy', difficultyScore: 0,
    questionIndex: 0, askedQuestions: new Set(), sessionHistory: [], totalScore: 0,
    questionsAnswered: 0, timerInterval: null, secondsElapsed: 0, sidebarOpen: true,
    currentQuestion: null, useResume: true, useCompany: false, useAdaptive: true, questionQueue: []
  });

  // Hide all, show onboarding
  document.getElementById('interview-screen').classList.add('hidden');
  document.getElementById('interview-screen').classList.remove('active');
  document.getElementById('report-screen').classList.add('hidden');
  document.getElementById('report-screen').classList.remove('active');
  document.getElementById('onboarding').classList.remove('hidden');
  document.getElementById('onboarding').classList.add('active');

  // Reset forms
  document.getElementById('resume-text').value = '';
  document.getElementById('resume-preview').classList.add('hidden');
  document.getElementById('company-search').value = '';

  // Re-initialize grids
  goToStep('step-welcome');
  initDomainGrid();
  initCompanyGrid();
  document.getElementById('btn-domain-next').disabled = true;
}

/* -------- Init -------- */
document.addEventListener('DOMContentLoaded', () => {
  initDomainGrid();
  initCompanyGrid();

  // Start visible with welcome step
  goToStep('step-welcome');
});
