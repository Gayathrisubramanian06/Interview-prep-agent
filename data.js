/* =============================================
   PrepAI – Question Bank & Domain Data
   ============================================= */

const DOMAINS = [
  {
    id: 'webdev',
    name: 'Web Development',
    icon: 'WEB',
    color: '#7c3aed',
    colorRgb: '124,58,237',
    tags: 'HTML, CSS, JS, React, Node.js',
    technical: {
      easy: [
        { q: "What is the difference between `let`, `const`, and `var` in JavaScript?", hint: "Think about scope, hoisting, and mutability." },
        { q: "Explain the CSS Box Model.", hint: "Content → Padding → Border → Margin" },
        { q: "What is the difference between `==` and `===` in JavaScript?", hint: "One checks value, the other checks value AND type." },
        { q: "What are semantic HTML elements? Give 3 examples.", hint: "Think about elements that convey meaning." },
        { q: "What is the purpose of the `meta viewport` tag?", hint: "Responsive design and mobile display." },
        { q: "What is the difference between `display: block`, `inline`, and `inline-block`?", hint: "Think about how elements occupy space." },
        { q: "How does event bubbling work in JavaScript?", hint: "Events propagate from child to parent." },
        { q: "What is CORS and why does it exist?", hint: "Cross-Origin Resource Sharing — browser security policy." }
      ],
      medium: [
        { q: "Explain the concept of closures in JavaScript with a real-world example.", hint: "A function remembering its outer scope." },
        { q: "What are the differences between REST and GraphQL APIs?", hint: "Consider flexibility, over-fetching, and schema." },
        { q: "Explain the Virtual DOM and how React uses it for performance.", hint: "Diffing algorithm and reconciliation." },
        { q: "What are Promises and how do they differ from async/await?", hint: "Both handle asynchronous operations differently." },
        { q: "How does CSS Flexbox differ from Grid, and when would you choose each?", hint: "1D vs 2D layout systems." },
        { q: "What are Web Workers and when would you use them?", hint: "Background threads in the browser." },
        { q: "Explain how HTTP caching works and what headers control it.", hint: "Cache-Control, ETags, Last-Modified." },
        { q: "What is tree shaking and how does it improve bundle size?", hint: "Removing dead code at build time." }
      ],
      hard: [
        { q: "Design a client-side caching strategy for a high-traffic React app that minimizes API calls while keeping data fresh.", hint: "Consider stale-while-revalidate, React Query, or SWR." },
        { q: "How would you implement a real-time collaborative editing feature (like Google Docs) in a web app?", hint: "Operational transforms, CRDTs, WebSockets." },
        { q: "Explain the critical rendering path and how you'd optimize it for a 100ms First Contentful Paint target.", hint: "Parser blocking, render blocking, resource hints." },
        { q: "How does the JavaScript event loop work, including microtasks vs macrotasks? Provide a complex execution order example.", hint: "Call stack, task queue, microtask queue, requestAnimationFrame." },
        { q: "Design a scalable frontend architecture for a micro-frontend application with 10+ independent teams.", hint: "Module federation, shared dependencies, communication patterns." }
      ]
    },
    hr: [
      "Tell me about a time you had to debug a production issue under pressure.",
      "How do you stay updated with the fast-changing frontend ecosystem?",
      "Describe a project where you had to balance technical debt vs. shipping speed.",
      "How do you handle disagreements with a designer about UX decisions?",
      "What's the most challenging UI component you've built and what made it difficult?"
    ]
  },
  {
    id: 'datascience',
    name: 'Data Science',
    icon: 'DATA',
    color: '#06b6d4',
    colorRgb: '6,182,212',
    tags: 'Python, SQL, Statistics, ML',
    technical: {
      easy: [
        { q: "What is the difference between supervised and unsupervised learning?", hint: "Labeled vs. unlabeled data." },
        { q: "Explain the concept of overfitting. How do you detect and prevent it?", hint: "Training accuracy much higher than validation." },
        { q: "What is the purpose of the train-test split?", hint: "Evaluate generalization on unseen data." },
        { q: "What are null values and how do you handle them?", hint: "Imputation, removal, or special category." },
        { q: "Explain the difference between mean, median, and mode.", hint: "Central tendency measures with different use cases." },
        { q: "What is a confusion matrix?", hint: "TP, TN, FP, FN." },
        { q: "What is one-hot encoding and when is it used?", hint: "Converting categorical variables for ML models." },
        { q: "Explain correlation vs causation with an example.", hint: "Ice cream sales and drowning rates." }
      ],
      medium: [
        { q: "Explain the bias-variance tradeoff in machine learning.", hint: "Simple models have high bias; complex models have high variance." },
        { q: "How does gradient descent work? What are its variants?", hint: "Batch, stochastic, mini-batch GD." },
        { q: "What is cross-validation and why is it preferred over a single train-test split?", hint: "k-fold reduces variance in model evaluation." },
        { q: "Explain dimensionality reduction and compare PCA with t-SNE.", hint: "Linear vs. non-linear, interpretability vs. visualization." },
        { q: "What is feature importance and how do tree-based models compute it?", hint: "Impurity decrease, permutation importance." },
        { q: "Walk me through how you'd approach an imbalanced classification problem.", hint: "SMOTE, class weights, threshold tuning, precision-recall." },
        { q: "What is regularization? Explain L1 vs L2.", hint: "Lasso encourages sparsity; Ridge shrinks coefficients." },
        { q: "How would you detect and handle outliers in a dataset?", hint: "IQR, Z-score, isolation forest, domain knowledge." }
      ],
      hard: [
        { q: "You have a dataset with 1M records, 500 features, and 0.1% positive class. Walk through your complete modeling pipeline.", hint: "Feature selection, sampling, ensemble, threshold optimization." },
        { q: "Explain the EM algorithm and how it applies to Gaussian Mixture Models.", hint: "E-step: compute responsibilities; M-step: update parameters." },
        { q: "How would you build a real-time anomaly detection system for streaming financial transactions?", hint: "Online learning, streaming stats, concept drift detection." },
        { q: "Compare and contrast XGBoost, LightGBM, and CatBoost. When would you prefer each?", hint: "Training speed, categorical handling, leaf-wise vs level-wise growth." },
        { q: "How would you evaluate and improve a recommendation system suffering from the cold-start problem?", hint: "Content-based fallback, demographic filtering, exploration-exploitation." }
      ]
    },
    hr: [
      "Describe a time when your analysis led to a business decision that had measurable impact.",
      "How do you communicate complex statistical findings to non-technical stakeholders?",
      "Tell me about a dataset that was messier than expected. How did you handle it?",
      "How do you prioritize which analysis to do when you have multiple requests?",
      "Describe a time you found an insight that was counterintuitive but correct."
    ]
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    icon: 'ML',
    color: '#8b5cf6',
    colorRgb: '139,92,246',
    tags: 'Neural Networks, NLP, CV, MLOps',
    technical: {
      easy: [
        { q: "What is the difference between deep learning and traditional machine learning?", hint: "Feature extraction vs. automatic feature learning." },
        { q: "Explain what a neural network is and how forward propagation works.", hint: "Layers of weighted connections with activations." },
        { q: "What is the role of an activation function in a neural network?", hint: "Introduces non-linearity; examples: ReLU, sigmoid, tanh." },
        { q: "What is backpropagation?", hint: "Chain rule applied to compute gradients layer by layer." },
        { q: "What is the vanishing gradient problem?", hint: "Gradients become very small in deep networks." },
        { q: "What is dropout and why is it used?", hint: "Regularization technique that randomly drops neurons." },
        { q: "What is batch normalization?", hint: "Normalizes layer inputs to stabilize and speed up training." },
        { q: "What is transfer learning?", hint: "Using a pre-trained model as starting point for a new task." }
      ],
      medium: [
        { q: "Explain the Transformer architecture and why it replaced RNNs for NLP tasks.", hint: "Self-attention, positional encoding, parallelization." },
        { q: "How does the Adam optimizer work, and what are its advantages over SGD?", hint: "Adaptive learning rates using first and second moments." },
        { q: "Compare CNNs and Vision Transformers (ViT). What are the tradeoffs?", hint: "Inductive biases, data efficiency, scalability." },
        { q: "What is the attention mechanism and how does it compute attention scores?", hint: "Q, K, V matrices and softmax-normalized dot products." },
        { q: "Explain RLHF (Reinforcement Learning from Human Feedback) as used in LLMs.", hint: "Reward model trained on human preferences, PPO fine-tuning." },
        { q: "How would you design an MLOps pipeline for continuous model retraining?", hint: "Data versioning, model registry, monitoring, CI/CD triggers." },
        { q: "What is knowledge distillation and why is it used?", hint: "Training a smaller model to mimic a larger one's soft outputs." },
        { q: "Explain the concept of embeddings and how word2vec works.", hint: "Distributed representation from skip-gram or CBOW." }
      ],
      hard: [
        { q: "Explain how BERT's masked language modeling pre-training works and how it differs from GPT's causal language modeling.", hint: "Bidirectional context vs. left-to-right autoregressive." },
        { q: "You need to deploy an LLM that can answer questions under 200ms with 99.9% uptime. Design the full serving infrastructure.", hint: "Quantization, vLLM, speculative decoding, load balancing, SLOs." },
        { q: "Explain the theoretical basis of GANs including the minimax game formulation, mode collapse, and how techniques like Wasserstein GAN address training instability.", hint: "D(G(z)) vs D(x), Nash equilibrium, Earth Mover's Distance." },
        { q: "How do modern diffusion models (DDPM, DDIM, Stable Diffusion) work? Compare them to VAEs and GANs.", hint: "Forward noising process, denoising score matching, latent diffusion." },
        { q: "Design a multi-modal model that can answer questions about both images and text, considering architecture, training data, and alignment challenges.", hint: "CLIP-style encoders, cross-attention, contrastive pre-training." }
      ]
    },
    hr: [
      "Tell me about the most impactful ML model you've built and how you measured its success.",
      "How do you decide when a problem truly needs deep learning vs. a simpler approach?",
      "Describe a time your model performed well in testing but poorly in production.",
      "How do you handle ethical considerations in ML, such as bias in training data?",
      "Walk me through how you would explain a complex ML model to a business executive."
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: 'OPS',
    color: '#10b981',
    colorRgb: '16,185,129',
    tags: 'AWS, Docker, Kubernetes, CI/CD',
    technical: {
      easy: [
        { q: "What is the difference between a container and a virtual machine?", hint: "OS-level vs. hardware-level virtualization." },
        { q: "Explain what CI/CD means and why it's important.", hint: "Continuous Integration and Continuous Delivery/Deployment." },
        { q: "What is Docker and what problem does it solve?", hint: "Application containerization for consistency across environments." },
        { q: "What is the purpose of a load balancer?", hint: "Distributes traffic across multiple servers." },
        { q: "What is Infrastructure as Code (IaC)? Name tools.", hint: "Terraform, CloudFormation, Pulumi, Ansible." },
        { q: "What is the difference between horizontal and vertical scaling?", hint: "Adding more machines vs. upgrading existing ones." },
        { q: "What is a Dockerfile and how does it work?", hint: "Instructions to build a Docker image layer by layer." },
        { q: "Explain what a CDN is and how it improves performance.", hint: "Edge servers geographically distributed for low latency." }
      ],
      medium: [
        { q: "Explain Kubernetes pod scheduling, resource requests, and limits.", hint: "kube-scheduler, QoS classes, LimitRange, ResourceQuota." },
        { q: "How would you design a blue-green deployment strategy? What are its advantages?", hint: "Two identical environments, instant switchover, easy rollback." },
        { q: "Explain the CAP theorem and how distributed systems make tradeoffs.", hint: "Consistency, Availability, Partition tolerance — pick two." },
        { q: "How does service discovery work in a microservices architecture?", hint: "DNS-based (Consul), client-side vs server-side discovery." },
        { q: "Design a monitoring and alerting strategy for a microservices application.", hint: "Metrics (Prometheus), logs (ELK), traces (Jaeger), SLOs." },
        { q: "What is GitOps and how does ArgoCD implement it?", hint: "Git as single source of truth, reconciliation loop." },
        { q: "Explain Kubernetes namespaces, RBAC, and network policies for multi-tenant clusters.", hint: "Isolation, access control, ingress/egress rules." },
        { q: "How does a Kubernetes HorizontalPodAutoscaler (HPA) work?", hint: "Metrics server, target utilization, scale up/down latency." }
      ],
      hard: [
        { q: "Design a disaster recovery strategy for a globally distributed microservices platform with an RTO of 5 minutes and RPO of 1 minute.", hint: "Active-active, async replication, circuit breakers, runbooks." },
        { q: "How would you architect a multi-cloud infrastructure that avoids vendor lock-in while maintaining operational simplicity?", hint: "Terraform abstraction, portable runtimes, abstracted storage layers." },
        { q: "A service is experiencing intermittent latency spikes every 6 hours. Walk through your complete observability and root cause analysis approach.", hint: "Distributed tracing, flamegraphs, GC pause, connection pooling." },
        { q: "Design a secrets management solution for 500+ microservices across 3 cloud providers.", hint: "HashiCorp Vault, dynamic secrets, Kubernetes integration, rotation." },
        { q: "Explain how you'd implement zero-downtime schema migrations in a high-traffic PostgreSQL database with 50M+ records.", hint: "Expand-contract pattern, online DDL, backward-compatible changes." }
      ]
    },
    hr: [
      "Tell me about a production outage you were part of resolving. What happened and what did you learn?",
      "How do you balance the need for speed (shipping quickly) with stability and reliability?",
      "Describe how you've improved the developer experience in a previous role.",
      "Tell me about a time you had to convince developers to adopt a new tool or process.",
      "How do you handle on-call responsibilities and prevent alert fatigue?"
    ]
  },
  {
    id: 'backend',
    name: 'Backend Dev',
    icon: 'BE',
    color: '#f59e0b',
    colorRgb: '245,158,11',
    tags: 'APIs, Databases, System Design',
    technical: {
      easy: [
        { q: "What is the difference between SQL and NoSQL databases? When do you use each?", hint: "Structured vs. flexible schemas, ACID vs. BASE." },
        { q: "Explain REST API principles and HTTP methods.", hint: "GET, POST, PUT, DELETE, PATCH — stateless, resource-based." },
        { q: "What is database indexing and why does it improve query performance?", hint: "B-tree structure for O(log n) lookups." },
        { q: "What is the N+1 query problem and how do you fix it?", hint: "Eager loading, JOIN queries, or DataLoader pattern." },
        { q: "Explain the difference between authentication and authorization.", hint: "Who you are vs. what you can do." },
        { q: "What is connection pooling and why is it important?", hint: "Reusing database connections to reduce overhead." },
        { q: "What is the difference between synchronous and asynchronous processing?", hint: "Blocking vs. non-blocking execution models." },
        { q: "What are environment variables and why should secrets never be in code?", hint: ".env files, secrets management, version control exposure." }
      ],
      medium: [
        { q: "How would you design a rate limiter for a public API serving 10M requests/day?", hint: "Token bucket, leaky bucket, Redis sliding window." },
        { q: "Explain ACID properties and when you'd sacrifice one for performance.", hint: "Atomicity, Consistency, Isolation, Durability." },
        { q: "How does database sharding work and what problems does it introduce?", hint: "Horizontal partitioning, shard key choice, cross-shard queries." },
        { q: "Design a notification system that can deliver 1 million notifications in real-time.", hint: "Message queues, fan-out strategies, push vs. pull." },
        { q: "What is eventual consistency and how does it affect application design?", hint: "Distributed systems, retry logic, idempotency." },
        { q: "Explain the Saga pattern for distributed transactions.", hint: "Choreography vs. orchestration, compensating transactions." },
        { q: "How would you implement caching in a multi-instance backend application?", hint: "Redis, cache invalidation strategies, cache aside vs. write-through." },
        { q: "What is a message queue and when would you use Kafka vs. RabbitMQ?", hint: "Log-based vs. queue-based, retention, consumer groups." }
      ],
      hard: [
        { q: "Design a URL shortener system like bit.ly that handles 100K URLs/second and 1B redirects/day.", hint: "Base62 encoding, consistent hashing, CDN, TTL management." },
        { q: "Design a distributed job scheduling system with at-least-once execution guarantees, idempotency, and dead-letter queues.", hint: "Leader election, job leasing, idempotency keys, exponential backoff." },
        { q: "How would you architect a search system for 1 billion product listings with sub-100ms response time?", hint: "Elasticsearch, inverted index, distributed sharding, caching layers." },
        { q: "Design a real-time leaderboard system for a game with 10M concurrent players.", hint: "Redis Sorted Sets, in-memory snapshots, eventual consistency." },
        { q: "Walk me through designing a financial transaction system with guaranteed exactly-once delivery and full audit trail.", hint: "Idempotency keys, event sourcing, CQRS, saga pattern." }
      ]
    },
    hr: [
      "Tell me about a complex system you designed and what tradeoffs you made.",
      "Describe a time you had to refactor a codebase that was poorly designed. How did you approach it?",
      "How do you approach API versioning when you have existing consumers?",
      "Tell me about a performance bottleneck you identified and fixed.",
      "How do you document your APIs and systems for other developers?"
    ]
  },
  {
    id: 'management',
    name: 'Product / Management',
    icon: 'PM',
    color: '#ec4899',
    colorRgb: '236,72,153',
    tags: 'Leadership, Strategy, Agile, OKRs',
    technical: {
      easy: [
        { q: "What is a Product Roadmap and what makes one effective?", hint: "Vision, prioritization, alignment, flexibility." },
        { q: "Explain the difference between Agile, Scrum, and Kanban.", hint: "Agile is the philosophy; Scrum and Kanban are frameworks." },
        { q: "How do you define and measure success for a product feature?", hint: "KPIs, north star metric, user satisfaction." },
        { q: "What is a user story and what are its components?", hint: "As a [user], I want [goal], so that [benefit]." },
        { q: "What is the MoSCoW prioritization method?", hint: "Must have, Should have, Could have, Won't have." },
        { q: "How do you handle conflicting priorities from different stakeholders?", hint: "Data-driven decisions, alignment meetings, escalation paths." },
        { q: "What is an OKR? How does it differ from KPIs?", hint: "Objectives and Key Results — aspirational vs. operational." },
        { q: "What is sprint velocity and how is it used for planning?", hint: "Story points completed per sprint as a planning baseline." }
      ],
      medium: [
        { q: "How would you prioritize a feature backlog when you have limited engineering resources?", hint: "RICE, ICE scoring, strategic alignment, opportunity sizing." },
        { q: "Describe how you would conduct a competitive analysis for a new product.", hint: "Feature comparison, market positioning, SWOT analysis." },
        { q: "How do you balance technical debt with new feature development?", hint: "20% rule, debt tracking, business impact framing." },
        { q: "How would you approach launching a product in a new market?", hint: "Market research, MVP definition, go-to-market, feedback loops." },
        { q: "Explain how you would run a successful OKR planning cycle.", hint: "Alignment, bottom-up/top-down balance, check-ins, grading." },
        { q: "How do you measure the ROI of a product feature after launch?", hint: "A/B testing, baseline comparison, attribution modeling." },
        { q: "What metrics would you track for a SaaS product?", hint: "MRR, CAC, LTV, churn, NPS, activation rate." },
        { q: "How do you work effectively with engineers who push back on your estimates?", hint: "Negotiation, understanding constraints, tradeoff discussion." }
      ],
      hard: [
        { q: "Your flagship product has 40% month-over-month churn. Walk me through how you'd diagnose and address it.", hint: "Cohort analysis, exit surveys, onboarding funnel, retention hooks." },
        { q: "You have a team of 15 engineers building a platform used by 500K daily users. How do you structure roadmap planning for the next 18 months?", hint: "Now/Next/Later, discovery vs. delivery, OKR alignment, tech debt budget." },
        { q: "Your company is deciding between building a feature or acquiring a competitor. What framework do you use to make this decision?", hint: "Build vs. buy vs. partner analysis, TCO, time-to-market, strategic fit." },
        { q: "Design a performance management system for a fully remote engineering team of 50 that drives both accountability and psychological safety.", hint: "360 reviews, blameless postmortems, OKRs, 1:1 cadence, public wins." },
        { q: "How would you turn around a product that is technically sound but has poor user adoption?", hint: "JTBD framework, activation funnel, positioning, sales-product alignment." }
      ]
    },
    hr: [
      "Tell me about a time you had to make a product decision with incomplete data.",
      "Describe a product launch that didn't go as planned. What did you learn?",
      "How do you foster alignment between product, engineering, and business teams?",
      "Tell me about a time you had to kill a feature or project. How did you handle it?",
      "How do you build trust with engineering teams as a PM?"
    ]
  },
  {
    id: 'dsa',
    name: 'DSA / Competitive',
    icon: 'DSA',
    color: '#ef4444',
    colorRgb: '239,68,68',
    tags: 'Arrays, Trees, Graphs, DP',
    technical: {
      easy: [
        { q: "What is the time complexity of binary search, and what are its prerequisites?", hint: "O(log n), requires sorted array." },
        { q: "Explain the difference between a stack and a queue. Give real-world examples.", hint: "LIFO vs. FIFO — undo history vs. print queue." },
        { q: "What is a hash table and how does it achieve O(1) average lookup?", hint: "Hash function maps keys to bucket indices." },
        { q: "Explain recursion and the concept of a base case.", hint: "A function calling itself with a smaller sub-problem." },
        { q: "What is the difference between DFS and BFS?", hint: "Stack-based depth exploration vs. queue-based level exploration." },
        { q: "What is a linked list and how does it differ from an array?", hint: "Non-contiguous memory, O(1) insert/delete, O(n) access." },
        { q: "Explain what a binary tree is and define height, depth, and leaf nodes.", hint: "Hierarchical structure, each node has at most 2 children." },
        { q: "What is Big-O notation? Explain O(1), O(n), O(n²), O(log n).", hint: "Worst-case growth rate of an algorithm's resource usage." }
      ],
      medium: [
        { q: "Given an array of integers, find the maximum subarray sum (Kadane's algorithm). Explain your approach.", hint: "Track current_max and global_max as you scan left to right." },
        { q: "How do you detect a cycle in a linked list? Explain Floyd's algorithm.", hint: "Slow pointer moves 1 step, fast pointer moves 2 steps." },
        { q: "Explain dynamic programming vs. memoization vs. tabulation with an example.", hint: "Overlapping subproblems + optimal substructure." },
        { q: "How does a self-balancing BST (AVL or Red-Black) maintain balance? Why does it matter?", hint: "Rotation operations keep height O(log n)." },
        { q: "Explain Dijkstra's algorithm. What are its limitations?", hint: "Greedy shortest path — fails with negative weights." },
        { q: "How would you serialize and deserialize a binary tree?", hint: "Pre-order traversal with null markers." },
        { q: "Explain the two-pointer technique and give 2 problems where it applies.", hint: "Container with most water, pair sum in sorted array." },
        { q: "What is a trie (prefix tree) and when should you use it?", hint: "Efficient string prefix search and autocomplete." }
      ],
      hard: [
        { q: "Design and implement an LRU (Least Recently Used) cache with O(1) get and put operations.", hint: "HashMap + doubly linked list." },
        { q: "Find all valid combinations of k numbers that sum to n using numbers 1–9. Explain time and space complexity.", hint: "Backtracking with pruning, O(k × C(9,k))." },
        { q: "You have a 2D grid with obstacles. Find the minimum number of steps to reach from top-left to bottom-right, where you can remove up to k obstacles.", hint: "BFS with state (row, col, k_remaining)." },
        { q: "Given a string, find the length of the longest palindromic subsequence. Solve it with O(n²) time and O(n) space.", hint: "DP with space optimization using two 1D arrays." },
        { q: "Design a system that can find the shortest path between any two nodes in a dynamic graph (edges are added/removed frequently).", hint: "D-query algorithm, incremental BFS, Euler tour for LCA." }
      ]
    },
    hr: [
      "Tell me about a time you had to solve a problem under a tight deadline with limited information.",
      "How do you approach learning a new algorithm or data structure you've never seen before?",
      "Describe a situation where you optimized code for performance. What was your process?",
      "How do you handle getting stuck on a difficult problem during a coding interview?",
      "Tell me about a collaborative coding project. How did you divide work and maintain code quality?"
    ]
  }
];

const COMPANIES = [
  {
    id: 'google',
    name: 'Google',
    logo: 'G',
    style: "Known for algorithm-heavy interviews, distributed systems, and Googleyness behavioral questions. Focus: scalability, elegance, and leadership principles.",
    questions: {
      technical: [
        "Design a distributed key-value store like Google Bigtable that can handle petabytes of data.",
        "How would you design Google Maps' routing algorithm for real-time traffic?",
        "Explain how PageRank works and how you'd scale it to the entire web.",
        "Design a system to detect and prevent click fraud at Google Ads scale (billions of clicks/day).",
        "How would you build a spell checker like the one in Google Search?"
      ],
      hr: [
        "Tell me about a time you demonstrated Googleyness — being genuinely helpful and thinking beyond your immediate role.",
        "Describe a situation where you took a big technical risk that didn't pay off. How did you handle it?",
        "Google values '10x thinking'. Give an example where you reimagined a problem rather than optimizing the existing solution.",
        "How do you handle ambiguity? Give a specific example."
      ]
    }
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'A',
    style: "Amazon uses STAR-format behavioral questions heavily based on their 16 Leadership Principles. Technical focus: distributed systems, cost efficiency, customer obsession.",
    questions: {
      technical: [
        "Design Amazon's product recommendation engine at 300M customer scale.",
        "Design a distributed inventory management system that handles Black Friday traffic spikes (100x normal load).",
        "How would you design Amazon's order fulfillment system to guarantee same-day delivery?",
        "Design a system to detect counterfeit products on Amazon Marketplace.",
        "How would you build a pricing engine that automatically adjusts prices millions of times per day?"
      ],
      hr: [
        "Tell me about a time you were customer-obsessed. How did you prioritize customer needs over internal metrics?",
        "Describe a time you had to deliver results in a situation with very few resources. (Frugality)",
        "Give an example of when you disagreed with a manager but still committed to the decision. (Disagree and Commit)",
        "Tell me about a time you raised the bar. What did you do to go beyond what was expected?"
      ]
    }
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'MS',
    style: "Microsoft emphasizes collaborative culture (Growth Mindset), system design, and Azure cloud. Focus: teamwork, learning from failures, and cloud-native architectures.",
    questions: {
      technical: [
        "Design Microsoft Azure's blob storage service for enterprise customers.",
        "How would you architect Microsoft Teams to handle 300 million daily active users?",
        "Design a distributed version control system like GitHub at scale.",
        "How would you implement a real-time collaborative editing engine for Microsoft Office Online?",
        "Design an AI copilot system that can integrate with any Microsoft 365 application."
      ],
      hr: [
        "Tell me about a time you embodied Satya Nadella's Growth Mindset by learning from failure.",
        "How have you helped a colleague grow professionally or technically?",
        "Describe a situation where collaboration across teams led to a better outcome than working alone.",
        "What do you do when you receive feedback that you strongly disagree with?"
      ]
    }
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'M',
    style: "Meta focuses on product impact, moving fast, and social graph problems. Technical: React/GraphQL (frontend), distributed ML systems (backend).",
    questions: {
      technical: [
        "Design Facebook's News Feed ranking algorithm considering thousands of signals.",
        "How would you build Instagram's story feature to serve 2 billion daily active users?",
        "Design a real-time messaging system for WhatsApp at global scale.",
        "How would you detect and remove hate speech at scale across 3 billion users?",
        "Design a social graph database that can answer 'mutual friends' queries in < 50ms."
      ],
      hr: [
        "Tell me about a time you moved fast and broke something. What did you learn?",
        "How have you used data to drive a product or engineering decision?",
        "Describe how you've contributed to Meta's mission of connecting people.",
        "Tell me about a time you had to make a decision quickly without all the information you wanted."
      ]
    }
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: 'N',
    style: "Netflix values freedom and responsibility, chaos engineering, and streaming architecture. Focus: highly available distributed systems, personalization, A/B testing.",
    questions: {
      technical: [
        "Design Netflix's video streaming infrastructure to serve 200M+ subscribers globally.",
        "How would you build Netflix's recommendation engine? What signals would you use?",
        "Design a chaos engineering system (like Chaos Monkey) that intentionally breaks production systems.",
        "How would you implement adaptive bitrate streaming for different network conditions?",
        "Design a content licensing and availability system across 190 countries with different catalogs."
      ],
      hr: [
        "Netflix has a 'Keeper Test'. Would your manager fight to keep you? Why?",
        "Tell me about a time you acted with full ownership and autonomy on a high-stakes decision.",
        "How do you handle working in an environment with minimal process?",
        "Describe a time you gave radical candor (honest, direct feedback) to a colleague or manager."
      ]
    }
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: 'AP',
    style: "Apple focuses on deep technical excellence, attention to detail, user experience perfection, and secrecy. Focus: Swift/Obj-C, hardware-software integration, privacy.",
    questions: {
      technical: [
        "How would you design an end-to-end encrypted messaging system for iMessage?",
        "Explain how you'd optimize battery life for a computationally intensive iOS app.",
        "Design the Siri voice assistant architecture focusing on on-device privacy preservation.",
        "How would you build the App Store review pipeline to handle 1M new app submissions per year?",
        "Design Apple Pay's security architecture for contactless payments."
      ],
      hr: [
        "Apple products are known for attention to detail. Tell me about a project where you went beyond good to make it perfect.",
        "Describe a time you identified a user experience problem that others overlooked.",
        "How do you work in an environment where you can't discuss your work outside the company?",
        "Tell me about a time you pushed back on a decision to maintain quality standards."
      ]
    }
  },
  {
    id: 'startup',
    name: 'Startup',
    logo: 'ST',
    style: "Startups value generalist skills, wearing many hats, fast iteration, and business impact. Focus: execution speed, ownership, and adaptability.",
    questions: {
      technical: [
        "How would you build an MVP of our core product in 2 weeks with just 2 engineers?",
        "What's your approach to choosing a tech stack for a new product? What would you use and why?",
        "How do you balance technical debt when you need to ship features fast?",
        "Walk me through how you'd set up observability for a new service from scratch.",
        "How do you decide what NOT to build?"
      ],
      hr: [
        "This role requires wearing many hats. Tell me about a time you had to work outside your comfort zone.",
        "What motivated you to join an early-stage startup over a big tech company?",
        "How do you handle when the company pivots and your work becomes obsolete?",
        "Tell me about a time you independently identified and solved a problem that wasn't in your job description."
      ]
    }
  },
  {
    id: 'general',
    name: 'General',
    logo: 'GEN',
    style: "Well-rounded preparation covering universal interview topics applicable to any company.",
    questions: {
      technical: [],
      hr: []
    }
  }
];

const GENERAL_HR = [
  "Tell me about yourself and walk me through your career journey.",
  "Why are you interested in this role?",
  "What is your greatest professional strength?",
  "What is an area you are actively working to improve?",
  "Where do you see yourself in 5 years?",
  "Tell me about a time you demonstrated strong leadership.",
  "Describe a conflict you had with a coworker and how you resolved it.",
  "What motivates you to do your best work?",
  "How do you handle working under pressure or tight deadlines?",
  "Tell me about a time you failed. What did you do next?",
  "How do you prioritize tasks when you have multiple urgent deadlines?",
  "What does work-life balance mean to you and how do you maintain it?",
  "Tell me about a time you had to learn something completely new very quickly.",
  "What kind of work environment do you thrive in?",
  "Why are you leaving your current role?"
];
