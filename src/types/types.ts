export interface Case {
  id: string;
  name: string;
  year: number;
  location: string;
  status: string;
  description: string;
  photo?: string;
  date: {
    day?: number;
    month?: number;
    year: number;
    precision: 'exact' | 'month' | 'year';
  };
  content?: string;
}