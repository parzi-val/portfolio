import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { PortfolioData, Writing } from './types';

export async function getPortfolioData(): Promise<PortfolioData> {
    const jsonPath = path.join(process.cwd(), 'public', 'content.json');
    const jsonContents = await fs.readFile(jsonPath, 'utf8');
    const data: PortfolioData = JSON.parse(jsonContents);

    // Discover local blogs
    const blogsDir = path.join(process.cwd(), 'blogs');
    try {
        const files = await fs.readdir(blogsDir);
        const markdownFiles = files.filter(f => f.endsWith('.md'));

        const localWritings: Writing[] = await Promise.all(
            markdownFiles.map(async (filename) => {
                const filePath = path.join(blogsDir, filename);
                const fileContent = await fs.readFile(filePath, 'utf8');
                const { data: frontmatter, content } = matter(fileContent);

                const slug = filename.replace('.md', '');

                // Fallback for missing frontmatter
                return {
                    title: frontmatter.title || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    description: frontmatter.description || content.slice(0, 160) + '...',
                    date: frontmatter.date || '2025',
                    slug: slug,
                    tags: frontmatter.tags || [],
                    content: content,
                    isLocal: true
                };
            })
        );

        data.writings = [...data.writings, ...localWritings].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    } catch (e) {
        console.error("Error reading blogs directory:", e);
    }

    return data;
}

export async function getBlogBySlug(slug: string): Promise<Writing | null> {
    const data = await getPortfolioData();
    return data.writings.find(w => w.slug === slug && w.isLocal) || null;
}
