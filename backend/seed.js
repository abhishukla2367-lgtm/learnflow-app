require("dotenv").config();
const mongoose   = require("mongoose");
const bcrypt     = require("bcryptjs");
const dns        = require("node:dns");

const User        = require("./models/User");
const Course      = require("./models/Course");
const Enrollment  = require("./models/Enrollment");
const Review      = require("./models/Review");
const Quiz        = require("./models/Quiz");
const LearningPath = require("./models/LearningPath");
const { Certificate } = require("./models/index");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
process.removeAllListeners("warning");

// ── Certification IDs match certsData.js exactly ────────────────────────────
const CERTIFICATIONS_DATA = [
  { _id: "65f1a2b3c4d5e6f7a8b9c0d1", title: "Certified Full Stack Developer",      price: 4999, category: "Web Development",  emoji: "🧑‍💻", tag: "Most Popular" },
  { _id: "65f1a2b3c4d5e6f7a8b9c0d2", title: "Certified Data Science Professional", price: 5999, category: "Data Science",     emoji: "📊",  tag: "Top Rated"   },
  { _id: "65f1a2b3c4d5e6f7a8b9c0d3", title: "Certified UI/UX Designer",            price: 3499, category: "Design",           emoji: "🎨",  tag: "High Demand" },
  { _id: "65f1a2b3c4d5e6f7a8b9c0d4", title: "Certified DevOps Engineer",           price: 5499, category: "Cloud Computing",  emoji: "☁️",  tag: "Trending"    },
  { _id: "65f1a2b3c4d5e6f7a8b9c0d5", title: "Certified React Native Developer",    price: 4499, category: "Web Development",  emoji: "📱",  tag: "New"         },
  { _id: "65f1a2b3c4d5e6f7a8b9c0d6", title: "Certified Business Analyst (Tech)",   price: 3999, category: "Marketing",        emoji: "📈",  tag: "Bestseller"  },
];

const COURSE_TITLES = {
  "Marketing":       ["Marketing Masterclass: Intermediate Level 1","Marketing Masterclass: Beginner Level 2","Marketing Masterclass: Advanced Level 3","Marketing Masterclass: Intermediate Level 4","Digital Advertising & PPC Strategy","Social Media ROI & Analytics","Content Marketing for Brand Growth","Email Automation & Funnel Building","Growth Hacking for Startups","Search Engine Optimization Deep Dive","Influencer Marketing & Partnerships","E-commerce Marketing Fundamentals"],
  "Web Dev":         ["Modern React with Redux Toolkit","Full-Stack Web Development Boot Camp","The Complete Node.js Developer Guide","Advanced CSS & Sass Frameworks","JavaScript: The Hard Parts & Deep Dive","Next.js 14 App Router Mastery","Tailwind CSS Layout Design","TypeScript Fundamentals for Scale","MERN Stack from Scratch","Angular & RxJS Enterprise Patterns","PHP & Laravel Web Applications","Python Django for Web Apps"],
  "AI / ML":         ["Machine Learning with Python","Deep Learning Specialization","Generative AI & LLM Engineering","Natural Language Processing (NLP)","Computer Vision & Image Processing","Data Science for Business Leaders","PyTorch for Deep Learning","TensorFlow 2.0 Professional","Reinforcement Learning Basics","AI Ethics & Governance","Big Data Engineering with Spark","Neural Networks Architecture"],
  "Design":          ["UI/UX Design Essentials","Adobe Illustrator Masterclass","Graphic Design Theory","Figma for Professional Designers","Motion Graphics with After Effects","Typography & Layout Mastery","Logo Design & Branding Systems","Web Design Portfolio Projects","3D Modeling for Beginners","Color Theory for Digital Art","User Research & Testing Methods","Mobile App Interface Design"],
  "Data Science":    ["Data Science Bootcamp 2026","Python for Data Analysis","Statistical Data Modeling","Data Mining & Exploration","SQL for Data Analytics","Probability for Data Science","Applied Machine Learning","Time Series Analysis & Hub","Big Data with Hadoop","Deep Learning for Data Science","Data Cleaning Fundamentals","Business Intelligence with PowerBI"],
  "Cloud Computing": ["AWS Solutions Architect Pro","Google Cloud Platform (GCP) Fundamentals","Microsoft Azure Essentials","Cloud Security & Compliance","Serverless Architecture with AWS Lambda","Terraform: Infrastructure as Code","Cloud Migration Strategies","Kubernetes Mastery for DevOps","Docker Containerization Guide","Multi-Cloud Management","Hybrid Cloud Infrastructure","Edge Computing Fundamentals"],
  "Cybersecurity":   ["Ethical Hacking Fundamentals","Cybersecurity Defense & Analyst","Network Security & Firewalls","Penetration Testing with Kali Linux","Incident Response & Handling","Web Application Security","Certified Information Systems Security (CISSP)","Malware Analysis & Reverse Engineering","Cryptography for Professionals","Mobile Security Threats","Cloud Security Architecture","Zero Trust Networking"],
  "DSA":             ["Data Structures in Java","Algorithm Design & Analysis","Dynamic Programming Mastery","Graph Theory for Software Engineering","Sorting & Searching Algorithms","Binary Trees & Recursion","Competitive Programming Secrets","System Design for Interviews","Complexity Analysis (Big O)","Advanced Linked Lists","Heaps & Priority Queues","Hash Maps & Collision Logic"],
};

const BASE = "https://res.cloudinary.com/db2vju4mv/image/upload";
const COURSE_IMAGES = {
  "Marketing":       [`${BASE}/f_auto,q_auto/v1773810616/marketing1_zyf1cg.webp`,`${BASE}/f_auto,q_auto/v1773810616/marketing2_ebwk0l.webp`,`${BASE}/f_auto,q_auto/v1773810616/marketing3_lvwipe.jpg`,`${BASE}/f_auto,q_auto/v1773810617/marketing4_dgomn1.webp`,`${BASE}/f_auto,q_auto/v1773810617/marketing5_yfvvli.jpg`,`${BASE}/f_auto,q_auto/v1773810618/marketing6_yr9m9k.jpg`,`${BASE}/f_auto,q_auto/v1773810619/marketing7_zrrfq6.jpg`,`${BASE}/f_auto,q_auto/v1773810621/marketing8_ujsts2.jpg`,`${BASE}/f_auto,q_auto/v1773810621/marketing9_qyjage.jpg`,`${BASE}/f_auto,q_auto/v1773810622/marketing10_hnkfg1.jpg`,`${BASE}/f_auto,q_auto/v1773810623/marketing11_aexdwx.jpg`,`${BASE}/f_auto,q_auto/v1773810624/marketing12_cmclcu.jpg`],
  "Web Dev":         [`${BASE}/f_auto,q_auto/v1773810687/webdev1_pw7byo.jpg`,`${BASE}/f_auto,q_auto/v1773810688/webdev2_xb0ao3.webp`,`${BASE}/f_auto,q_auto/v1773810689/webdev3_ggoeum.png`,`${BASE}/f_auto,q_auto/v1773810690/webdev4_kxfa09.jpg`,`${BASE}/f_auto,q_auto/v1773810690/webdev5_ibfblx.jpg`,`${BASE}/f_auto,q_auto/v1773810692/webdev6_blmn5y.jpg`,`${BASE}/f_auto,q_auto/v1773810693/webdev7_cvlbo2.webp`,`${BASE}/f_auto,q_auto/v1773810694/webdev8_zvpzq6.jpg`,`${BASE}/f_auto,q_auto/v1773810694/webdev9_lljbrz.jpg`,`${BASE}/f_auto,q_auto/v1773810695/webdev10_uqcvqt.jpg`,`${BASE}/f_auto,q_auto/v1773810697/webdev11_e5fmfo.webp`,`${BASE}/f_auto,q_auto/v1773810698/webdev12_gsjirf.jpg`],
  "AI / ML":         [`${BASE}/f_auto,q_auto/v1773810725/ai-ml1_ridnur.webp`,`${BASE}/f_auto,q_auto/v1773810726/ai-ml2_boj6t3.jpg`,`${BASE}/f_auto,q_auto/v1773810727/ai-ml3_eucoyw.jpg`,`${BASE}/f_auto,q_auto/v1773810728/ai-ml4_gsxssw.webp`,`${BASE}/f_auto,q_auto/v1773810729/ai-ml5_lzkiwd.jpg`,`${BASE}/f_auto,q_auto/v1773810731/ai-ml6_hfjotn.jpg`,`${BASE}/f_auto,q_auto/v1773810732/ai-ml7_ywwbks.png`,`${BASE}/f_auto,q_auto/v1773810733/ai-ml8_dhurrx.jpg`,`${BASE}/f_auto,q_auto/v1773810734/ai-ml9_f082kp.jpg`,`${BASE}/f_auto,q_auto/v1773810735/ai-ml10_zfs9p7.jpg`,`${BASE}/f_auto,q_auto/v1773810736/ai-ml11_iwu2vp.png`,`${BASE}/f_auto,q_auto/v1773810738/ai-ml12_hhfxb5.webp`],
  "Design":          [`${BASE}/f_auto,q_auto/v1773810790/design1_zqejk3.webp`,`${BASE}/f_auto,q_auto/v1773810791/design2_gxevaw.webp`,`${BASE}/f_auto,q_auto/v1773810793/design3._uzmeqd.png`,`${BASE}/f_auto,q_auto/v1773810794/design4_vt1hga.jpg`,`${BASE}/f_auto,q_auto/v1773810795/design5_c55hx3.jpg`,`${BASE}/f_auto,q_auto/v1773810797/design6_xufbcm.jpg`,`${BASE}/f_auto,q_auto/v1773810798/design7_bsrtmq.jpg`,`${BASE}/f_auto,q_auto/v1773810799/design8_l2dcau.png`,`${BASE}/f_auto,q_auto/v1773810800/design9_cfd38c.jpg`,`${BASE}/f_auto,q_auto/v1773810802/design10_vsaxqn.jpg`,`${BASE}/f_auto,q_auto/v1773810803/design11_wbcktx.png`,`${BASE}/f_auto,q_auto/v1773810805/design12_dztnnm.jpg`],
  "Data Science":    [`${BASE}/f_auto,q_auto/v1773810839/data-science1_z9bpph.jpg`,`${BASE}/f_auto,q_auto/v1773810840/data-science2_olkpz5.jpg`,`${BASE}/f_auto,q_auto/v1773810841/data-science3_jr2wad.png`,`${BASE}/f_auto,q_auto/v1773810843/data-science4_hvmblg.jpg`,`${BASE}/f_auto,q_auto/v1773810845/data-science5_sjmoog.jpg`,`${BASE}/f_auto,q_auto/v1773810846/data-science6_vukp9k.jpg`,`${BASE}/f_auto,q_auto/v1773810847/data-science7_uankbs.jpg`,`${BASE}/f_auto,q_auto/v1773810849/data-science8_jbhx0t.png`,`${BASE}/f_auto,q_auto/v1773810850/data-science9_qsbqea.jpg`,`${BASE}/f_auto,q_auto/v1773810852/data-science10_njpsog.avif`,`${BASE}/f_auto,q_auto/v1773810853/data-science11_tvnj6b.jpg`,`${BASE}/f_auto,q_auto/v1773810855/data-science12_hvaxri.jpg`],
  "Cloud Computing": [`${BASE}/f_auto,q_auto/v1773810876/cloud-computing1_dvsoi4.png`,`${BASE}/f_auto,q_auto/v1773810876/cloud-computing2_n3ffat.jpg`,`${BASE}/f_auto,q_auto/v1773810878/cloud-computing3_jpixv2.jpg`,`${BASE}/f_auto,q_auto/v1773810879/cloud-computing4_w39otu.jpg`,`${BASE}/f_auto,q_auto/v1773810881/cloud-computing5_rsaoun.jpg`,`${BASE}/f_auto,q_auto/v1773810882/cloud-computing6_dg9xvc.png`,`${BASE}/f_auto,q_auto/v1773810884/cloud-computing7_jgg4wb.jpg`,`${BASE}/f_auto,q_auto/v1773810886/cloud-computing8_lf17gz.webp`,`${BASE}/f_auto,q_auto/v1773810887/cloud-computing9_qv4h82.jpg`,`${BASE}/f_auto,q_auto/v1773810889/cloud-computing10_bwrlaz.jpg`,`${BASE}/f_auto,q_auto/v1773810890/cloud-computing11_evsjs9.jpg`,`${BASE}/f_auto,q_auto/v1773810892/cloud-computing12_rnnpp1.jpg`],
  "Cybersecurity":   [`${BASE}/f_auto,q_auto/v1773810917/cybersecurity1_gypdjz.jpg`,`${BASE}/f_auto,q_auto/v1773810918/cybersecurity2_yfg0lj.jpg`,`${BASE}/f_auto,q_auto/v1773810920/cybersecurity3_d5bvli.webp`,`${BASE}/f_auto,q_auto/v1773810921/cybersecurity4_z9yoti.png`,`${BASE}/f_auto,q_auto/v1773810923/cybersecurity5_svq7ce.jpg`,`${BASE}/f_auto,q_auto/v1773810925/cybersecurity6_wlfx2u.jpg`,`${BASE}/f_auto,q_auto/v1773810926/cybersecurity7_gtixg5.jpg`,`${BASE}/f_auto,q_auto/v1773810929/cybersecurity8_gmi3f1.png`,`${BASE}/f_auto,q_auto/v1773810930/cybersecurity9_amiqob.jpg`,`${BASE}/f_auto,q_auto/v1773810932/cybersecurity10_hyzcex.jpg`,`${BASE}/f_auto,q_auto/v1773810934/cybersecurity11_caouhr.jpg`,`${BASE}/f_auto,q_auto/v1773810935/cybersecurity12_f33u9x.jpg`],
  "DSA":             [`${BASE}/f_auto,q_auto/v1773811020/dsa1_udkc3l.jpg`,`${BASE}/f_auto,q_auto/v1773811023/dsa2_siz4l2.jpg`,`${BASE}/f_auto,q_auto/v1773811025/dsa3_xzgolb.jpg`,`${BASE}/f_auto,q_auto/v1773811028/dsa4_g04pps.webp`,`${BASE}/f_auto,q_auto/v1773811031/dsa5_wmlraz.jpg`,`${BASE}/f_auto,q_auto/v1773811033/dsa6_ex8pgz.jpg`,`${BASE}/f_auto,q_auto/v1773811036/dsa7_wcq603.webp`,`${BASE}/f_auto,q_auto/v1773811039/dsa8_x7cyw9.webp`,`${BASE}/f_auto,q_auto/v1773811041/dsa9_mc0ahn.jpg`,`${BASE}/f_auto,q_auto/v1773811044/dsa10_rldzuz.webp`,`${BASE}/f_auto,q_auto/v1773811046/dsa11_c3ublz.jpg`,`${BASE}/f_auto,q_auto/v1773811049/dsa12_xzht5s.avif`],
};

const CATEGORY_INSTRUCTOR = {
  "Marketing":       7, // Ajay Chauhan
  "Web Dev":         0, // Rohan Gupta      
  "AI / ML":         2, // Ananya Iyer      
  "Design":          1, // Priya Kulkarni   
  "Data Science":    4, // Kavita Bhosle
  "Cloud Computing": 3, // Siddharth Rao   
  "Cybersecurity":   6, // Vikas Tiwari
  "DSA":             5, // Aarav Deshmukh
};

const CATEGORY_MAP = {
  "Marketing": "Marketing", "Web Dev": "Web Development", "AI / ML": "AI / Machine Learning",
  "Design": "Design", "Data Science": "Data Science", "Cloud Computing": "Cloud Computing",
  "Cybersecurity": "Cybersecurity", "DSA": "DSA",
};

// ── Review seed data ─────────────────────────────────────────────────────────
const REVIEW_TITLES = [
  "Absolutely loved this course!", "Great content, highly recommend",
  "Very well structured", "Worth every penny", "Exceeded my expectations",
  "Best course on this topic", "Clear and concise explanations",
  "Hands-on and very practical", "Amazing instructor", "Life-changing course",
  "Perfect for career growth", "Highly detailed and engaging",
];

const REVIEW_BODIES = [
  "The instructor explains everything with real-world examples. I landed a job after completing this course!",
  "Highly structured content with practical assignments. The projects helped me build a solid portfolio.",
  "Great depth of content. Some sections could use more examples but overall very satisfied with the quality.",
  "I've taken many online courses but this one stands out. The quality is absolutely top-notch and worth it.",
  "Perfect for beginners and intermediate learners alike. The pace is just right throughout the entire course.",
  "The assignments were challenging but very helpful. Learned so much in a very short amount of time.",
  "Instructor is knowledgeable and responds quickly to questions. 100% recommended to everyone out there.",
  "Very up-to-date content. Everything is relevant to what's being used in the industry today. Great value.",
  "This course completely changed how I approach problem solving. Practical, well-paced, and incredibly useful.",
  "Loved the real-world project approach. Got my first freelance client thanks to what I learned here!",
];

// ── Quiz seed data ───────────────────────────────────────────────────────────
const QUIZZES_DATA = [
  {
    category: "Web Development",
    title: "Web Development Fundamentals Quiz",
    description: "Test your knowledge of core web development concepts.",
    questions: [
      { question: "What does HTML stand for?", options: ["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Logic","None of the above"], correctAnswer: 0, explanation: "HTML stands for Hyper Text Markup Language.", points: 1 },
      { question: "Which CSS property controls the text size?", options: ["font-style","text-size","font-size","text-scale"], correctAnswer: 2, explanation: "font-size controls the size of text in CSS.", points: 1 },
      { question: "What is the correct syntax for an arrow function in JS?", options: ["function => {}","=> function(){}","const fn = () => {}","fn -> {}"], correctAnswer: 2, explanation: "Arrow functions use the syntax: const fn = () => {}", points: 1 },
      { question: "Which hook is used for side effects in React?", options: ["useState","useEffect","useRef","useContext"], correctAnswer: 1, explanation: "useEffect is used to handle side effects in React.", points: 1 },
      { question: "What does REST stand for?", options: ["Representational State Transfer","Remote Execution Service Transfer","Relational State Transport","None"], correctAnswer: 0, explanation: "REST stands for Representational State Transfer.", points: 1 },
    ],
  },
  {
    category: "Data Science",
    title: "Data Science Core Concepts Quiz",
    description: "Evaluate your understanding of data science fundamentals.",
    questions: [
      { question: "What library is used for data manipulation in Python?", options: ["NumPy","Pandas","Matplotlib","Scikit-learn"], correctAnswer: 1, explanation: "Pandas is the primary library for data manipulation.", points: 1 },
      { question: "What does EDA stand for?", options: ["Exploratory Data Analysis","Extended Data Algorithm","Evaluated Data Assessment","None"], correctAnswer: 0, explanation: "EDA = Exploratory Data Analysis.", points: 1 },
      { question: "Which of these is a supervised learning algorithm?", options: ["K-Means","DBSCAN","Linear Regression","PCA"], correctAnswer: 2, explanation: "Linear Regression is a supervised learning algorithm.", points: 1 },
      { question: "What is overfitting?", options: ["Model performs well on test data","Model memorizes training data and fails on new data","Model underfits the training set","None of the above"], correctAnswer: 1, explanation: "Overfitting means the model memorizes training data too well.", points: 1 },
      { question: "Which metric is used for classification problems?", options: ["RMSE","MAE","Accuracy","R-squared"], correctAnswer: 2, explanation: "Accuracy is commonly used for classification problems.", points: 1 },
    ],
  },
  {
    category: "AI / Machine Learning",
    title: "AI & Machine Learning Quiz",
    description: "Test your AI and ML knowledge.",
    questions: [
      { question: "What is a neural network?", options: ["A type of database","A set of algorithms modeled after the human brain","A cloud computing service","None"], correctAnswer: 1, explanation: "Neural networks are modeled after the human brain.", points: 1 },
      { question: "What does 'training a model' mean?", options: ["Writing code for the model","Adjusting model parameters using data","Deploying the model","Testing the model"], correctAnswer: 1, explanation: "Training means adjusting parameters to minimize loss.", points: 1 },
      { question: "What is the purpose of an activation function?", options: ["To initialize weights","To introduce non-linearity","To normalize inputs","To reduce overfitting"], correctAnswer: 1, explanation: "Activation functions introduce non-linearity into the network.", points: 1 },
      { question: "What is gradient descent?", options: ["A data preprocessing technique","An optimization algorithm","A neural network architecture","A regularization method"], correctAnswer: 1, explanation: "Gradient descent is used to minimize the loss function.", points: 1 },
      { question: "What does LLM stand for?", options: ["Large Language Model","Low Level Machine","Linear Learning Method","None"], correctAnswer: 0, explanation: "LLM stands for Large Language Model.", points: 1 },
    ],
  },
  {
    category: "Design",
    title: "UI/UX Design Principles Quiz",
    description: "Test your design knowledge.",
    questions: [
      { question: "What does UX stand for?", options: ["User Experience","Universal Exchange","Unified Extension","None"], correctAnswer: 0, explanation: "UX stands for User Experience.", points: 1 },
      { question: "What is a wireframe?", options: ["A finished design","A low-fidelity layout sketch","A color palette","A font selection"], correctAnswer: 1, explanation: "A wireframe is a low-fidelity blueprint of a design.", points: 1 },
      { question: "Which principle ensures enough contrast between text and background?", options: ["Proximity","Alignment","Accessibility","Repetition"], correctAnswer: 2, explanation: "Accessibility ensures readable contrast ratios.", points: 1 },
      { question: "What tool is most popular for UI design?", options: ["Photoshop","Figma","Illustrator","Canva"], correctAnswer: 1, explanation: "Figma is the industry standard for UI/UX design.", points: 1 },
      { question: "What is a design system?", options: ["A collection of reusable components and guidelines","A project management tool","A CSS framework","None"], correctAnswer: 0, explanation: "A design system is a collection of reusable components.", points: 1 },
    ],
  },
  {
    category: "Cloud Computing",
    title: "Cloud Computing Essentials Quiz",
    description: "Test your cloud knowledge.",
    questions: [
      { question: "What does IaaS stand for?", options: ["Infrastructure as a Service","Internet as a Service","Integration as a Service","None"], correctAnswer: 0, explanation: "IaaS = Infrastructure as a Service.", points: 1 },
      { question: "Which is NOT a major cloud provider?", options: ["AWS","Azure","GCP","MongoDB Atlas"], correctAnswer: 3, explanation: "MongoDB Atlas is a database service, not a full cloud provider.", points: 1 },
      { question: "What is serverless computing?", options: ["Computing without internet","Running code without managing servers","A type of database","None"], correctAnswer: 1, explanation: "Serverless means you run code without managing the underlying server.", points: 1 },
      { question: "What does auto-scaling do?", options: ["Automatically backs up data","Adjusts resources based on demand","Encrypts data automatically","None"], correctAnswer: 1, explanation: "Auto-scaling adjusts compute resources based on traffic.", points: 1 },
      { question: "What is a CDN?", options: ["Content Delivery Network","Central Data Node","Cloud Database Network","None"], correctAnswer: 0, explanation: "CDN = Content Delivery Network.", points: 1 },
    ],
  },
  {
    category: "Cybersecurity",
    title: "Cybersecurity Fundamentals Quiz",
    description: "Test your security knowledge.",
    questions: [
      { question: "What is phishing?", options: ["A type of malware","A social engineering attack via fake emails","A network protocol","None"], correctAnswer: 1, explanation: "Phishing tricks users into revealing sensitive info via fake emails.", points: 1 },
      { question: "What does VPN stand for?", options: ["Virtual Private Network","Verified Public Node","Virtual Protocol Network","None"], correctAnswer: 0, explanation: "VPN = Virtual Private Network.", points: 1 },
      { question: "What is two-factor authentication?", options: ["Using two passwords","Verifying identity with two methods","Two-step encryption","None"], correctAnswer: 1, explanation: "2FA verifies identity using two different methods.", points: 1 },
      { question: "What is a firewall?", options: ["A physical server","A network security system that monitors traffic","An antivirus software","None"], correctAnswer: 1, explanation: "A firewall monitors and controls incoming/outgoing network traffic.", points: 1 },
      { question: "What is encryption?", options: ["Deleting sensitive data","Converting data into an unreadable format","Compressing files","None"], correctAnswer: 1, explanation: "Encryption converts data into an unreadable format to protect it.", points: 1 },
    ],
  },
  {
    category: "Marketing",
    title: "Digital Marketing Quiz",
    description: "Test your marketing fundamentals.",
    questions: [
      { question: "What does SEO stand for?", options: ["Search Engine Optimization","Social Engagement Outreach","Sales and Export Operations","None"], correctAnswer: 0, explanation: "SEO = Search Engine Optimization.", points: 1 },
      { question: "What is a CTA?", options: ["Click-Through Analytics","Call To Action","Content Target Audience","None"], correctAnswer: 1, explanation: "CTA = Call To Action — a prompt urging users to act.", points: 1 },
      { question: "What is A/B testing?", options: ["Comparing two versions to see which performs better","Testing two products","Running two ad campaigns simultaneously","None"], correctAnswer: 0, explanation: "A/B testing compares two variants to optimize performance.", points: 1 },
      { question: "What is ROI?", options: ["Return on Investment","Rate of Impressions","Reach of Influence","None"], correctAnswer: 0, explanation: "ROI = Return on Investment.", points: 1 },
      { question: "Which platform is best for B2B marketing?", options: ["Instagram","TikTok","LinkedIn","Snapchat"], correctAnswer: 2, explanation: "LinkedIn is the top platform for B2B marketing.", points: 1 },
    ],
  },
  {
    category: "DSA",
    title: "Data Structures & Algorithms Quiz",
    description: "Test your DSA fundamentals.",
    questions: [
      { question: "What is the time complexity of binary search?", options: ["O(n)","O(n²)","O(log n)","O(1)"], correctAnswer: 2, explanation: "Binary search runs in O(log n) time.", points: 1 },
      { question: "Which data structure uses LIFO?", options: ["Queue","Stack","Linked List","Tree"], correctAnswer: 1, explanation: "Stack uses Last In First Out (LIFO).", points: 1 },
      { question: "What is a hash map used for?", options: ["Sorting data","Fast key-value lookups","Traversing graphs","None"], correctAnswer: 1, explanation: "Hash maps provide O(1) average-case key-value lookups.", points: 1 },
      { question: "What is the worst-case complexity of quicksort?", options: ["O(n log n)","O(n)","O(n²)","O(log n)"], correctAnswer: 2, explanation: "Quicksort degrades to O(n²) in the worst case.", points: 1 },
      { question: "What is a binary tree?", options: ["A tree with exactly two nodes","A tree where each node has at most two children","A sorted array","None"], correctAnswer: 1, explanation: "In a binary tree, each node has at most two children.", points: 1 },
    ],
  },
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
};

// ════════════════════════════════════════════════════════════════════════════
const seed = async () => {
  await connectDB();

  // ── Clear all collections ─────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    Review.deleteMany({}),
    Certificate.deleteMany({}),
    Quiz.deleteMany({}),
    LearningPath.deleteMany({}),
  ]);
  console.log("🗑️  All collections cleared");

  const hashedPw = await bcrypt.hash("password123", 12);

  // ── 1. Admin ──────────────────────────────────────────────────────────────
  const [admin] = await User.insertMany([{
    name: "Admin", email: "admin@learnflow.com",
    password: hashedPw, role: "admin", isVerified: true,
  }]);
  console.log("✅ Admin seeded       →  admin@learnflow.com / password123");

  // NEW  — index order must match CATEGORY_INSTRUCTOR above
const instructors = await User.insertMany([
  // index 0 — male
  { name: "Rohan Gupta",     email: "rohan.gupta@learnflow.com",     password: hashedPw, role: "instructor", isVerified: true },
  // index 1 — female
  { name: "Priya Kulkarni",  email: "priya.kulkarni@learnflow.com",  password: hashedPw, role: "instructor", isVerified: true },
  // index 2 — female
  { name: "Ananya Iyer",     email: "ananya.iyer@learnflow.com",     password: hashedPw, role: "instructor", isVerified: true },
  // index 3 — male
  { name: "Siddharth Rao",   email: "siddharth.rao@learnflow.com",   password: hashedPw, role: "instructor", isVerified: true },
  // index 4 — female
  { name: "Kavita Bhosle",   email: "kavita.bhosle@learnflow.com",   password: hashedPw, role: "instructor", isVerified: true },
  // index 5 — male
  { name: "Aarav Deshmukh",  email: "aarav.deshmukh@learnflow.com",  password: hashedPw, role: "instructor", isVerified: true },
  // index 6 — male
  { name: "Vikas Tiwari",    email: "vikas.tiwari@learnflow.com",    password: hashedPw, role: "instructor", isVerified: true },
  // index 7 — male
  { name: "Ajay Chauhan",    email: "ajay.chauhan@learnflow.com",    password: hashedPw, role: "instructor", isVerified: true }
]);
console.log(`✅ Instructors seeded  →  ${instructors.length} instructors`);

  // ── 3. Demo student ───────────────────────────────────────────────────────
  const [demoStudent] = await User.insertMany([{
    name: "Demo Student", email: "student@learnflow.com",
    password: hashedPw, role: "student", isVerified: true,
  }]);
  console.log("✅ Demo student seeded →  student@learnflow.com / password123");

  // ── 4. Extra students (for realistic reviews) ─────────────────────────────
  const extraStudents = await User.insertMany([
    { name: "Arjun Mehta",    email: "arjun@demo.com",   password: hashedPw, role: "student", isVerified: true },
    { name: "Sneha Patil",    email: "sneha@demo.com",   password: hashedPw, role: "student", isVerified: true },
    { name: "Vikram Singh",   email: "vikram@demo.com",  password: hashedPw, role: "student", isVerified: true },
    { name: "Meera Iyer",     email: "meera@demo.com",   password: hashedPw, role: "student", isVerified: true },
    { name: "Karan Patel",    email: "karan@demo.com",   password: hashedPw, role: "student", isVerified: true },
    { name: "Ananya Sharma",  email: "ananya@demo.com",  password: hashedPw, role: "student", isVerified: true },
    { name: "Rohan Desai",    email: "rohan@demo.com",   password: hashedPw, role: "student", isVerified: true },
    { name: "Pooja Kulkarni", email: "pooja@demo.com",   password: hashedPw, role: "student", isVerified: true },
  ]);
  const allStudents = [demoStudent, ...extraStudents];
  console.log(`✅ Students seeded     →  ${allStudents.length} students total`);

  // ── 5. 96 Courses ─────────────────────────────────────────────────────────
  const coursesToInsert = [];
  Object.keys(COURSE_TITLES).forEach((key) => {
    const dbCategory = CATEGORY_MAP[key];
    COURSE_TITLES[key].forEach((title, index) => {
      const isFree = (index + 1) % 4 === 0;
      const isFeatured = index === 0 || index === 3 || index === 4 || index === 8;
      coursesToInsert.push({
        title,
        subtitle:    `Master ${dbCategory} with professional-grade curriculum.`,
        description: `This ${dbCategory} course includes deep-dive modules, real-world projects, and lifetime access.`,
        instructor: title === "Data Science Bootcamp 2026"
        ? instructors[7]._id   
        : title === "Adobe Illustrator Masterclass"
        ? instructors[5]._id   
        : instructors[CATEGORY_INSTRUCTOR[key]]._id,
        thumbnail:   COURSE_IMAGES[key][index],
        category:    dbCategory,
        difficulty:  index < 4 ? "Beginner" : index < 8 ? "Intermediate" : "Advanced",
        price:       isFree ? 0 : 1999 + (index * 250),
        isFree,
        isPublished: true,
        isFeatured,
        enrollmentCount: Math.floor(Math.random() * 1500) + 50,
        averageRating:   0,   // will be updated from real reviews below
        totalReviews:    0,   // will be updated from real reviews below
        sections: [
          { title: "Introduction", order: 1, lessons: [{ title: "Welcome", duration: 10, order: 1, isPreview: true }] },
        ],
      });
    });
  });
  await Course.insertMany(coursesToInsert);
  console.log(`✅ Courses seeded      →  ${coursesToInsert.length} courses across 8 categories`);

  // ── 6. Certifications (stored as Course docs with isCertification:true) ──
  const certsToInsert = CERTIFICATIONS_DATA.map((cert, index) => ({
    _id:             new mongoose.Types.ObjectId(cert._id),
    title:           cert.title,
    subtitle:        `Professional ${cert.category} Certification Program`,
    description:     `Professional certification in ${cert.category}. Earn an industry-recognised credential.`,
    thumbnail:       COURSE_IMAGES[Object.keys(CATEGORY_MAP).find(k => CATEGORY_MAP[k] === cert.category) || "Web Dev"][0],
    category:        cert.category,
    price:           cert.price,
    isFree:          false,
    emoji:           cert.emoji,
    tag:             cert.tag,
    isCertification: true,
    isPublished:     true,
    isFeatured:      true,
    instructor:      instructors[index % instructors.length]._id,
    difficulty:      "Intermediate",
    enrollmentCount: Math.floor(Math.random() * 800) + 100,
    sections: [
      { title: "Introduction", order: 1, lessons: [{ title: "Welcome", duration: 10, order: 1, isPreview: true }] },
    ],
  }));

  try {
    await Course.insertMany(certsToInsert, { ordered: false });
    console.log(`✅ Certifications      →  ${certsToInsert.length} certification programs seeded as Courses`);
  } catch (err) {
    console.warn("⚠️  Certification seed partial:", err.message.substring(0, 120));
  }

  // ── 7. Demo enrollments ───────────────────────────────────────────────────
  const demoEnrollments = CERTIFICATIONS_DATA.slice(0, 2).map(cert => ({
    student:     demoStudent._id,
    course:      new mongoose.Types.ObjectId(cert._id),
    courseModel: "Course",
    certData: {
      title:       cert.title,
      thumbnail:   certsToInsert.find(c => c._id.toString() === cert._id)?.thumbnail || "",
      emoji:       cert.emoji,
      tag:         cert.tag,
      description: `Professional certification in ${cert.category}.`,
    },
    status:     "enrolled",
    amount:     cert.price,
    type:       "paid",
    progress:   Math.floor(Math.random() * 60),
    enrolledAt: new Date(),
  }));

  try {
    await Enrollment.insertMany(demoEnrollments);
    console.log(`✅ Enrollments         →  ${demoEnrollments.length} demo enrollments seeded`);
  } catch (err) {
    console.warn("⚠️  Demo enrollment seed partial:", err.message.substring(0, 120));
  }

  // ── 8. Reviews ────────────────────────────────────────────────────────────
  const allCourses     = await Course.find({});
  const reviewsToInsert = [];

  allCourses.forEach((course, ci) => {
    const numReviews = 3 + (ci % 5); // 3–7 reviews per course
    const usedStudents = new Set();
    for (let i = 0; i < numReviews; i++) {
      const student = allStudents[(ci + i) % allStudents.length];
      if (usedStudents.has(student._id.toString())) continue;
      usedStudents.add(student._id.toString());
      // Weight ratings realistically: mostly 4–5 stars
      const rating = Math.random() > 0.15 ? 5 : 4;
      reviewsToInsert.push({
        course:     course._id,
        student:    student._id,
        rating,
        title:      REVIEW_TITLES[(ci + i) % REVIEW_TITLES.length],
        body:       REVIEW_BODIES[(ci + i) % REVIEW_BODIES.length],
        helpful:    Math.floor(Math.random() * 50),
        isVerified: true,
      });
    }
  });

  await Review.insertMany(reviewsToInsert);
  console.log(`✅ Reviews seeded      →  ${reviewsToInsert.length} reviews across ${allCourses.length} courses`);

  // Recalculate real averageRating & totalReviews on every course
  const ratingStats = await Review.aggregate([
    { $group: { _id: "$course", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Promise.all(
    ratingStats.map(stat =>
      Course.findByIdAndUpdate(stat._id, {
        averageRating: Math.round(stat.avg * 10) / 10,
        totalReviews:  stat.count,
      })
    )
  );
  console.log("✅ Course ratings      →  recalculated from real reviews");

  // ── 9. Quizzes (one per category) ─────────────────────────────────────────
  const quizzesToInsert = await Promise.all(
    QUIZZES_DATA.map(async (q) => {
      const course = await Course.findOne({ category: q.category });
      return {
        course:       course._id,
        title:        q.title,
        description:  q.description,
        questions:    q.questions,
        timeLimit:    30,
        passingScore: 70,
        isActive:     true,
      };
    })
  );
  await Quiz.insertMany(quizzesToInsert);
  console.log(`✅ Quizzes seeded      →  ${quizzesToInsert.length} quizzes (1 per category)`);

  // ── 10. Learning Paths ────────────────────────────────────────────────────
  const [webDevCourses, dsCourses, aiCourses, designCourses,
         cloudCourses, cybCourses, marketingCourses, dsaCourses] = await Promise.all([
    Course.find({ category: "Web Development"  }).limit(4),
    Course.find({ category: "Data Science"     }).limit(4),
    Course.find({ category: "AI / Machine Learning"          }).limit(4),
    Course.find({ category: "Design"           }).limit(4),
    Course.find({ category: "Cloud Computing"  }).limit(4),
    Course.find({ category: "Cybersecurity"    }).limit(4),
    Course.find({ category: "Marketing"        }).limit(4),
    Course.find({ category: "DSA"              }).limit(4),
  ]);

  const learningPaths = [
    {
      title: "Become a Full Stack Developer",
      description: "Master frontend, backend, and databases to build complete web applications from scratch.",
      icon: "🧑‍💻", thumbnail: COURSE_IMAGES["Web Dev"][0],
      courses: webDevCourses.map(c => c._id), duration: "4-6 months", difficulty: "Intermediate",
      enrollCount: 3200, tags: ["React","Node.js","MongoDB","JavaScript"],
      outcomes: ["Build full-stack apps","REST API design","Deploy to cloud","Get hired as a developer"],
    },
    {
      title: "Data Science Career Path",
      description: "Go from zero to data scientist with Python, statistics, and machine learning.",
      icon: "📊", thumbnail: COURSE_IMAGES["Data Science"][0],
      courses: dsCourses.map(c => c._id), duration: "5-7 months", difficulty: "Intermediate",
      enrollCount: 2800, tags: ["Python","Pandas","SQL","Statistics"],
      outcomes: ["Analyze large datasets","Build ML models","Data visualization","Business insights"],
    },
    {
      title: "AI & Machine Learning Mastery",
      description: "Deep dive into AI, deep learning, and LLMs to build intelligent applications.",
      icon: "🤖", thumbnail: COURSE_IMAGES["AI / ML"][0],
      courses: aiCourses.map(c => c._id), duration: "6-8 months", difficulty: "Advanced",
      enrollCount: 2100, tags: ["PyTorch","TensorFlow","NLP","LLMs"],
      outcomes: ["Build neural networks","Train LLMs","Deploy AI models","Computer vision"],
    },
    {
      title: "UI/UX Design Professional",
      description: "Learn design thinking, Figma, and build stunning interfaces users love.",
      icon: "🎨", thumbnail: COURSE_IMAGES["Design"][0],
      courses: designCourses.map(c => c._id), duration: "3-4 months", difficulty: "Beginner",
      enrollCount: 1900, tags: ["Figma","Wireframing","Prototyping","Design Systems"],
      outcomes: ["Design mobile apps","Create design systems","User research","Build portfolio"],
    },
    {
      title: "Cloud & DevOps Engineer",
      description: "Master AWS, Docker, Kubernetes, and CI/CD pipelines for modern infrastructure.",
      icon: "☁️", thumbnail: COURSE_IMAGES["Cloud Computing"][0],
      courses: cloudCourses.map(c => c._id), duration: "5-6 months", difficulty: "Advanced",
      enrollCount: 1700, tags: ["AWS","Docker","Kubernetes","Terraform"],
      outcomes: ["Deploy scalable apps","Automate infrastructure","CI/CD pipelines","Cloud certifications"],
    },
    {
      title: "Cybersecurity Analyst",
      description: "Learn ethical hacking, penetration testing, and how to defend against cyber threats.",
      icon: "🔐", thumbnail: COURSE_IMAGES["Cybersecurity"][0],
      courses: cybCourses.map(c => c._id), duration: "4-5 months", difficulty: "Intermediate",
      enrollCount: 1500, tags: ["Kali Linux","Pen Testing","Network Security","Firewalls"],
      outcomes: ["Ethical hacking","Incident response","Security audits","CISSP prep"],
    },
    {
      title: "Digital Marketing Expert",
      description: "Master SEO, social media, paid ads, and growth hacking to drive real results.",
      icon: "📈", thumbnail: COURSE_IMAGES["Marketing"][0],
      courses: marketingCourses.map(c => c._id), duration: "2-3 months", difficulty: "Beginner",
      enrollCount: 2400, tags: ["SEO","Google Ads","Social Media","Analytics"],
      outcomes: ["Run ad campaigns","Grow organic traffic","Email marketing","Brand strategy"],
    },
    {
      title: "DSA for Interview Mastery",
      description: "Crack top tech interviews with strong data structures and algorithm fundamentals.",
      icon: "💡", thumbnail: COURSE_IMAGES["DSA"][0],
      courses: dsaCourses.map(c => c._id), duration: "3-5 months", difficulty: "Advanced",
      enrollCount: 3800, tags: ["Arrays","Trees","Dynamic Programming","System Design"],
      outcomes: ["Solve LeetCode problems","System design","Crack FAANG interviews","Big O mastery"],
    },
  ];

  await LearningPath.insertMany(learningPaths);
  console.log(`✅ Learning paths      →  ${learningPaths.length} paths seeded`);

  // ── Done ──────────────────────────────────────────────────────────────────
  await mongoose.disconnect();
  console.log(`
╔══════════════════════════════════════════════════════╗
║           🎉  Learnflow Seed Complete!               ║
╠══════════════════════════════════════════════════════╣
║  👤  admin@learnflow.com     / password123           ║
║  🎓  student@learnflow.com   / password123           ║
║  👨‍🏫  rahul@learnflow.com     / password123           ║
╠══════════════════════════════════════════════════════╣
║  📚  96 Courses   |  6 Certifications                ║
║  ⭐  Reviews      |  🧩 8 Quizzes                    ║
║  🗺️   8 Learning Paths seeded                        ║
╚══════════════════════════════════════════════════════╝
`);
  process.exit(0);
};

seed().catch(err => { console.error("❌ Seed failed:", err); process.exit(1); });