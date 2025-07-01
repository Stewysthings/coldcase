import { useState } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import type { Case } from '../types/types';

interface CaseFormProps {
  onSave: (caseData: Case) => Promise<boolean>;
  className?: string;
  editCase?: Case;
}

export default function CaseForm({ onSave, className, editCase }: CaseFormProps) {
  const [show, setShow] = useState(false);
  const [newCase, setNewCase] = useState<Partial<Case>>(editCase || {
    id: '',
    name: '',
    location: '',
    status: 'Unsolved',
    description: '',
    date: {
      year: new Date().getFullYear(),
      precision: 'year'
    },
    references: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCaseData = (data: Partial<Case>): data is Case => {
    return !!(
      data.id?.trim() &&
      data.name?.trim() &&
      data.location?.trim() &&
      data.description?.trim() &&
      data.status &&
      data.date
    );
  };

  const handleSubmit = async () => {
    if (!validateCaseData(newCase)) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Now TypeScript knows newCase is a complete Case object
    const success = await onSave(newCase);
  };

  return (
    <div className={className}>
      <Button variant="primary" onClick={() => setShow(true)}>
        {editCase ? 'Edit Case' : 'Add New Case'}
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editCase ? 'Edit Case' : 'Add New Case'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Case ID</Form.Label>
              <Form.Control
                value={newCase.id}
                onChange={(e) => setNewCase({...newCase, id: e.target.value})}
                placeholder="unique-id"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Victim Name</Form.Label>
              <Form.Control
                value={newCase.name}
                onChange={(e) => setNewCase({...newCase, name: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={newCase.location}
                onChange={(e) => setNewCase({...newCase, location: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCase.description}
                onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newCase.status}
                onChange={(e) => setNewCase({...newCase, status: e.target.value})}
              >
                <option value="Unsolved">Unsolved</option>
                <option value="Solved">Solved</option>
                <option value="Cold Case">Cold Case</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Incident</Form.Label>
              <Row>
                <Col xs={4}>
                  <Form.Control
                    type="number"
                    placeholder="Year"
                    value={newCase.date?.year || ''}
                    onChange={(e) => setNewCase({
                      ...newCase,
                      date: {
                        ...newCase.date!,
                        year: parseInt(e.target.value) || new Date().getFullYear()
                      }
                    })}
                    required
                  />
                </Col>
                <Col xs={4}>
                  <Form.Control
                    type="number"
                    placeholder="Month (1-12)"
                    min="1"
                    max="12"
                    value={newCase.date?.month || ''}
                    onChange={(e) => setNewCase({
                      ...newCase,
                      date: {
                        ...newCase.date!,
                        month: parseInt(e.target.value) || undefined
                      }
                    })}
                  />
                </Col>
                <Col xs={4}>
                  <Form.Control
                    type="number"
                    placeholder="Day (1-31)"
                    min="1"
                    max="31"
                    value={newCase.date?.day || ''}
                    onChange={(e) => setNewCase({
                      ...newCase,
                      date: {
                        ...newCase.date!,
                        day: parseInt(e.target.value) || undefined
                      }
                    })}
                  />
                </Col>
              </Row>
              <Form.Select
                className="mt-2"
                value={newCase.date?.precision || 'year'}
                onChange={(e) => setNewCase({
                  ...newCase,
                  date: {
                    ...newCase.date!,
                    precision: e.target.value as 'exact' | 'month' | 'year'
                  }
                })}
              >
                <option value="year">Year only</option>
                <option value="month">Month and year</option>
                <option value="exact">Exact date</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Photo Filename</Form.Label>
              <Form.Control
                value={newCase.photo || ''}
                onChange={(e) => setNewCase({...newCase, photo: e.target.value})}
                placeholder="e.g., case-id.jpeg"
              />
              <Form.Text className="text-muted">
                Photo filename in /public/photos/ folder (e.g., janet-smith-1924.jpeg)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reference Links</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter URLs separated by new lines (one per line)"
                value={(newCase.references || []).join('\n')}
                onChange={(e) => setNewCase({
                  ...newCase,
                  references: e.target.value.split('\n')
                })}
              />
              <Form.Text className="text-muted">
                Enter news articles, police reports, or other reference links
              </Form.Text>
            </Form.Group>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Case'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}