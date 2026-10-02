import type { Job } from './types'

// Keep in sync with ~/Proyectos/job-hunt/cv/cv-{en,es}.html. Jobs without a period don't show dates.
export const experience: Job[] = [
  {
    id: 'vr-academy',
    role: { en: 'Fullstack Developer', es: 'Desarrollador Fullstack' },
    period: { en: 'Jan 2026 – Aug 2026', es: 'ene. de 2026 – ago. de 2026' },
    company: 'VR Academy',
    stack: [
      'NestJS',
      'Nx',
      'Colyseus',
      'React',
      'Vite',
      'TypeScript',
      'PostgreSQL',
      'Redis',
      'Elasticsearch',
      'AWS S3',
    ],
    highlights: {
      en: [
        'Built a multi-tenant SaaS platform for immersive VR training, owning both the NestJS backend and the React/Vite frontend inside an Nx monorepo.',
        'Implemented real-time multiplayer session state with Colyseus and Socket.IO, keeping VR devices synchronized across shared virtual classrooms.',
        'Designed device authentication at the WebSocket connection phase with API-token validation, closing an auth gap in the device-join flow.',
        'Integrated Elasticsearch for content search and AWS S3 presigned URLs for secure media delivery; shipped an AI-assisted 360° content generator from API design to the tenant-facing UI.',
        'Applied Clean Architecture across shared libraries to keep the platform maintainable as the team and feature set grew.',
      ],
      es: [
        'Construí una plataforma SaaS multi-tenant de formación inmersiva en VR, a cargo tanto del backend en NestJS como del frontend en React/Vite dentro de un monorepo Nx.',
        'Implementé el estado de sesiones multijugador en tiempo real con Colyseus y Socket.IO, manteniendo sincronizados los dispositivos VR en aulas virtuales compartidas.',
        'Diseñé la autenticación de dispositivos en la fase de conexión del WebSocket con validación de API tokens, cerrando una brecha en el flujo de ingreso.',
        'Integré Elasticsearch para búsqueda de contenido y URLs prefirmadas de AWS S3 para entrega segura de multimedia; entregué un generador de contenido 360° asistido por IA desde el diseño de la API hasta la interfaz del tenant.',
        'Apliqué Clean Architecture en las librerías compartidas para mantener la plataforma mantenible a medida que crecían el equipo y las funcionalidades.',
      ],
    },
  },
  {
    id: 'puerto-aguadulce',
    role: { en: 'Fullstack Developer', es: 'Desarrollador Fullstack' },
    period: { en: 'Jan 2022 – Aug 2025', es: 'ene. de 2022 – ago. de 2025' },
    company: 'ASSIT TI',
    client: 'Sociedad Puerto Aguadulce',
    stack: ['Angular 15', 'NgRx', 'TypeScript', 'Spring Boot', 'WildFly', 'Microservices'],
    highlights: {
      en: [
        'Led the migration of a legacy port-logistics system from AngularJS to Angular 15, cutting technical debt and improving load time by ~90%.',
        'Built and maintained Spring Boot microservices on WildFly supporting port operations at 99.9% uptime.',
        'Implemented NgRx state management to handle complex real-time data flows across operational dashboards.',
        'Worked in a GitLab-based workflow with code review and coordinated release branches.',
      ],
      es: [
        'Lideré la migración de un sistema legacy de logística portuaria de AngularJS a Angular 15, reduciendo la deuda técnica y mejorando el tiempo de carga ~90%.',
        'Construí y mantuve microservicios Spring Boot sobre WildFly que sostienen las operaciones del puerto con 99.9% de uptime.',
        'Implementé NgRx para manejar flujos de datos complejos en tiempo real en los dashboards operativos.',
        'Trabajé con un flujo basado en GitLab con code review y ramas de release coordinadas.',
      ],
    },
  },
  {
    id: 'caring-data',
    role: { en: 'Fullstack Developer', es: 'Desarrollador Fullstack' },
    period: { en: 'Jul 2023 – Aug 2025', es: 'jul. de 2023 – ago. de 2025' },
    company: 'ASSIT TI',
    client: 'Caring Data',
    stack: ['React', 'Laravel', 'MySQL'],
    highlights: {
      en: [
        'Developed a geriatric-care management platform end to end: React frontend, Laravel REST backend, MySQL data layer.',
        'Modeled complex relational schemas covering residents, staff, medical records and scheduling.',
        'Built admin panels with dynamic tables and custom reporting used daily by internal staff.',
        'Provided ongoing maintenance and direct technical support to end users.',
      ],
      es: [
        'Desarrollé de punta a punta una plataforma de gestión de cuidado geriátrico: frontend en React, backend REST en Laravel y capa de datos en MySQL.',
        'Modelé esquemas relacionales complejos de residentes, personal, historias médicas y agendas.',
        'Construí paneles administrativos con tablas dinámicas y reportes personalizados usados a diario por el personal.',
        'Di mantenimiento continuo y soporte técnico directo a los usuarios finales.',
      ],
    },
  },
  {
    id: 'ieh',
    role: { en: 'Software Engineer', es: 'Ingeniero de Software' },
    period: { en: 'Jan 2020 – Dec 2021', es: 'ene. de 2020 – dic. de 2021' },
    company: 'IEH Electricidad',
    stack: ['React', 'Express', 'Node.js', 'MySQL', 'MongoDB', 'Linux', 'SVG'],
    highlights: {
      en: [
        'Built interactive SVG diagrams and dynamic charts for real-time monitoring of electrical grid networks.',
        'Developed REST APIs with Express backed by MySQL and MongoDB.',
        'Rebuilt the monitoring UI in React, substantially reducing initial load time on the operator dashboard.',
        'Configured and deployed HTTP servers on Linux with automated deployment, reducing manual release errors.',
      ],
      es: [
        'Construí diagramas SVG interactivos y gráficos dinámicos para el monitoreo en tiempo real de redes eléctricas.',
        'Desarrollé APIs REST con Express sobre MySQL y MongoDB.',
        'Reconstruí la interfaz de monitoreo en React, reduciendo considerablemente el tiempo de carga inicial del dashboard de operadores.',
        'Configuré y desplegué servidores HTTP en Linux con despliegue automatizado, reduciendo errores manuales en los releases.',
      ],
    },
  },
]
