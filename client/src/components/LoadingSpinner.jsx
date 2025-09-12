function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;