import type { Profile } from './types'

const base = import.meta.env.BASE_URL

export const profile: Profile = {
  name: 'Moisés Guevara',
  role: { en: 'Fullstack Developer', es: 'Desarrollador Fullstack' },
  headline: 'TypeScript · NestJS · React · Angular',
  location: {
    en: 'Anzoátegui, Venezuela · Remote (UTC-4)',
    es: 'Anzoátegui, Venezuela · Remoto (UTC-4)',
  },
  availability: {
    en: 'Open to remote fullstack / backend roles and contract work.',
    es: 'Disponible para roles fullstack / backend remotos y proyectos por contrato.',
  },
  summary: {
    en: [
      'I build and ship production web platforms in TypeScript. On the backend I focus on NestJS and Node.js: multi-tenant SaaS, REST and WebSocket APIs, real-time state synchronization and event-driven services.',
      'On the frontend I work with React and Angular at scale, including a full AngularJS → Angular 15 migration and complex state management with NgRx and Redux. I am comfortable owning the path to production: Linux servers, automated deployments and SQL/NoSQL data modeling.',
      'Lately I have been going deep into AI engineering. I designed and built a multi-agent coding system with LangGraph (Supervisor pattern) that pairs Claude with local models served by Ollama: structured output end to end, graph-based code retrieval (my own GraphRAG), sandboxed execution of generated code and tracing with LangSmith. In production, I shipped an AI-assisted 360° content generator at VR Academy.',
      'I also ship my own products. F2+F3 is an open-source desktop app (Electron, React) with a Java game mod and an Astro site, where a local vision model (CLIP, running on the user’s machine) reads screenshots. I measured its reliability against a labelled dataset and published the numbers, and it can also plug into Claude, OpenAI, Gemini or Ollama.',
    ],
    es: [
      'Construyo y llevo a producción plataformas web en TypeScript. En el backend me enfoco en NestJS y Node.js: SaaS multi-tenant, APIs REST y WebSocket, sincronización de estado en tiempo real y servicios orientados a eventos.',
      'En el frontend trabajo con React y Angular a escala, incluyendo una migración completa de AngularJS a Angular 15 y manejo de estado complejo con NgRx y Redux. Me siento cómodo siendo dueño del camino a producción: servidores Linux, despliegues automatizados y modelado de datos SQL/NoSQL.',
      'Últimamente me he metido a fondo en ingeniería de IA. Diseñé y construí un sistema multiagente de programación con LangGraph (patrón Supervisor) que combina Claude con modelos locales servidos por Ollama: salida estructurada de extremo a extremo, recuperación de contexto basada en un grafo del código (un GraphRAG propio), ejecución aislada del código generado y trazas con LangSmith. En producción, entregué un generador de contenido 360° asistido por IA en VR Academy.',
      'También publico mis propios productos. F2+F3 es una app de escritorio open source (Electron, React) con un mod del juego en Java y un sitio en Astro, donde un modelo de visión local (CLIP, corriendo en el equipo del usuario) lee las capturas. Medí su fiabilidad contra un conjunto de datos etiquetado y publiqué las cifras, y además se integra con Claude, OpenAI, Gemini u Ollama.',
    ],
  },
  strengths: {
    en: [
      '**Backend that holds up in production** — multi-tenancy, REST & WebSocket APIs, real-time sync.',
      '**Frontend at scale** — React and Angular, including legacy migrations.',
      '**AI engineering** — multi-agent systems with LangGraph, Claude and local LLMs, structured outputs, RAG and measured evaluation.',
      '**Architecture that survives growth** — Clean Architecture, Nx monorepos, shared libraries.',
      '**Ownership end to end** — Linux, Nginx, Docker and automated deploys.',
    ],
    es: [
      '**Backend que aguanta en producción** — multi-tenancy, APIs REST y WebSocket, sincronización en tiempo real.',
      '**Frontend a escala** — React y Angular, incluyendo migraciones de sistemas legacy.',
      '**Ingeniería de IA** — sistemas multiagente con LangGraph, Claude y LLMs locales, salida estructurada, RAG y evaluación medida.',
      '**Arquitectura que sobrevive al crecimiento** — Clean Architecture, monorepos Nx, librerías compartidas.',
      '**Responsabilidad de punta a punta** — Linux, Nginx, Docker y despliegues automatizados.',
    ],
  },
  email: 'mguevaraj27@gmail.com',
  links: {
    github: { label: 'github.com/MguevaraJ', href: 'https://github.com/MguevaraJ' },
    linkedin: {
      label: 'linkedin.com/in/moisesguevara',
      href: 'https://www.linkedin.com/in/moisesguevara/',
    },
    source: {
      label: 'github.com/MguevaraJ/MguevaraJ.github.io',
      href: 'https://github.com/MguevaraJ/MguevaraJ.github.io',
    },
  },
  languages: [
    { name: { en: 'Spanish', es: 'Español' }, level: { en: 'Native', es: 'Nativo' } },
    // TODO: add English with your real level (B1 / B2 / C1), e.g.
    // { name: { en: 'English', es: 'Inglés' }, level: { en: 'B2', es: 'B2' } },
  ],
  // TODO: fill in and uncomment once the CV has the real data.
  // education: {
  //   degree: { en: 'B.Sc. Computer Engineering', es: 'Ingeniería en Informática' },
  //   institution: 'University name',
  //   year: '2020',
  // },
  cv: {
    en: `${base}cv/Moises-Guevara-CV-EN.pdf`,
    es: `${base}cv/Moises-Guevara-CV-ES.pdf`,
  },
}
