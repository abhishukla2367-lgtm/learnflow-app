import { useParams } from 'react-router-dom';
import CoursePlayer from './Course/CoursePlayer';
import CertCoursePlayer from './Certification/CertCoursePlayer';
import NotFound from './NotFound';

export default function UnifiedPlayer() {
  const { type } = useParams();

  // This maps the URL type to the correct folder logic
  const players = {
    course: <CoursePlayer />,
    cert: <CertCoursePlayer />
  };

  return players[type] || <NotFound />;
}