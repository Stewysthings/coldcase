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
      setCases(prev => [...prev, newCase]);
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

  const filteredCases = useMemo(() => 
    cases.filter(caseData =>
      caseData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseData.location.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
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
        {isAdmin && (
          <CaseForm 
            onSave={handleSaveCase}
            className="mb-4"
          />
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
                    src={`/cases/${caseData.id}/${caseData.photo}`}
                    alt={`${caseData.name} case photo`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Header>
                  {caseData.name} • {formatDate(caseData.date)}
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-5 fw-bold text-primary">
                    {caseData.name} ({caseData.year})
                  </Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    <span className="d-inline-block bg-light px-2 py-1 rounded">
                      {caseData.location}
                    </span> • {caseData.status}
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1" style={{ wordWrap: 'break-word' }}>
                    {caseData.description}
                  </Card.Text>
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