import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, Button, Form, Alert, Card } from 'react-bootstrap';
import { debounce } from 'lodash';
import type { Case } from './types/types';
import CaseForm from './components/CaseForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';






function App() {
  
  // State management - MOVE ALL STATE HOOKS TO THE TOP
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Now defined before use
  const [count, setCount] = useState(0);
  const [editingCase, setEditingCase] = useState<Case | undefined>(undefined);

  // Rest of your code remains exactly the same...
  // [Keep all your useEffect, handleSaveCase, formatDate, etc.]// [Keep all your existing state hooks...]

   return (
    <div className="app-container">
      <header className="header">
        <div className="header-content container">
          <h1 className="m-0">
            BC Cold Cases
            <Button 
              size="sm" 
              variant={isAdmin ? 'danger' : 'outline-light'} 
              onClick={() => setIsAdmin(!isAdmin)}
              className="ms-3"
            >
              {isAdmin ? 'Exit Admin' : 'Admin Mode'}
            </Button>
          </h1>
        </div>
      </header>

      {/* Rest of your JSX remains the same... */}
    </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Search Bar */}
          <Form.Group className="mb-4 bg-light p-3 rounded shadow-sm">
            <Form.Control
              type="search"
              placeholder="Search by name or location..."
              onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              className="fs-5 p-3"
            />
          </Form.Group>

          {/* Admin Panels (keep existing functionality) */}
          {isAdmin && !editingCase && (
            <CaseForm onSave={handleSaveCase} className="mb-4" />
          )}
          
          {isAdmin && editingCase && (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Editing: {editingCase.name}</h5>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setEditingCase(undefined)}
                >
                  Cancel Edit
                </Button>
              </div>
              <CaseForm 
                onSave={async (updatedCase) => {
                  const success = await handleSaveCase(updatedCase);
                  if (success) setEditingCase(undefined);
                  return success;
                }}
                editCase={editingCase}
              />
            </div>
          )}

          {/* Status Indicators */}
          {loading && <div className="text-center py-4">Loading cases...</div>}
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

          {/* Case Grid - Updated to use our CSS Grid */}
          <div className="cards-grid">
            {filteredCases.map((caseData) => (
              <Card key={caseData.id} className="h-100">
                {/* [Keep all your existing Card content...] */}
              </Card>
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-5">
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => setCount(c => c + 1)}
              className="px-4"
            >
              Total Views: {count}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;