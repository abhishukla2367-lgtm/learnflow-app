import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Core Pages
import Home           from './pages/Home';
import Courses        from './pages/Courses';
import CourseDetail   from './pages/CourseDetail';
import Dashboard      from './pages/Dashboard';
import MyCourses    from './pages/MyCourses';
import Leaderboard    from './pages/Leaderboard';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Profile        from './pages/Profile';
import NotFound       from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';

// Certification Pages (Inside /Certification folder)
import Certifications from './pages/Certification/Certifications';
import CertDetail     from './pages/Certification/CertDetail';
import Checkout       from './pages/Certification/Checkout';
import Success        from './pages/Certification/Success'; 
import CoursePlayer   from './pages/Certification/CoursePlayer';
import Quiz           from './pages/Certification/Quiz';
import CertificatePage from './pages/Certification/CertificatePage';

// Information & Resource Pages
import LiveSessions   from './pages/LiveSessions';
import Instructors    from './pages/Instructors';
import About          from './pages/About';
import Contact        from './pages/Contact';
import Help           from './pages/Help';
import Privacy        from './pages/Privacy';
import Terms          from './pages/Terms';
import Cookies        from './pages/Cookies';

// Admin
import AdminDashboard from './components/admin/AdminDashboard';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-9 h-9 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/* ── Route guard ─────────────────────────────────────────── */
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />; // Use a dedicated component
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

/* ── Public layout (Header + Footer) ────────────────────── */
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 pt-[110px] lg:pt-[120px]">
        <Routes>
          {/* Public Routes */}
          <Route path="/"                element={<Home />} />
          <Route path="/courses"         element={<Courses />} />
          <Route path="/course/:id"      element={<CourseDetail />} />
          <Route path="/leaderboard"     element={<Leaderboard />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/about"           element={<About />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/instructors"     element={<Instructors />} />
          <Route path="/live-sessions"   element={<LiveSessions />} />
          <Route path="/help"            element={<Help />} />
          <Route path="/privacy"         element={<Privacy />} />
          <Route path="/terms"           element={<Terms />} />
          <Route path="/cookies"         element={<Cookies />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Certification Logic (Using :certId for consistency) */}
          <Route path="/certifications"         element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
          <Route path="/certifications/:certId" element={<ProtectedRoute><CertDetail /></ProtectedRoute>} />
          <Route path="/checkout/:certId"       element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/success"                element={<ProtectedRoute><Success /></ProtectedRoute>} />
          
          <Route path="/learn/:certId/:lessonId?" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
          <Route path="/quiz/:certId"            element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/certificate/:certId"     element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

/* ── Main Entry ──────────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                fontFamily: 'Outfit, sans-serif',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(15,23,42,0.12)',
              },
              success: { iconTheme: { primary: '#06b6d4', secondary: '#FFFFFF' } },
              error: { iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' } },
            }}
          />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}