/* =============================================
   PrepAI – Domain & Company Metadata
   (All questions generated 100% dynamically via Groq LLM)
   ============================================= */

const DOMAINS = [
  {
    id: 'webdev',
    name: 'Web Development',
    icon: 'WEB',
    color: '#7c3aed',
    colorRgb: '124,58,237',
    tags: 'HTML, CSS, JS, React, Node.js'
  },
  {
    id: 'datascience',
    name: 'Data Science',
    icon: 'DATA',
    color: '#06b6d4',
    colorRgb: '6,182,212',
    tags: 'Python, SQL, Statistics, ML'
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    icon: 'ML',
    color: '#8b5cf6',
    colorRgb: '139,92,246',
    tags: 'Neural Networks, NLP, CV, MLOps'
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: 'OPS',
    color: '#10b981',
    colorRgb: '16,185,129',
    tags: 'AWS, Docker, Kubernetes, CI/CD'
  },
  {
    id: 'backend',
    name: 'Backend Dev',
    icon: 'BE',
    color: '#f59e0b',
    colorRgb: '245,158,11',
    tags: 'APIs, Databases, System Design'
  },
  {
    id: 'management',
    name: 'Product / Management',
    icon: 'PM',
    color: '#ec4899',
    colorRgb: '236,72,153',
    tags: 'Leadership, Strategy, Agile, OKRs'
  },
  {
    id: 'dsa',
    name: 'DSA / Competitive',
    icon: 'DSA',
    color: '#ef4444',
    colorRgb: '239,68,68',
    tags: 'Arrays, Trees, Graphs, DP'
  }
];

const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    logo: 'G',
    style: "Known for algorithm-heavy interviews, distributed systems, and Googleyness behavioral questions. Focus: scalability, elegance, and leadership principles."
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'A',
    style: "Amazon uses STAR-format behavioral questions heavily based on their 16 Leadership Principles. Technical focus: distributed systems, cost efficiency, customer obsession."
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'MS',
    style: "Microsoft emphasizes collaborative culture (Growth Mindset), system design, and Azure cloud. Focus: teamwork, learning from failures, and cloud-native architectures."
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'M',
    style: "Meta focuses on product impact, moving fast, and social graph problems. Technical: React/GraphQL (frontend), distributed ML systems (backend)."
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: 'N',
    style: "Netflix values freedom and responsibility, chaos engineering, and streaming architecture. Focus: highly available distributed systems, personalization, A/B testing."
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: 'AP',
    style: "Apple focuses on deep technical excellence, attention to detail, user experience perfection, and secrecy. Focus: Swift/Obj-C, hardware-software integration, privacy."
  },
  {
    id: 'startup',
    name: 'Startup',
    logo: 'ST',
    style: "Startups value generalist skills, wearing many hats, fast iteration, and business impact. Focus: execution speed, ownership, and adaptability."
  },
  {
    id: 'general',
    name: 'General',
    logo: 'GEN',
    style: "Well-rounded preparation covering universal interview topics applicable to any company."
  }
];
