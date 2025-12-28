
export const PERSONAL_INFO = {
  name: "Ahuruezenma Davidson Chiemezuo",
  roles: ["AI Developer", "Automation Specialist", "Data Protection Officer"],
  location: "Abuja, Nigeria",
  email: "derocton@gmail.com",
  github: "https://github.com/DavidGaso1",
  linkedin: "https://linkedin.com/in/davidson-ahuruezenma-33a773294",
  summary: "Davidson is an AI Engineer with a unique academic foundation in Sociology and advanced technical training. He approaches AI Engineering through a human-centric lens, specializing in building robust RAG systems, complex N8N workflows, and scalable data protection frameworks."
};

export const technicalSkills = [
  { subject: 'AI & ML', value: 80, fullMark: 100 },
  { subject: 'N8N Automation', value: 85, fullMark: 100 },
  { subject: 'SQL / Postgres', value: 80, fullMark: 100 },
  { subject: 'AWS Cloud', value: 75, fullMark: 100 },
  { subject: 'Python', value: 80, fullMark: 100 },
];

export const toolsData = [
  { name: 'PostgreSQL', val: 80, color: '#00d9ff' },
  { name: 'Python', val: 80, color: '#a855f7' },
  { name: 'Claude/Gemini', val: 92, color: '#00d9ff' },
  { name: 'Antigravity', val: 95, color: '#a855f7' },
  { name: 'N8N', val: 85, color: '#00d9ff' },
  { name: 'AWS', val: 60, color: '#a855f7' },
];

export const softSkills = [
  { name: 'Problem Solving', progress: 95 },
  { name: 'Communication', progress: 90 },
  { name: 'Adaptability', progress: 85 },
  { name: 'Time Management', progress: 85 },
  { name: 'People Management', progress: 80 },
];

export const experiences = [
  {
    role: "Data Protection Officer",
    company: "ViZO Technology Limited",
    period: "April 2024 - Present",
    location: "Hybrid / Abuja",
    badge: "Current Role",
    achievements: [
      "Implementing AI-driven monitoring for data compliance and security protocols.",
      "Developing RAG systems for internal knowledge base management.",
      "Leading cross-departmental automation workflows using N8N and Supabase.",
      "Ensuring alignment with global and local data protection regulations (NDPA)."
    ]
  },
  {
    role: "AWS Cloud Virtual Internship",
    company: "DGI Integrated Services",
    period: "May 2023 - April 2024",
    location: "Remote",
    achievements: [
      "Mastered core AWS services including S3, EC2, and IAM configurations.",
      "Designed scalable cloud architectures for data-heavy applications.",
      "Gained hands-on experience in cloud security and performance optimization.",
      "Simulated enterprise cloud deployments and VPC management."
    ]
  }
];

export const projects = [
  {
    title: "RAG System for ViZO Technologies",
    description: "Intelligent document querying system with vector embeddings and semantic search.",
    tech: ["Python", "LangChain", "OpenAI", "Vector DB"],
    primaryTech: "Python / AI",
    github: "https://github.com/DavidGaso1/ViZO-RAG",
    stars: 124,
    forks: 35
  },
  {
    title: "AI Assistant Automation Workflow",
    description: "Comprehensive N8N workflow integrating Gemini, OpenAI, and Supabase for task management.",
    tech: ["N8N", "Gemini", "OpenAI", "Supabase"],
    primaryTech: "Automation",
    github: "https://github.com/DavidGaso1/N8N-AI-Workflow",
    stars: 89,
    forks: 12
  },
  {
    title: "AI Academic Assignment Generator",
    description: "Automated essay generator providing structured content with academic citations.",
    tech: ["Google Gemini", "HTML/CSS", "JSON"],
    primaryTech: "GenAI",
    github: "https://github.com/DavidGaso1/AI-Assignment-Gen",
    stars: 256,
    forks: 42
  },
  {
    title: "Data Cleaning with MySQL",
    description: "Robust data preprocessing workflow designed for large-scale analytics pipelines.",
    tech: ["MySQL", "SQL", "Data Analysis"],
    primaryTech: "Data Engineering",
    github: "https://github.com/DavidGaso1/MySQL-Data-Cleaning",
    stars: 67,
    forks: 8
  }
];

export const certifications = [
  {
    title: "NYSC Certificate",
    issuer: "Federal Govt of Nigeria",
    year: "2025",
    type: "National"
  },
  {
    title: "Workflow Automation",
    issuer: "Udemy",
    year: "2025",
    type: "Technical"
  },
  {
    title: "Data Protection",
    issuer: "Data Protection Academy",
    year: "2024",
    type: "Compliance"
  },
  {
    title: "AWS S3 Basics",
    issuer: "Amazon Web Services",
    year: "2022",
    type: "Cloud"
  },
  {
    title: "Project Management",
    issuer: "Coursera / Google",
    year: "2023",
    type: "Management"
  }
];
