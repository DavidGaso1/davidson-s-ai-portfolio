
export interface Project {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tech: string[];
  features: string[];
  github: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  achievements: string[];
  badge?: string;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  year: string;
}

export interface Skill {
  subject: string;
  value: number;
  fullMark: number;
}
