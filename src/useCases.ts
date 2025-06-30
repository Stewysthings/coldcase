import { useEffect, useState } from 'react';

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCases() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/cases');
        if (!response.ok) throw new Error('Network response was not ok');
        const loadedCases = await response.json();
        setCases(loadedCases);
      } catch (err) {
        setError('Failed to load cases');
        console.error('Failed to load cases:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  return { cases, loading, error };
}
