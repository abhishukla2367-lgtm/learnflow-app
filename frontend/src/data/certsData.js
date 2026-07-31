export const CERTS = [
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d1",
    title: 'Certified Full Stack Developer',
    emoji: '🧑‍💻',
    tagline: 'The most in-demand web skill in India — now with blockchain proof.',
    desc: 'Master end-to-end web development with the MERN stack.',
    duration: '12 weeks', level: 'Intermediate', price: 4999, origPrice: 14999,
    tag: 'Most Popular', jobs: '22,000+ openings',
    tagStyle: 'inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200',
    gradient: 'from-cyan-500 to-blue-600',
    accentBg: 'bg-cyan-50', accentBorder: 'border-cyan-200', accentText: 'text-cyan-700',
    modules: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
    highlights: [
      'Build full-stack apps with the MERN stack from scratch',
      'Implement secure JWT authentication and role-based access',
      'Deploy to AWS with CI/CD pipelines using GitHub Actions',
      'Design and query MongoDB with aggregation pipelines',
      'Master React hooks, Context API, and Redux',
      'Build RESTful APIs with Node.js and Express',
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript ES6+', 'AWS', 'Docker', 'Git', 'REST APIs', 'JWT'],
    companies: ['TCS', 'Infosys', 'Wipro', 'Flipkart', 'Zomato', 'Razorpay'],
    syllabus: [
      { topic: 'HTML5 & CSS3 Foundations', week: 'Week 1–2', lessons: 6 },
      { topic: 'Modern JavaScript ES6+', week: 'Week 1–2', lessons: 8 },
      { topic: 'React — Components & Hooks', week: 'Week 3–5', lessons: 10 },
      { topic: 'React Router & State Management', week: 'Week 3–5', lessons: 7 },
      { topic: 'Node.js & Express REST APIs', week: 'Week 6–8', lessons: 9 },
      { topic: 'MongoDB & Mongoose', week: 'Week 9–10', lessons: 7 },
      { topic: 'Auth, JWT & Security', week: 'Week 11', lessons: 6 },
      { topic: 'AWS Deployment & CI/CD', week: 'Week 12', lessons: 5 },
    ],
    alumni: {
      name: 'Raj Sridhar',
      role: 'Software Engineer · Infosys',
      city: 'Coimbatore',
      text: 'The Full Stack cert opened doors I never expected. Went from ₹4.5 LPA to ₹11 LPA at Infosys within 4 months.',
      avatar: 'RS',
      rating: 5,
    },
    lessons: [
      {
        id: '1-1', weekLabel: 'Week 1–2', title: 'HTML5 & CSS3 Foundations', duration: '48 min',
        // freeCodeCamp — HTML Full Course for Beginners (Beau Carnes)
        videoId: 'mU6anWqZJcc',
        description: 'Build the structural and visual foundations of modern websites using semantic HTML5 and advanced CSS3 including Flexbox and Grid layouts.',
      },
      {
        id: '1-2', weekLabel: 'Week 1–2', title: 'Modern JavaScript ES6+', duration: '62 min',
        // freeCodeCamp — JavaScript Full Course for Beginners
        videoId: 'PkZNo7MFNFg',
        description: 'Deep dive into ES6+ features: arrow functions, destructuring, async/await, modules, and the event loop.',
      },
      {
        id: '1-3', weekLabel: 'Week 3–5', title: 'React — Components & Hooks', duration: '55 min',
        // Traversy Media — React Crash Course 2021
        videoId: 'w7ejDZ8SWv8',
        description: 'Learn React from the ground up — JSX, functional components, useState, useEffect, and building real UIs.',
      },
      {
        id: '1-4', weekLabel: 'Week 3–5', title: 'React Router & State Management', duration: '30 min',
        // Web Dev Simplified — React Router v6 Tutorial
        videoId: 'zpUMRsAO6-Y',
        description: 'Master client-side routing with React Router and global state management patterns using Context API and Redux.',
      },
      {
        id: '1-5', weekLabel: 'Week 6–8', title: 'Node.js & Express REST APIs', duration: '58 min',
        // Traversy Media — Node.js & Express Crash Course
        videoId: 'Oe421EPjeBE',
        description: 'Build scalable REST APIs with Node.js and Express — middleware, routing, authentication, and error handling.',
      },
      {
        id: '1-6', weekLabel: 'Week 9–10', title: 'MongoDB & Mongoose', duration: '44 min',
        // freeCodeCamp — MongoDB Full Tutorial
        videoId: 'xdbm7n9dWHM',
        description: 'Design and query NoSQL databases with MongoDB. Schema design, aggregation pipelines, and Mongoose ODM.',
      },
      {
        id: '1-7', weekLabel: 'Week 11', title: 'Auth, JWT & Security', duration: '46 min',
        // Web Dev Simplified — JWT Authentication Tutorial
        videoId: '7Q17ubqLfaM',
        description: 'Implement secure authentication with JWT, bcrypt password hashing, role-based access control, and OWASP security practices.',
      },
      {
        id: '1-8', weekLabel: 'Week 12', title: 'AWS Deployment & CI/CD', duration: '52 min',
        // TechWorld with Nana — GitHub Actions CI/CD Tutorial
        videoId: '40X6abe5wv0',
        description: 'Deploy full-stack applications to AWS EC2, configure Nginx, set up GitHub Actions CI/CD pipelines, and manage environment variables.',
      },
    ],
    quiz: [
      { q: 'Which hook is used to perform side effects in a React functional component?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct: 1 },
      { q: 'What does REST stand for?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Resource Encapsulated State Transfer', 'Relational Entity State Transfer'], correct: 1 },
      { q: 'Which MongoDB method is used to find all documents matching a query?', options: ['findOne()', 'search()', 'find()', 'query()'], correct: 2 },
      { q: 'In Node.js, which module is used to create an HTTP server natively?', options: ['express', 'http', 'server', 'net'], correct: 1 },
      { q: 'What is the correct way to declare a constant in ES6?', options: ['var x = 5', 'let x = 5', 'const x = 5', 'define x = 5'], correct: 2 },
    ],
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d2",
    title: 'Certified Data Science Professional',
    emoji: '📊',
    tagline: 'From raw data to deployed models — the full data science lifecycle.',
    desc: 'Python, ML, and deployment — the exact stack top analytics firms hire for.',
    duration: '14 weeks', level: 'Intermediate', price: 5999, origPrice: 17999,
    tag: 'High Demand', jobs: '18,500+ openings',
    tagStyle: 'inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-violet-50 text-violet-700 border border-violet-200',
    gradient: 'from-violet-500 to-purple-600',
    accentBg: 'bg-violet-50', accentBorder: 'border-violet-200', accentText: 'text-violet-700',
    modules: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'MLOps'],
    highlights: [
      'Build and deploy machine learning models end-to-end',
      'Master Pandas and NumPy for large-scale data manipulation',
      'Design neural networks with TensorFlow and Keras',
      'Apply NLP techniques for text classification and sentiment analysis',
      'Containerise and monitor models in production with Docker and MLflow',
      'Tune models with GridSearchCV and feature engineering pipelines',
    ],
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'NLP', 'MLflow', 'Docker', 'FastAPI', 'SQL'],
    companies: ['Mu Sigma', 'Flipkart', 'Walmart Labs', 'BYJU\'S', 'Swiggy', 'PhonePe'],
    syllabus: [
      { topic: 'Python for Data Science', week: 'Week 1–2', lessons: 7 },
      { topic: 'Pandas & NumPy Mastery', week: 'Week 3–5', lessons: 9 },
      { topic: 'Data Visualisation with Matplotlib & Seaborn', week: 'Week 3–5', lessons: 6 },
      { topic: 'Machine Learning with Scikit-learn', week: 'Week 6–8', lessons: 10 },
      { topic: 'Deep Learning with TensorFlow', week: 'Week 9–10', lessons: 8 },
      { topic: 'NLP & Text Mining', week: 'Week 11–12', lessons: 7 },
      { topic: 'Feature Engineering & Model Selection', week: 'Week 13–14', lessons: 6 },
      { topic: 'MLOps & Model Deployment', week: 'Week 13–14', lessons: 5 },
    ],
    alumni: {
      name: 'Sunny Verma',
      role: 'Data Analyst · Mu Sigma',
      city: 'Bengaluru',
      text: 'Mu Sigma shortlisted me specifically because of the Learnodays badge on my LinkedIn. The Data Science cert is gold.',
      avatar: 'SV',
      rating: 5,
    },
    lessons: [
      {
        id: '2-1', weekLabel: 'Week 1–2', title: 'Python for Data Science', duration: '54 min',
        // freeCodeCamp — Python for Everybody (Dr. Chuck)
        videoId: 'HrRA67O-QXI',
        description: 'Python fundamentals tailored for data science — data types, functions, file I/O, and working with the scientific Python stack.',
      },
      {
        id: '2-2', weekLabel: 'Week 3–5', title: 'Pandas & NumPy Mastery', duration: '58 min',
        // Keith Galli — Complete Pandas Tutorial
        videoId: 'e60ItwlZTKM',
        description: 'Manipulate, clean, and transform large datasets using Pandas DataFrames and NumPy arrays for high-performance computation.',
      },
      {
        id: '2-3', weekLabel: 'Week 3–5', title: 'Data Visualisation with Matplotlib & Seaborn', duration: '46 min',
        // Corey Schafer — Matplotlib Tutorial Full Series
        videoId: '-jTD74eEy2I',
        description: 'Create publication-quality charts, heatmaps, and interactive visualisations to communicate data insights effectively.',
      },
      {
        id: '2-4', weekLabel: 'Week 6–8', title: 'Machine Learning with Scikit-learn', duration: '65 min',
        // freeCodeCamp — Machine Learning with Python
        videoId: 'ukzFI9rgwfU',
        description: 'Supervised and unsupervised learning — linear regression, decision trees, random forests, SVM, KMeans, and model evaluation.',
      },
      {
        id: '2-5', weekLabel: 'Week 9–10', title: 'Deep Learning with TensorFlow', duration: '70 min',
        // 3Blue1Brown — Neural Networks (Chapter 1)
        videoId: 'aircAruvnKk',
        description: 'Build and train neural networks from scratch. Understand backpropagation, CNNs, RNNs, and transfer learning with Keras.',
      },
      {
        id: '2-6', weekLabel: 'Week 11–12', title: 'NLP & Text Mining', duration: '52 min',
        // freeCodeCamp — NLP with Python (spaCy & NLTK)
        videoId: '05ONoGfmKvA',
        description: 'Process and analyse text data using NLTK, spaCy, and transformers. Sentiment analysis, named entity recognition, and text classification.',
      },
      {
        id: '2-7', weekLabel: 'Week 13–14', title: 'Feature Engineering & Model Selection', duration: '48 min',
        // Krish Naik — Feature Engineering Full Course
        videoId: '0B5eIE_1vpU',
        description: 'Advanced techniques for feature selection, dimensionality reduction with PCA, hyperparameter tuning with GridSearchCV.',
      },
      {
        id: '2-8', weekLabel: 'Week 13–14', title: 'MLOps & Model Deployment', duration: '56 min',
        // TechWorld with Nana — MLOps Explained
        videoId: 'ZVWg18AXXuE',
        description: 'Deploy ML models as REST APIs using FastAPI and Flask. Containerise with Docker and monitor models in production with MLflow.',
      },
    ],
    quiz: [
      { q: 'Which Python library is primarily used for data manipulation and analysis?', options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'], correct: 1 },
      { q: 'What does overfitting mean in machine learning?', options: ['Model performs well on training but poorly on test data', 'Model performs poorly on both training and test data', 'Model is too simple to capture patterns', 'Model takes too long to train'], correct: 0 },
      { q: 'Which algorithm is NOT a supervised learning method?', options: ['Linear Regression', 'Decision Tree', 'K-Means Clustering', 'Support Vector Machine'], correct: 2 },
      { q: 'What is the purpose of the train-test split?', options: ['Speed up training', 'Evaluate model on unseen data', 'Reduce overfitting only', 'Clean the dataset'], correct: 1 },
      { q: 'Which metric is most appropriate for imbalanced classification problems?', options: ['Accuracy', 'Mean Squared Error', 'F1 Score', 'R-squared'], correct: 2 },
    ],
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d3",
    title: 'Certified UI/UX Designer',
    emoji: '🎨',
    tagline: 'Design thinking to Figma mastery — build a portfolio that lands offers.',
    desc: 'Portfolio-ready design skills for India\'s top product companies.',
    duration: '10 weeks', level: 'Beginner', price: 3499, origPrice: 9999,
    tag: 'Portfolio Ready', jobs: '9,000+ openings',
    tagStyle: 'inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-amber-50 text-amber-700 border border-amber-200',
    gradient: 'from-amber-500 to-orange-600',
    accentBg: 'bg-amber-50', accentBorder: 'border-amber-200', accentText: 'text-amber-700',
    modules: ['Figma', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility'],
    highlights: [
      'Master Figma from zero to production-ready designs',
      'Conduct user research and synthesise findings into insights',
      'Build scalable design systems with tokens and components',
      'Create interactive prototypes and run usability tests',
      'Design for accessibility following WCAG 2.1 guidelines',
      'Prepare developer handoff specs and a job-ready portfolio',
    ],
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility', 'WCAG', 'Usability Testing'],
    companies: ['Razorpay', 'Swiggy', 'Ola', 'MakeMyTrip', 'Zepto', 'CRED'],
    syllabus: [
      { topic: 'UX Foundations & Design Thinking', week: 'Week 1–2', lessons: 5 },
      { topic: 'User Research Methods', week: 'Week 1–2', lessons: 5 },
      { topic: 'Wireframing & Information Architecture', week: 'Week 3–4', lessons: 6 },
      { topic: 'Figma UI Design Mastery', week: 'Week 5–6', lessons: 8 },
      { topic: 'Prototyping & Usability Testing', week: 'Week 7–8', lessons: 6 },
      { topic: 'Design Systems & Tokens', week: 'Week 9', lessons: 5 },
      { topic: 'Accessibility & Inclusive Design', week: 'Week 9', lessons: 4 },
      { topic: 'Developer Handoff & Portfolio', week: 'Week 10', lessons: 4 },
    ],
    alumni: {
      name: 'Meena Patel',
      role: 'UI Designer · Razorpay',
      city: 'Pune',
      text: 'From non-tech in Ahmedabad to designing Razorpay\'s checkout flow. The UI/UX cert made all the difference.',
      avatar: 'MP',
      rating: 4,
    },
    lessons: [
      {
        id: '3-1', weekLabel: 'Week 1–2', title: 'UX Foundations & Design Thinking', duration: '42 min',
        // AJ&Smart — Design Thinking Full Course
        videoId: '6lmvCqvmjfE',
        description: 'Understand the UX design process, empathy mapping, user personas, and how design thinking solves real human problems.',
      },
      {
        id: '3-2', weekLabel: 'Week 1–2', title: 'User Research Methods', duration: '38 min',
        // Nielsen Norman Group — User Research Methods Overview
        videoId: 'kQ_6faxhyIw',
        description: 'Conduct user interviews, usability tests, and surveys. Synthesise research into actionable insights using affinity diagrams.',
      },
      {
        id: '3-3', weekLabel: 'Week 3–4', title: 'Wireframing & Information Architecture', duration: '44 min',
        // Figma — Wireframing in Figma Official Tutorial
        videoId: 'qpH7-KFWZRI',
        description: 'Create low-fidelity wireframes, site maps, and user flows. Learn to structure information for maximum usability.',
      },
      {
        id: '3-4', weekLabel: 'Week 5–6', title: 'Figma UI Design Mastery', duration: '60 min',
        // DesignCourse — Figma UI Design Tutorial for Beginners
        videoId: 'FTFaQWZBqQ8',
        description: 'Master Figma from scratch — auto-layout, components, variables, styles, and building production-ready high-fidelity designs.',
      },
      {
        id: '3-5', weekLabel: 'Week 7–8', title: 'Prototyping & Usability Testing', duration: '48 min',
        // Figma — Prototyping in Figma Official Tutorial
        videoId: 'OlbdIXLunt4',
        description: 'Build interactive prototypes in Figma. Run usability tests, collect feedback, and iterate your designs based on real user data.',
      },
      {
        id: '3-6', weekLabel: 'Week 9', title: 'Design Systems & Tokens', duration: '52 min',
        // Figma — Design Systems Tutorial
        videoId: 'CJyJN0ZdEGA',
        description: 'Build scalable design systems with reusable components, design tokens, typography scales, and colour palettes.',
      },
      {
        id: '3-7', weekLabel: 'Week 9', title: 'Accessibility & Inclusive Design', duration: '40 min',
        // Google — Web Accessibility (WCAG & Inclusive Design)
        videoId: 'UAKeNiaay10',
        description: 'Design for all users — WCAG 2.1 guidelines, colour contrast, keyboard navigation, screen reader support, and ARIA labels.',
      },
      {
        id: '3-8', weekLabel: 'Week 10', title: 'Developer Handoff & Portfolio', duration: '36 min',
        // Figma — Dev Mode & Developer Handoff Official Tutorial
        videoId: 'ALkqhXv0GPk',
        description: 'Prepare design specifications for developers using Figma Dev Mode. Build a portfolio that lands product design roles.',
      },
    ],
    quiz: [
      { q: 'What is the primary goal of UX design?', options: ['Make things look beautiful', 'Increase company revenue', 'Create useful, usable, and enjoyable experiences', 'Write clean code'], correct: 2 },
      { q: 'What is a user persona?', options: ['A fake social media account', 'A fictional representation of your target user', 'A developer testing document', 'A legal user agreement'], correct: 1 },
      { q: 'What does WCAG stand for?', options: ['Web Content Accessibility Guidelines', 'Web Colour and Graphics', 'Website Code Auditing Guide', 'Web Component Automation Group'], correct: 0 },
      { q: 'Which is a low-fidelity design deliverable?', options: ['Final Figma prototype', 'Coded component', 'Paper wireframe', 'Brand style guide'], correct: 2 },
      { q: 'What is the purpose of a design system?', options: ['Replace designers with developers', 'Ensure consistency and scalability across products', 'Make apps load faster', 'Automate user testing'], correct: 1 },
    ],
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d4",
    title: 'Certified DevOps Engineer',
    emoji: '⚙️',
    tagline: 'CI/CD, Kubernetes, and cloud infra — the backbone of modern engineering teams.',
    desc: 'CI/CD, Kubernetes, and cloud infra — recognised by IT giants and funded startups.',
    duration: '12 weeks', level: 'Advanced', price: 5499, origPrice: 15999,
    tag: 'Industry Gold', jobs: '15,000+ openings',
    tagStyle: 'inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200',
    gradient: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-50', accentBorder: 'border-emerald-200', accentText: 'text-emerald-700',
    modules: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Prometheus'],
    highlights: [
      'Build and manage containerised workloads with Docker and Kubernetes',
      'Provision cloud infrastructure on AWS with Terraform',
      'Design automated CI/CD pipelines with GitHub Actions and Jenkins',
      'Monitor systems in real-time with Prometheus and Grafana',
      'Write bash scripts to automate repetitive Linux operations',
      'Implement RBAC security and Helm chart deployments',
    ],
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions', 'Jenkins', 'Prometheus', 'Grafana', 'Linux', 'Bash'],
    companies: ['TCS', 'HCL', 'Wipro', 'Infosys', 'Accenture', 'ThoughtWorks'],
    syllabus: [
      { topic: 'Linux & Shell Scripting', week: 'Week 1–2', lessons: 7 },
      { topic: 'Networking for DevOps', week: 'Week 1–2', lessons: 5 },
      { topic: 'Docker — Containers & Images', week: 'Week 3–4', lessons: 8 },
      { topic: 'Kubernetes in Production', week: 'Week 5–6', lessons: 9 },
      { topic: 'AWS Core Services', week: 'Week 7–8', lessons: 8 },
      { topic: 'Terraform & Infrastructure as Code', week: 'Week 9–10', lessons: 7 },
      { topic: 'CI/CD with GitHub Actions & Jenkins', week: 'Week 9–10', lessons: 6 },
      { topic: 'Monitoring with Prometheus & Grafana', week: 'Week 11–12', lessons: 6 },
    ],
    alumni: {
      name: 'Karan Mehta',
      role: 'DevOps Engineer · HCL Technologies',
      city: 'Hyderabad',
      text: 'Got my first DevOps role at HCL with a 40% salary jump. The Kubernetes and Terraform modules were directly what they tested in the interview.',
      avatar: 'KM',
      rating: 4.7,
    },
    lessons: [
      {
        id: '4-1', weekLabel: 'Week 1–2', title: 'Linux & Shell Scripting', duration: '56 min',
        // freeCodeCamp — Linux Command Line Full Course
        videoId: 'FL7K2A2KH7g',
        description: 'Master Linux fundamentals, file permissions, process management, and write powerful bash scripts to automate repetitive tasks.',
      },
      {
        id: '4-2', weekLabel: 'Week 1–2', title: 'Networking for DevOps', duration: '44 min',
        // PowerCert Animated Videos — Networking Full Course
        videoId: 'mNTs-shuFno',
        description: 'TCP/IP, DNS, HTTP/HTTPS, load balancing, firewalls, VPCs, and subnets — everything a DevOps engineer needs to know.',
      },
      {
        id: '4-3', weekLabel: 'Week 3–4', title: 'Docker — Containers & Images', duration: '60 min',
        // freeCodeCamp — Docker Tutorial for Beginners (Full Course)
        videoId: 'exmSJpJvIPs',
        description: 'Build, ship, and run containerised applications with Docker. Dockerfiles, multi-stage builds, Docker Compose, and best practices.',
      },
      {
        id: '4-4', weekLabel: 'Week 5–6', title: 'Kubernetes in Production', duration: '70 min',
        // TechWorld with Nana — Kubernetes Tutorial for Beginners (Full Course)
        videoId: 'X48VuDVv0do',
        description: 'Deploy and manage containerised workloads on Kubernetes — pods, services, deployments, Helm charts, and RBAC security.',
      },
      {
        id: '4-5', weekLabel: 'Week 7–8', title: 'AWS Core Services', duration: '65 min',
        // freeCodeCamp — AWS Certified Cloud Practitioner (Full Course)
        videoId: '3WZzmiAkYBQ',
        description: 'EC2, S3, RDS, VPC, IAM, EKS, CloudFront — architect and deploy cloud infrastructure on AWS following best practices.',
      },
      {
        id: '4-6', weekLabel: 'Week 9–10', title: 'Terraform & Infrastructure as Code', duration: '58 min',
        // TechWorld with Nana — Terraform Course for Beginners
        videoId: 'l5k1ai_GBDE',
        description: 'Provision cloud infrastructure with Terraform. Modules, state management, workspaces, and integrating IaC into CI/CD pipelines.',
      },
      {
        id: '4-7', weekLabel: 'Week 9–10', title: 'CI/CD with GitHub Actions & Jenkins', duration: '52 min',
        // TechWorld with Nana — GitHub Actions Tutorial
        videoId: 'R8_veQiYBjI',
        description: 'Build automated pipelines for testing, building, and deploying applications with GitHub Actions and Jenkins.',
      },
      {
        id: '4-8', weekLabel: 'Week 11–12', title: 'Monitoring with Prometheus & Grafana', duration: '48 min',
        // TechWorld with Nana — Prometheus & Grafana Tutorial
        videoId: 'h4Sl21AKiDg',
        description: 'Instrument applications, collect metrics with Prometheus, build real-time dashboards in Grafana, and set up alerting rules.',
      },
    ],
    quiz: [
      { q: 'What does CI/CD stand for?', options: ['Code Integration / Code Deployment', 'Continuous Integration / Continuous Delivery', 'Cloud Infrastructure / Cloud Deployment', 'Container Images / Container Deployment'], correct: 1 },
      { q: 'Which command is used to list all running Docker containers?', options: ['docker list', 'docker ps', 'docker run --list', 'docker containers'], correct: 1 },
      { q: 'In Kubernetes, what is a Pod?', options: ['A virtual machine', 'The smallest deployable unit containing one or more containers', 'A networking policy', 'A load balancer'], correct: 1 },
      { q: 'What is the purpose of Terraform state files?', options: ['Store passwords securely', 'Track the real-world infrastructure Terraform manages', 'Log all deployments', 'Define CI/CD pipelines'], correct: 1 },
      { q: 'Which Linux command shows real-time system resource usage?', options: ['ls -la', 'grep -r', 'top', 'chmod 777'], correct: 2 },
    ],
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d5",
    title: 'Certified React Native Developer',
    emoji: '📱',
    tagline: 'One codebase, two stores — ship Android and iOS apps that India actually uses.',
    desc: 'Ship Android & iOS apps from one codebase for India\'s 750M+ smartphone users.',
    duration: '10 weeks', level: 'Intermediate', price: 4499, origPrice: 12999,
    tag: 'Mobile First', jobs: '12,000+ openings',
    tagStyle: 'inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-rose-50 text-rose-700 border border-rose-200',
    gradient: 'from-rose-500 to-pink-600',
    accentBg: 'bg-rose-50', accentBorder: 'border-rose-200', accentText: 'text-rose-700',
    modules: ['React Native', 'Expo', 'Redux', 'Firebase', 'Reanimated', 'EAS Build'],
    highlights: [
      'Build cross-platform Android and iOS apps with React Native and Expo',
      'Implement complex navigation flows with React Navigation',
      'Manage app state with Redux Toolkit and RTK Query',
      'Integrate Firebase auth, Firestore, and push notifications',
      'Create fluid 60fps animations with Reanimated 3',
      'Submit production apps to Google Play and the Apple App Store',
    ],
    skills: ['React Native', 'Expo', 'Redux Toolkit', 'Firebase', 'Reanimated 3', 'React Navigation', 'JavaScript', 'TypeScript', 'EAS Build'],
    companies: ['Ola', 'Swiggy', 'Zepto', 'PhonePe', 'CRED', 'Meesho'],
    syllabus: [
      { topic: 'React Native & Expo Fundamentals', week: 'Week 1–2', lessons: 6 },
      { topic: 'Navigation with React Navigation', week: 'Week 3–4', lessons: 6 },
      { topic: 'Core UI Components & Lists', week: 'Week 3–4', lessons: 5 },
      { topic: 'Redux Toolkit & State Management', week: 'Week 5–6', lessons: 7 },
      { topic: 'Firebase Auth & Firestore', week: 'Week 7–8', lessons: 7 },
      { topic: 'Animations with Reanimated 3', week: 'Week 9', lessons: 5 },
      { topic: 'Native Modules & Device APIs', week: 'Week 9', lessons: 5 },
      { topic: 'App Store Deployment & OTA Updates', week: 'Week 10', lessons: 4 },
    ],
    alumni: {
      name: 'Priya Patil',
      role: 'Mobile Developer · Swiggy',
      city: 'Bengaluru',
      text: 'I had zero mobile experience before this cert. Six months later I\'m shipping features to millions of Swiggy users on Android and iOS.',
      avatar: 'PP',
      rating: 4.9,
    },
    lessons: [
      {
        id: '5-1', weekLabel: 'Week 1–2', title: 'React Native & Expo Fundamentals', duration: '50 min',
        // freeCodeCamp — React Native Course for Beginners (Expo)
        videoId: '0-S5a0eXPoc',
        description: 'Set up your development environment with Expo, understand the React Native component model, StyleSheet, and Flexbox for mobile layouts.',
      },
      {
        id: '5-2', weekLabel: 'Week 3–4', title: 'Navigation with React Navigation', duration: '46 min',
        // Catalin Miron — React Navigation v6 Full Tutorial
        videoId: 'Jj3lM7KIKkA',
        description: 'Implement stack, tab, and drawer navigators. Pass parameters between screens and manage deep linking.',
      },
      {
        id: '5-3', weekLabel: 'Week 3–4', title: 'Core UI Components & Lists', duration: '42 min',
        // William Candillon — React Native FlatList Tutorial
        videoId: 'br3kkw5m_jw',
        description: 'Build performant list views with FlatList and SectionList, build custom components, and implement pull-to-refresh patterns.',
      },
      {
        id: '5-4', weekLabel: 'Week 5–6', title: 'Redux Toolkit & State Management', duration: '54 min',
        // Laith Harb — Redux Toolkit Full Tutorial
        videoId: '1i04-A7kfFI',
        description: 'Manage complex application state with Redux Toolkit, RTK Query for API calls, and persist state with Redux Persist.',
      },
      {
        id: '5-5', weekLabel: 'Week 7–8', title: 'Firebase Auth & Firestore', duration: '58 min',
        // Net Ninja — React Native Firebase Full Course
        videoId: 'knk5Fjrpde0',
        description: 'Integrate Firebase authentication, real-time Firestore database, Cloud Storage, and push notifications with FCM.',
      },
      {
        id: '5-6', weekLabel: 'Week 9', title: 'Animations with Reanimated 3', duration: '52 min',
        // William Candillon — React Native Reanimated 3 Tutorial
        videoId: '8hW5Dnuu99Q',
        description: 'Create fluid, 60fps animations with React Native Reanimated 3. Spring animations, gesture handlers, and shared element transitions.',
      },
      {
        id: '5-7', weekLabel: 'Week 9', title: 'Native Modules & Device APIs', duration: '44 min',
        // Expo — Using Native Device APIs with Expo
        videoId: '-Oniup60Afs',
        description: 'Access device hardware — camera, location, contacts, biometrics, and local notifications using Expo APIs and native modules.',
      },
      {
        id: '5-8', weekLabel: 'Week 10', title: 'App Store Deployment & OTA Updates', duration: '48 min',
        // Expo — EAS Build & App Store Submission Tutorial
        videoId: 'DWpcD6bvTRA',
        description: 'Build, sign, and submit your app to Google Play and the Apple App Store. Use Expo EAS Build and OTA updates with EAS Update.',
      },
    ],
    quiz: [
      { q: 'Which component is used for high-performance lists in React Native?', options: ['ScrollView', 'ListView', 'FlatList', 'TableView'], correct: 2 },
      { q: 'What is the default layout engine in React Native?', options: ['CSS Grid', 'Flexbox', 'Bootstrap', 'Absolute'], correct: 1 },
      { q: 'Which tool is used to build and submit React Native apps to stores?', options: ['Expo EAS Build', 'Webpack', 'Vite', 'Parcel'], correct: 0 },
      { q: 'What does Redux Persist do?', options: ['Makes Redux faster', 'Saves Redux state to local storage across app restarts', 'Syncs Redux with a server', 'Encrypts Redux state'], correct: 1 },
      { q: 'What is Reanimated 3 used for in React Native?', options: ['Database management', 'Authentication', 'High-performance animations using the UI thread', 'API calls'], correct: 2 },
    ],
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d6",
    title: 'Certified Business Analyst (Tech)',
    emoji: '📈',
    tagline: 'Bridge business and technology — the career pivot consulting firms are hiring for.',
    desc: 'Bridge business and tech — the career pivot India\'s IT consulting firms are hiring for.',
    duration: '8 weeks', level: 'Beginner', price: 3999, origPrice: 10999,
    tag: 'Non-Tech Friendly', jobs: '8,000+ openings',
    tagStyle: 'inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-indigo-50 text-indigo-700 border border-indigo-200',
    gradient: 'from-indigo-500 to-violet-600',
    accentBg: 'bg-indigo-50', accentBorder: 'border-indigo-200', accentText: 'text-indigo-700',
    modules: ['SQL', 'Power BI', 'Tableau', 'Agile', 'BPMN', 'BRD'],
    highlights: [
      'Write complex SQL queries for business reporting and analytics',
      'Build interactive Power BI dashboards with DAX calculations',
      'Run Agile ceremonies and write user stories with acceptance criteria',
      'Document business requirements in professional BRDs',
      'Model and improve business processes using BPMN notation',
      'Manage stakeholders and deliver executive-level presentations',
    ],
    skills: ['SQL', 'Power BI', 'Tableau', 'DAX', 'Agile', 'Scrum', 'BPMN', 'Requirements Gathering', 'Data Storytelling'],
    companies: ['TCS', 'Accenture', 'Capgemini', 'Deloitte', 'IBM', 'Cognizant'],
    syllabus: [
      { topic: 'BA Fundamentals & SDLC', week: 'Week 1', lessons: 4 },
      { topic: 'SQL for Business Analysts', week: 'Week 2–3', lessons: 8 },
      { topic: 'Power BI Dashboard Design', week: 'Week 4–5', lessons: 7 },
      { topic: 'Data Storytelling with Tableau', week: 'Week 4–5', lessons: 6 },
      { topic: 'Agile & Scrum for BAs', week: 'Week 6', lessons: 5 },
      { topic: 'Requirements Gathering & BRD', week: 'Week 7', lessons: 5 },
      { topic: 'Process Mapping with BPMN', week: 'Week 7', lessons: 4 },
      { topic: 'Stakeholder Management & Presentations', week: 'Week 8', lessons: 4 },
    ],
    alumni: {
      name: 'Divya Sharma',
      role: 'Business Analyst · Accenture',
      city: 'Mumbai',
      text: 'Switched from an ops role to BA at Accenture with a ₹3 LPA hike. The SQL and Power BI modules alone were worth the entire fee.',
      avatar: 'DS',
      rating: 5,
    },
    lessons: [
      {
        id: '6-1', weekLabel: 'Week 1', title: 'BA Fundamentals & SDLC', duration: '38 min',
        // CareerFoundry — What Does a Business Analyst Do?
        videoId: 'pf3vbuh0e-w',
        description: 'Understand the role of a Business Analyst in software projects, the SDLC, and how BAs bridge business stakeholders and development teams.',
      },
      {
        id: '6-2', weekLabel: 'Week 2–3', title: 'SQL for Business Analysts', duration: '56 min',
        // freeCodeCamp — SQL Full Course for Beginners
        videoId: '9581lX_pM54',
        description: 'Write SQL queries to extract business insights — SELECT, JOINs, GROUP BY, subqueries, window functions, and real-world reporting.',
      },
      {
        id: '6-3', weekLabel: 'Week 4–5', title: 'Power BI Dashboard Design', duration: '52 min',
        // Guy in a Cube / Microsoft — Power BI Full Course for Beginners
        videoId: 'xj-ByfvYtuQ',
        description: 'Connect data sources, build interactive dashboards, write DAX formulas, and present business KPIs using Power BI.',
      },
      {
        id: '6-4', weekLabel: 'Week 4–5', title: 'Data Storytelling with Tableau', duration: '46 min',
        // freeCodeCamp — Tableau Full Course
        videoId: 'TPMlZxRRaBQ',
        description: 'Build compelling data visualisations in Tableau, create calculated fields, and design executive-level dashboards.',
      },
      {
        id: '6-5', weekLabel: 'Week 6', title: 'Agile & Scrum for BAs', duration: '44 min',
        // Atlassian — Agile & Scrum Full Explanation
        videoId: 'zPznsR9YmoU',
        description: 'Sprint planning, backlog grooming, writing user stories with acceptance criteria, and facilitating scrum ceremonies as a BA.',
      },
      {
        id: '6-6', weekLabel: 'Week 7', title: 'Requirements Gathering & BRD', duration: '42 min',
        // BA Academy — Requirements Gathering & BRD Tutorial
        videoId: 'OPP5Elhot0E',
        description: 'Conduct stakeholder interviews, document business requirements in a BRD, create use cases, and manage scope creep.',
      },
      {
        id: '6-7', weekLabel: 'Week 7', title: 'Process Mapping with BPMN', duration: '36 min',
        // Signavio — BPMN 2.0 Process Modelling Tutorial
        videoId: 'BwkNceoybvA',
        description: 'Model business processes using BPMN notation, identify bottlenecks, and propose process improvements backed by data.',
      },
      {
        id: '6-8', weekLabel: 'Week 8', title: 'Stakeholder Management & Presentations', duration: '40 min',
        // Project Management — Stakeholder Management Full Guide
        videoId: 'MRr4jvEALsU',
        description: 'Manage stakeholder expectations, resolve conflicts, create executive presentations, and deliver project sign-offs.',
      },
    ],
    quiz: [
      { q: 'What does SDLC stand for?', options: ['Software Development Life Cycle', 'System Design and Launch Checklist', 'Structured Data Lifecycle', 'Software Delivery and Launch Cycle'], correct: 0 },
      { q: 'In Agile, what is a Sprint?', options: ['A performance review', 'A time-boxed iteration of work, typically 2 weeks', 'A type of user story', 'A stakeholder meeting'], correct: 1 },
      { q: 'Which SQL clause is used to filter grouped results?', options: ['WHERE', 'FILTER', 'HAVING', 'GROUP'], correct: 2 },
      { q: 'What is the purpose of a Business Requirements Document (BRD)?', options: ['Define technical architecture', 'Document the business needs and project scope', 'Plan the testing phase', 'Estimate project costs only'], correct: 1 },
      { q: 'In Power BI, what language is used to write custom calculations?', options: ['SQL', 'Python', 'DAX', 'MDX'], correct: 2 },
    ],
  },
];