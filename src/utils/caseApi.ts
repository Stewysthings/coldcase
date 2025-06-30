import type { Case } from './types/types';


export async function loadCases(): Promise<(Case | null)[]> {
  try {
    const caseModules = import.meta.glob('/public/cases/**/meta.json', { eager: false });
    return await Promise.all(
      Object.entries(caseModules).map(async ([metaPath, resolver]) => {
        // ... your existing loading logic ...
      })
    );
  } catch (error) {
    throw new Error('Case loading failed'); // Throw for error boundaries
  }
}