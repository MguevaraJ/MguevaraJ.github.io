import { profile } from './profile'
import type { Project } from './types'

export const projects: Project[] = [
  {
    id: 'vr-platform',
    name: {
      en: 'Multi-tenant VR training platform',
      es: 'Plataforma multi-tenant de formación en VR',
    },
    context: {
      en: 'VR Academy — a SaaS where organizations run immersive training sessions in shared virtual classrooms.',
      es: 'VR Academy — un SaaS donde las organizaciones dictan formaciones inmersivas en aulas virtuales compartidas.',
    },
    challenge: {
      en: 'Keep many VR headsets in the same classroom perfectly in sync, while isolating the data and content of every tenant on a single platform.',
      es: 'Mantener perfectamente sincronizados muchos visores VR dentro de la misma aula, aislando los datos y el contenido de cada tenant en una sola plataforma.',
    },
    approach: {
      en: [
        'NestJS backend and React/Vite frontend in an Nx monorepo, with Clean Architecture in the shared libraries.',
        'Colyseus rooms as the authoritative session state, Socket.IO for device events.',
        'Device authentication moved to the WebSocket connection phase, validated with API tokens.',
        'Elasticsearch for content search and S3 presigned URLs for media delivery.',
      ],
      es: [
        'Backend NestJS y frontend React/Vite en un monorepo Nx, con Clean Architecture en las librerías compartidas.',
        'Rooms de Colyseus como estado autoritativo de la sesión y Socket.IO para los eventos de dispositivos.',
        'Autenticación de dispositivos movida a la fase de conexión del WebSocket, validada con API tokens.',
        'Elasticsearch para búsqueda de contenido y URLs prefirmadas de S3 para multimedia.',
      ],
    },
    outcome: {
      en: [
        'Closed an authentication gap in the device-join flow.',
        'Shipped an AI-assisted 360° content generator, from API design to the tenant UI.',
      ],
      es: [
        'Se cerró una brecha de autenticación en el flujo de ingreso de dispositivos.',
        'Se entregó un generador de contenido 360° asistido por IA, desde la API hasta la interfaz del tenant.',
      ],
    },
    stack: [
      'NestJS',
      'Nx',
      'Colyseus',
      'Socket.IO',
      'React',
      'PostgreSQL',
      'Redis',
      'Elasticsearch',
      'AWS S3',
    ],
  },
  {
    id: 'port-migration',
    name: {
      en: 'Port logistics: AngularJS → Angular 15',
      es: 'Logística portuaria: AngularJS → Angular 15',
    },
    context: {
      en: 'Sociedad Puerto Aguadulce (via ASSIT TI) — the system that runs day-to-day port operations.',
      es: 'Sociedad Puerto Aguadulce (vía ASSIT TI) — el sistema que opera el día a día del puerto.',
    },
    challenge: {
      en: 'A legacy AngularJS frontend that was slow and expensive to change, on top of services that could not go down.',
      es: 'Un frontend legacy en AngularJS lento y costoso de modificar, sobre servicios que no podían caerse.',
    },
    approach: {
      en: [
        'Led the incremental migration to Angular 15 without stopping operations.',
        'NgRx to tame real-time data flows across the operational dashboards.',
        'Spring Boot microservices on WildFly, released through GitLab with code review.',
      ],
      es: [
        'Lideré la migración incremental a Angular 15 sin detener la operación.',
        'NgRx para ordenar los flujos de datos en tiempo real de los dashboards operativos.',
        'Microservicios Spring Boot sobre WildFly, con releases en GitLab y code review.',
      ],
    },
    outcome: {
      en: [
        '~90% faster load time and far less technical debt.',
        '99.9% uptime on the services behind port operations.',
      ],
      es: [
        'Tiempo de carga ~90% menor y mucha menos deuda técnica.',
        '99.9% de uptime en los servicios que sostienen la operación.',
      ],
    },
    stack: ['Angular 15', 'NgRx', 'TypeScript', 'Spring Boot', 'WildFly'],
  },
  {
    id: 'grid-monitoring',
    name: {
      en: 'Real-time electrical grid monitoring',
      es: 'Monitoreo en tiempo real de redes eléctricas',
    },
    context: {
      en: 'IEH Electricidad — operators watching the state of an electrical network live.',
      es: 'IEH Electricidad — operadores que vigilan en vivo el estado de una red eléctrica.',
    },
    challenge: {
      en: 'Represent a complex network so operators can read it at a glance, with data that changes constantly.',
      es: 'Representar una red compleja para que los operadores la lean de un vistazo, con datos que cambian todo el tiempo.',
    },
    approach: {
      en: [
        'Interactive SVG diagrams and dynamic charts for the network.',
        'Express REST APIs over MySQL and MongoDB.',
        'Rebuilt the monitoring UI in React; automated deployments on Linux.',
      ],
      es: [
        'Diagramas SVG interactivos y gráficos dinámicos de la red.',
        'APIs REST en Express sobre MySQL y MongoDB.',
        'Reconstrucción de la interfaz en React; despliegues automatizados en Linux.',
      ],
    },
    outcome: {
      en: ['Much faster initial load on the operator dashboard.', 'Fewer manual release errors.'],
      es: [
        'Carga inicial mucho más rápida del dashboard de operadores.',
        'Menos errores manuales en los releases.',
      ],
    },
    stack: ['React', 'SVG', 'Express', 'MySQL', 'MongoDB', 'Linux'],
  },
  {
    id: 'portfolio',
    name: { en: 'This portfolio', es: 'Este portafolio' },
    context: {
      en: 'The site you are using right now.',
      es: 'El sitio que estás usando ahora mismo.',
    },
    challenge: {
      en: 'Show my work in a way that is memorable for developers and still easy for everyone else.',
      es: 'Mostrar mi trabajo de una forma memorable para developers y fácil para todos los demás.',
    },
    approach: {
      en: [
        'A small Vim engine written as a pure, unit-tested reducer: modes, motions, counts, search and ex commands.',
        'Content as typed, bilingual data rendered into buffers, so the UI and the CV never drift apart.',
        'Everything is also clickable, so no one needs to know Vim.',
      ],
      es: [
        'Un pequeño motor de Vim escrito como un reducer puro y con tests: modos, movimientos, contadores, búsqueda y comandos ex.',
        'El contenido son datos tipados y bilingües que se renderizan como buffers, así la interfaz y el CV nunca se desincronizan.',
        'Todo también se puede usar con el mouse, nadie necesita saber Vim.',
      ],
    },
    outcome: {
      en: ['React 19 + Vite + TypeScript, no UI libraries.'],
      es: ['React 19 + Vite + TypeScript, sin librerías de UI.'],
    },
    stack: ['React', 'TypeScript', 'Vite', 'Vitest'],
    links: profile.links.source ? [profile.links.source] : undefined,
  },
]
