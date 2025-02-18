import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes'; 
import Spinner from './components/ui/Spinner';

// Saját ErrorBoundary osztály komponens
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Frissíti a state-et, hogy a következő renderelés során megjelenjen a tartalék UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hiba naplózás
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ 
      error: error,
      errorInfo: errorInfo 
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hiba történt</h1>
            <p className="text-gray-700 mb-6">
              Sajnáljuk, váratlan hiba merült fel az alkalmazásban.
            </p>
            <div className="mb-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Oldal újratöltése
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left text-sm text-gray-600 mt-4">
                <summary>Hiba részletei</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Suspense fallback={<Spinner />}>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default React.memo(App);
