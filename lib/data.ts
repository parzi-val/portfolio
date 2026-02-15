import { promises as fs } from 'fs';
import path from 'path';

export interface PortfolioData {
    bio: {
        greeting: string;
        paragraphs: string[];
        avatar: string;
    };
    socials: {
        platform: string;
        href: string;
    }[];
    experiences: {
        title: string;
        period: string;
        description: string;
        skills: string[];
        url: string;
    }[];
    projects: {
        title: string;
        description: string;
        tags: string[];
        link: string;
    }[];
    writings: {
        title: string;
        description: string;
        date: string;
        link: string;
        tags: string[];
    }[];
}

export async function getPortfolioData(): Promise<PortfolioData> {
    const filePath = path.join(process.cwd(), 'public', 'content.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}
