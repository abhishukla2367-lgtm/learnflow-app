export const COURSES = [
  // ─── MARKETING (4 courses) ────────────────────────────────────────────────
  {
    id: "69d9301719ab4505458555ba",
    category: "Marketing",
    title: "Marketing Masterclass: Beginner Level",
    emoji: "📣",
    tagline: "Your first step into the world of digital marketing.",
    desc: "Learn the fundamentals of marketing strategy, branding, and customer psychology.",
    duration: "6 weeks",
    level: "Beginner",
    price: 0,
    origPrice: 4999,
    isFree: true,
    tag: "Free Trial",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-orange-50 text-orange-700 border border-orange-200",
    gradient: "from-orange-400 to-red-500",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-200",
    accentText: "text-orange-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810616/marketing2_ebwk0l.webp",
    modules: ["Marketing Fundamentals", "Branding", "Target Audience", "Customer Psychology", "Market Research"],
    highlights: [
      "Understand core marketing principles and frameworks",
      "Define your target audience and customer persona",
      "Learn the basics of branding and positioning",
      "Apply customer psychology to marketing messages",
      "Conduct market research and competitor analysis",
    ],
    skills: ["Marketing Strategy", "Branding", "Market Research", "Customer Psychology", "SWOT Analysis"],
    companies: ["TCS", "Accenture", "Capgemini", "Deloitte", "IBM", "Cognizant"],
    syllabus: [
      { topic: "Introduction to Marketing", week: "Week 1", lessons: 5 },
      { topic: "Branding & Positioning", week: "Week 2", lessons: 5 },
      { topic: "Understanding Your Audience", week: "Week 3", lessons: 4 },
      { topic: "Customer Psychology", week: "Week 4", lessons: 5 },
      { topic: "Market Research Methods", week: "Week 5", lessons: 4 },
      { topic: "Competitive Analysis", week: "Week 6", lessons: 4 },
    ],
    alumni: {
      name: "Riya Malhotra",
      role: "Marketing Executive · Capgemini",
      city: "Delhi",
      text: "This free course got me interview-ready. Landed my first marketing role within 3 months of completing it.",
      avatar: "RM",
      rating: 5,
    },
    lessons: [
      {
        id: "mkt-1-1",
        weekLabel: "Week 1",
        title: "Introduction to Marketing Fundamentals",
        duration: "52 min",
        videoId: "eug-8wEQlO0",
        description:
          "Learn the core principles of marketing, the 4 Ps framework, and how modern businesses attract and retain customers.",
      },
      {
        id: "mkt-1-2",
        weekLabel: "Week 2",
        title: "Branding & Positioning",
        duration: "44 min",
        videoId: "Rcv-J6534oE",
        description:
          "Understand what makes a brand memorable. Learn positioning strategy, brand identity, and how to communicate value clearly.",
      },
      {
        id: "mkt-1-3",
        weekLabel: "Week 3",
        title: "Understanding Your Target Audience",
        duration: "38 min",
        videoId: "FzEkHlYt2uA",
        description:
          "Create detailed buyer personas, map customer journeys, and learn segmentation strategies to reach the right people.",
      },
      {
        id: "mkt-1-4",
        weekLabel: "Week 4",
        title: "Customer Psychology & Persuasion",
        duration: "46 min",
        videoId: "cFdCzN7RYbw",
        description:
          "Apply psychological principles like social proof, scarcity, and reciprocity to make marketing messages more persuasive.",
      },
      {
        id: "mkt-1-5",
        weekLabel: "Week 5–6",
        title: "Market Research & Competitive Analysis",
        duration: "40 min",
        videoId: "nV83XG4b-oU",
        description:
          "Conduct primary and secondary market research, perform SWOT analysis, and benchmark against competitors.",
      },
    ],
    quiz: [
      { q: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Engagement Outreach", "Sales and Export Operations", "None"], correct: 0 },
      { q: "What is a CTA?", options: ["Click-Through Analytics", "Call To Action", "Content Target Audience", "None"], correct: 1 },
      { q: "What is A/B testing?", options: ["Comparing two versions to see which performs better", "Testing two products", "Running two ad campaigns simultaneously", "None"], correct: 0 },
      { q: "What is ROI?", options: ["Return on Investment", "Rate of Impressions", "Reach of Influence", "None"], correct: 0 },
      { q: "Which platform is best for B2B marketing?", options: ["Instagram", "TikTok", "LinkedIn", "Snapchat"], correct: 2 },
    ],
  },
  {
    id: "69d9301719ab4505458555bd",
    category: "Marketing",
    title: "Digital Advertising & PPC Strategy",
    emoji: "🎯",
    tagline: "Run ads that convert — Google, Meta, and beyond.",
    desc: "Master paid advertising across Google Ads, Meta Ads, and programmatic platforms.",
    duration: "6 weeks",
    level: "Intermediate",
    price: 2499,
    origPrice: 7999,
    isFree: false,
    tag: "High ROI Skills",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-orange-50 text-orange-700 border border-orange-200",
    gradient: "from-orange-400 to-red-500",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-200",
    accentText: "text-orange-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810617/marketing5_yfvvli.jpg",
    modules: ["Google Ads", "Meta Ads", "PPC Strategy", "Ad Copywriting", "Campaign Analytics"],
    highlights: [
      "Launch and optimise Google Search and Display campaigns",
      "Build high-converting Meta (Facebook/Instagram) ad funnels",
      "Write ad copy that drives clicks and conversions",
      "Track ROAS and optimise bids with data",
      "Set up pixel tracking and conversion events",
    ],
    skills: ["Google Ads", "Meta Ads", "PPC", "Ad Copywriting", "ROAS", "Pixel Tracking", "Bid Strategy"],
    companies: ["TCS", "Accenture", "Capgemini", "Deloitte", "IBM", "Cognizant"],
    syllabus: [
      { topic: "Google Ads Fundamentals", week: "Week 1–2", lessons: 7 },
      { topic: "Meta Ads & Audience Targeting", week: "Week 3–4", lessons: 7 },
      { topic: "Ad Copywriting & Creatives", week: "Week 4", lessons: 5 },
      { topic: "Campaign Analytics & ROAS", week: "Week 5–6", lessons: 6 },
    ],
    alumni: {
      name: "Saurabh Nair",
      role: "Performance Marketer · Deloitte",
      city: "Pune",
      text: "The Google Ads and Meta modules are the most practical I've found anywhere. My ROAS improved 3x after this course.",
      avatar: "SN",
      rating: 5,
    },
    lessons: [
      {
        id: "mkt-2-1",
        weekLabel: "Week 1–2",
        title: "Google Ads Full Course for Beginners",
        duration: "60 min",
        videoId: "autzRHtt-RM",
        description:
          "Set up and launch Google Search, Display, and Shopping campaigns. Learn keyword match types, Quality Score, and bidding strategies.",
      },
      {
        id: "mkt-2-2",
        weekLabel: "Week 3–4",
        title: "Meta Ads & Audience Targeting",
        duration: "54 min",
        videoId: "dAJyqo6wnq4",
        description:
          "Build Facebook and Instagram ad campaigns from scratch. Master custom audiences, lookalike audiences, retargeting, and the Meta pixel.",
      },
      {
        id: "mkt-2-3",
        weekLabel: "Week 4",
        title: "Ad Copywriting That Converts",
        duration: "42 min",
        videoId: "0pb4evBBBDg",
        description:
          "Write compelling ad headlines, descriptions, and CTAs. Learn the AIDA framework, emotional triggers, and split-testing copy.",
      },
      {
        id: "mkt-2-4",
        weekLabel: "Week 5–6",
        title: "PPC Analytics & Campaign Optimisation",
        duration: "48 min",
        videoId: "PPDBldQMWc0",
        description:
          "Track campaign performance with Google Analytics and Ads reports. Optimise bids, cut wasted spend, and scale winning ad sets.",
      },
    ],
    quiz: [
      { q: "What does PPC stand for?", options: ["Pay Per Click", "Price Per Customer", "Paid Promotion Channel", "None"], correct: 0 },
      { q: "What is ROAS?", options: ["Return on Ad Spend", "Rate of Ad Sales", "Revenue of Ad Sets", "None"], correct: 0 },
      { q: "Which metric measures the percentage of people who click your ad?", options: ["CPM", "CTR", "CPC", "ROAS"], correct: 1 },
      { q: "What is a lookalike audience?", options: ["People who have visited your website", "People who resemble your existing customers", "People who clicked your ad", "None"], correct: 1 },
      { q: "What is Quality Score in Google Ads?", options: ["A measure of your website speed", "A measure of ad relevance and expected CTR", "Your campaign budget score", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555c0",
    category: "Marketing",
    title: "Social Media ROI & Analytics",
    emoji: "📊",
    tagline: "Turn likes into revenue — measure and maximise social media impact.",
    desc: "Learn to track, analyse, and optimise social media performance across platforms.",
    duration: "6 weeks",
    level: "Advanced",
    price: 2999,
    origPrice: 8999,
    isFree: false,
    tag: "Data-Driven",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-orange-50 text-orange-700 border border-orange-200",
    gradient: "from-orange-400 to-red-500",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-200",
    accentText: "text-orange-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810618/marketing6_yr9m9k.jpg",
    modules: ["Social Analytics", "ROI Measurement", "Reporting", "Platform Insights", "Strategy Optimisation"],
    highlights: [
      "Set up proper UTM tracking for all social channels",
      "Build executive-level social media reports",
      "Calculate true ROI from organic and paid social",
      "Use platform-native analytics on Instagram, LinkedIn, and X",
      "Optimise content strategy based on performance data",
    ],
    skills: ["Social Analytics", "UTM Tracking", "ROI", "Reporting", "Instagram Insights", "LinkedIn Analytics"],
    companies: ["TCS", "Accenture", "Capgemini", "Deloitte", "IBM", "Cognizant"],
    syllabus: [
      { topic: "Social Media Metrics That Matter", week: "Week 1–2", lessons: 6 },
      { topic: "UTM Tracking & Attribution", week: "Week 3", lessons: 5 },
      { topic: "Platform Analytics Deep Dive", week: "Week 4", lessons: 6 },
      { topic: "ROI Calculation & Reporting", week: "Week 5–6", lessons: 6 },
    ],
    alumni: {
      name: "Nisha Verma",
      role: "Social Media Manager · IBM",
      city: "Mumbai",
      text: "I finally understand the numbers behind social media. Proved a 4x ROI to my leadership team after this course.",
      avatar: "NV",
      rating: 4,
    },
    lessons: [
      {
        id: "mkt-3-1",
        weekLabel: "Week 1–2",
        title: "Social Media Analytics — Metrics That Matter",
        duration: "46 min",
        videoId: "aEsWltLmPfc",
        description:
          "Identify vanity metrics vs. business metrics. Learn reach, engagement rate, share of voice, and conversion tracking across platforms.",
      },
      {
        id: "mkt-3-2",
        weekLabel: "Week 3",
        title: "UTM Tracking & Attribution Models",
        duration: "38 min",
        videoId: "KYFZOg_L7Z0",
        description:
          "Set up UTM parameters for every social post and campaign. Understand first-touch, last-touch, and multi-touch attribution models.",
      },
      {
        id: "mkt-3-3",
        weekLabel: "Week 4",
        title: "Instagram & LinkedIn Analytics Deep Dive",
        duration: "42 min",
        videoId: "bRug-2uCEak",
        description:
          "Extract actionable insights from Instagram Insights and LinkedIn Analytics. Find peak posting times and top-performing content.",
      },
      {
        id: "mkt-3-4",
        weekLabel: "Week 5–6",
        title: "Calculating Social Media ROI & Executive Reporting",
        duration: "50 min",
        videoId: "a5W1KHUoPhI",
        description:
          "Build a social media ROI framework. Create data-driven reports for stakeholders and build a dashboard in Google Data Studio.",
      },
    ],
    quiz: [
      { q: "What does UTM stand for?", options: ["Urchin Tracking Module", "Universal Traffic Metric", "User Traffic Measure", "None"], correct: 0 },
      { q: "Which is a vanity metric on social media?", options: ["Conversion rate", "Revenue generated", "Number of likes", "Cost per acquisition"], correct: 2 },
      { q: "What is engagement rate?", options: ["Total reach / impressions", "Interactions / reach × 100", "Followers / posts", "None"], correct: 1 },
      { q: "What is social listening?", options: ["Monitoring brand mentions and conversations online", "Listening to podcasts", "Following competitors", "None"], correct: 0 },
      { q: "Which model gives full credit to the last touchpoint before conversion?", options: ["First-touch attribution", "Linear attribution", "Last-touch attribution", "Time-decay attribution"], correct: 2 },
    ],
  },
  {
    id: "69d9301719ab4505458555c3",
    category: "Marketing",
    title: "Content Marketing for Brand Growth",
    emoji: "✍️",
    tagline: "Content is king — learn to create it, distribute it, and grow with it.",
    desc: "Build a content engine that attracts, nurtures, and converts audiences at scale.",
    duration: "6 weeks",
    level: "Beginner",
    price: 2499,
    origPrice: 7499,
    isFree: false,
    tag: "Creator Skills",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-orange-50 text-orange-700 border border-orange-200",
    gradient: "from-orange-400 to-red-500",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-200",
    accentText: "text-orange-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810619/marketing7_zrrfq6.jpg",
    modules: ["Content Strategy", "SEO Writing", "Blog & Video", "Distribution", "Content Analytics"],
    highlights: [
      "Build a 90-day content calendar from scratch",
      "Write SEO-optimised blog posts that rank on Google",
      "Repurpose content across multiple channels efficiently",
      "Measure content performance with Google Analytics",
      "Build an email newsletter that drives repeat traffic",
    ],
    skills: ["Content Strategy", "SEO Writing", "Blogging", "Email Marketing", "Content Distribution", "Analytics"],
    companies: ["TCS", "Accenture", "Capgemini", "Deloitte", "IBM", "Cognizant"],
    syllabus: [
      { topic: "Content Strategy Fundamentals", week: "Week 1–2", lessons: 5 },
      { topic: "SEO Copywriting & Blog Writing", week: "Week 3–4", lessons: 7 },
      { topic: "Video & Visual Content Creation", week: "Week 4", lessons: 5 },
      { topic: "Distribution, Email & Analytics", week: "Week 5–6", lessons: 6 },
    ],
    alumni: {
      name: "Aditya Joshi",
      role: "Content Strategist · Cognizant",
      city: "Bengaluru",
      text: "My blog went from 200 to 12,000 monthly visitors in 6 months using the SEO writing framework from this course.",
      avatar: "AJ",
      rating: 5,
    },
    lessons: [
      {
        id: "mkt-4-1",
        weekLabel: "Week 1–2",
        title: "Content Strategy & Planning",
        duration: "48 min",
        videoId: "d-a-ScSUdYE",
        description:
          "Develop a content strategy aligned to business goals. Build buyer journey content maps, a content calendar, and a repurposing workflow.",
      },
      {
        id: "mkt-4-2",
        weekLabel: "Week 3–4",
        title: "SEO Copywriting & Blog Writing",
        duration: "54 min",
        videoId: "W_EereS0qEs",
        description:
          "Research keywords, write SEO-optimised articles, and structure content so it ranks on page 1. Learn on-page SEO best practices.",
      },
      {
        id: "mkt-4-3",
        weekLabel: "Week 4",
        title: "Video & Visual Content Creation",
        duration: "44 min",
        videoId: "LuUm9D2lb7I",
        description:
          "Script, film, and edit short-form and long-form video content. Learn thumbnail strategy, hooks, and repurposing video for all platforms.",
      },
      {
        id: "mkt-4-4",
        weekLabel: "Week 5–6",
        title: "Email Marketing & Content Analytics",
        duration: "46 min",
        videoId: "tCL1Xuo06qw",
        description:
          "Build and grow an email newsletter. Write high open-rate subject lines, nurture sequences, and measure content ROI with GA4.",
      },
    ],
    quiz: [
      { q: "What is a content calendar?", options: ["A social media profile", "A plan for scheduling and publishing content", "An email campaign", "None"], correct: 1 },
      { q: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Engagement Outreach", "Search Export Operations", "None"], correct: 0 },
      { q: "What is evergreen content?", options: ["Content about nature", "Content that stays relevant over a long period", "Content published in spring", "None"], correct: 1 },
      { q: "What is a content funnel?", options: ["A video format", "Content mapped to awareness, consideration, and decision stages", "A social media feature", "None"], correct: 1 },
      { q: "Which metric measures email campaign effectiveness?", options: ["Bounce rate", "Open rate", "Impressions", "Reach"], correct: 1 },
    ],
  },

  // ─── WEB DEVELOPMENT (4 courses) ─────────────────────────────────────────
  {
    id: "69d9301719ab4505458555c6",
    category: "Web Development",
    title: "Modern React with Redux Toolkit",
    emoji: "⚛️",
    tagline: "The definitive React + Redux course for 2024 and beyond.",
    desc: "Build production-grade React apps with Redux Toolkit, RTK Query, and modern patterns.",
    duration: "6 weeks",
    level: "Beginner",
    price: 0,
    origPrice: 5999,
    isFree: true,
    tag: "Free Trial",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200",
    gradient: "from-cyan-500 to-blue-600",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    accentText: "text-cyan-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810687/webdev1_pw7byo.jpg",
    modules: ["React Fundamentals", "Hooks", "Redux Toolkit", "RTK Query", "Performance"],
    highlights: [
      "Build React apps with functional components and hooks",
      "Manage global state with Redux Toolkit and slices",
      "Fetch and cache server data with RTK Query",
      "Optimise React performance with useMemo and useCallback",
      "Write clean, maintainable component architecture",
    ],
    skills: ["React", "Redux Toolkit", "RTK Query", "JavaScript ES6+", "Hooks", "Component Design"],
    companies: ["TCS", "Infosys", "Wipro", "Flipkart", "Zomato", "Razorpay"],
    syllabus: [
      { topic: "React Fundamentals & JSX", week: "Week 1–2", lessons: 7 },
      { topic: "React Hooks In Depth", week: "Week 3", lessons: 6 },
      { topic: "Redux Toolkit & Slices", week: "Week 4", lessons: 7 },
      { topic: "RTK Query & Data Fetching", week: "Week 5–6", lessons: 7 },
    ],
    alumni: {
      name: "Nikhil Sharma",
      role: "Frontend Developer · Flipkart",
      city: "Bengaluru",
      text: "Redux Toolkit finally clicked after this course. Now writing cleaner state management code every single day at work.",
      avatar: "NS",
      rating: 5,
    },
    lessons: [
      {
        id: "webdev-1-1",
        weekLabel: "Week 1–2",
        title: "React Crash Course — Components, Props & State",
        duration: "60 min",
        videoId: "LDB4uaJ87e0",
        description:
          "Build your first React application. Learn JSX, functional components, props, state, and event handling from the ground up.",
      },
      {
        id: "webdev-1-2",
        weekLabel: "Week 3",
        title: "React Hooks — useState, useEffect & More",
        duration: "55 min",
        videoId: "HnXPKtro4SM",
        description:
          "Master all essential React hooks — useState, useEffect, useContext, useRef, useMemo, and useCallback with real-world examples.",
      },
      {
        id: "webdev-1-3",
        weekLabel: "Week 4",
        title: "Redux Toolkit — Modern State Management",
        duration: "58 min",
        videoId: "NqzdVN2tyvQ",
        description:
          "Learn Redux Toolkit from scratch. Create slices, configure the store, write reducers, and dispatch actions with ease.",
      },
      {
        id: "webdev-1-4",
        weekLabel: "Week 5–6",
        title: "RTK Query — Data Fetching & Caching",
        duration: "50 min",
        videoId: "HyZzCHgG3AY",
        description:
          "Simplify API calls with RTK Query. Learn createApi, endpoints, caching, auto-refetching, and optimistic updates.",
      },
    ],
    quiz: [
      { q: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extra", "None"], correct: 0 },
      { q: "Which hook manages local component state?", options: ["useEffect", "useContext", "useState", "useReducer"], correct: 2 },
      { q: "What is a Redux slice?", options: ["A CSS module", "A collection of reducer logic and actions for a feature", "An API endpoint", "None"], correct: 1 },
      { q: "What does RTK Query primarily handle?", options: ["CSS styling", "Server state management and API caching", "Routing", "None"], correct: 1 },
      { q: "Which hook runs side effects after render?", options: ["useState", "useEffect", "useMemo", "useRef"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555c9",
    category: "Web Development",
    title: "Full-Stack Web Development Boot Camp",
    emoji: "🖥️",
    tagline: "Front to back — build and deploy complete web applications.",
    desc: "An intensive full-stack bootcamp covering React, Node.js, Express, and PostgreSQL.",
    duration: "8 weeks",
    level: "Intermediate",
    price: 2499,
    origPrice: 7999,
    isFree: false,
    tag: "Most Popular",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200",
    gradient: "from-cyan-500 to-blue-600",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    accentText: "text-cyan-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810688/webdev2_xb0ao3.webp",
    modules: ["React", "Node.js", "Express", "PostgreSQL", "Deployment"],
    highlights: [
      "Build a full-stack application from scratch in 8 weeks",
      "Design RESTful APIs with Node.js and Express",
      "Integrate PostgreSQL with Sequelize ORM",
      "Deploy to a cloud platform with CI/CD",
      "Implement JWT authentication and authorisation",
    ],
    skills: ["React", "Node.js", "Express", "PostgreSQL", "REST APIs", "JWT", "Deployment"],
    companies: ["TCS", "Infosys", "Wipro", "Flipkart", "Zomato", "Razorpay"],
    syllabus: [
      { topic: "React Frontend Architecture", week: "Week 1–2", lessons: 7 },
      { topic: "Node.js & Express Backend", week: "Week 3–4", lessons: 8 },
      { topic: "PostgreSQL & Sequelize", week: "Week 5–6", lessons: 7 },
      { topic: "Auth, Testing & Deployment", week: "Week 7–8", lessons: 6 },
    ],
    alumni: {
      name: "Rahul Bose",
      role: "Full Stack Developer · Zomato",
      city: "Delhi",
      text: "The bootcamp structure was intense but I shipped a real project to Zomato's review process straight from the capstone.",
      avatar: "RB",
      rating: 5,
    },
    lessons: [
      {
        id: "webdev-2-1",
        weekLabel: "Week 1–2",
        title: "React Frontend Architecture",
        duration: "55 min",
        videoId: "5hXoIIRoWqQ",
        description:
          "Architect scalable React frontends with folder structure best practices, component design patterns, and Context API.",
      },
      {
        id: "webdev-2-2",
        weekLabel: "Week 3–4",
        title: "Node.js & Express REST APIs",
        duration: "58 min",
        videoId: "Oe421EPjeBE",
        description:
          "Build production-ready REST APIs with Node.js and Express. Middleware, routing, error handling, and API best practices.",
      },
      {
        id: "webdev-2-3",
        weekLabel: "Week 5–6",
        title: "PostgreSQL & Sequelize ORM",
        duration: "54 min",
        videoId: "qw--VYLpxG4",
        description:
          "Design relational databases with PostgreSQL. Use Sequelize ORM for migrations, associations, and complex queries.",
      },
      {
        id: "webdev-2-4",
        weekLabel: "Week 7–8",
        title: "JWT Authentication & Cloud Deployment",
        duration: "52 min",
        videoId: "-zAbsLnFlvc",
        description:
          "Implement JWT-based auth with refresh tokens and deploy the full stack to a cloud provider with CI/CD via GitHub Actions.",
      },
    ],
    quiz: [
      { q: "What is Express.js?", options: ["A CSS framework", "A minimalist Node.js web framework", "A database", "None"], correct: 1 },
      { q: "What is a REST API?", options: ["A type of database", "An architectural style for networked applications", "A JavaScript library", "None"], correct: 1 },
      { q: "Which SQL clause filters grouped records?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correct: 1 },
      { q: "What does JWT stand for?", options: ["JavaScript Web Token", "JSON Web Token", "Java Web Transfer", "None"], correct: 1 },
      { q: "What is middleware in Express?", options: ["A database layer", "A function that runs between request and response", "A frontend component", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555cc",
    category: "Web Development",
    title: "Advanced CSS & Sass Frameworks",
    emoji: "🎨",
    tagline: "Master CSS at the expert level — animations, architecture, and tooling.",
    desc: "Go deep on CSS Grid, Flexbox, animations, custom properties, and the Sass preprocessor.",
    duration: "6 weeks",
    level: "Advanced",
    price: 2999,
    origPrice: 8999,
    isFree: false,
    tag: "Design + Code",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200",
    gradient: "from-cyan-500 to-blue-600",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    accentText: "text-cyan-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810690/webdev4_kxfa09.jpg",
    modules: ["CSS Grid", "Flexbox", "Animations", "CSS Variables", "Sass", "BEM"],
    highlights: [
      "Build complex layouts with CSS Grid and Flexbox",
      "Create smooth keyframe and transition animations",
      "Write scalable CSS with BEM methodology",
      "Use Sass variables, mixins, functions, and partials",
      "Implement CSS custom properties for theming",
    ],
    skills: ["CSS Grid", "Flexbox", "Sass", "CSS Animations", "BEM", "CSS Variables", "Responsive Design"],
    companies: ["TCS", "Infosys", "Wipro", "Flipkart", "Zomato", "Razorpay"],
    syllabus: [
      { topic: "CSS Grid Mastery", week: "Week 1–2", lessons: 7 },
      { topic: "Flexbox & Responsive Design", week: "Week 2–3", lessons: 6 },
      { topic: "CSS Animations & Transitions", week: "Week 4", lessons: 6 },
      { topic: "Sass & CSS Architecture", week: "Week 5–6", lessons: 7 },
    ],
    alumni: {
      name: "Simran Kaur",
      role: "UI Developer · Wipro",
      city: "Chandigarh",
      text: "Finally understood CSS Grid deeply. My UIs went from looking okay to pixel-perfect and clients noticed immediately.",
      avatar: "SK",
      rating: 4,
    },
    lessons: [
      {
        id: "webdev-3-1",
        weekLabel: "Week 1–2",
        title: "CSS Grid — Complete Mastery",
        duration: "52 min",
        videoId: "raCIHJz3f48",
        description:
          "Master CSS Grid completely — grid-template-areas, auto-fill, auto-fit, minmax, named lines, and advanced layout patterns.",
      },
      {
        id: "webdev-3-2",
        weekLabel: "Week 2–3",
        title: "Flexbox & Responsive Design",
        duration: "46 min",
        videoId: "tXIhdp5R7sc",
        description:
          "Master CSS Flexbox for one-dimensional layouts. Build fully responsive designs with media queries and mobile-first methodology.",
      },
      {
        id: "webdev-3-3",
        weekLabel: "Week 4",
        title: "CSS Animations & Transitions",
        duration: "44 min",
        videoId: "MuWYQ_RM-2Q",
        description:
          "Create engaging UI animations with CSS keyframes, transitions, transform, and animation-delay for orchestrated page effects.",
      },
      {
        id: "webdev-3-4",
        weekLabel: "Week 5–6",
        title: "Sass & CSS Architecture with BEM",
        duration: "50 min",
        videoId: "jfMHA8SqUL4",
        description:
          "Write modular, maintainable CSS with Sass — variables, nesting, mixins, functions, partials, and the BEM naming convention.",
      },
    ],
    quiz: [
      { q: "What does BEM stand for?", options: ["Block Element Modifier", "Box Element Model", "Browser Execution Method", "None"], correct: 0 },
      { q: "Which CSS property creates a grid container?", options: ["display: flex", "display: grid", "display: block", "None"], correct: 1 },
      { q: "What is the Sass feature that allows reusable CSS blocks?", options: ["Variables", "Mixins", "Functions", "Partials"], correct: 1 },
      { q: "What is CSS specificity?", options: ["How fast CSS loads", "The weight that determines which style rule applies", "The number of selectors", "None"], correct: 1 },
      { q: "Which CSS property is used for animations?", options: ["transition", "transform", "animation", "All of the above"], correct: 3 },
    ],
  },
  {
    id: "69d9301719ab4505458555cf",
    category: "Web Development",
    title: "JavaScript: The Hard Parts & Deep Dive",
    emoji: "📜",
    tagline: "Understand JS at a level most developers never reach.",
    desc: "Closures, prototypes, the event loop, async patterns — JavaScript mastery for serious developers.",
    duration: "6 weeks",
    level: "Beginner",
    price: 2499,
    origPrice: 6999,
    isFree: false,
    tag: "Core Skills",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200",
    gradient: "from-cyan-500 to-blue-600",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    accentText: "text-cyan-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810690/webdev5_ibfblx.jpg",
    modules: ["Closures", "Prototypes", "Event Loop", "Async/Await", "Functional JS"],
    highlights: [
      "Understand closures and lexical scope deeply",
      "Master the JavaScript prototype chain and OOP",
      "Explain the event loop and call stack to anyone",
      "Write async code with Promises, async/await, and generators",
      "Apply functional programming patterns in JavaScript",
    ],
    skills: ["JavaScript", "Closures", "Prototypes", "Event Loop", "Promises", "Async/Await", "Functional Programming"],
    companies: ["TCS", "Infosys", "Wipro", "Flipkart", "Zomato", "Razorpay"],
    syllabus: [
      { topic: "Execution Context & Closures", week: "Week 1–2", lessons: 7 },
      { topic: "Prototypes & OOP in JS", week: "Week 3", lessons: 6 },
      { topic: "The Event Loop & Async JS", week: "Week 4", lessons: 6 },
      { topic: "Functional Programming Patterns", week: "Week 5–6", lessons: 7 },
    ],
    alumni: {
      name: "Tanmay Bhat",
      role: "Senior JS Developer · Razorpay",
      city: "Bengaluru",
      text: "After this course I could finally explain closures and the event loop in interviews. Got senior role at Razorpay.",
      avatar: "TB",
      rating: 5,
    },
    lessons: [
      {
        id: "webdev-4-1",
        weekLabel: "Week 1–2",
        title: "JavaScript Execution Context & Closures",
        duration: "60 min",
        videoId: "Efqj3FV2vjE",
        description:
          "Understand how JavaScript executes code — the call stack, execution contexts, scope chain, and closures explained visually.",
      },
      {
        id: "webdev-4-2",
        weekLabel: "Week 3",
        title: "Prototypes & Object-Oriented JavaScript",
        duration: "50 min",
        videoId: "8_tFfRj4NE0",
        description:
          "Deep dive into the prototype chain, constructor functions, ES6 classes, and how inheritance really works in JavaScript.",
      },
      {
        id: "webdev-4-3",
        weekLabel: "Week 4",
        title: "The Event Loop, Promises & Async/Await",
        duration: "28 min",
        videoId: "fOdcuDigxfw",
        description:
          "Visualise the event loop, call stack, callback queue, and microtask queue. Master Promises and async/await patterns.",
      },
      {
        id: "webdev-4-4",
        weekLabel: "Week 5–6",
        title: "Functional Programming in JavaScript",
        duration: "54 min",
        videoId: "XvLMO2wE3OQ",
        description:
          "Apply pure functions, higher-order functions, map/filter/reduce, currying, and immutability in real JavaScript applications.",
      },
    ],
    quiz: [
      { q: "What is a closure in JavaScript?", options: ["A function that has access to its outer scope", "A loop construct", "A type of error", "None"], correct: 0 },
      { q: "What is the event loop responsible for?", options: ["Managing CSS styles", "Handling async callbacks when the call stack is empty", "Rendering HTML", "None"], correct: 1 },
      { q: "What is prototype chain?", options: ["A series of connected objects through which JS looks for properties", "A CSS selector pattern", "A Node.js module", "None"], correct: 0 },
      { q: "What does async/await do?", options: ["Makes code run faster", "Makes asynchronous code look synchronous", "Runs code in parallel", "None"], correct: 1 },
      { q: "Which is a higher-order function?", options: ["map()", "parseInt()", "alert()", "console.log()"], correct: 0 },
    ],
  },

  // ─── AI / MACHINE LEARNING (4 courses) ───────────────────────────────────
  {
    id: "69d9301719ab4505458555d2",
    category: "AI / Machine Learning",
    title: "Machine Learning with Python",
    emoji: "🤖",
    tagline: "Your first step into the world of AI — no PhD required.",
    desc: "Learn core ML algorithms and apply them to real datasets using Python and Scikit-learn.",
    duration: "8 weeks",
    level: "Beginner",
    price: 0,
    origPrice: 6999,
    isFree: true,
    tag: "Free Trial",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-violet-50 text-violet-700 border border-violet-200",
    gradient: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    accentText: "text-violet-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810725/ai-ml1_ridnur.webp",
    modules: ["Python", "Scikit-learn", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
    highlights: [
      "Implement regression, classification, and clustering algorithms",
      "Evaluate models with cross-validation and confusion matrices",
      "Preprocess and clean datasets for ML pipelines",
      "Apply feature engineering to improve model accuracy",
      "Build an end-to-end ML project from data to prediction",
    ],
    skills: ["Python", "Scikit-learn", "Linear Regression", "Decision Trees", "K-Means", "Model Evaluation"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Python for ML", week: "Week 1–2", lessons: 6 },
      { topic: "Supervised Learning Algorithms", week: "Week 3–5", lessons: 9 },
      { topic: "Unsupervised Learning", week: "Week 6", lessons: 5 },
      { topic: "Model Evaluation & Tuning", week: "Week 7–8", lessons: 7 },
    ],
    alumni: {
      name: "Akash Tiwari",
      role: "ML Engineer · PhonePe",
      city: "Bengaluru",
      text: "Started this as a complete beginner. Six months later I'm building production ML models at PhonePe.",
      avatar: "AT",
      rating: 5,
    },
    lessons: [
      {
        id: "aiml-1-1",
        weekLabel: "Week 1–2",
        title: "Machine Learning with Python — Full Course",
        duration: "65 min",
        videoId: "7eh4d6sabA0",
        description:
          "Learn core ML concepts and implement algorithms using Python and Scikit-learn — regression, classification, and model evaluation.",
      },
      {
        id: "aiml-1-2",
        weekLabel: "Week 3–5",
        title: "Supervised Learning — Regression & Classification",
        duration: "54 min",
        videoId: "hyb0zKj7EnY",
        description:
          "Deep dive into linear regression, logistic regression, decision trees, random forests, and SVM with real datasets.",
      },
      {
        id: "aiml-1-3",
        weekLabel: "Week 6",
        title: "Unsupervised Learning — Clustering & Dimensionality Reduction",
        duration: "46 min",
        videoId: "Z76eLlK5a7U",
        description:
          "Implement K-Means clustering, hierarchical clustering, and PCA for dimensionality reduction with Python.",
      },
      {
        id: "aiml-1-4",
        weekLabel: "Week 7–8",
        title: "Model Evaluation, Tuning & Pipelines",
        duration: "50 min",
        videoId: "NJTUbCoFwsM",
        description:
          "Evaluate models with cross-validation, tune hyperparameters with GridSearchCV, and build end-to-end Scikit-learn pipelines.",
      },
    ],
    quiz: [
      { q: "What is a neural network?", options: ["A type of database", "A set of algorithms modeled after the human brain", "A cloud computing service", "None"], correct: 1 },
      { q: "What does 'training a model' mean?", options: ["Writing code for the model", "Adjusting model parameters using data", "Deploying the model", "Testing the model"], correct: 1 },
      { q: "What is the purpose of an activation function?", options: ["To initialize weights", "To introduce non-linearity", "To normalize inputs", "To reduce overfitting"], correct: 1 },
      { q: "What is gradient descent?", options: ["A data preprocessing technique", "An optimization algorithm", "A neural network architecture", "A regularization method"], correct: 1 },
      { q: "What does LLM stand for?", options: ["Large Language Model", "Low Level Machine", "Linear Learning Method", "None"], correct: 0 },
    ],
  },
  {
    id: "69d9301719ab4505458555d5",
    category: "AI / Machine Learning",
    title: "Deep Learning Specialization",
    emoji: "🧠",
    tagline: "Neural networks, CNNs, RNNs — the architecture of modern AI.",
    desc: "Build and train deep neural networks for vision, NLP, and sequential data problems.",
    duration: "10 weeks",
    level: "Intermediate",
    price: 2499,
    origPrice: 8999,
    isFree: false,
    tag: "AI Core",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-violet-50 text-violet-700 border border-violet-200",
    gradient: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    accentText: "text-violet-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810726/ai-ml2_boj6t3.jpg",
    modules: ["Neural Networks", "CNNs", "RNNs", "TensorFlow", "Transfer Learning"],
    highlights: [
      "Build neural networks from scratch with NumPy and TensorFlow",
      "Design CNNs for image classification and object detection",
      "Apply RNNs and LSTMs to sequential and time-series data",
      "Use transfer learning with pretrained models (ResNet, VGG)",
      "Regularise and optimise deep networks for production",
    ],
    skills: ["TensorFlow", "Keras", "CNN", "RNN", "LSTM", "Transfer Learning", "Python", "NumPy"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Neural Networks from Scratch", week: "Week 1–2", lessons: 7 },
      { topic: "CNNs for Computer Vision", week: "Week 3–5", lessons: 9 },
      { topic: "RNNs, LSTMs & Time Series", week: "Week 6–8", lessons: 8 },
      { topic: "Transfer Learning & Deployment", week: "Week 9–10", lessons: 7 },
    ],
    alumni: {
      name: "Priya Anand",
      role: "Deep Learning Engineer · Swiggy",
      city: "Bengaluru",
      text: "The CNN module alone was worth 10x the price. Shipped an image classification model in my first week at Swiggy.",
      avatar: "PA",
      rating: 5,
    },
    lessons: [
      {
        id: "aiml-2-1",
        weekLabel: "Week 1–2",
        title: "Neural Networks — How They Really Work",
        duration: "20 min",
        videoId: "zxw4bCnTLHA",
        description:
          "Understand neural networks visually — layers, weights, biases, and how backpropagation adjusts them to learn patterns.",
      },
      {
        id: "aiml-2-2",
        weekLabel: "Week 3–5",
        title: "Convolutional Neural Networks for Image Classification",
        duration: "60 min",
        videoId: "Rmtr9SY-4VQ",
        description:
          "Build CNNs to classify images — convolution, pooling, batch normalisation, and data augmentation strategies.",
      },
      {
        id: "aiml-2-3",
        weekLabel: "Week 6–8",
        title: "RNNs & LSTMs for Sequential Data",
        duration: "52 min",
        videoId: "KBftoy0DPxI",
        description:
          "Understand recurrent architectures — vanilla RNNs, LSTMs, GRUs — and apply them to time series and text generation tasks.",
      },
      {
        id: "aiml-2-4",
        weekLabel: "Week 9–10",
        title: "Transfer Learning with Pretrained Models",
        duration: "50 min",
        videoId: "0o45fyiDr2U",
        description:
          "Fine-tune ResNet and VGG on custom datasets. Apply transfer learning strategies to achieve state-of-the-art results with less data.",
      },
    ],
    quiz: [
      { q: "What is backpropagation?", options: ["A method for loading data", "An algorithm to compute gradients and update weights", "A regularisation method", "None"], correct: 1 },
      { q: "What does CNN stand for?", options: ["Convolutional Neural Network", "Cumulative Node Network", "Connected Neuron Net", "None"], correct: 0 },
      { q: "What is the vanishing gradient problem?", options: ["Gradients become too large", "Gradients become too small, slowing learning in deep networks", "The model overfits", "None"], correct: 1 },
      { q: "What is transfer learning?", options: ["Copying weights from one language to another", "Using a pretrained model as a starting point for a new task", "Moving data between servers", "None"], correct: 1 },
      { q: "What is an epoch in deep learning?", options: ["A single training example", "One full pass through the entire training dataset", "A batch of data", "A layer in the network"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555d8",
    category: "AI / Machine Learning",
    title: "Generative AI & LLM Engineering",
    emoji: "✨",
    tagline: "Build apps powered by GPT, Claude, and open-source LLMs.",
    desc: "Prompt engineering, RAG, fine-tuning, and deploying production LLM applications.",
    duration: "8 weeks",
    level: "Advanced",
    price: 2999,
    origPrice: 9999,
    isFree: false,
    tag: "Trending",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-violet-50 text-violet-700 border border-violet-200",
    gradient: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    accentText: "text-violet-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810727/ai-ml3_eucoyw.jpg",
    modules: ["Prompt Engineering", "LangChain", "RAG", "Fine-tuning", "LLM APIs"],
    highlights: [
      "Master prompt engineering for GPT and open-source models",
      "Build RAG pipelines with LangChain and vector databases",
      "Fine-tune open-source LLMs on custom datasets",
      "Deploy LLM-powered APIs and chatbots to production",
      "Evaluate and benchmark LLM outputs systematically",
    ],
    skills: ["Prompt Engineering", "LangChain", "RAG", "Fine-tuning", "OpenAI API", "Vector DBs", "LLM Evaluation"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Prompt Engineering Mastery", week: "Week 1–2", lessons: 7 },
      { topic: "LangChain & LLM Apps", week: "Week 3–4", lessons: 8 },
      { topic: "RAG & Vector Databases", week: "Week 5–6", lessons: 7 },
      { topic: "Fine-tuning & Deployment", week: "Week 7–8", lessons: 7 },
    ],
    alumni: {
      name: "Sameer Gupta",
      role: "AI Engineer · Walmart Labs",
      city: "Bengaluru",
      text: "The RAG pipeline module saved me weeks of self-research. Shipped a production LLM app within my first month on the job.",
      avatar: "SG",
      rating: 5,
    },
    lessons: [
      {
        id: "aiml-3-1",
        weekLabel: "Week 1–2",
        title: "Prompt Engineering for LLMs",
        duration: "58 min",
        // freeCodeCamp — Prompt Engineering Full Course
        videoId: "mwNzbRSCMDE",
        description:
          "Learn zero-shot, few-shot, chain-of-thought, and system prompting techniques to get reliable outputs from GPT and open-source models.",
      },
      {
        id: "aiml-3-2",
        weekLabel: "Week 3–4",
        title: "Building LLM Apps with LangChain",
        duration: "62 min",
        // freeCodeCamp — LangChain Full Course
        videoId: "HSZ_uaif57o",
        description:
          "Use LangChain chains, agents, and tools to build document Q&A, chatbots, and multi-step reasoning applications.",
      },
      {
        id: "aiml-3-3",
        weekLabel: "Week 5–6",
        title: "RAG — Retrieval Augmented Generation",
        duration: "50 min",
        // IBM Technology — RAG Explained
        videoId: "T-D1OfcDW1M",
        description:
          "Build end-to-end RAG pipelines — chunk documents, embed them into a vector database, and retrieve context for LLM responses.",
      },
      {
        id: "aiml-3-4",
        weekLabel: "Week 7–8",
        title: "Fine-Tuning & Deploying LLMs",
        duration: "56 min",
        // Andrej Karpathy — Let's Build GPT From Scratch
        videoId: "kCc8FmEb1nY",
        description:
          "Understand LLM internals by building one from scratch. Fine-tune open-source models with LoRA and deploy via FastAPI.",
      },
    ],
    quiz: [
      { q: "What is RAG?", options: ["Random Aggregation Generation", "Retrieval Augmented Generation", "Recursive AI Grammar", "None"], correct: 1 },
      { q: "What is a vector database used for in LLM apps?", options: ["Storing images", "Storing and querying text embeddings by similarity", "Running SQL queries", "None"], correct: 1 },
      { q: "What is few-shot prompting?", options: ["Providing examples in the prompt to guide the model", "Using a smaller model", "Giving the model less data", "None"], correct: 0 },
      { q: "What is LoRA used for?", options: ["Data cleaning", "Efficient fine-tuning of large language models", "Deploying APIs", "None"], correct: 1 },
      { q: "What does a temperature parameter control in LLMs?", options: ["Compute speed", "Randomness of output", "Model size", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555db",
    category: "AI / Machine Learning",
    title: "Natural Language Processing (NLP)",
    emoji: "💬",
    tagline: "Teach machines to read, understand, and generate human language.",
    desc: "From tokenisation to transformers — build text classification, NER, and sentiment systems.",
    duration: "8 weeks",
    level: "Beginner",
    price: 2499,
    origPrice: 7499,
    isFree: false,
    tag: "Language AI",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-violet-50 text-violet-700 border border-violet-200",
    gradient: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    accentText: "text-violet-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810728/ai-ml4_gsxssw.webp",
    modules: ["NLTK", "spaCy", "Transformers", "Text Classification", "Sentiment Analysis"],
    highlights: [
      "Preprocess text with tokenisation, stemming, and lemmatisation",
      "Build text classifiers with TF-IDF and Naive Bayes",
      "Apply named entity recognition with spaCy",
      "Use BERT and Hugging Face transformers for NLP tasks",
      "Build a sentiment analysis pipeline end-to-end",
    ],
    skills: ["NLTK", "spaCy", "Transformers", "Text Classification", "Sentiment Analysis", "Hugging Face", "Python"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Text Preprocessing & NLTK", week: "Week 1–2", lessons: 6 },
      { topic: "NLP with spaCy & NER", week: "Week 3–4", lessons: 7 },
      { topic: "Text Classification & Sentiment", week: "Week 5–6", lessons: 7 },
      { topic: "Transformers & Hugging Face", week: "Week 7–8", lessons: 7 },
    ],
    alumni: {
      name: "Ritu Saxena",
      role: "NLP Engineer · BYJU'S",
      city: "Delhi",
      text: "Went from zero NLP knowledge to deploying a sentiment analysis system in 8 weeks. The transformers module is gold.",
      avatar: "RS",
      rating: 4,
    },
    lessons: [
      {
        id: "aiml-4-1",
        weekLabel: "Week 1–2",
        title: "NLP with Python — Text Preprocessing & NLTK",
        duration: "52 min",
        // freeCodeCamp — NLP with Python (spaCy & NLTK)
        videoId: "05ONoGfmKvA",
        description:
          "Tokenise, stem, lemmatise, and clean text. Perform POS tagging and stopword removal using NLTK.",
      },
      {
        id: "aiml-4-2",
        weekLabel: "Week 3–4",
        title: "Named Entity Recognition with spaCy",
        duration: "44 min",
        // Sentdex — spaCy NLP Tutorial
        videoId: "dIUTsFT2MeQ",
        description:
          "Use spaCy's pipeline for NER, dependency parsing, and building custom entity recognisers for domain-specific text.",
      },
      {
        id: "aiml-4-3",
        weekLabel: "Week 5–6",
        title: "Text Classification & Sentiment Analysis",
        duration: "50 min",
        // Krish Naik — NLP Text Classification Tutorial
        videoId: "VtRLrQ3Ev-U",
        description:
          "Build text classifiers with TF-IDF, logistic regression, and Naive Bayes. Create a movie sentiment analysis pipeline.",
      },
      {
        id: "aiml-4-4",
        weekLabel: "Week 7–8",
        title: "Transformers & Hugging Face for NLP",
        duration: "58 min",
        // Hugging Face — Transformers Course Overview
        videoId: "00GKzGyWFEs",
        description:
          "Fine-tune BERT for classification, use Hugging Face pipelines for summarisation, translation, and Q&A tasks.",
      },
    ],
    quiz: [
      { q: "What is tokenisation in NLP?", options: ["Encrypting text", "Splitting text into individual words or characters", "Translating text", "None"], correct: 1 },
      { q: "What does NER stand for?", options: ["Named Entity Recognition", "Neural Extraction Routine", "None", "Natural Event Recognition"], correct: 0 },
      { q: "What is TF-IDF?", options: ["A neural network", "A statistical measure of word importance in a document", "A type of tokeniser", "None"], correct: 1 },
      { q: "What is BERT?", options: ["A chatbot", "A bidirectional transformer pretrained on large text corpora", "A Python library", "None"], correct: 1 },
      { q: "What is sentiment analysis?", options: ["Identifying the language of text", "Determining the emotional tone of text", "Summarising text", "None"], correct: 1 },
    ],
  },

  // ─── DESIGN (4 courses) ───────────────────────────────────────────────────
  {
    id: "69d9301719ab4505458555de",
    category: "Design",
    title: "UI/UX Design Essentials",
    emoji: "🎨",
    tagline: "The complete beginner's guide to designing beautiful digital products.",
    desc: "Learn UX fundamentals, wireframing, and Figma to start your design career.",
    duration: "8 weeks",
    level: "Beginner",
    price: 0,
    origPrice: 4999,
    isFree: true,
    tag: "Free Trial",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-amber-50 text-amber-700 border border-amber-200",
    gradient: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810790/design1_zqejk3.webp",
    modules: ["UX Fundamentals", "User Research", "Wireframing", "Figma Basics", "Usability Testing"],
    highlights: [
      "Understand UX principles and the design thinking process",
      "Create wireframes and user flows for digital products",
      "Design interfaces in Figma from scratch",
      "Conduct basic usability testing",
      "Build a beginner portfolio with real project work",
    ],
    skills: ["UX Design", "Wireframing", "Figma", "User Research", "Usability Testing", "Design Thinking"],
    companies: ["Razorpay", "Swiggy", "Ola", "MakeMyTrip", "Zepto", "CRED"],
    syllabus: [
      { topic: "UX & Design Thinking", week: "Week 1–2", lessons: 5 },
      { topic: "User Research & Personas", week: "Week 3", lessons: 5 },
      { topic: "Wireframing & User Flows", week: "Week 4–5", lessons: 6 },
      { topic: "Figma UI Design", week: "Week 6–7", lessons: 7 },
      { topic: "Usability Testing", week: "Week 8", lessons: 4 },
    ],
    alumni: {
      name: "Geetha Rao",
      role: "Junior UX Designer · Ola",
      city: "Chennai",
      text: "Perfect entry point into design. Got my first junior role at Ola after building my portfolio from this course.",
      avatar: "GR",
      rating: 5,
    },
    lessons: [
      {
        id: "design-1-1",
        weekLabel: "Week 1–2",
        title: "UX Design Fundamentals & Design Thinking",
        duration: "42 min",
        // AJ&Smart — Design Thinking Full Course
        videoId: "6lmvCqvmjfE",
        description:
          "Understand the UX design process, empathy mapping, user personas, and how design thinking solves real human problems.",
      },
      {
        id: "design-1-2",
        weekLabel: "Week 3",
        title: "User Research Methods",
        duration: "38 min",
        // Nielsen Norman Group — User Research Methods Overview
        videoId: "kQ_6faxhyIw",
        description:
          "Conduct user interviews, usability tests, and surveys. Synthesise research into actionable insights using affinity diagrams.",
      },
      {
        id: "design-1-3",
        weekLabel: "Week 4–5",
        title: "Wireframing & Information Architecture",
        duration: "44 min",
        // Figma — Wireframing in Figma Official Tutorial
        videoId: "qpH7-KFWZRI",
        description:
          "Create low-fidelity wireframes, site maps, and user flows. Learn to structure information for maximum usability.",
      },
      {
        id: "design-1-4",
        weekLabel: "Week 6–7",
        title: "Figma UI Design for Beginners",
        duration: "60 min",
        // DesignCourse — Figma UI Design Tutorial for Beginners
        videoId: "FTFaQWZBqQ8",
        description:
          "Master Figma from scratch — auto-layout, components, styles, and building high-fidelity designs.",
      },
      {
        id: "design-1-5",
        weekLabel: "Week 8",
        title: "Usability Testing & Iteration",
        duration: "36 min",
        // Figma — Prototyping in Figma Official Tutorial
        videoId: "OlbdIXLunt4",
        description:
          "Build interactive prototypes in Figma. Run usability tests, collect feedback, and iterate your designs based on real user data.",
      },
    ],
    quiz: [
      { q: "What does UX stand for?", options: ["User Experience", "Universal Exchange", "Unified Extension", "None"], correct: 0 },
      { q: "What is a wireframe?", options: ["A finished design", "A low-fidelity layout sketch", "A color palette", "A font selection"], correct: 1 },
      { q: "What tool is most popular for UI design?", options: ["Photoshop", "Figma", "Illustrator", "Canva"], correct: 1 },
      { q: "What is a design system?", options: ["A collection of reusable components and guidelines", "A project management tool", "A CSS framework", "None"], correct: 0 },
      { q: "What is the goal of usability testing?", options: ["Make the app look better", "Observe real users and find pain points", "Speed up the design process", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555e1",
    category: "Design",
    title: "Graphic Design Theory",
    emoji: "🖼️",
    tagline: "Master the visual principles that separate good design from great design.",
    desc: "Typography, colour theory, composition, and layout — the core of visual communication.",
    duration: "6 weeks",
    level: "Intermediate",
    price: 2499,
    origPrice: 6999,
    isFree: false,
    tag: "Visual Foundation",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-amber-50 text-amber-700 border border-amber-200",
    gradient: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810793/design3._uzmeqd.png",
    modules: ["Typography", "Colour Theory", "Composition", "Grid Systems", "Visual Hierarchy"],
    highlights: [
      "Apply the Gestalt principles to your layouts",
      "Pair typefaces professionally and establish hierarchy",
      "Use colour theory to evoke emotion and guide attention",
      "Design with grid systems and white space",
      "Critique and improve visual designs systematically",
    ],
    skills: ["Typography", "Colour Theory", "Composition", "Grid Systems", "Visual Hierarchy", "Gestalt Principles"],
    companies: ["Razorpay", "Swiggy", "Ola", "MakeMyTrip", "Zepto", "CRED"],
    syllabus: [
      { topic: "Principles of Visual Design", week: "Week 1–2", lessons: 6 },
      { topic: "Typography Mastery", week: "Week 3", lessons: 5 },
      { topic: "Colour Theory in Practice", week: "Week 4", lessons: 5 },
      { topic: "Composition & Grid Systems", week: "Week 5–6", lessons: 7 },
    ],
    alumni: {
      name: "Harish Nair",
      role: "Brand Designer · CRED",
      city: "Bengaluru",
      text: "My design work completely transformed after this course. The typography and colour modules alone are worth it.",
      avatar: "HN",
      rating: 4,
    },
    lessons: [
      {
        id: "design-2-1",
        weekLabel: "Week 1–2",
        title: "Principles of Visual Design",
        duration: "48 min",
        // DesignCourse — Graphic Design Theory
        videoId: "9QTCvayLhCA",
        description:
          "Learn the foundational principles of design — balance, contrast, repetition, alignment, and the Gestalt principles.",
      },
      {
        id: "design-2-2",
        weekLabel: "Week 3",
        title: "Typography — The Art of Type",
        duration: "44 min",
        // Google Fonts — Typography Tutorial
        videoId: "hnCmCwoogrQ",
        description:
          "Choose and pair typefaces professionally. Understand kerning, leading, tracking, and creating clear typographic hierarchy.",
      },
      {
        id: "design-2-3",
        weekLabel: "Week 4",
        title: "Colour Theory for Designers",
        duration: "40 min",
        // Canva — Colour Theory Tutorial
        videoId: "YeI6Wqn4I78",
        description:
          "Master the colour wheel, harmonies, contrast ratios, and psychological effects of colour in digital design.",
      },
      {
        id: "design-2-4",
        weekLabel: "Week 5–6",
        title: "Composition, Grids & Visual Hierarchy",
        duration: "46 min",
        // DesignCourse — Layout & Composition
        videoId: "a5KYlHNKQB8",
        description:
          "Design with purpose — apply grid systems, white space, and the rule of thirds to create powerful visual compositions.",
      },
    ],
    quiz: [
      { q: "What is visual hierarchy?", options: ["The order designers work in", "The arrangement of elements to guide the viewer's eye", "A type of grid system", "None"], correct: 1 },
      { q: "Which Gestalt principle groups similar elements together?", options: ["Proximity", "Similarity", "Continuity", "Closure"], correct: 1 },
      { q: "What is leading in typography?", options: ["The spacing between letters", "The spacing between lines of text", "The weight of a font", "None"], correct: 1 },
      { q: "What are complementary colours?", options: ["Colours that are next to each other on the wheel", "Colours directly opposite each other on the colour wheel", "Colours from the same hue family", "None"], correct: 1 },
      { q: "What is a grid system?", options: ["A navigation element", "A framework of lines to align and organise layout elements", "A CSS property", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555e4",
    category: "Design",
    title: "Figma for Professional Designers",
    emoji: "🛠️",
    tagline: "Every Figma feature, every workflow — production design mastery.",
    desc: "Advanced Figma — components, variables, auto-layout, design systems, and developer handoff.",
    duration: "6 weeks",
    level: "Advanced",
    price: 2999,
    origPrice: 8499,
    isFree: false,
    tag: "Tool Mastery",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-amber-50 text-amber-700 border border-amber-200",
    gradient: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810794/design4_vt1hga.jpg",
    modules: ["Advanced Components", "Auto-Layout", "Variables", "Design Tokens", "Developer Handoff"],
    highlights: [
      "Build complex nested components and variants",
      "Master auto-layout for responsive component design",
      "Use Figma variables for dynamic theming",
      "Create and maintain a scalable design system",
      "Prepare polished developer handoff specs in Dev Mode",
    ],
    skills: ["Figma", "Auto-Layout", "Components", "Variants", "Variables", "Design Systems", "Dev Mode"],
    companies: ["Razorpay", "Swiggy", "Ola", "MakeMyTrip", "Zepto", "CRED"],
    syllabus: [
      { topic: "Advanced Components & Variants", week: "Week 1–2", lessons: 7 },
      { topic: "Auto-Layout & Responsive Design", week: "Week 3", lessons: 6 },
      { topic: "Figma Variables & Dynamic Theming", week: "Week 4", lessons: 6 },
      { topic: "Design Systems & Developer Handoff", week: "Week 5–6", lessons: 7 },
    ],
    alumni: {
      name: "Karishma Kapoor",
      role: "Product Designer · Zepto",
      city: "Mumbai",
      text: "I thought I knew Figma but this course unlocked variables, advanced auto-layout, and proper component architecture. Game changer.",
      avatar: "KK",
      rating: 5,
    },
    lessons: [
      {
        id: "design-3-1",
        weekLabel: "Week 1–2",
        title: "Advanced Components & Variants in Figma",
        duration: "55 min",
        // Figma — Advanced Component Tutorial
        videoId: "9iXECZfcuI4",
        description:
          "Build nested components, create variant groups, and manage component properties for a scalable UI component library.",
      },
      {
        id: "design-3-2",
        weekLabel: "Week 3",
        title: "Auto-Layout Mastery",
        duration: "46 min",
        // Figma — Auto Layout Tutorial
        videoId: "TyaGpGDFczw",
        description:
          "Use auto-layout to build responsive components that adapt to content. Master padding, spacing, and wrapping behaviour.",
      },
      {
        id: "design-3-3",
        weekLabel: "Week 4",
        title: "Figma Variables & Dynamic Theming",
        duration: "44 min",
        // Figma — Variables Tutorial (Official)
        videoId: "1ONxxlJnvdM",
        description:
          "Use Figma Variables to build light/dark mode systems, spacing tokens, and dynamic colour themes across your design system.",
      },
      {
        id: "design-3-4",
        weekLabel: "Week 5–6",
        title: "Design Systems & Developer Handoff",
        duration: "52 min",
        // Figma — Design Systems Tutorial
        videoId: "CJyJN0ZdEGA",
        description:
          "Build and document a complete design system. Prepare pixel-perfect developer handoff specs using Figma Dev Mode.",
      },
    ],
    quiz: [
      { q: "What is an auto-layout frame in Figma?", options: ["A fixed-size frame", "A frame that automatically adjusts size based on content", "A background layer", "None"], correct: 1 },
      { q: "What are Figma Variables used for?", options: ["Running JavaScript", "Storing reusable design values like colours and spacing", "Exporting assets", "None"], correct: 1 },
      { q: "What is a component variant?", options: ["A broken component", "A different state or style of the same component", "A duplicated layer", "None"], correct: 1 },
      { q: "What is Dev Mode in Figma?", options: ["A dark theme", "A view for developers to inspect and export design specs", "An animation tool", "None"], correct: 1 },
      { q: "What is a design token?", options: ["A payment method", "A named value like a colour or spacing unit shared across design and code", "A layer style", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555e7",
    category: "Design",
    title: "Motion Graphics with After Effects",
    emoji: "🎬",
    tagline: "Bring your designs to life with motion and animation.",
    desc: "Create professional motion graphics, animated UI, and video content with After Effects.",
    duration: "6 weeks",
    level: "Beginner",
    price: 2499,
    origPrice: 6999,
    isFree: false,
    tag: "Creative Skills",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-amber-50 text-amber-700 border border-amber-200",
    gradient: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810795/design5_c55hx3.jpg",
    modules: ["After Effects Basics", "Keyframing", "Typography Animation", "Motion Principles", "Exporting"],
    highlights: [
      "Navigate the After Effects workspace confidently",
      "Animate text, shapes, and logos with keyframes",
      "Apply easing and motion principles for natural movement",
      "Create title sequences and animated social media content",
      "Export animations for web, social, and video projects",
    ],
    skills: ["After Effects", "Keyframing", "Motion Graphics", "Typography Animation", "Easing", "Video Export"],
    companies: ["Razorpay", "Swiggy", "Ola", "MakeMyTrip", "Zepto", "CRED"],
    syllabus: [
      { topic: "After Effects Interface & Basics", week: "Week 1–2", lessons: 6 },
      { topic: "Keyframing & Animation Principles", week: "Week 3–4", lessons: 7 },
      { topic: "Typography & Logo Animation", week: "Week 5", lessons: 6 },
      { topic: "Exporting & Real-World Projects", week: "Week 6", lessons: 5 },
    ],
    alumni: {
      name: "Tanvi Mehta",
      role: "Motion Designer · MakeMyTrip",
      city: "Mumbai",
      text: "I had zero motion experience but landed a motion design role at MakeMyTrip after building my portfolio from this course.",
      avatar: "TM",
      rating: 4,
    },
    lessons: [
      {
        id: "design-4-1",
        weekLabel: "Week 1–2",
        title: "After Effects for Beginners — Full Introduction",
        duration: "54 min",
        // Motion Array — After Effects for Beginners
        videoId: "TrNBa1btEk0",
        description:
          "Get comfortable with the After Effects interface — composition settings, timeline, layers, and basic animation workflow.",
      },
      {
        id: "design-4-2",
        weekLabel: "Week 3–4",
        title: "Keyframing & Motion Principles",
        duration: "48 min",
        // School of Motion — 12 Principles of Animation
        videoId: "uDqjIdI4bF4",
        description:
          "Apply the 12 principles of animation — squash and stretch, anticipation, easing — to create natural, professional motion.",
      },
      {
        id: "design-4-3",
        weekLabel: "Week 5",
        title: "Typography & Logo Animation",
        duration: "44 min",
        // MOBOX Graphics — Text Animation After Effects
        videoId: "l2Az-oMiExM",
        description:
          "Animate text reveals, kinetic typography, and logo stings. Use the text animator and shape layers for expressive motion.",
      },
      {
        id: "design-4-4",
        weekLabel: "Week 6",
        title: "Exporting & Delivering Motion Projects",
        duration: "36 min",
        // Motion Array — After Effects Export Settings
        videoId: "9BUz8zBs59E",
        description:
          "Export animations for social media, web, and video using Media Encoder. Learn codec settings, GIF export, and Lottie JSON for web.",
      },
    ],
    quiz: [
      { q: "What is a composition in After Effects?", options: ["A video file format", "A container for layers that defines the frame size and duration", "A filter effect", "None"], correct: 1 },
      { q: "What is easing in animation?", options: ["Making animation slower", "Gradually accelerating or decelerating movement for natural motion", "Removing keyframes", "None"], correct: 1 },
      { q: "What is a keyframe?", options: ["A type of video codec", "A point in time that defines a specific value for a property", "A layer style", "None"], correct: 1 },
      { q: "What does the 'anticipation' principle mean?", options: ["Predicting the next frame", "A small motion before the main action to prepare the viewer", "An animation preset", "None"], correct: 1 },
      { q: "What is Lottie used for?", options: ["Video editing", "Exporting After Effects animations as lightweight JSON for web", "3D rendering", "None"], correct: 1 },
    ],
  },

  // ─── DATA SCIENCE (4 courses) ─────────────────────────────────────────────
  {
    id: "69d9301719ab4505458555ea",
    category: "Data Science",
    title: "Probability for Data Science",
    emoji: "🎲",
    tagline: "The mathematics that powers machine learning — made intuitive.",
    desc: "Master probability, statistics, and distributions essential for data science and ML.",
    duration: "6 weeks",
    level: "Beginner",
    price: 0,
    origPrice: 4999,
    isFree: true,
    tag: "Free Trial",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810846/data-science6_vukp9k.jpg",
    modules: ["Probability Basics", "Distributions", "Bayes Theorem", "Hypothesis Testing", "Statistics"],
    highlights: [
      "Understand conditional probability and Bayes' theorem",
      "Work with normal, binomial, and Poisson distributions",
      "Conduct hypothesis tests and interpret p-values",
      "Apply statistical thinking to real datasets",
      "Use Python (NumPy & SciPy) for statistical computation",
    ],
    skills: ["Probability", "Statistics", "Bayesian Thinking", "Hypothesis Testing", "Python", "SciPy"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Probability Fundamentals", week: "Week 1–2", lessons: 6 },
      { topic: "Probability Distributions", week: "Week 3", lessons: 5 },
      { topic: "Bayes Theorem & Applications", week: "Week 4", lessons: 5 },
      { topic: "Hypothesis Testing & Statistics", week: "Week 5–6", lessons: 6 },
    ],
    alumni: {
      name: "Anil Kumar",
      role: "Data Scientist · Mu Sigma",
      city: "Bengaluru",
      text: "This course filled the gaps my engineering degree left. Probability finally makes sense and I use it every day at Mu Sigma.",
      avatar: "AK",
      rating: 5,
    },
    lessons: [
      {
        id: "ds-1-1",
        weekLabel: "Week 1–2",
        title: "Probability for Data Science — Fundamentals",
        duration: "48 min",
        // StatQuest — Probability Basics
        videoId: "KzfWUEJjG18",
        description:
          "Learn probability rules, set theory, conditional probability, independence, and the multiplication and addition rules.",
      },
      {
        id: "ds-1-2",
        weekLabel: "Week 3",
        title: "Probability Distributions — Normal, Binomial & More",
        duration: "50 min",
        // StatQuest — Distributions
        videoId: "qBigTkjLsfo",
        description:
          "Understand normal, binomial, Poisson, and exponential distributions and their applications in data science.",
      },
      {
        id: "ds-1-3",
        weekLabel: "Week 4",
        title: "Bayes' Theorem Explained",
        duration: "20 min",
        // 3Blue1Brown — Bayes' Theorem
        videoId: "HZGCoVF3YvM",
        description:
          "Understand Bayes' theorem visually. Apply it to spam filtering, medical testing, and Bayesian inference.",
      },
      {
        id: "ds-1-4",
        weekLabel: "Week 5–6",
        title: "Hypothesis Testing & Statistical Significance",
        duration: "52 min",
        // StatQuest — Hypothesis Testing & p-values
        videoId: "0oc49DyA3hU",
        description:
          "Run t-tests, chi-square tests, and ANOVA. Interpret p-values, confidence intervals, and statistical significance correctly.",
      },
    ],
    quiz: [
      { q: "What is probability?", options: ["A measure of certainty", "A measure of the likelihood of an event", "A statistical formula", "None"], correct: 1 },
      { q: "What does EDA stand for?", options: ["Exploratory Data Analysis", "Extended Data Algorithm", "Evaluated Data Assessment", "None"], correct: 0 },
      { q: "What does a p-value below 0.05 typically indicate?", options: ["The null hypothesis is true", "The result is statistically significant", "The sample is too small", "None"], correct: 1 },
      { q: "What is a normal distribution?", options: ["A skewed data distribution", "A bell-shaped, symmetric probability distribution", "A uniform distribution", "None"], correct: 1 },
      { q: "What is Bayes' theorem used for?", options: ["Sorting data", "Updating the probability of a hypothesis given new evidence", "Cleaning datasets", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555ed",
    category: "Data Science",
    title: "Python for Data Analysis",
    emoji: "🐍",
    tagline: "Pandas, NumPy, and Matplotlib — the essential Python data toolkit.",
    desc: "Master Python's data stack for cleaning, transforming, and visualising real-world datasets.",
    duration: "6 weeks",
    level: "Intermediate",
    price: 2499,
    origPrice: 6999,
    isFree: false,
    tag: "Must Have",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810840/data-science2_olkpz5.jpg",
    modules: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Cleaning"],
    highlights: [
      "Manipulate large datasets efficiently with Pandas DataFrames",
      "Perform vectorised operations with NumPy arrays",
      "Visualise data distributions and trends with Matplotlib and Seaborn",
      "Clean messy real-world datasets end-to-end",
      "Apply GroupBy, merge, pivot tables for business analysis",
    ],
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Cleaning", "EDA"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Python Data Structures & Control Flow", week: "Week 1", lessons: 5 },
      { topic: "Pandas & NumPy Mastery", week: "Week 2–4", lessons: 9 },
      { topic: "Data Visualisation", week: "Week 5", lessons: 6 },
      { topic: "End-to-End EDA Project", week: "Week 6", lessons: 5 },
    ],
    alumni: {
      name: "Preeti Menon",
      role: "Data Analyst · Flipkart",
      city: "Bengaluru",
      text: "The Pandas module alone saved me 20 hours a week of manual Excel work. Absolutely indispensable skills.",
      avatar: "PM",
      rating: 5,
    },
    lessons: [
      {
        id: "ds-2-1",
        weekLabel: "Week 1",
        title: "Python for Data Science — Fundamentals",
        duration: "54 min",
        // freeCodeCamp — Python for Everybody (Dr. Chuck)
        videoId: "HrRA67O-QXI",
        description:
          "Python fundamentals for data science — data types, loops, functions, file I/O, and the scientific Python ecosystem.",
      },
      {
        id: "ds-2-2",
        weekLabel: "Week 2–4",
        title: "Pandas & NumPy — Complete Data Manipulation",
        duration: "58 min",
        // Keith Galli — Complete Pandas Tutorial
        videoId: "e60ItwlZTKM",
        description:
          "Manipulate, clean, and transform large datasets using Pandas DataFrames and NumPy arrays for high-performance computation.",
      },
      {
        id: "ds-2-3",
        weekLabel: "Week 5",
        title: "Data Visualisation with Matplotlib & Seaborn",
        duration: "46 min",
        // Corey Schafer — Matplotlib Tutorial Full Series
        videoId: "-jTD74eEy2I",
        description:
          "Create publication-quality charts, heatmaps, and interactive visualisations to communicate data insights effectively.",
      },
      {
        id: "ds-2-4",
        weekLabel: "Week 6",
        title: "End-to-End Exploratory Data Analysis Project",
        duration: "52 min",
        // Alex The Analyst — EDA with Python Project
        videoId: "Liv6eeb1VfE",
        description:
          "Apply your full Python data stack to a real Kaggle dataset — import, clean, explore, visualise, and present your findings.",
      },
    ],
    quiz: [
      { q: "What library is used for data manipulation in Python?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], correct: 1 },
      { q: "What does a Pandas DataFrame represent?", options: ["A list of numbers", "A 2D labelled data structure similar to a spreadsheet", "A machine learning model", "None"], correct: 1 },
      { q: "What is the difference between loc and iloc in Pandas?", options: ["No difference", "loc uses labels, iloc uses integer positions", "iloc uses labels, loc uses positions", "None"], correct: 1 },
      { q: "Which NumPy function creates an array filled with zeros?", options: ["np.empty()", "np.ones()", "np.zeros()", "np.array()"], correct: 2 },
      { q: "What is a heatmap used for?", options: ["Displaying geographic data only", "Showing the magnitude of data in a matrix format", "Creating pie charts", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555f0",
    category: "Data Science",
    title: "Statistical Data Modeling",
    emoji: "📐",
    tagline: "Build models that explain the world — from regression to Bayesian inference.",
    desc: "Applied statistics and modelling — linear models, GLMs, time series, and more.",
    duration: "8 weeks",
    level: "Advanced",
    price: 2999,
    origPrice: 8999,
    isFree: false,
    tag: "Analytical Edge",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810841/data-science3_jr2wad.png",
    modules: ["Linear Models", "GLMs", "Time Series", "Bayesian Inference", "Model Validation"],
    highlights: [
      "Build and interpret multiple linear regression models",
      "Apply GLMs — logistic, Poisson, and negative binomial",
      "Model and forecast time series with ARIMA and Prophet",
      "Understand Bayesian inference and MCMC sampling",
      "Validate models with cross-validation and diagnostic plots",
    ],
    skills: ["Linear Regression", "GLMs", "Time Series", "ARIMA", "Bayesian Inference", "Python", "R"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Linear & Multiple Regression", week: "Week 1–2", lessons: 7 },
      { topic: "Generalised Linear Models", week: "Week 3–4", lessons: 7 },
      { topic: "Time Series Analysis & Forecasting", week: "Week 5–6", lessons: 7 },
      { topic: "Bayesian Statistics & Model Validation", week: "Week 7–8", lessons: 7 },
    ],
    alumni: {
      name: "Deepak Pillai",
      role: "Senior Data Scientist · Walmart Labs",
      city: "Bengaluru",
      text: "This is the course that turned me from a junior data analyst into a data scientist. The ARIMA and Bayesian modules are exceptional.",
      avatar: "DP",
      rating: 5,
    },
    lessons: [
      {
        id: "ds-3-1",
        weekLabel: "Week 1–2",
        title: "Linear & Multiple Regression — Complete Guide",
        duration: "55 min",
        // StatQuest — Linear Regression
        videoId: "nk2CQITm_eo",
        description:
          "Build linear models, interpret coefficients, handle multicollinearity, and validate assumptions with residual analysis.",
      },
      {
        id: "ds-3-2",
        weekLabel: "Week 3–4",
        title: "Generalised Linear Models — Logistic & Poisson Regression",
        duration: "48 min",
        // StatQuest — Logistic Regression
        videoId: "yIYKR4sgzI8",
        description:
          "Apply logistic regression for classification, Poisson regression for count data, and interpret GLM outputs correctly.",
      },
      {
        id: "ds-3-3",
        weekLabel: "Week 5–6",
        title: "Time Series Analysis & ARIMA Forecasting",
        duration: "58 min",
        // ritvikmath — Time Series & ARIMA
        videoId: "e8Yw4alG16Q",
        description:
          "Analyse time series for stationarity, trend, and seasonality. Fit ARIMA and SARIMA models and forecast future values.",
      },
      {
        id: "ds-3-4",
        weekLabel: "Week 7–8",
        title: "Bayesian Statistics & MCMC",
        duration: "52 min",
        // StatQuest — Bayesian Statistics
        videoId: "3OJEae7Qb_o",
        description:
          "Understand Bayesian inference, priors, posteriors, and Markov Chain Monte Carlo sampling with PyMC3.",
      },
    ],
    quiz: [
      { q: "What is the purpose of a regression model?", options: ["Classify data into categories", "Predict a continuous outcome variable", "Cluster data points", "None"], correct: 1 },
      { q: "What does ARIMA stand for?", options: ["Auto Regression Integrated Moving Average", "Automated Risk Index Model Analysis", "None", "Average Regression Interval Method"], correct: 0 },
      { q: "What is multicollinearity?", options: ["Multiple dependent variables", "High correlation among independent variables", "A model with too many layers", "None"], correct: 1 },
      { q: "What is a prior in Bayesian statistics?", options: ["Your belief about a parameter before seeing data", "The final model output", "A type of distribution", "None"], correct: 0 },
      { q: "What is R-squared?", options: ["A clustering metric", "The proportion of variance in the dependent variable explained by the model", "A regularisation technique", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555f3",
    category: "Data Science",
    title: "Data Mining & Exploration",
    emoji: "⛏️",
    tagline: "Find hidden patterns in large datasets that others miss.",
    desc: "Association rules, clustering, anomaly detection, and pattern extraction from large datasets.",
    duration: "6 weeks",
    level: "Beginner",
    price: 2499,
    origPrice: 6999,
    isFree: false,
    tag: "Pattern Finding",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810843/data-science4_hvmblg.jpg",
    modules: ["Data Mining Fundamentals", "Clustering", "Association Rules", "Anomaly Detection", "Pattern Analysis"],
    highlights: [
      "Apply Apriori and FP-Growth for market basket analysis",
      "Detect outliers with Isolation Forest and Z-score methods",
      "Cluster customer data with K-Means and DBSCAN",
      "Explore datasets with automated EDA tools",
      "Build a recommendation system with collaborative filtering",
    ],
    skills: ["Data Mining", "Clustering", "Association Rules", "Anomaly Detection", "Python", "Scikit-learn"],
    companies: ["Mu Sigma", "Flipkart", "Walmart Labs", "BYJU'S", "Swiggy", "PhonePe"],
    syllabus: [
      { topic: "Data Mining Concepts & EDA", week: "Week 1–2", lessons: 6 },
      { topic: "Clustering Algorithms", week: "Week 3", lessons: 5 },
      { topic: "Association Rule Mining", week: "Week 4", lessons: 5 },
      { topic: "Anomaly Detection & Recommenders", week: "Week 5–6", lessons: 6 },
    ],
    alumni: {
      name: "Gaurav Tiwari",
      role: "Data Analyst · BYJU'S",
      city: "Pune",
      text: "The association rules module helped me build a product recommendation engine that increased conversion rates by 18%.",
      avatar: "GT",
      rating: 4,
    },
    lessons: [
      {
        id: "ds-4-1",
        weekLabel: "Week 1–2",
        title: "Data Mining Fundamentals & EDA",
        duration: "50 min",
        // freeCodeCamp — Data Analysis with Python Full Course
        videoId: "r-uOLxNrNk8",
        description:
          "Learn the data mining process — CRISP-DM, data collection, cleaning, and exploratory analysis to surface initial patterns.",
      },
      {
        id: "ds-4-2",
        weekLabel: "Week 3",
        title: "Clustering — K-Means & DBSCAN",
        duration: "44 min",
        // Krish Naik — Clustering Algorithms
        videoId: "EItlUEPCIzM",
        description:
          "Segment customers and data points using K-Means and DBSCAN. Choose the optimal number of clusters with the elbow method.",
      },
      {
        id: "ds-4-3",
        weekLabel: "Week 4",
        title: "Association Rule Mining — Market Basket Analysis",
        duration: "42 min",
        // StatQuest — Association Rules
        videoId: "WGlMlS_Yydk",
        description:
          "Mine frequent itemsets with the Apriori algorithm. Calculate support, confidence, and lift for market basket analysis.",
      },
      {
        id: "ds-4-4",
        weekLabel: "Week 5–6",
        title: "Anomaly Detection & Recommendation Systems",
        duration: "52 min",
        // Krish Naik — Recommendation System Tutorial
        videoId: "1YoD0fg3_EM",
        description:
          "Detect outliers with Isolation Forest and build a collaborative filtering recommendation system from scratch.",
      },
    ],
    quiz: [
      { q: "What is market basket analysis?", options: ["Analysing supermarket foot traffic", "Finding products that are frequently purchased together", "Pricing strategy analysis", "None"], correct: 1 },
      { q: "What does support mean in association rules?", options: ["The frequency of an itemset in the dataset", "The accuracy of the rule", "The size of the dataset", "None"], correct: 0 },
      { q: "What is an anomaly in data?", options: ["A missing value", "An observation that deviates significantly from the norm", "A duplicate row", "None"], correct: 1 },
      { q: "What does DBSCAN stand for?", options: ["Database Scan", "Density-Based Spatial Clustering of Applications with Noise", "None", "Data Basis Scan Algorithm"], correct: 1 },
      { q: "What is collaborative filtering?", options: ["Filtering emails", "Recommending items based on similar users' preferences", "A data cleaning method", "None"], correct: 1 },
    ],
  },

  // ─── CLOUD COMPUTING (4 courses) ─────────────────────────────────────────
  {
    id: "69d9301719ab4505458555f6",
    category: "Cloud Computing",
    title: "AWS Solutions Architect Pro",
    emoji: "☁️",
    tagline: "Design fault-tolerant, scalable, and cost-optimised cloud architectures on AWS.",
    desc: "Advanced AWS architecture — VPC, EC2, RDS, EKS, IAM, and well-architected framework.",
    duration: "8 weeks",
    level: "Beginner",
    price: 0,
    origPrice: 7999,
    isFree: true,
    tag: "Free Trial",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-sky-50 text-sky-700 border border-sky-200",
    gradient: "from-sky-500 to-blue-600",
    accentBg: "bg-sky-50",
    accentBorder: "border-sky-200",
    accentText: "text-sky-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810876/cloud-computing1_dvsoi4.png",
    modules: ["EC2", "S3", "VPC", "RDS", "IAM", "Well-Architected Framework"],
    highlights: [
      "Design multi-tier architectures on AWS",
      "Configure VPCs, subnets, security groups, and NACLs",
      "Set up auto-scaling groups and load balancers",
      "Implement IAM policies for least-privilege security",
      "Optimise AWS costs with Reserved Instances and Savings Plans",
    ],
    skills: ["AWS", "EC2", "S3", "VPC", "RDS", "IAM", "Auto Scaling", "CloudFront", "Load Balancing"],
    companies: ["TCS", "HCL", "Wipro", "Infosys", "Accenture", "ThoughtWorks"],
    syllabus: [
      { topic: "AWS Core Services & IAM", week: "Week 1–2", lessons: 7 },
      { topic: "Networking — VPC & CloudFront", week: "Week 3–4", lessons: 7 },
      { topic: "Compute & Storage — EC2, S3, RDS", week: "Week 5–6", lessons: 8 },
      { topic: "Architecture & Cost Optimisation", week: "Week 7–8", lessons: 6 },
    ],
    alumni: {
      name: "Rajesh Pillai",
      role: "Cloud Architect · Accenture",
      city: "Hyderabad",
      text: "Passed the AWS Solutions Architect exam on my first attempt and got a promotion within 2 months. Absolutely worth it.",
      avatar: "RP",
      rating: 5,
    },
    lessons: [
      {
        id: "cloud-1-1",
        weekLabel: "Week 1–2",
        title: "AWS Cloud Practitioner Essentials",
        duration: "65 min",
        // freeCodeCamp — AWS Certified Cloud Practitioner Full Course
        videoId: "3WZzmiAkYBQ",
        description:
          "EC2, S3, RDS, VPC, IAM, EKS, CloudFront — architect and deploy cloud infrastructure on AWS following best practices.",
      },
      {
        id: "cloud-1-2",
        weekLabel: "Week 3–4",
        title: "AWS VPC & Networking Deep Dive",
        duration: "54 min",
        // Stephane Maarek — AWS VPC Tutorial
        videoId: "g2JOHLHh4rI",
        description:
          "Design and configure VPCs — subnets, route tables, internet gateways, NAT gateways, security groups, and VPC peering.",
      },
      {
        id: "cloud-1-3",
        weekLabel: "Week 5–6",
        title: "EC2, Auto Scaling & Load Balancing",
        duration: "56 min",
        // AWS — EC2 Auto Scaling Tutorial
        videoId: "09ji0vbNkPk",
        description:
          "Launch and manage EC2 instances, configure auto-scaling groups, and distribute traffic with Application Load Balancers.",
      },
      {
        id: "cloud-1-4",
        weekLabel: "Week 7–8",
        title: "AWS Architecture & Cost Optimisation",
        duration: "48 min",
        // AWS — Well-Architected Framework Overview
        videoId: "vPEMTd74xHU",
        description:
          "Apply the AWS Well-Architected Framework pillars. Optimise costs with Reserved Instances, Savings Plans, and right-sizing.",
      },
    ],
    quiz: [
      { q: "What does IaaS stand for?", options: ["Infrastructure as a Service", "Internet as a Service", "Integration as a Service", "None"], correct: 0 },
      { q: "What is an AWS VPC?", options: ["A virtual machine", "A logically isolated virtual network in AWS", "A storage bucket", "None"], correct: 1 },
      { q: "What does IAM stand for in AWS?", options: ["Internet Access Management", "Identity and Access Management", "Infrastructure Audit Module", "None"], correct: 1 },
      { q: "What is the purpose of an Auto Scaling Group?", options: ["Back up data automatically", "Automatically adjust the number of EC2 instances based on load", "Encrypt data at rest", "None"], correct: 1 },
      { q: "What is Amazon S3 used for?", options: ["Running virtual machines", "Object storage for files and data", "Container orchestration", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555f9",
    category: "Cloud Computing",
    title: "Google Cloud Platform (GCP) Fundamentals",
    emoji: "🌐",
    tagline: "Google's cloud — from Compute Engine to BigQuery and beyond.",
    desc: "Get productive on GCP — core services, networking, IAM, and GKE for container workloads.",
    duration: "6 weeks",
    level: "Intermediate",
    price: 2499,
    origPrice: 6999,
    isFree: false,
    tag: "Multi-Cloud",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-sky-50 text-sky-700 border border-sky-200",
    gradient: "from-sky-500 to-blue-600",
    accentBg: "bg-sky-50",
    accentBorder: "border-sky-200",
    accentText: "text-sky-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810876/cloud-computing2_n3ffat.jpg",
    modules: ["Compute Engine", "GKE", "Cloud Storage", "BigQuery", "Cloud IAM"],
    highlights: [
      "Deploy workloads on Compute Engine and Cloud Run",
      "Orchestrate containers with Google Kubernetes Engine (GKE)",
      "Query large datasets instantly with BigQuery",
      "Manage identities and permissions with Cloud IAM",
      "Monitor and observe cloud services with Cloud Monitoring",
    ],
    skills: ["GCP", "Compute Engine", "GKE", "BigQuery", "Cloud Storage", "Cloud IAM", "Cloud Run"],
    companies: ["TCS", "HCL", "Wipro", "Infosys", "Accenture", "ThoughtWorks"],
    syllabus: [
      { topic: "GCP Core Services & IAM", week: "Week 1–2", lessons: 7 },
      { topic: "GKE & Container Workloads", week: "Week 3–4", lessons: 7 },
      { topic: "BigQuery & Data Analytics", week: "Week 5", lessons: 6 },
      { topic: "Networking & Monitoring", week: "Week 6", lessons: 5 },
    ],
    alumni: {
      name: "Suresh Babu",
      role: "Cloud Engineer · HCL",
      city: "Chennai",
      text: "GCP was completely new to me. After this course I deployed a multi-tier app on GKE in my first week at HCL.",
      avatar: "SB",
      rating: 4,
    },
    lessons: [
      {
        id: "cloud-2-1",
        weekLabel: "Week 1–2",
        title: "Google Cloud Fundamentals — Core Infrastructure",
        duration: "58 min",
        // Google Cloud — GCP Fundamentals Course Overview
        videoId: "bOD5MQJq5TE",
        description:
          "Explore GCP's global infrastructure, core services — Compute Engine, Cloud Storage, Cloud SQL — and IAM configuration.",
      },
      {
        id: "cloud-2-2",
        weekLabel: "Week 3–4",
        title: "Google Kubernetes Engine (GKE) Deep Dive",
        duration: "62 min",
        // TechWorld with Nana — Kubernetes Tutorial for Beginners (Full Course)
        videoId: "X48VuDVv0do",
        description:
          "Deploy and manage containerised workloads on GKE — pods, services, deployments, Ingress, and horizontal pod autoscaling.",
      },
      {
        id: "cloud-2-3",
        weekLabel: "Week 5",
        title: "BigQuery for Data Analysis",
        duration: "50 min",
        // Google Cloud — BigQuery Tutorial
        videoId: "ggmVk87FG5Y",
        description:
          "Query petabyte-scale datasets with BigQuery SQL. Use partitioned tables, clustered tables, and BI Engine for dashboards.",
      },
      {
        id: "cloud-2-4",
        weekLabel: "Week 6",
        title: "GCP Networking & Cloud Monitoring",
        duration: "44 min",
        // Google Cloud — VPC and Network Tutorial
        videoId: "kTEQcH60VtE",
        description:
          "Configure GCP VPCs, firewall rules, load balancers, and Cloud CDN. Monitor workloads with Cloud Monitoring and Logging.",
      },
    ],
    quiz: [
      { q: "Which is NOT a major cloud provider?", options: ["AWS", "Azure", "GCP", "MongoDB Atlas"], correct: 3 },
      { q: "What is GKE?", options: ["Google's managed Kubernetes service", "A storage product", "A monitoring tool", "None"], correct: 0 },
      { q: "What is BigQuery primarily used for?", options: ["Running containerised apps", "Serverless analytics on large datasets", "Storing files", "None"], correct: 1 },
      { q: "What is Cloud IAM used for?", options: ["Monitoring performance", "Managing who can access GCP resources and what they can do", "Storing data", "None"], correct: 1 },
      { q: "What is Cloud Run?", options: ["A CI/CD tool", "A fully managed platform for running stateless containers", "A database service", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555fc",
    category: "Cloud Computing",
    title: "Cloud Security & Compliance",
    emoji: "🔐",
    tagline: "Secure your cloud infrastructure — from architecture to audit.",
    desc: "Zero trust, IAM, encryption, compliance frameworks, and cloud security best practices.",
    duration: "6 weeks",
    level: "Advanced",
    price: 2999,
    origPrice: 8499,
    isFree: false,
    tag: "Security Focus",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-sky-50 text-sky-700 border border-sky-200",
    gradient: "from-sky-500 to-blue-600",
    accentBg: "bg-sky-50",
    accentBorder: "border-sky-200",
    accentText: "text-sky-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810879/cloud-computing4_w39otu.jpg",
    modules: ["Zero Trust", "IAM Security", "Encryption", "Compliance", "SIEM", "Threat Detection"],
    highlights: [
      "Design zero trust architectures for cloud environments",
      "Implement IAM with least-privilege and MFA enforcement",
      "Encrypt data at rest and in transit with KMS",
      "Achieve SOC 2 and ISO 27001 compliance readiness",
      "Detect and respond to cloud threats with SIEM tools",
    ],
    skills: ["Zero Trust", "Cloud IAM", "KMS", "SOC 2", "ISO 27001", "SIEM", "Threat Detection", "AWS Security"],
    companies: ["TCS", "HCL", "Wipro", "Infosys", "Accenture", "ThoughtWorks"],
    syllabus: [
      { topic: "Cloud Security Fundamentals", week: "Week 1–2", lessons: 7 },
      { topic: "IAM & Zero Trust Architecture", week: "Week 3", lessons: 6 },
      { topic: "Encryption & Data Protection", week: "Week 4", lessons: 6 },
      { topic: "Compliance & Threat Response", week: "Week 5–6", lessons: 7 },
    ],
    alumni: {
      name: "Abhishek Kumar",
      role: "Cloud Security Engineer · Wipro",
      city: "Noida",
      text: "Got my first dedicated security role after this course. The zero trust and compliance modules directly came up in my interview.",
      avatar: "AK",
      rating: 5,
    },
    lessons: [
      {
        id: "cloud-3-1",
        weekLabel: "Week 1–2",
        title: "Cloud Security Fundamentals",
        duration: "54 min",
        // freeCodeCamp — Cloud Security Full Course
        videoId: "M988_fsOSWo",
        description:
          "Understand the shared responsibility model, cloud attack surfaces, and implement security controls across compute, storage, and networking.",
      },
      {
        id: "cloud-3-2",
        weekLabel: "Week 3",
        title: "IAM Security & Zero Trust Architecture",
        duration: "48 min",
        // John Savill — Zero Trust Architecture
        videoId: "8LCmBsRwQew",
        description:
          "Implement zero trust principles — never trust, always verify. Configure MFA, conditional access, and least-privilege IAM policies.",
      },
      {
        id: "cloud-3-3",
        weekLabel: "Week 4",
        title: "Encryption, KMS & Data Protection",
        duration: "44 min",
        // AWS — AWS KMS Tutorial
        videoId: "WIimqYOGVnM",
        description:
          "Implement encryption at rest and in transit using AWS KMS and CloudHSM. Manage keys, audit usage, and enforce data protection policies.",
      },
      {
        id: "cloud-3-4",
        weekLabel: "Week 5–6",
        title: "Compliance Frameworks & Threat Detection",
        duration: "52 min",
        // SANS — Cloud Security Compliance
        videoId: "4CyFoaSQ3lk",
        description:
          "Map controls to SOC 2, ISO 27001, and GDPR requirements. Use AWS GuardDuty and Security Hub for real-time threat detection.",
      },
    ],
    quiz: [
      { q: "What is serverless computing?", options: ["Computing without internet", "Running code without managing servers", "A type of database", "None"], correct: 1 },
      { q: "What is the shared responsibility model in cloud security?", options: ["The cloud provider is responsible for everything", "Security responsibilities are divided between the provider and customer", "The customer handles all security", "None"], correct: 1 },
      { q: "What is zero trust architecture?", options: ["Trust all internal traffic", "Never trust, always verify — no implicit trust based on network location", "Allow all external traffic", "None"], correct: 1 },
      { q: "What does KMS stand for?", options: ["Key Management Service", "Kubernetes Monitoring System", "Knowledge Management Suite", "None"], correct: 0 },
      { q: "What is the principle of least privilege?", options: ["Give all users admin access", "Grant only the minimum permissions needed to perform a task", "Encrypt all data", "None"], correct: 1 },
    ],
  },
  {
    id: "69d9301719ab4505458555ff",
    category: "Cloud Computing",
    title: "Serverless Architecture with AWS Lambda",
    emoji: "⚡",
    tagline: "Build event-driven apps that scale to millions — with zero server management.",
    desc: "AWS Lambda, API Gateway, DynamoDB, and Step Functions for modern serverless applications.",
    duration: "6 weeks",
    level: "Beginner",
    price: 2499,
    origPrice: 6999,
    isFree: false,
    tag: "Future Ready",
    tagStyle:
      "inline-flex items-center px-2.5 py-1 rounded-full font-medium font-mono bg-sky-50 text-sky-700 border border-sky-200",
    gradient: "from-sky-500 to-blue-600",
    accentBg: "bg-sky-50",
    accentBorder: "border-sky-200",
    accentText: "text-sky-700",
    thumbnail:
      "https://res.cloudinary.com/db2vju4mv/image/upload/f_auto,q_auto/v1773810881/cloud-computing5_rsaoun.jpg",
    modules: ["AWS Lambda", "API Gateway", "DynamoDB", "S3 Events", "Step Functions"],
    highlights: [
      "Build and deploy Lambda functions in Python and Node.js",
      "Design REST APIs with API Gateway and Lambda integration",
      "Store and query data with DynamoDB single-table design",
      "Orchestrate complex workflows with Step Functions",
      "Monitor and debug serverless apps with CloudWatch and X-Ray",
    ],
    skills: ["AWS Lambda", "API Gateway", "DynamoDB", "Step Functions", "Serverless Framework", "CloudWatch", "Python"],
    companies: ["TCS", "HCL", "Wipro", "Infosys", "Accenture", "ThoughtWorks"],
    syllabus: [
      { topic: "AWS Lambda & Serverless Concepts", week: "Week 1–2", lessons: 7 },
      { topic: "API Gateway & REST APIs", week: "Week 3", lessons: 6 },
      { topic: "DynamoDB for Serverless Apps", week: "Week 4", lessons: 6 },
      { topic: "Step Functions, Events & Monitoring", week: "Week 5–6", lessons: 6 },
    ],
    alumni: {
      name: "Vinod Sharma",
      role: "Serverless Developer · ThoughtWorks",
      city: "Bengaluru",
      text: "Built a production serverless API processing 2 million events per day. This course gave me everything I needed.",
      avatar: "VS",
      rating: 5,
    },
    lessons: [
      {
        id: "cloud-4-1",
        weekLabel: "Week 1–2",
        title: "AWS Lambda — Serverless Computing from Scratch",
        duration: "56 min",
        // freeCodeCamp — AWS Lambda Tutorial
        videoId: "eOBq__h4OJ4",
        description:
          "Create and deploy Lambda functions, understand invocation models, configure triggers, and manage IAM roles and permissions.",
      },
      {
        id: "cloud-4-2",
        weekLabel: "Week 3",
        title: "API Gateway — Building REST APIs on AWS",
        duration: "48 min",
        // Traversy Media — AWS API Gateway Tutorial
        videoId: "1_Ia5IL4Uy4",
        description:
          "Create and secure REST APIs with API Gateway. Integrate with Lambda, configure CORS, throttling, and custom authorisers.",
      },
      {
        id: "cloud-4-3",
        weekLabel: "Week 4",
        title: "DynamoDB — NoSQL for Serverless Apps",
        duration: "52 min",
        // Alex DeBrie — DynamoDB Deep Dive
        videoId: "DIQVJqiSUkE",
        description:
          "Design DynamoDB schemas with single-table design. Understand partition keys, sort keys, GSIs, and optimise for performance.",
      },
      {
        id: "cloud-4-4",
        weekLabel: "Week 5–6",
        title: "Step Functions, S3 Events & CloudWatch",
        duration: "46 min",
        // AWS — Step Functions Tutorial
        videoId: "Dh7h3lkpeP4",
        description:
          "Orchestrate multi-step workflows with Step Functions. Trigger Lambda from S3 events and monitor with CloudWatch and X-Ray.",
      },
    ],
    quiz: [
      { q: "What does auto-scaling do?", options: ["Automatically backs up data", "Adjusts resources based on demand", "Encrypts data automatically", "None"], correct: 1 },
      { q: "What is AWS Lambda?", options: ["A server management service", "A serverless compute service that runs code in response to events", "A database service", "None"], correct: 1 },
      { q: "What is a cold start in AWS Lambda?", options: ["A function that never runs", "The latency when Lambda initialises a new function instance", "A type of error", "None"], correct: 1 },
      { q: "What is DynamoDB?", options: ["A relational database", "A fully managed NoSQL key-value and document database", "A caching service", "None"], correct: 1 },
      { q: "What does API Gateway do?", options: ["Manages database connections", "Acts as a front door to create, manage, and secure REST APIs", "Monitors Lambda functions", "None"], correct: 1 },
    ],
  },
];