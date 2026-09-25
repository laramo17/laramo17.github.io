export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  cvUrl: string;
}

export interface Experience {
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export type ProjectCategory = "dev" | "data" | "ai-ml";

export interface Project {
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  image?: string;
  featured: boolean;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description?: string;
}
