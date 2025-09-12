import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
          <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-lg p-8 max-w-md w-full border border-red-500/20">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-300 mb-6">
                An unexpected error occurred. Please try refreshing the page or go back to the home page.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-red-400 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="bg-gray-800 p-3 rounded text-sm text-red-300 overflow-auto max-h-32">
                    <div className="font-mono text-xs">
                      {this.state.error.toString()}
                      <br />
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
                >
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white font-medium"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;