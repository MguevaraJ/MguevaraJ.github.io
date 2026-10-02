import type { Localized } from '@/i18n/locale'
import type { SkillGroup } from './types'

/** What I use every day — shown first. */
export const coreSkills = ['TypeScript', 'NestJS', 'Node.js', 'React', 'Angular']

export const coreComment: Localized = {
  en: 'what I work with every day',
  es: 'con lo que trabajo todos los días',
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'languages',
    comment: { en: 'languages', es: 'lenguajes' },
    items: ['TypeScript', 'JavaScript (ES6+)', 'PHP', 'Java', 'Python', 'SQL'],
  },
  {
    key: 'ai',
    comment: {
      en: 'AI engineering: agents, RAG and LLM tooling',
      es: 'ingeniería de IA: agentes, RAG y herramientas para LLMs',
    },
    items: [
      'LangGraph',
      'LangChain',
      'Claude API',
      'Ollama (local LLMs)',
      'Multi-agent systems',
      'Structured outputs (Pydantic / Outlines)',
      'RAG / GraphRAG',
      'LangSmith',
      'Prompt engineering',
    ],
  },
  {
    key: 'backend',
    comment: { en: 'APIs, real-time and services', es: 'APIs, tiempo real y servicios' },
    items: [
      'NestJS',
      'Node.js',
      'Express',
      'Colyseus',
      'Socket.IO',
      'WebSockets',
      'REST APIs',
      'JWT / Passport',
      'Laravel',
      'Spring Boot',
    ],
  },
  {
    key: 'frontend',
    comment: { en: 'interfaces and state', es: 'interfaces y estado' },
    items: [
      'React',
      'Angular (2+ / 15)',
      'Redux',
      'NgRx',
      'Vite',
      'MUI',
      'TailwindCSS',
      'SVG / data viz',
    ],
  },
  {
    key: 'databases',
    comment: { en: 'data modeling and search', es: 'modelado de datos y búsqueda' },
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'TypeORM'],
  },
  {
    key: 'infra',
    comment: { en: 'the path to production', es: 'el camino a producción' },
    items: [
      'Linux',
      'Nginx',
      'Docker',
      'Podman',
      'AWS S3',
      'PM2',
      'Nx monorepo',
      'Git (GitHub / GitLab)',
      'Jest',
      'Swagger',
      'WildFly',
    ],
  },
  {
    key: 'practices',
    comment: { en: 'how I work', es: 'cómo trabajo' },
    items: [
      'Clean Architecture',
      'Microservices',
      'Multi-tenancy',
      'Code review',
      'CI/CD',
      'Agile',
    ],
  },
]
