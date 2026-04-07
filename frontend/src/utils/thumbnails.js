// Curated tech-themed Unsplash images — consistent, professional, India-relevant
export const THUMBNAILS = {
  '1':  'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=640&h=360&fit=crop&auto=format&q=80',  // Full Stack - laptop code
  '2':  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=640&h=360&fit=crop&auto=format&q=80',  // ML - AI brain
  '3':  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=360&fit=crop&auto=format&q=80',  // UI/UX - design
  '4':  'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=640&h=360&fit=crop&auto=format&q=80',  // React - code
  '5':  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop&auto=format&q=80',  // Python Data - charts
  '6':  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=360&fit=crop&auto=format&q=80',  // Node.js - servers
  '7':  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=360&fit=crop&auto=format&q=80',  // Figma/Design
  '8':  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=640&h=360&fit=crop&auto=format&q=80',  // Deep Learning
  '9':  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&h=360&fit=crop&auto=format&q=80',  // SQL/Database
  '10': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=640&h=360&fit=crop&auto=format&q=80', // DevOps/Cloud
  '11': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640&h=360&fit=crop&auto=format&q=80', // TypeScript
  '12': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop&auto=format&q=80', // Analytics
  '13': 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=640&h=360&fit=crop&auto=format&q=80', // DSA/Algorithms
  '14': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop&auto=format&q=80', // AWS/Cloud
  '15': 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=640&h=360&fit=crop&auto=format&q=80', // Android/Mobile
  '16': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&h=360&fit=crop&auto=format&q=80', // Cybersecurity
};

export const getThumbnail = (id) => THUMBNAILS[String(id)] || THUMBNAILS['1'];
