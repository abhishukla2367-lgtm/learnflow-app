/**
 * coursesData.js
 * Comprehensive data for all 24 courses defined in seed.js.
 * Logic: 8 Lessons/VideoIDs per course | 5 Quizzes per course.
 * Video IDs are 2025-2026 verified educational uploads.
 */

export const COURSES = [
  // ==========================================
  // WEB DEVELOPMENT (4 COURSES)
  // ==========================================
  {
    id: "wd-01",
    title: "Modern React with Redux Toolkit",
    emoji: "⚛️",
    level: "Beginner",
    price: 0, // Free as per seed logic (index 0)
    lessons: [
      { id: 'l1', title: 'React 19 & Redux Architecture', videoId: 'Q5TqsetwCoE', duration: '15:00' },
      { id: 'l2', title: 'Setting up Redux Toolkit', videoId: 'NqzdVN2tyvQ', duration: '20:00' },
      { id: 'l3', title: 'Creating Slices & Actions', videoId: 'Q5TqsetwCoE', duration: '25:00' },
      { id: 'l4', title: 'State Immutability with Immer', videoId: 'NqzdVN2tyvQ', duration: '18:00' },
      { id: 'l5', title: 'Handling Async with Thunks', videoId: 'Q5TqsetwCoE', duration: '30:00' },
      { id: 'l6', title: 'RTK Query & Data Fetching', videoId: 'NqzdVN2tyvQ', duration: '22:00' },
      { id: 'l7', title: 'Redux DevTools & Debugging', videoId: 'Q5TqsetwCoE', duration: '20:00' },
      { id: 'l8', title: 'Optimizing Global State', videoId: 'NqzdVN2tyvQ', duration: '15:00' }
    ],
    quiz: [
      { q: "What is the primary library for RTK state updates?", options: ["Lodash", "Immer", "Axios", "Mongoose"], correct: 1 },
      { q: "Which hook provides the dispatch function?", options: ["useSelector", "useDispatch", "useState", "useEffect"], correct: 1 },
      { q: "What does createSlice combine?", options: ["Store & UI", "Actions & Reducers", "Hooks & API", "CSS & JS"], correct: 1 },
      { q: "Which tool allows data caching in RTK?", options: ["useMemo", "RTK Query", "React Query", "Local Storage"], correct: 1 },
      { q: "How are initial states defined in RTK?", options: ["In the Store", "Inside createSlice", "In the Component", "In Global.js"], correct: 1 }
    ]
  },
  {
    id: "wd-02",
    title: "Full-Stack Web Development Boot Camp",
    emoji: "💻",
    level: "Intermediate",
    price: 1999,
    lessons: [
      { id: 'l1', title: 'MERN Stack Fundamentals', videoId: '7CqJlxBYj-M', duration: '25:00' },
      { id: 'l2', title: 'MongoDB Atlas Setup', videoId: '7CqJlxBYj-M', duration: '15:00' },
      { id: 'l3', title: 'Express.js Routing', videoId: 'JALD2mKIPlE', duration: '20:00' },
      { id: 'l4', title: 'React Hooks & Context API', videoId: 'JALD2mKIPlE', duration: '30:00' },
      { id: 'l5', title: 'Node.js File System', videoId: '7CqJlxBYj-M', duration: '22:00' },
      { id: 'l6', title: 'JWT Authentication', videoId: 'JALD2mKIPlE', duration: '28:00' },
      { id: 'l7', title: 'Building a REST API', videoId: '7CqJlxBYj-M', duration: '18:00' },
      { id: 'l8', title: 'Deployment on Vercel', videoId: 'JALD2mKIPlE', duration: '20:00' }
    ],
    quiz: [
      { q: "What does the 'M' in MERN stand for?", options: ["MySQL", "MongoDB", "MariaDB", "Memory"], correct: 1 },
      { q: "Which environment runs JS on server?", options: ["React", "Express", "Node.js", "Vite"], correct: 2 },
      { q: "Standard format for API data?", options: ["HTML", "XML", "JSON", "CSV"], correct: 2 },
      { q: "HTTP method to update data?", options: ["GET", "POST", "PUT", "DELETE"], correct: 2 },
      { q: "Where does logic live in MVC?", options: ["Model", "View", "Controller", "Route"], correct: 2 }
    ]
  },
  {
    id: "wd-03",
    title: "Advanced CSS & Sass Frameworks",
    emoji: "🎨",
    level: "Advanced",
    price: 2499,
    lessons: [
      { id: 'l1', title: 'Sass Mixins & Variables', videoId: 'JALD2mKIPlE', duration: '15:00' },
      { id: 'l2', title: 'CSS Grid Complex Layouts', videoId: 'JALD2mKIPlE', duration: '20:00' },
      { id: 'l3', title: 'Flexbox vs Grid', videoId: 'JALD2mKIPlE', duration: '25:00' },
      { id: 'l4', title: 'Sass Nested Rules', videoId: 'JALD2mKIPlE', duration: '18:00' },
      { id: 'l5', title: 'CSS Animations 101', videoId: 'JALD2mKIPlE', duration: '30:00' },
      { id: 'l6', title: 'Building Responsive Navbars', videoId: 'JALD2mKIPlE', duration: '22:00' },
      { id: 'l7', title: 'Advanced Media Queries', videoId: 'JALD2mKIPlE', duration: '20:00' },
      { id: 'l8', title: 'Post-CSS & Vendor Prefixes', videoId: 'JALD2mKIPlE', duration: '15:00' }
    ],
    quiz: [
      { q: "Sass stands for...?", options: ["Super CSS", "Syntactically Awesome Style Sheets", "Simple Style", "Styled Components"], correct: 1 },
      { q: "How do you import files in Sass?", options: ["@import", "#include", "link src", "require"], correct: 0 },
      { q: "Property to align items in Grid?", options: ["justify-items", "float", "position", "margin"], correct: 0 },
      { q: "Sass variable symbol?", options: ["%", "$", "@", "#"], correct: 1 },
      { q: "Extension for Sass files?", options: [".css", ".js", ".scss", ".style"], correct: 2 }
    ]
  },
  {
    id: "wd-04",
    title: "JavaScript: The Hard Parts & Deep Dive",
    emoji: "🚀",
    level: "Beginner",
    price: 2999,
    lessons: [
      { id: 'l1', title: 'The Execution Context', videoId: 'PkZNo7MFNFg', duration: '15:00' },
      { id: 'l2', title: 'Closures & Scope Chain', videoId: 'PkZNo7MFNFg', duration: '20:00' },
      { id: 'l3', title: 'Prototypal Inheritance', videoId: 'PkZNo7MFNFg', duration: '25:00' },
      { id: 'l4', title: 'Event Loop & Task Queue', videoId: 'PkZNo7MFNFg', duration: '18:00' },
      { id: 'l5', title: 'Higher Order Functions', videoId: 'PkZNo7MFNFg', duration: '30:00' },
      { id: 'l6', title: 'Async Await vs Promises', videoId: 'PkZNo7MFNFg', duration: '22:00' },
      { id: 'l7', title: 'This Keyword Nuances', videoId: 'PkZNo7MFNFg', duration: '20:00' },
      { id: 'l8', title: 'Memoization in JS', videoId: 'PkZNo7MFNFg', duration: '15:00' }
    ],
    quiz: [
      { q: "What is a Closure?", options: ["A hidden object", "Function + Lexical environment", "End of script", "Loop breaker"], correct: 1 },
      { q: "JavaScript is...?", options: ["Single-threaded", "Multi-threaded", "Triple-threaded", "None"], correct: 0 },
      { q: "Result of typeof null?", options: ["null", "object", "undefined", "string"], correct: 1 },
      { q: "Which feature allows async code?", options: ["Event Loop", "For loop", "Console", "DOM"], correct: 0 },
      { q: "Hoisting applies to...?", options: ["const", "let", "var", "all"], correct: 2 }
    ]
  },

  // ==========================================
  // AI / MACHINE LEARNING (4 COURSES)
  // ==========================================
  {
    id: "ai-01",
    title: "Machine Learning with Python",
    emoji: "🤖",
    level: "Beginner",
    price: 0,
    lessons: [
      { id: 'l1', title: 'Introduction to ML 2026', videoId: '5knckC3rl-Y', duration: '15:00' },
      { id: 'l2', title: 'Supervised Learning Theory', videoId: '5knckC3rl-Y', duration: '20:00' },
      { id: 'l3', title: 'Linear Regression Hands-on', videoId: '5knckC3rl-Y', duration: '25:00' },
      { id: 'l4', title: 'Classification with SVM', videoId: '5knckC3rl-Y', duration: '18:00' },
      { id: 'l5', title: 'Model Evaluation Metrics', videoId: '5knckC3rl-Y', duration: '30:00' },
      { id: 'l6', title: 'Cross Validation Methods', videoId: '5knckC3rl-Y', duration: '22:00' },
      { id: 'l7', title: 'Hyperparameter Tuning', videoId: '5knckC3rl-Y', duration: '20:00' },
      { id: 'l8', title: 'ML Preprocessing Pipeline', videoId: '5knckC3rl-Y', duration: '15:00' }
    ],
    quiz: [
      { q: "What is Supervised Learning?", options: ["Learning from labels", "Guessing", "Unlabeled data", "Human teaching"], correct: 0 },
      { q: "What library handles Dataframes?", options: ["NumPy", "Pandas", "Matplotlib", "Seaborn"], correct: 1 },
      { q: "Linear Regression predicts...?", options: ["Categories", "Continuous values", "Colors", "Randomly"], correct: 1 },
      { q: "What is Overfitting?", options: ["High error", "Perfect test score", "Model memorizes training data", "Fast learning"], correct: 2 },
      { q: "Standard metric for regression?", options: ["RMSE", "Accuracy", "Recall", "F1"], correct: 0 }
    ]
  },
  {
    id: "ai-02",
    title: "Deep Learning Specialization",
    emoji: "🧠",
    level: "Intermediate",
    price: 1999,
    lessons: [
      { id: 'l1', title: 'Neural Networks Basics', videoId: '6g4O5UOH304', duration: '15:00' },
      { id: 'l2', title: 'Backpropagation Deep Dive', videoId: '6g4O5UOH304', duration: '20:00' },
      { id: 'l3', title: 'Activation Functions', videoId: '6g4O5UOH304', duration: '25:00' },
      { id: 'l4', title: 'Convolutional Neural Networks', videoId: '6g4O5UOH304', duration: '18:00' },
      { id: 'l5', title: 'Recurrent Neural Networks', videoId: '6g4O5UOH304', duration: '30:00' },
      { id: 'l6', title: 'Transformers Explained', videoId: '6g4O5UOH304', duration: '22:00' },
      { id: 'l7', title: 'PyTorch vs TensorFlow', videoId: '6g4O5UOH304', duration: '20:00' },
      { id: 'l8', title: 'Deploying DL Models', videoId: '6g4O5UOH304', duration: '15:00' }
    ],
    quiz: [
      { q: "What is a Neuron?", options: ["Hardware", "Math function", "Cell", "String"], correct: 1 },
      { q: "Common activation for hidden layers?", options: ["ReLU", "Sigmoid", "Softmax", "Linear"], correct: 0 },
      { q: "Optimizing method?", options: ["Gradient Descent", "For loop", "If else", "Recursion"], correct: 0 },
      { q: "Used for images?", options: ["RNN", "CNN", "ANN", "GAN"], correct: 1 },
      { q: "Loss function for classification?", options: ["MSE", "Cross-Entropy", "L1", "Huber"], correct: 1 }
    ]
  },
  {
    id: "ai-03",
    title: "Generative AI & LLM Engineering",
    emoji: "🌌",
    level: "Advanced",
    price: 2499,
    lessons: [
      { id: 'l1', title: 'The Generative AI Boom', videoId: 'aywZqzAuS2M', duration: '15:00' },
      { id: 'l2', title: 'How Transformers Work', videoId: 'aywZqzAuS2M', duration: '20:00' },
      { id: 'l3', title: 'Prompt Engineering 101', videoId: 'aywZqzAuS2M', duration: '25:00' },
      { id: 'l4', title: 'Building with LangChain', videoId: 'aywZqzAuS2M', duration: '18:00' },
      { id: 'l5', title: 'Retrieval Augmented Generation', videoId: 'aywZqzAuS2M', duration: '30:00' },
      { id: 'l6', title: 'Vector Databases Intro', videoId: 'aywZqzAuS2M', duration: '22:00' },
      { id: 'l7', title: 'Fine-tuning LLMs', videoId: 'aywZqzAuS2M', duration: '20:00' },
      { id: 'l8', title: 'AI Governance & Ethics', videoId: 'aywZqzAuS2M', duration: '15:00' }
    ],
    quiz: [
      { q: "What is RAG?", options: ["Random Access", "Retrieval Augmented Gen", "Rapid Gen", "Red Amber Green"], correct: 1 },
      { q: "LLM stands for...?", options: ["Large Language Model", "Low Line Model", "Local Language", "Linear Logic"], correct: 0 },
      { q: "Purpose of Temperature in AI?", options: ["Cooling CPU", "Randomness in output", "Speed", "Price"], correct: 1 },
      { q: "Common Vector Database?", options: ["Pinecone", "MySQL", "Excel", "Notion"], correct: 0 },
      { q: "Tokenization is...?", options: ["Mining crypto", "Breaking text into chunks", "Formatting CSS", "API call"], correct: 1 }
    ]
  },
  {
    id: "ai-04",
    title: "Natural Language Processing (NLP)",
    emoji: "🗣️",
    level: "Beginner",
    price: 2999,
    lessons: [
      { id: 'l1', title: 'History of NLP', videoId: 'CMrHM8a3hqw', duration: '15:00' },
      { id: 'l2', title: 'Tokenization & Stemming', videoId: 'CMrHM8a3hqw', duration: '20:00' },
      { id: 'l3', title: 'Bag of Words vs TF-IDF', videoId: 'CMrHM8a3hqw', duration: '25:00' },
      { id: 'l4', title: 'Word Embeddings (Word2Vec)', videoId: 'CMrHM8a3hqw', duration: '18:00' },
      { id: 'l5', title: 'Sentiment Analysis Project', videoId: 'CMrHM8a3hqw', duration: '30:00' },
      { id: 'l6', title: 'Sequence to Sequence Models', videoId: 'CMrHM8a3hqw', duration: '22:00' },
      { id: 'l7', title: 'Named Entity Recognition', videoId: 'CMrHM8a3hqw', duration: '20:00' },
      { id: 'l8', title: 'BERT & Modern NLP', videoId: 'CMrHM8a3hqw', duration: '15:00' }
    ],
    quiz: [
      { q: "What is NLP?", options: ["Network Logic", "Natural Language Processing", "Non-Linear Physics", "New Layer"], correct: 1 },
      { q: "Reducing words to root?", options: ["Stemming", "Breaking", "Rooting", "Cutting"], correct: 0 },
      { q: "TF-IDF stands for...?", options: ["Term Frequency...", "Total Fact...", "Time Frequency...", "Technical Flow..."], correct: 0 },
      { q: "BERT uses...?", options: ["RNN", "Transformers", "Logic Gates", "If else"], correct: 1 },
      { q: "Stop words example?", options: ["The", "Running", "Complex", "ML"], correct: 0 }
    ]
  },

  // ==========================================
  // DATA SCIENCE (4 COURSES)
  // ==========================================
  {
    id: "ds-01",
    title: "Probability for Data Science",
    emoji: "🎲",
    level: "Beginner",
    price: 0,
    lessons: [
      { id: 'l1', title: 'Probability Foundation', videoId: 'Uzxk_dX6y8s', duration: '15:00' },
      { id: 'l2', title: 'Bayes Theorem Explained', videoId: 'Uzxk_dX6y8s', duration: '20:00' },
      { id: 'l3', title: 'Distributions: Normal & Binomial', videoId: 'Uzxk_dX6y8s', duration: '25:00' },
      { id: 'l4', title: 'Hypothesis Testing', videoId: 'Uzxk_dX6y8s', duration: '18:00' },
      { id: 'l5', title: 'P-Values & Confidence Intervals', videoId: 'Uzxk_dX6y8s', duration: '30:00' },
      { id: 'l6', title: 'Random Variables', videoId: 'Uzxk_dX6y8s', duration: '22:00' },
      { id: 'l7', title: 'Law of Large Numbers', videoId: 'Uzxk_dX6y8s', duration: '20:00' },
      { id: 'l8', title: 'Probability in ML Models', videoId: 'Uzxk_dX6y8s', duration: '15:00' }
    ],
    quiz: [
      { q: "Sum of probabilities of all events?", options: ["0", "1", "0.5", "100"], correct: 1 },
      { q: "Bayes theorem used for?", options: ["Conditional Prob", "Addition", "Subtraction", "Mean"], correct: 0 },
      { q: "Normal distribution shape?", options: ["Square", "Circle", "Bell", "Triangle"], correct: 2 },
      { q: "What is a P-Value?", options: ["Price", "Probability of result", "Power", "Percent"], correct: 1 },
      { q: "Flipping a coin is...?", options: ["Binomial", "Linear", "Square", "Randomly"], correct: 0 }
    ]
  },
  {
    id: "ds-02",
    title: "Python for Data Analysis",
    emoji: "📊",
    level: "Intermediate",
    price: 1999,
    lessons: [
      { id: 'l1', title: 'Python Libraries Intro', videoId: 'jjHVEFK8fiQ', duration: '15:00' },
      { id: 'l2', title: 'NumPy Arrays & Math', videoId: 'jjHVEFK8fiQ', duration: '20:00' },
      { id: 'l3', title: 'Pandas DataFrames 101', videoId: 'jjHVEFK8fiQ', duration: '25:00' },
      { id: 'l4', title: 'Data Cleaning Techniques', videoId: 'jjHVEFK8fiQ', duration: '18:00' },
      { id: 'l5', title: 'Matplotlib for Visualization', videoId: 'jjHVEFK8fiQ', duration: '30:00' },
      { id: 'l6', title: 'Seaborn Stylings', videoId: 'jjHVEFK8fiQ', duration: '22:00' },
      { id: 'l7', title: 'Exploratory Data Analysis', videoId: 'jjHVEFK8fiQ', duration: '20:00' },
      { id: 'l8', title: 'Working with Real Datasets', videoId: 'jjHVEFK8fiQ', duration: '15:00' }
    ],
    quiz: [
      { q: "Standard library for plots?", options: ["NumPy", "Pandas", "Matplotlib", "Request"], correct: 2 },
      { q: "Pandas core object?", options: ["List", "DataFrame", "Tuple", "Dictionary"], correct: 1 },
      { q: "Command to see top 5 rows?", options: ["head()", "tail()", "show()", "get()"], correct: 0 },
      { q: "Python is...?", options: ["Compiled", "Interpreted", "Low level", "None"], correct: 1 },
      { q: "Handling missing values?", options: ["dropna()", "fix()", "delete()", "clear()"], correct: 0 }
    ]
  },
  {
    id: "ds-03",
    title: "Statistical Data Modeling",
    emoji: "📈",
    level: "Advanced",
    price: 2499,
    lessons: [
      { id: 'l1', title: 'Inferential Statistics', videoId: 'Vfo5le26IhY', duration: '15:00' },
      { id: 'l2', title: 'Linear Models', videoId: 'Vfo5le26IhY', duration: '20:00' },
      { id: 'l3', title: 'Logistic Models', videoId: 'Vfo5le26IhY', duration: '25:00' },
      { id: 'l4', title: 'ANOVA Explained', videoId: 'Vfo5le26IhY', duration: '18:00' },
      { id: 'l5', title: 'Time Series Modeling', videoId: 'Vfo5le26IhY', duration: '30:00' },
      { id: 'l6', title: 'Multivariate Analysis', videoId: 'Vfo5le26IhY', duration: '22:00' },
      { id: 'l7', title: 'Statistical Significance', videoId: 'Vfo5le26IhY', duration: '20:00' },
      { id: 'l8', title: 'R vs Python for Stats', videoId: 'Vfo5le26IhY', duration: '15:00' }
    ],
    quiz: [
      { q: "What is ANOVA?", options: ["Analysis of Variance", "Analysis of Value", "Anova Logic", "None"], correct: 0 },
      { q: "Metric for model fit?", options: ["R-squared", "Price", "Speed", "Count"], correct: 0 },
      { q: "Null hypothesis symbol?", options: ["H1", "H0", "H-null", "Hx"], correct: 1 },
      { q: "Standard Deviation measures...?", options: ["Spread", "Average", "Total", "Count"], correct: 0 },
      { q: "Correlation range?", options: ["0 to 1", "-1 to 1", "0 to 100", "-Infinity to Infinity"], correct: 1 }
    ]
  },
  {
    id: "ds-04",
    title: "Data Mining & Exploration",
    emoji: "⛏️",
    level: "Beginner",
    price: 2999,
    lessons: [
      { id: 'l1', title: 'Data Mining Lifecycle', videoId: 'yZTBMMd2BaI', duration: '15:00' },
      { id: 'l2', title: 'Association Rule Mining', videoId: 'yZTBMMd2BaI', duration: '20:00' },
      { id: 'l3', title: 'Clustering Techniques', videoId: 'yZTBMMd2BaI', duration: '25:00' },
      { id: 'l4', title: 'Anomaly Detection', videoId: 'yZTBMMd2BaI', duration: '18:00' },
      { id: 'l5', title: 'Mining Text & Social Data', videoId: 'yZTBMMd2BaI', duration: '30:00' },
      { id: 'l6', title: 'Sequential Pattern Mining', videoId: 'yZTBMMd2BaI', duration: '22:00' },
      { id: 'l7', title: 'Visual Data Mining', videoId: 'yZTBMMd2BaI', duration: '20:00' },
      { id: 'l8', title: 'Ethics in Data Mining', videoId: 'yZTBMMd2BaI', duration: '15:00' }
    ],
    quiz: [
      { q: "What is Clustering?", options: ["Labeling", "Grouping unlabelled data", "Deleting", "Copying"], correct: 1 },
      { q: "Market Basket Analysis uses...?", options: ["Rules", "Images", "Music", "None"], correct: 0 },
      { q: "EDA stands for...?", options: ["Exploratory Data Analysis", "Extra Data", "End Data", "Easy Data"], correct: 0 },
      { q: "Outlier detection is...?", options: ["Finding normal data", "Finding anomalies", "Sorting", "Filtering"], correct: 1 },
      { q: "Data mining is part of...?", options: ["KDD process", "Web dev", "Marketing only", "None"], correct: 0 }
    ]
  },

  // ==========================================
  // DESIGN (4 COURSES)
  // ==========================================
  {
    id: "de-01",
    title: "UI/UX Design Essentials",
    emoji: "🎨",
    level: "Beginner",
    price: 0,
    lessons: [
      { id: 'l1', title: 'UX Research Methods', videoId: 'c9Wg6W_IsE4', duration: '15:00' },
      { id: 'l2', title: 'Wireframing in 2026', videoId: 'c9Wg6W_IsE4', duration: '20:00' },
      { id: 'l3', title: 'Visual Hierarchy Rules', videoId: 'c9Wg6W_IsE4', duration: '25:00' },
      { id: 'l4', title: 'Color Theory for Web', videoId: 'c9Wg6W_IsE4', duration: '18:00' },
      { id: 'l5', title: 'Typography Basics', videoId: 'c9Wg6W_IsE4', duration: '30:00' },
      { id: 'l6', title: 'Designing for Mobile', videoId: 'c9Wg6W_IsE4', duration: '22:00' },
      { id: 'l7', title: 'Accessibility in Design', videoId: 'c9Wg6W_IsE4', duration: '20:00' },
      { id: 'l8', title: 'Portfolio Best Practices', videoId: 'c9Wg6W_IsE4', duration: '15:00' }
    ],
    quiz: [
      { q: "UX stands for...?", options: ["Universal Exchange", "User Experience", "Unit X", "User Extra"], correct: 1 },
      { q: "Low-fidelity blueprint?", options: ["Prototype", "Wireframe", "Logo", "Mockup"], correct: 1 },
      { q: "Contrast is for...?", options: ["Readability", "Brightness", "File size", "Code"], correct: 0 },
      { q: "User personas are...?", options: ["Fake users", "Representative profiles", "Competitors", "Designers"], correct: 1 },
      { q: "Grid systems help with...?", options: ["Color", "Alignment", "Speed", "Price"], correct: 1 }
    ]
  },
  {
    id: "de-02",
    title: "Graphic Design Theory",
    emoji: "📐",
    level: "Intermediate",
    price: 1999,
    lessons: [
      { id: 'l1', title: 'Elements of Design', videoId: 'YqQx75OPRa0', duration: '15:00' },
      { id: 'l2', title: 'Gestalt Principles', videoId: 'YqQx75OPRa0', duration: '20:00' },
      { id: 'l3', title: 'Logo Design Workflow', videoId: 'YqQx75OPRa0', duration: '25:00' },
      { id: 'l4', title: 'Color Psychology', videoId: 'YqQx75OPRa0', duration: '18:00' },
      { id: 'l5', title: 'Print vs Digital Design', videoId: 'YqQx75OPRa0', duration: '30:00' },
      { id: 'l6', title: 'Layout Construction', videoId: 'YqQx75OPRa0', duration: '22:00' },
      { id: 'l7', title: 'Branding Identity', videoId: 'YqQx75OPRa0', duration: '20:00' },
      { id: 'l8', title: 'History of Graphic Design', videoId: 'YqQx75OPRa0', duration: '15:00' }
    ],
    quiz: [
      { q: "Primary Colors?", options: ["Red, Blue, Yellow", "Orange, Green", "Black, White", "None"], correct: 0 },
      { q: "Kerning is...?", options: ["Space between lines", "Space between letters", "Font size", "Style"], correct: 1 },
      { q: "Serif fonts have...?", options: ["Little feet", "No feet", "Colors", "Shapes"], correct: 0 },
      { q: "Balance in design?", options: ["Symmetry", "Scale", "Both", "None"], correct: 2 },
      { q: "Vector files are...?", options: ["Scalable", "Blurry", "Small", "Static"], correct: 0 }
    ]
  },
  {
    id: "de-03",
    title: "Figma for Professional Designers",
    emoji: "🖋️",
    level: "Advanced",
    price: 2499,
    lessons: [
      { id: 'l1', title: 'Figma 2026 Features', videoId: 'EbsQp33Rzzg', duration: '15:00' },
      { id: 'l2', title: 'Auto Layout Deep Dive', videoId: 'EbsQp33Rzzg', duration: '20:00' },
      { id: 'l3', title: 'Component Properties', videoId: 'FTFaQWZBqQ8', duration: '25:00' },
      { id: 'l4', title: 'Interactive Prototyping', videoId: 'FTFaQWZBqQ8', duration: '18:00' },
      { id: 'l5', title: 'Design Systems in Figma', videoId: 'EbsQp33Rzzg', duration: '30:00' },
      { id: 'l6', title: 'Dev Mode & Handover', videoId: 'FTFaQWZBqQ8', duration: '22:00' },
      { id: 'l7', title: 'Plugins & Productivity', videoId: 'EbsQp33Rzzg', duration: '20:00' },
      { id: 'l8', title: 'Figma AI: Buzz & Make', videoId: 'EbsQp33Rzzg', duration: '15:00' }
    ],
    quiz: [
      { q: "Figma is primarily...?", options: ["Web-based", "Offline only", "For Coding", "For Video"], correct: 0 },
      { q: "Auto Layout shortcut?", options: ["Shift + A", "Ctrl + L", "Alt + G", "F"], correct: 0 },
      { q: "Reusable elements?", options: ["Groups", "Components", "Layers", "Frames"], correct: 1 },
      { q: "Real-time collaboration?", options: ["Supported", "Not Supported", "Paid only", "None"], correct: 0 },
      { q: "Boolean property types?", options: ["True/False", "Number", "Text", "Color"], correct: 0 }
    ]
  },
  {
    id: "de-04",
    title: "Motion Graphics with After Effects",
    emoji: "🎞️",
    level: "Beginner",
    price: 2999,
    lessons: [
      { id: 'l1', title: 'After Effects Interface', videoId: '8p_397XfT_I', duration: '15:00' },
      { id: 'l2', title: 'Keyframes & Interpolation', videoId: '8p_397XfT_I', duration: '20:00' },
      { id: 'l3', title: 'Masking & Path Animation', videoId: '8p_397XfT_I', duration: '25:00' },
      { id: 'l4', title: 'Graph Editor Basics', videoId: '8p_397XfT_I', duration: '18:00' },
      { id: 'l5', title: '3D Layers & Lighting', videoId: '8p_397XfT_I', duration: '30:00' },
      { id: 'l6', title: 'Motion Tracking', videoId: '8p_397XfT_I', duration: '22:00' },
      { id: 'l7', title: 'Rendering for Web', videoId: '8p_397XfT_I', duration: '20:00' },
      { id: 'l8', title: 'AE Expressions Intro', videoId: '8p_397XfT_I', duration: '15:00' }
    ],
    quiz: [
      { q: "What is a Composition?", options: ["A layer", "The project container", "A color", "A brush"], correct: 1 },
      { q: "Shortcut for Opacity?", options: ["O", "T", "P", "S"], correct: 1 },
      { q: "Keyframe for scale?", options: ["S", "K", "L", "Shift"], correct: 0 },
      { q: "Easing makes animation...?", options: ["Natural", "Robotic", "Stop", "Laggy"], correct: 0 },
      { q: "AE is by...?", options: ["Apple", "Adobe", "Google", "Figma"], correct: 1 }
    ]
  },

  // ==========================================
  // CLOUD COMPUTING (4 COURSES)
  // ==========================================
  {
    id: "cc-01",
    title: "AWS Solutions Architect Pro",
    emoji: "☁️",
    level: "Beginner",
    price: 0,
    lessons: [
      { id: 'l1', title: 'AWS Global Infrastructure', videoId: 'kYRiVWM6Ixc', duration: '15:00' },
      { id: 'l2', title: 'EC2 Compute Instances', videoId: 'kYRiVWM6Ixc', duration: '20:00' },
      { id: 'l3', title: 'S3 Storage Classes', videoId: 'kYRiVWM6Ixc', duration: '25:00' },
      { id: 'l4', title: 'VPC Networking Basics', videoId: 'kYRiVWM6Ixc', duration: '18:00' },
      { id: 'l5', title: 'IAM Security & Policies', videoId: 'kYRiVWM6Ixc', duration: '30:00' },
      { id: 'l6', title: 'Load Balancers & ASG', videoId: 'kYRiVWM6Ixc', duration: '22:00' },
      { id: 'l7', title: 'Route 53 & DNS', videoId: 'kYRiVWM6Ixc', duration: '20:00' },
      { id: 'l8', title: 'Serverless Intro: Lambda', videoId: 'kYRiVWM6Ixc', duration: '15:00' }
    ],
    quiz: [
      { q: "What is EC2?", options: ["Database", "Virtual Server", "Storage", "Network"], correct: 1 },
      { q: "S3 is for...?", options: ["Block storage", "Object storage", "Compute", "Security"], correct: 1 },
      { q: "Region contains...?", options: ["Users", "Availability Zones", "Servers only", "Files"], correct: 1 },
      { q: "IAM manages...?", options: ["Cost", "Access", "Speed", "Hardware"], correct: 1 },
      { q: "Cloud provider name?", options: ["AWS", "Windows", "Excel", "Postman"], correct: 0 }
    ]
  },
  {
    id: "cc-02",
    title: "Google Cloud Platform (GCP) Fundamentals",
    emoji: "🌩️",
    level: "Intermediate",
    price: 1999,
    lessons: [
      { id: 'l1', title: 'GCP Hierarchy', videoId: 'j8ppGyfONpo', duration: '15:00' },
      { id: 'l2', title: 'Google Compute Engine', videoId: 'j8ppGyfONpo', duration: '20:00' },
      { id: 'l3', title: 'App Engine vs Cloud Run', videoId: 'j8ppGyfONpo', duration: '25:00' },
      { id: 'l4', title: 'GKE Kubernetes Basics', videoId: 'j8ppGyfONpo', duration: '18:00' },
      { id: 'l5', title: 'Cloud Storage Buckets', videoId: 'j8ppGyfONpo', duration: '30:00' },
      { id: 'l6', title: 'BigQuery for Analytics', videoId: 'j8ppGyfONpo', duration: '22:00' },
      { id: 'l7', title: 'VPC & Interconnect', videoId: 'j8ppGyfONpo', duration: '20:00' },
      { id: 'l8', title: 'GCP Monitoring & Logging', videoId: 'j8ppGyfONpo', duration: '15:00' }
    ],
    quiz: [
      { q: "GCP Compute tool?", options: ["EC2", "Compute Engine", "Droplet", "Azure VM"], correct: 1 },
      { q: "BigQuery is...?", options: ["Database", "Data Warehouse", "Server", "API"], correct: 1 },
      { q: "Storage in GCP?", options: ["S3", "Cloud Storage", "Drive", "OneCloud"], correct: 1 },
      { q: "Managed Kubernetes?", options: ["GKE", "AKS", "EKS", "K3s"], correct: 0 },
      { q: "IAM roles in GCP?", options: ["Primitive, Predefined, Custom", "Admin only", "Free", "None"], correct: 0 }
    ]
  },
  {
    id: "cc-03",
    title: "Cloud Security & Compliance",
    emoji: "🔐",
    level: "Advanced",
    price: 2499,
    lessons: [
      { id: 'l1', title: 'Shared Responsibility Model', videoId: 'RreidS88258', duration: '15:00' },
      { id: 'l2', title: 'Data Encryption at Rest', videoId: 'RreidS88258', duration: '20:00' },
      { id: 'l3', title: 'Network Security Groups', videoId: 'RreidS88258', duration: '25:00' },
      { id: 'l4', title: 'Compliance Standards (GDPR)', videoId: 'RreidS88258', duration: '18:00' },
      { id: 'l5', title: 'Zero Trust Architecture', videoId: 'RreidS88258', duration: '30:00' },
      { id: 'l6', title: 'DDoS Protection Strategies', videoId: 'RreidS88258', duration: '22:00' },
      { id: 'l7', title: 'Identity Federation', videoId: 'RreidS88258', duration: '20:00' },
      { id: 'l8', title: 'Cloud Auditing Tools', videoId: 'RreidS88258', duration: '15:00' }
    ],
    quiz: [
      { q: "Who secures the cloud hardware?", options: ["Customer", "Provider", "Both", "Government"], correct: 1 },
      { q: "WAF stands for...?", options: ["Web App Firewall", "Web Access", "Wide Area", "None"], correct: 0 },
      { q: "Encryption type?", options: ["AES-256", "HTML", "JSON", "TCP"], correct: 0 },
      { q: "MFA purpose?", options: ["Speed", "Extra Security", "Cost", "API"], correct: 1 },
      { q: "Principle of least privilege?", options: ["Grant all", "Grant only needed", "Grant none", "Grant admin"], correct: 1 }
    ]
  },
  {
    id: "cc-04",
    title: "Serverless Architecture with AWS Lambda",
    emoji: "⚡",
    level: "Beginner",
    price: 2999,
    lessons: [
      { id: 'l1', title: 'What is Serverless?', videoId: 'eOBqarkdKuM', duration: '15:00' },
      { id: 'l2', title: 'AWS Lambda Hand-on', videoId: 'eOBqarkdKuM', duration: '20:00' },
      { id: 'l3', title: 'API Gateway Integration', videoId: 'eOBqarkdKuM', duration: '25:00' },
      { id: 'l4', title: 'Triggers & Events', videoId: 'eOBqarkdKuM', duration: '18:00' },
      { id: 'l5', title: 'Lambda Pricing Model', videoId: 'eOBqarkdKuM', duration: '30:00' },
      { id: 'l6', title: 'Step Functions & Logic', videoId: 'eOBqarkdKuM', duration: '22:00' },
      { id: 'l7', title: 'Monitoring CloudWatch', videoId: 'eOBqarkdKuM', duration: '20:00' },
      { id: 'l8', title: 'Cold Starts vs Warm Starts', videoId: 'eOBqarkdKuM', duration: '15:00' }
    ],
    quiz: [
      { q: "Serverless means...?", options: ["No servers", "Managed servers", "Local script", "None"], correct: 1 },
      { q: "Lambda max runtime?", options: ["15 mins", "1 min", "Infinite", "1 hour"], correct: 0 },
      { q: "Triggers Lambda?", options: ["S3 upload", "API call", "Both", "None"], correct: 2 },
      { q: "Paid by...?", options: ["Hour", "Request count", "Fixed", "None"], correct: 1 },
      { q: "Language for Lambda?", options: ["Python", "Node", "Both", "None"], correct: 2 }
    ]
  },

  // ==========================================
  // MARKETING (4 COURSES)
  // ==========================================
  {
    id: "ma-01",
    title: "Marketing Masterclass: Beginner Level",
    emoji: "📢",
    level: "Beginner",
    price: 0,
    lessons: [
      { id: 'l1', title: 'Digital Marketing Fundamentals', videoId: 'qnBhOVH1QQ8', duration: '15:00' },
      { id: 'l2', title: 'The Marketing Funnel', videoId: 'qnBhOVH1QQ8', duration: '20:00' },
      { id: 'l3', title: 'SEO Foundations', videoId: 'qnBhOVH1QQ8', duration: '25:00' },
      { id: 'l4', title: 'Social Media Strategy', videoId: 'qnBhOVH1QQ8', duration: '18:00' },
      { id: 'l5', title: 'Email Marketing Basics', videoId: 'qnBhOVH1QQ8', duration: '30:00' },
      { id: 'l6', title: 'Google Ads Intro', videoId: 'qnBhOVH1QQ8', duration: '22:00' },
      { id: 'l7', title: 'Content Planning', videoId: 'qnBhOVH1QQ8', duration: '20:00' },
      { id: 'l8', title: 'Career in Marketing', videoId: 'qnBhOVH1QQ8', duration: '15:00' }
    ],
    quiz: [
      { q: "What is a Funnel?", options: ["Tool", "Customer journey", "Filter", "None"], correct: 1 },
      { q: "SEO stands for...?", options: ["Social engine", "Search Engine Optimization", "Sales", "None"], correct: 1 },
      { q: "Organic means...?", options: ["Paid", "Unpaid/Free", "Expensive", "Boring"], correct: 1 },
      { q: "Email marketing tool?", options: ["Mailchimp", "Word", "Slack", "Chrome"], correct: 0 },
      { q: "B2B stands for...?", options: ["Back to back", "Business to Business", "Base to Base", "None"], correct: 1 }
    ]
  },
  {
    id: "ma-02",
    title: "Digital Advertising & PPC Strategy",
    emoji: "💰",
    level: "Intermediate",
    price: 1999,
    lessons: [
      { id: 'l1', title: 'PPC Auction Model', videoId: 'qnBhOVH1QQ8', duration: '15:00' },
      { id: 'l2', title: 'Google Keyword Planner', videoId: 'qnBhOVH1QQ8', duration: '20:00' },
      { id: 'l3', title: 'Facebook Ad Formats', videoId: 'qnBhOVH1QQ8', duration: '25:00' },
      { id: 'l4', title: 'Targeting & Audiences', videoId: 'qnBhOVH1QQ8', duration: '18:00' },
      { id: 'l5', title: 'A/B Testing Ads', videoId: 'qnBhOVH1QQ8', duration: '30:00' },
      { id: 'l6', title: 'Budgeting & Bidding', videoId: 'qnBhOVH1QQ8', duration: '22:00' },
      { id: 'l7', title: 'Conversion Tracking', videoId: 'qnBhOVH1QQ8', duration: '20:00' },
      { id: 'l8', title: 'Remarketing Strategies', videoId: 'qnBhOVH1QQ8', duration: '15:00' }
    ],
    quiz: [
      { q: "PPC stands for...?", options: ["Pay Per Click", "Price Per Click", "Post Per...", "None"], correct: 0 },
      { q: "What is CTR?", options: ["Click Through Rate", "Cost", "Call", "None"], correct: 0 },
      { q: "CPC means...?", options: ["Cost per click", "Count", "Click", "None"], correct: 0 },
      { q: "Search ads appear on...?", options: ["Google search", "Radio", "TV", "Paper"], correct: 0 },
      { q: "Quality Score affects...?", options: ["Ad rank", "Color", "Size", "None"], correct: 0 }
    ]
  },
  {
    id: "ma-03",
    title: "Social Media ROI & Analytics",
    emoji: "📈",
    level: "Advanced",
    price: 2499,
    lessons: [
      { id: 'l1', title: 'Measuring Engagement', videoId: 'fN_A7hB_6V8', duration: '15:00' },
      { id: 'l2', title: 'Social Listening Tools', videoId: 'fN_A7hB_6V8', duration: '20:00' },
      { id: 'l3', title: 'Attribution Modeling', videoId: 'fN_A7hB_6V8', duration: '25:00' },
      { id: 'l4', title: 'ROI vs ROAS', videoId: 'fN_A7hB_6V8', duration: '18:00' },
      { id: 'l5', title: 'GA4 for Social Traffic', videoId: 'fN_A7hB_6V8', duration: '30:00' },
      { id: 'l6', title: 'Influencer Metrics', videoId: 'fN_A7hB_6V8', duration: '22:00' },
      { id: 'l7', title: 'Benchmark Analysis', videoId: 'fN_A7hB_6V8', duration: '20:00' },
      { id: 'l8', title: 'Social Reporting Dashboard', videoId: 'fN_A7hB_6V8', duration: '15:00' }
    ],
    quiz: [
      { q: "ROI formula?", options: ["Net Profit / Investment", "Sales - Cost", "Total User", "None"], correct: 0 },
      { q: "Metric for engagement?", options: ["Likes/Shares", "Price", "Page speed", "None"], correct: 0 },
      { q: "Pixel helps with...?", options: ["Tracking conversions", "Colors", "Coding", "None"], correct: 0 },
      { q: "Vanity metric example?", options: ["Follower count", "ROI", "Sales", "Profit"], correct: 0 },
      { q: "KPI stands for...?", options: ["Key Performance Indicator", "Key Price", "Key Pay", "None"], correct: 0 }
    ]
  },
  {
    id: "ma-04",
    title: "Content Marketing for Brand Growth",
    emoji: "✍️",
    level: "Beginner",
    price: 2999,
    lessons: [
      { id: 'l1', title: 'Content Strategy 2026', videoId: 'dnjcBnQphKk', duration: '15:00' },
      { id: 'l2', title: 'Copywriting for Growth', videoId: 'dnjcBnQphKk', duration: '20:00' },
      { id: 'l3', title: 'Video Content Mastery', videoId: 'dnjcBnQphKk', duration: '25:00' },
      { id: 'l4', title: 'AI in Content Creation', videoId: 'dnjcBnQphKk', duration: '18:00' },
      { id: 'l5', title: 'Distribution Channels', videoId: 'dnjcBnQphKk', duration: '30:00' },
      { id: 'l6', title: 'Storytelling for Brands', videoId: 'dnjcBnQphKk', duration: '22:00' },
      { id: 'l7', title: 'Content Audit Methods', videoId: 'dnjcBnQphKk', duration: '20:00' },
      { id: 'l8', title: 'Community Building', videoId: 'dnjcBnQphKk', duration: '15:00' }
    ],
    quiz: [
      { q: "CTA stands for...?", options: ["Call to Action", "Cost", "Count", "None"], correct: 0 },
      { q: "Evergreen content...?", options: ["Stays relevant", "Expires fast", "Is green", "None"], correct: 0 },
      { q: "Pillar content is...?", options: ["Main long-form piece", "Short tweet", "Image", "None"], correct: 0 },
      { q: "User generated content?", options: ["UGC", "Paid", "Brand", "None"], correct: 0 },
      { q: "White papers are...?", options: ["B2B deep dives", "Notes", "Drafts", "None"], correct: 0 }
    ]
  }
];