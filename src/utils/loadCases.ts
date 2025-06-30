import matter from 'gray-matter';
console.log(matter); // Test if it works
import { promises as fs } from 'fs';
import path from 'path';

interface CaseMeta {
    id: string;
    name: string;
    date: {
        year: number;
        month?: number;
        day?: number;
        precision: 'year' | 'month' | 'exact';
    };
}

export async function getCases(): Promise<{ meta: CaseMeta; content: string }[]> {
    const casesDir = path.join(process.cwd(), 'public/cases');
    const caseFolders = (await fs.readdir(casesDir)).filter(
        item => !item.includes('templates')
    );

    return Promise.all(
        caseFolders.map(async folder => {
            const metaPath = path.join(casesDir, folder, 'meta.json');
            const mdPath = path.join(casesDir, folder, 'index.md');

            const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
            const { content } = matter(await fs.readFile(mdPath, 'utf-8'));

            return { meta, content };
        })
    );
}