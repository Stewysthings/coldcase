import { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Navbar, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './App.css';
import ReactMarkdown from 'react-markdown';
import { debounce } from 'lodash';

interface Case {
    id: string;
    name: string;
    location: string;
    status: string;
    description: string;
    photo?: string;
    year: string | number;
    date: { day?: number; month?: number; year: number; precision: 'exact' | 'month' | 'year' };
    content?: string; // For Markdown content
}

function App() {
    const [count, setCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const loadedCases = await loadCases();
                setCases(loadedCases.filter((c): c is Case => c !== null));
            } catch (error) {
                setError('Failed to load cases. Please try again.');
                console.error('Failed to load cases:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function loadCases(): Promise<(Case | null)[]> {
        try {
            const caseModules = import.meta.glob('/public/cases/**/meta.json', { eager: false });
            const loadedCases = await Promise.all(
                Object.entries(caseModules).map(async ([metaPath, resolver]) => {
                    const meta = (await resolver()) as { default: Omit<Case, 'content'> };
                    const caseDir = metaPath.replace('/meta.json', '');
                    const contentPath = `${caseDir}/index.md?raw`;
                    const contentModule = await import(/* @vite-ignore */ contentPath);
                    const content = contentModule.default as string;

                    function validateCaseData(data: any): data is Case {
                        return data && typeof data.id === 'string' && typeof data.name === 'string';
                    }

                    const validatedCase = validateCaseData(meta.default) ? { ...meta.default, content } : null;
                    if (!validatedCase) {
                        console.warn(`Invalid case data at ${metaPath}`);
                        return null;
                    }
                    return validatedCase;
                })
            );
            return loadedCases;
        } catch (error) {
            console.error('Error loading cases:', error);
            return []; // fallback is just empty now
        }
    }

    function formatDate({ day, month, year, precision }: Case['date']) {
        if (precision === 'exact') return `${month}/${day}/${year}`;
        if (precision === 'month') return `${month}/${year}`;
        return year.toString();
    }

    const debouncedSetSearchTerm = useCallback(
        debounce((term: string) => setSearchTerm(term), 300),
        []
    );

    const filteredCases = useMemo(() => 
        cases.filter((caseData) =>
            caseData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseData.location.toLowerCase().includes(searchTerm.toLowerCase())
        ), [cases, searchTerm]
    );

    return (
        <div className="app-container">
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand className="fw-bold">BC Cold Cases</Navbar.Brand>
                </Container>
            </Navbar>

            <Container className="py-4">
                {/* Search Bar */}
                <Form.Group className="mb-4 bg-light p-3 rounded shadow-sm">
                    <Form.Control
                        type="search"
                        placeholder="Search by name or location..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="fs-5 p-3"
                    />
                </Form.Group>

                {/* Loading / Error */}
                {loading && <div className="text-center">Loading cases...</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Case Cards */}
                <Row xs={1} md={2} lg={3} className="g-4">
                    {filteredCases.map((caseData) => (
                        <Col key={caseData.id}>
                            <Card className="h-100 shadow-sm">
                                {caseData.photo && (
                                    <Card.Img
                                        variant="top"
                                        src={caseData.photo}
                                        alt={`${caseData.name} case photo`}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Header>
                                    {caseData.name} • {formatDate(caseData.date)}
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="fs-4 fw-bold text-primary">
                                        {caseData.name} ({caseData.year})
                                    </Card.Title>
                                    <Card.Subtitle className="mb-3 text-muted">
                                        <span className="d-inline-block bg-light px-2 py-1 rounded">
                                            {caseData.location}
                                        </span>{' '}
                                        • {caseData.status}
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
                        onClick={() => setCount((c) => c + 1)}
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
