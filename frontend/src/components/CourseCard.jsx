import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users } from 'lucide-react';

export default function CourseCard({ course, className = '' }) {
  const {
    _id, id,
    title, instructor,
    thumbnail, image,
    rating, reviewCount,
    duration, enrollCount,
    price, originalPrice,
    level, category,
    isLive = false, progress
  } = course;

  const courseId    = _id || id;
  const courseImage = thumbnail || image;

  const levelStyle = {
    Beginner:     'bg-emerald-500 text-white',
    Intermediate: 'bg-amber-500 text-white',
    Advanced:     'bg-violet-600 text-white',
  }[level] || 'bg-cyan-600 text-white';

  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const navigate = useNavigate();
  // Handle instructor as either a string or an object with a name field
  const instructorName =
    typeof instructor === 'string'
      ? instructor
      : instructor?.name || 'Instructor';

  return (
  <div className={`group flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-cyan-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden ${className}`}>
      <div className="relative aspect-video overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={courseImage || `https://picsum.photos/seed/${courseId}course/640/360`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-left: LIVE pill OR level pill — never both */}
        <div className="absolute top-3 left-3">
          {isLive ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white text-xs font-bold font-mono rounded-full shadow">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              LIVE
            </span>
          ) : (
            level && (
              <span className={`px-2.5 py-1 text-xs font-semibold font-mono rounded-full shadow ${levelStyle}`}>
                {level}
              </span>
            )
          )}
        </div>

        <div className="absolute top-3 right-3">
        {course.isEnrolled && course.enrollmentType === 'trial' ? (
        <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-full shadow animate-pulse">
        Trial Active
        </span>
        ) : price === 0 ? (
        <span className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow">
        7-Day Trial
        </span>
          ) : (
            price != null && (
              <span className="px-2.5 py-1 bg-white/95 text-slate-900 text-xs font-bold rounded-full shadow border border-white/60">
                ₹{price.toLocaleString('en-IN')}
                {discount > 0 && (
                  <span className="ml-1.5 text-emerald-600">{discount}% off</span>
                )}
              </span>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <span className="text-xs text-slate-500 font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md w-fit">
          {category}
        </span>

        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors">
          {title}
        </h3>

        <p className="text-xs text-slate-500">
          by <span className="text-slate-700 font-semibold">{instructorName}</span>
        </p>

        {typeof progress === 'number' && (
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Progress</span>
              <span className="text-cyan-600 font-mono font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
  
  <button
  onClick={(e) => { 
    e.stopPropagation(); 
    
    // NUCLEAR FIX: Use the plural /courses/ and check for valid ID
    const finalId = _id || id; 
    
    if (!finalId) {
      console.error("Navigation failed: Course ID is missing", course);
      return;
    }

    navigate(`/courses/${finalId}`); 
  }}
  className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-colors duration-200 tracking-wide whitespace-nowrap"
>
  Enroll Now →
</button>

  <div className="flex items-center gap-3">
    {duration && <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3.5 h-3.5" />{duration}</span>}
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
      <span className="text-xs font-bold text-slate-800 font-mono">{(parseFloat(rating) || 0).toFixed(1)}</span>
      {reviewCount && <span className="text-xs text-slate-400 font-mono">({reviewCount.toLocaleString('en-IN')})</span>}
    </div>
  </div>

</div>
</div>
</div>
  );
}