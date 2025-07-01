import React, { useState, useMemo } from 'react';

function MyComponent() {
  const [error, setError] = useState<string | null>(null);
  
  const handleSomething = () => {
    setError('Something went wrong!');
  };
  
  return (
    <div>
      {error && <p>{error}</p>}
    </div>
  );
}


// Assuming you have your original cases data
const [cases, setCases] = useState([]);
const [searchTerm, setSearchTerm] = useState('');

// filteredCases is computed based on search criteria
const filteredCases = useMemo(() => {
  if (!searchTerm) return cases;
  
  return cases.filter(caseItem => 
    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.place.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [cases, searchTerm]);
