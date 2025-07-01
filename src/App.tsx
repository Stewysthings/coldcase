import { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Navbar, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { debounce } from 'lodash';
import type { Case } from './types/types';
import { loadCases } from './utils/caseApi';
import CaseForm from './components/CaseForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  // State management
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [count, setCount] = useState(0);
  const [editingCase, setEditingCase] = useState<Case | undefined>(undefined);

  // Load cases on mount
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedCases = await loadCases();
        setCases(loadedCases.filter(Boolean));
      } catch (err) {
        setError('Failed to load cases. Please try again.');
        console.error('Case loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Admin functions
  const handleSaveCase = async (newCase: Case) => {
    try {
      // TODO: Replace with actual API call
      setCases(prev => {
        const existingIndex = prev.findIndex(c => c.id === newCase.id);
        if (existingIndex >= 0) {
          // Update existing case
          const updated = [...prev];
          updated[existingIndex] = newCase;
          return updated;
        } else {
          // Add new case
          return [...prev, newCase];
        }
      });
      return true; // Success
    } catch (err) {
      setError('Failed to save case');
      console.error('Save error:', err);
      return false; // Failure
    }
  };

  // Utilities
  const formatDate = ({ day, month, year, precision }: Case['date']) => {
    if (precision === 'exact' && day && month) return `${month}/${day}/${year}`;
    if (precision === 'month' && month) return `${month}/${year}`;
    return year.toString();
  };

  const debouncedSetSearchTerm = useCallback(
    debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  const filteredCases = useMemo(() => 
    cases
      .filter(caseData =>
        caseData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseData.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.date.year - b.date.year), // Sort by year (oldest first)
    [cases, searchTerm]
  );

  return (
    <div className="app-container">
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold">
            BC Cold Cases
            <Button 
              size="sm" 
              variant={isAdmin ? 'danger' : 'outline-light'} 
              onClick={() => setIsAdmin(!isAdmin)}
              className="ms-3"
            >
              {isAdmin ? 'Exit Admin' : 'Admin Mode'}
            </Button>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="py-4">
        {/* Search Bar */}
        <Form.Group className="mb-4 bg-light p-3 rounded shadow-sm">
          <Form.Control
            type="search"
            placeholder="Search by name or location..."
            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
            className="fs-5 p-3"
          />
        </Form.Group>

        {/* Admin Panel */}
        {isAdmin && !editingCase && (
          <CaseForm 
            onSave={handleSaveCase}
            className="mb-4"
          />
        )}

        {/* Edit Case Panel */}
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
                if (success) {
                  setEditingCase(undefined);
                }
                return success;
              }}
              editCase={editingCase}
            />
          </div>
        )}

        {/* Status Indicators */}
        {loading && <div className="text-center py-4">Loading cases...</div>}
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

        {/* Case Grid */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCases.map((caseData) => (
            <Col key={caseData.id}>
              <Card className="h-100 shadow-sm">
                {caseData.photo && (
                  <Card.Img
                    variant="top"
                    src={`/photos/${caseData.photo}`}
                    alt={`${caseData.name} case photo`}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('Failed to load image:', `/photos/${caseData.photo}`, 'for case:', caseData.name);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Successfully loaded image:', `/photos/${caseData.photo}`, 'for case:', caseData.name);
                    }}
                  />
                )}
                <Card.Header>
                  {caseData.name} • {formatDate(caseData.date)}
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <Card.Title 
                    className={`fs-5 fw-bold ${isAdmin ? 'text-primary text-decoration-underline' : 'text-primary'}`}
                    style={isAdmin ? { cursor: 'pointer' } : {}}
                    onClick={isAdmin ? () => setEditingCase(caseData) : undefined}
                    title={isAdmin ? 'Click to edit this case' : ''}
                  >
                    {caseData.name} ({caseData.date.year})
                  </Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    <span className="d-inline-block bg-light px-2 py-1 rounded">
                      {caseData.location}
                    </span> • {caseData.status}
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1" style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {caseData.description}
                  </Card.Text>
                  {caseData.references && caseData.references.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">References:</small>
                      <ul className="list-unstyled mt-1">
                        {caseData.references.map((link, index) => (
                          <li key={index}>
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none small"
                            >
                              {link.length > 50 ? `${link.substring(0, 50)}...` : link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

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
      </Container>
    </div>
  );
}

export default App;