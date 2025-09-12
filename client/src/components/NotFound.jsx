import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="text-9xl font-bold text-blue-400 mb-4">404</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate(isAuthenticated ? '/gallery' : '/auth')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            {isAuthenticated ? 'Go to Gallery' : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;