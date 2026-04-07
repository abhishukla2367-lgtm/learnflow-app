export const INSTRUCTOR_PHOTO_MAP = {
  "Vikas Tiwari":   "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391842/s8ppe300x300-5_mbakdn.gif",
  "Kavita Bhosle":  "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images2_j1hqgr.jpg",
  "Priya Kulkarni": "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/1724819928447_h9vfvl.jpg",
  "Rohan Gupta":    "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images3_e6krpx.webp",
  "Ajay Chauhan":   "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/64217-Ajay-Chauhan_z8khuj.jpg",
  "Siddharth Rao":  "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images_eahpkr.jpg",
  "Aarav Deshmukh": "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391840/1749345417148_mkfa31.jpg",
  "Ananya Iyer":    "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391840/1745549131722_xjjk4q.jpg",
};

export function getInstructorPhoto(name = "") {
  return INSTRUCTOR_PHOTO_MAP[name] || null;
}