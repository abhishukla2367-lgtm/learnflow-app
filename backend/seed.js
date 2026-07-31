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

// ── Exactly 4 courses per category ──────────────────────────────────────────
// Index: 0 = Beginner (Free/Trial), 1 = Intermediate, 2 = Advanced, 3 = Beginner
const COURSE_TITLES = {
  "Marketing":       ["Marketing Masterclass: Beginner Level",      "Digital Advertising & PPC Strategy",  "Social Media ROI & Analytics",       "Content Marketing for Brand Growth"],
  "Web Dev":         ["Modern React with Redux Toolkit",            "Full-Stack Web Development Boot Camp", "Advanced CSS & Sass Frameworks",      "JavaScript: The Hard Parts & Deep Dive"],
  "AI / ML":         ["Machine Learning with Python",               "Deep Learning Specialization",         "Generative AI & LLM Engineering",    "Natural Language Processing (NLP)"],
  "Design":          ["UI/UX Design Essentials",                    "Graphic Design Theory",        "Figma for Professional Designers",    "Motion Graphics with After Effects"],
  "Data Science":    ["Probability for Data Science",                 "Python for Data Analysis",             "Statistical Data Modeling",           "Data Mining & Exploration"],
  "Cloud Computing": ["AWS Solutions Architect Pro",                "Google Cloud Platform (GCP) Fundamentals", "Cloud Security & Compliance",     "Serverless Architecture with AWS Lambda"]
};

// ── Difficulty by index (0=Beginner/Free, 1=Intermediate, 2=Advanced, 3=Beginner) ──
const DIFFICULTY_MAP = ["Beginner", "Intermediate", "Advanced", "Beginner"];

const BASE = "https://res.cloudinary.com/db2vju4mv/image/upload";
// ── 4 images per category (index-matched with COURSE_TITLES) ────────────────
const COURSE_IMAGES = {
  "Marketing":       [
    `${BASE}/f_auto,q_auto/v1773810616/marketing2_ebwk0l.webp`,    // Marketing Masterclass: Beginner Level (Beginner Lvl 2 on left)
    `${BASE}/f_auto,q_auto/v1773810617/marketing5_yfvvli.jpg`,     // Digital Advertising & PPC Strategy    (index 4 on left)
    `${BASE}/f_auto,q_auto/v1773810618/marketing6_yr9m9k.jpg`,     // Social Media ROI & Analytics          (index 5 on left)
    `${BASE}/f_auto,q_auto/v1773810619/marketing7_zrrfq6.jpg`      // Content Marketing for Brand Growth     (index 6 on left)
  ],
  "Web Dev":         [
    `${BASE}/f_auto,q_auto/v1773810687/webdev1_pw7byo.jpg`,        // Modern React with Redux Toolkit        (index 0 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810688/webdev2_xb0ao3.webp`,       // Full-Stack Web Development Boot Camp   (index 1 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810690/webdev4_kxfa09.jpg`,        // Advanced CSS & Sass Frameworks         (index 3 on left, skips Node.js)
    `${BASE}/f_auto,q_auto/v1773810690/webdev5_ibfblx.jpg`         // JavaScript: The Hard Parts & Deep Dive (index 4 on left)
  ],
  "AI / ML":         [
    `${BASE}/f_auto,q_auto/v1773810725/ai-ml1_ridnur.webp`,      
    `${BASE}/f_auto,q_auto/v1773810726/ai-ml2_boj6t3.jpg`,         
    `${BASE}/f_auto,q_auto/v1773810727/ai-ml3_eucoyw.jpg`,       
    `${BASE}/f_auto,q_auto/v1773810728/ai-ml4_gsxssw.webp`         // Natural Language Processing (NLP)      (index 3 on left) ✓
  ],
  "Design":          [
    `${BASE}/f_auto,q_auto/v1773810790/design1_zqejk3.webp`,       // UI/UX Design Essentials                (index 0 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810793/design3._uzmeqd.png`,       // Adobe Illustrator Masterclass          (index 1 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810794/design4_vt1hga.jpg`,        // Figma for Professional Designers       (index 3 on left, skips Graphic Design Theory)
    `${BASE}/f_auto,q_auto/v1773810795/design5_c55hx3.jpg`         // Motion Graphics with After Effects     (index 4 on left)
  ],
  "Data Science":    [
    `${BASE}/f_auto,q_auto/v1773810846/data-science6_vukp9k.jpg`,  // Data Science Bootcamp 2026             (index 0 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810840/data-science2_olkpz5.jpg`,  // Python for Data Analysis               (index 1 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810841/data-science3_jr2wad.png`,  // Statistical Data Modeling              (index 2 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810843/data-science4_hvmblg.jpg`   // Data Mining & Exploration              (index 3 on left) ✓
  ],
  "Cloud Computing": [
    `${BASE}/f_auto,q_auto/v1773810876/cloud-computing1_dvsoi4.png`, // AWS Solutions Architect Pro           (index 0 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810876/cloud-computing2_n3ffat.jpg`, // Google Cloud Platform (GCP) Fundamentals (index 1 on left) ✓
    `${BASE}/f_auto,q_auto/v1773810879/cloud-computing4_w39otu.jpg`, // Cloud Security & Compliance           (index 3 on left, skips Azure)
    `${BASE}/f_auto,q_auto/v1773810881/cloud-computing5_rsaoun.jpg`  // Serverless Architecture with AWS Lambda (index 4 on left)
  ]
};

const CATEGORY_INSTRUCTOR = {
  "Marketing":       5, // Ajay Chauhan
  "Web Dev":         0, // Rohan Gupta
  "AI / ML":         2, // Ananya Iyer
  "Design":          1, // Priya Kulkarni
  "Data Science":    4, // Kavita Bhosle
  "Cloud Computing": 3, // Siddharth Rao
};

const CATEGORY_MAP = {
  "Marketing":       "Marketing",
  "Web Dev":         "Web Development",
  "AI / ML":         "AI / Machine Learning",
  "Design":          "Design",
  "Data Science":    "Data Science",
  "Cloud Computing": "Cloud Computing",
};

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
  ]);
  console.log("🗑️  All collections cleared");

  const hashedPw = await bcrypt.hash("password123", 12);

  // ── 1. Admin ──────────────────────────────────────────────────────────────
  const [admin] = await User.insertMany([{
    name: "Admin", email: "admin@Learnodays.com",
    password: hashedPw, role: "admin", isVerified: true,
  }]);
  console.log("✅ Admin seeded       →  admin@Learnodays.com / password123");

  // ── 2. Instructors — index order must match CATEGORY_INSTRUCTOR above ─────
  const instructors = await User.insertMany([
    { name: "Rohan Gupta",    email: "rohan.gupta@Learnodays.com",    password: hashedPw, role: "instructor", isVerified: true }, 
    { name: "Priya Kulkarni", email: "priya.kulkarni@Learnodays.com", password: hashedPw, role: "instructor", isVerified: true }, 
    { name: "Ananya Iyer",    email: "ananya.iyer@Learnodays.com",    password: hashedPw, role: "instructor", isVerified: true }, 
    { name: "Siddharth Rao",  email: "siddharth.rao@Learnodays.com",  password: hashedPw, role: "instructor", isVerified: true }, 
    { name: "Kavita Bhosle",  email: "kavita.bhosle@Learnodays.com",  password: hashedPw, role: "instructor", isVerified: true }, 
    { name: "Ajay Chauhan",   email: "ajay.chauhan@Learnodays.com",   password: hashedPw, role: "instructor", isVerified: true }, 
  ]);
  console.log(`✅ Instructors seeded  →  ${instructors.length} instructors`);

  // ── 3. Demo student ───────────────────────────────────────────────────────
  const [demoStudent] = await User.insertMany([{
    name: "Demo Student", email: "student@Learnodays.com",
    password: hashedPw, role: "student", isVerified: true,
  }]);
  console.log("✅ Demo student seeded →  student@Learnodays.com / password123");

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

  // ── 5. 32 Courses (4 per category × 8 categories) ─────────────────────────
  // Index 0 → Beginner + Free (Trial)
  // Index 1 → Intermediate + Paid
  // Index 2 → Advanced + Paid
  // Index 3 → Beginner + Paid
  const coursesToInsert = [];
  Object.keys(COURSE_TITLES).forEach((key) => {
    const dbCategory = CATEGORY_MAP[key];
    COURSE_TITLES[key].forEach((title, index) => {
      const isFree       = index === 0;                      // Only index 0 is free/trial
      const isFeatured   = index === 0 || index === 2;       // Beginner & Advanced are featured
      const difficulty   = DIFFICULTY_MAP[index];
      coursesToInsert.push({
        title,
        subtitle:    `Master ${dbCategory} with professional-grade curriculum.`,
        description: `This ${dbCategory} course includes deep-dive modules, real-world projects, and lifetime access.`,
        instructor: instructors[CATEGORY_INSTRUCTOR[key]]._id,
        thumbnail:   COURSE_IMAGES[key][index],
        category:    dbCategory,
        difficulty,
        price:       isFree ? 0 : 1999 + (index * 500),
        isFree,
        isPublished: true,
        isFeatured,
        enrollmentCount: Math.floor(Math.random() * 1500) + 50,
        averageRating:   0,   // recalculated from real reviews below
        totalReviews:    0,   // recalculated from real reviews below
        sections: [
          { title: "Introduction", order: 1, lessons: [{ title: "Welcome", duration: 10, order: 1, isPreview: true }] },
        ],
      });
    });
  });
  await Course.insertMany(coursesToInsert);
  console.log(`✅ Courses seeded      →  ${coursesToInsert.length} courses across 6 categories (4 each)`);

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
  const allCourses      = await Course.find({});
  const reviewsToInsert = [];

  allCourses.forEach((course, ci) => {
    const numReviews  = 3 + (ci % 5); // 3–7 reviews per course
    const usedStudents = new Set();
    for (let i = 0; i < numReviews; i++) {
      const student = allStudents[(ci + i) % allStudents.length];
      if (usedStudents.has(student._id.toString())) continue;
      usedStudents.add(student._id.toString());
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
         cloudCourses, marketingCourses] = await Promise.all([
    Course.find({ category: "Web Development"      }).limit(4),
    Course.find({ category: "Data Science"         }).limit(4),
    Course.find({ category: "AI / Machine Learning"}).limit(4),
    Course.find({ category: "Design"               }).limit(4),
    Course.find({ category: "Cloud Computing"      }).limit(4),
    Course.find({ category: "Marketing"            }).limit(4)
  ]);

  // ── Done ──────────────────────────────────────────────────────────────────
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error("❌ Seed failed:", err); process.exit(1); });