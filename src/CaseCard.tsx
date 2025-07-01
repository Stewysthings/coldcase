import { Card, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import type { Case } from './types/types';

interface CaseCardProps {
    caseData: Case;
    formatDate: (date: Case['date']) => string;
}

export function CaseCard({ caseData, formatDate }: CaseCardProps) {
    return (
        <Col xs={12} md={6} lg={4}>
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
                        {caseData.name} ({caseData.date.year})
                    </Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">
            <span className="d-inline-block bg-light px-2 py-1 rounded">
              {caseData.location}
            </span>{' '}
                        • {caseData.status}
                    </Card.Subtitle>
                    <Card.Text className="flex-grow-1">
                        <ReactMarkdown>{caseData.content || caseData.description}</ReactMarkdown>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default CaseCard;