import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import GalleryPage from './pages/GalleryPage';
import AlbumsPage from './pages/AlbumsPage';
import ImageDetailPage from './pages/ImageDetailPage';
import LoadingSpinner from './components/LoadingSpinner'

// Loading Spinner Component
/*function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <div className="text-white text-lg">Loading...</div>
      </div>
    </div>
  );
}*/

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to auth page but remember where they tried to go
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

// Public Route Component (redirect if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // if (isAuthenticated) {
  //   // If already authenticated, redirect to gallery
  //   return <Navigate to="/gallery" replace />;
  // }

  return children;
}

// App Routes Component (needs to be inside AuthProvider)
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/auth" 
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/gallery" 
        element={
          <ProtectedRoute>
            <GalleryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/albums" 
        element={
          <ProtectedRoute>
            <AlbumsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/images/:id" 
        element={
          <ProtectedRoute>
            <ImageDetailPage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;