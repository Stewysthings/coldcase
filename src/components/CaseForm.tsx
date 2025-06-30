import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Case } from '../types';

interface CaseFormProps {
  onSave: (caseData: Case) => Promise<boolean>;
  className?: string;
}

export default function CaseForm({ onSave, className }: CaseFormProps) {
  const [show, setShow] = useState(false);
  const [newCase, setNewCase] = useState<Partial<Case>>({
    id: '',
    name: '',
    location: '',
    status: 'Unsolved',
    year: new Date().getFullYear()
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const success = await onSave(newCase as Case);
      if (success) {
        setShow(false);
        setNewCase({
          id: '',
          name: '',
          location: '',
          status: 'Unsolved',
          year: new Date().getFullYear()
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={className}>
      <Button variant="primary" onClick={() => setShow(true)}>
        Add New Case
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
              />
            </Form.Group>

            {/* Add other fields similarly */}
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