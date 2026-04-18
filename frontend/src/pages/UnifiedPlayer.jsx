import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';

// Lazy load for better performance
const CoursePlayer = lazy(() => import('./Course/CoursePlayer'));
const CertCoursePlayer = lazy(() => import('./Certification/CertCoursePlayer'));

export default function UnifiedPlayer() {
  const { type, id, lessonId } = useParams();

  // 1. Normalize type for safety
  const normalizedType = type?.toLowerCase();

  // 2. Validate type
  if (normalizedType !== 'course' && normalizedType !== 'certification') {
    return <NotFound />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Initialising Classroom...</p>
        </div>
      </div>
    }>
      {normalizedType === 'course' ? (
        <CoursePlayer courseId={id} lessonId={lessonId} />
      ) : (
        <CertCoursePlayer courseId={id} lessonId={lessonId} />
      )}
    </Suspense>
  );
}