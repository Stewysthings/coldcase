/// <reference types="vite/client" />

declare module '*.json' {
    const value: Array<{
      id: number;
      name: string;
      year: number;
      location: string;
      status: string;
    }>;
    export default value;
}

interface ImportMeta {
    glob(
      pattern: string,
      options?: { eager?: boolean }
    ): Record<string, () => Promise<unknown>>;
}


interface ImportMeta {
  glob: (pattern: string) => Record<string, any>;
}