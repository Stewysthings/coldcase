// File: src/utils/loadCases.ts
import { Case } from '../types';

export async function loadCases(): Promise<Case[]> {
  try {
    const caseModules = import.meta.glob('/public/cases/**/meta.json', { eager: true });
    return Object.entries(caseModules).map(([path, module]) => ({
      ...(module as any).default,
      id: path.split('/')[3]
    }));
  } catch (error) {
    console.error('Failed to load cases:', error);
    return [];
  }
}