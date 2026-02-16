export interface Writing {
    title: string;
    description: string;
    date: string;
    link?: string;
    slug?: string;
    tags: string[];
    content?: string;
    isLocal?: boolean;
}

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
        github?: string;
        featured: boolean;
        image?: string;
    }[];
    writings: Writing[];
}
