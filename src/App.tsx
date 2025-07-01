import { useState, Suspense } from 'react';
import { Button, Alert } from 'react-bootstrap';
import CaseForm from './components/CaseForm';
import AdminLoadingSkeleton from './components/AdminLoadingSkeleton';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Safe admin toggle function
  const toggleAdmin = () => {
    try {
      setIsAdmin(prev => !prev);
      setAdminError(null);
    } catch (error) {
      console.error("Admin toggle error:", error);
      setAdminError("Failed to change admin mode");
    }
  };

  return (
    <div className="app-container">
      {/* Header with admin toggle */}
      <header className="header">
        <div className="header-content container">
          <h1 className="m-0">
            BC Cold Cases
            <Button 
              size="sm" 
              variant={isAdmin ? 'danger' : 'outline-light'} 
              onClick={toggleAdmin}
              className="ms-3"
              aria-expanded={isAdmin}
              aria-controls="admin-panel"
            >
              {isAdmin ? 'Exit Admin' : 'Admin Mode'}
            </Button>
          </h1>
        </div>
      </header>

      {/* Error display */}
      {adminError && (
        <Alert variant="danger" dismissible onClose={() => setAdminError(null)}>
          {adminError}
        </Alert>
      )}

      {/* Main content with safe admin panel rendering */}
      <main className="main-content">
        <div className="container">
          {/* Other components... */}

          {/* Admin Panel with error boundaries */}
          {isAdmin && (
            <div id="admin-panel">
              <Suspense fallback={<AdminLoadingSkeleton />}>
                <CaseForm 
                  onSave={(caseData) => {
                    console.log("Saving case:", caseData);
                    // Add your save logic here
                  }} 
                />
              </Suspense>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}