// UnifiedPlayer.jsx
import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';

// Ensure these paths are 100% accurate and case-sensitive
const CoursePlayer = lazy(() => import('./Course/CoursePlayer'));
const CertCoursePlayer = lazy(() => import('./Certification/CertCoursePlayer'));

export default function UnifiedPlayer() {
  const { type, id, lessonId } = useParams();

  // Verify the type is valid
  if (type !== 'course' && type !== 'certification') {
    return <NotFound />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-9 h-9 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      {type === 'course' ? (
        <CoursePlayer courseId={id} lessonId={lessonId} />
      ) : (
        <CertCoursePlayer certId={id} lessonId={lessonId} />
      )}
    </Suspense>
  );
}