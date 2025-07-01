import React, { useState } from 'react';

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
