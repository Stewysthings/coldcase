export interface Case {
  id: string;
  name: string;
  location: string;
  status: string;
  description: string;
  photo?: string;
  year: number;
  date: {
    day?: number;
    month?: number;
    year: number;
    precision: 'exact' | 'month' | 'year';
  };
  content?: string;
}