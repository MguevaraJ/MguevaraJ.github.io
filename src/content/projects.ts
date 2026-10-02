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
    id: 'caring-data',
    name: {
      en: 'Geriatric-care management platform',
      es: 'Plataforma de gestión de cuidado geriátrico',
    },
    context: {
      en: 'Caring Data (via ASSIT TI) — the daily tool of the staff who look after elderly residents.',
      es: 'Caring Data (vía ASSIT TI) — la herramienta diaria del personal que cuida a residentes de la tercera edad.',
    },
    challenge: {
      en: 'Bring residents, staff, medical records and schedules into one system that non-technical staff could rely on every day.',
      es: 'Reunir residentes, personal, historias médicas y agendas en un solo sistema en el que el personal no técnico pudiera confiar a diario.',
    },
    approach: {
      en: [
        'Built it end to end: React frontend, Laravel REST backend, MySQL data layer.',
        'Modeled the relational schema for residents, staff, medical records and scheduling.',
        'Admin panels with dynamic tables and custom reports.',
      ],
      es: [
        'La construí de punta a punta: frontend en React, backend REST en Laravel y capa de datos en MySQL.',
        'Modelé el esquema relacional de residentes, personal, historias médicas y agendas.',
        'Paneles administrativos con tablas dinámicas y reportes personalizados.',
      ],
    },
    outcome: {
      en: [
        'Admin panels and reports used daily by the internal staff.',
        'Ongoing maintenance and direct support to the end users.',
      ],
      es: [
        'Paneles y reportes usados a diario por el personal interno.',
        'Mantenimiento continuo y soporte directo a los usuarios finales.',
      ],
    },
    stack: ['React', 'Laravel', 'PHP', 'MySQL', 'REST APIs'],
  },
  {
    id: 'f2f3',
    name: {
      en: 'F2+F3: screenshot manager for technical Minecraft',
      es: 'F2+F3: gestor de capturas para Minecraft técnico',
    },
    context: {
      en: 'Personal, open-source product in three repositories: a desktop app, a game mod and its website. Designed, built and released by me.',
      es: 'Producto personal y open source en tres repositorios: una app de escritorio, un mod del juego y su sitio web. Diseñado, construido y publicado por mí.',
    },
    challenge: {
      en: 'Technical players use screenshots as notes: the coordinates, biome and dimension live in the F3 debug overlay, trapped inside the image. Turn a folder of PNGs into searchable data, offline and without making the player change how they play.',
      es: 'Los jugadores técnicos usan las capturas como notas: las coordenadas, el bioma y la dimensión viven en el overlay de depuración F3, atrapados dentro de la imagen. Convertir una carpeta de PNGs en datos consultables, sin internet y sin cambiarle al jugador su forma de jugar.',
    },
    approach: {
      en: [
        '**f2f3 (desktop app)** — turns screenshots into data. A pixel-level OCR reads the F3 overlay using the real bitmap font extracted from the game, in worker threads; on top of it, a gallery, viewer, coordinate search (`x>1000 y<0`) and export to Excel/CSV/ZIP.',
        "**AI · local model, on the user's machine** — CLIP (`clip-vit-base-patch32`, fp16 weights) running in-process with transformers.js / ONNX: an optional one-time download of ~170 MB, then no internet, no API key and no cost per image, at about 54 ms per screenshot.",
        '**AI · how it is used** — zero-shot classification: the text embeddings of prompts like “a Minecraft screenshot of a desert” are precomputed and shipped with the app; each screenshot is embedded once (the whole scene for the biome, a crop around the crosshair for the mob) and compared by cosine similarity + softmax. It only answers above a confidence threshold and a margin over the runner-up; otherwise it says nothing.',
        '**AI · measured reliability** — I built an evaluation pipeline: the mod records the real biome and mob of each screenshot, so its output is the ground truth. A script scores the model against that labelled set and reports precision, coverage and false alarms; the thresholds were calibrated from those runs.',
        '**AI · commercial models, optional** — one provider interface with a shared prompt and JSON schema (structured output) for Claude, OpenAI, Gemini, any OpenAI-compatible server (OpenRouter, LM Studio) and Ollama. They add what the local model cannot do: structures, weather, time of day. Keys are stored encrypted and never reach the renderer.',
        '**AI · trust by design** — every value shows where it came from and is merged by precedence: exact (mod or F3) > advanced vision > local model > color heuristics. A guess is never passed off as a fact.',
        '**f2f3 · desktop engineering** — pure, Electron-free core so the logic is unit-testable; sandboxed renderer with a typed IPC contract and strict CSP; incremental Google Drive backup with OAuth (loopback + PKCE).',
        '**f2f3-companion (Fabric mod, Java)** — removes the guesswork at the source: on every screenshot it writes the exact game state next to the image, and brings the app into the game (gallery, guide arrow to where a screenshot was taken, saving and placing builds). One reference version plus ports to two older Minecraft versions through a small compatibility layer.',
        '**f2f3-web (landing, Astro)** — explains the product in English and Spanish with no client framework. The accuracy figures of the local model are generated from an evaluation script, not written by hand.',
      ],
      es: [
        '**f2f3 (app de escritorio)** — convierte capturas en datos. Un OCR píxel a píxel lee el overlay F3 con la fuente bitmap real extraída del juego, en worker threads; encima, galería, visor, búsqueda por coordenadas (`x>1000 y<0`) y exportación a Excel/CSV/ZIP.',
        '**IA · modelo local, en el equipo del usuario** — CLIP (`clip-vit-base-patch32`, pesos fp16) corriendo dentro de la app con transformers.js / ONNX: una descarga única y opcional de ~170 MB, y después sin internet, sin API key y sin costo por imagen, a unos 54 ms por captura.',
        '**IA · cómo se usa** — clasificación zero-shot: los embeddings de texto de prompts como “a Minecraft screenshot of a desert” se precalculan y van incluidos en la app; cada captura se convierte en embedding una vez (la escena completa para el bioma, un recorte alrededor de la mira para el mob) y se compara por similitud coseno + softmax. Solo responde por encima de un umbral de confianza y de un margen sobre el segundo candidato; si no, no dice nada.',
        '**IA · fiabilidad medida** — construí un pipeline de evaluación: el mod registra el bioma y el mob reales de cada captura, así que su salida es la verdad de referencia. Un script puntúa el modelo contra ese conjunto etiquetado y reporta precisión, cobertura y falsas alarmas; los umbrales se calibraron con esas corridas.',
        '**IA · modelos comerciales, opcional** — una sola interfaz de proveedores con prompt y esquema JSON compartidos (salida estructurada) para Claude, OpenAI, Gemini, cualquier servidor compatible con OpenAI (OpenRouter, LM Studio) y Ollama. Aportan lo que el modelo local no puede: estructuras, clima y hora del día. Las claves se guardan cifradas y nunca llegan al renderer.',
        '**IA · confianza por diseño** — cada dato muestra de dónde salió y se fusiona por precedencia: exacto (mod o F3) > visión avanzada > modelo local > heurística de colores. Una estimación nunca se hace pasar por un hecho.',
        '**f2f3 · ingeniería de escritorio** — núcleo puro, sin Electron, para que la lógica sea testeable; renderer en sandbox con contrato IPC tipado y CSP estricta; respaldo incremental en Google Drive con OAuth (loopback + PKCE).',
        '**f2f3-companion (mod de Fabric, Java)** — elimina la incertidumbre en el origen: en cada captura escribe junto a la imagen el estado exacto del juego, y lleva la app dentro del juego (galería, flecha que te guía al lugar de una captura, guardar y colocar builds). Una versión de referencia y ports a dos versiones anteriores de Minecraft con una pequeña capa de compatibilidad.',
        '**f2f3-web (landing, Astro)** — explica el producto en inglés y español sin framework de cliente. Las cifras de precisión del modelo local se generan con un script de evaluación, no se escriben a mano.',
      ],
    },
    outcome: {
      en: [
        'Released: versioned builds of the app and the mod on GitHub, with the Windows installer built in GitHub Actions; landing live on GitHub Pages.',
        '172 automated tests; the OCR reads vanilla screenshots with 100% accuracy in the test suite.',
        'Local model measured on 248 screenshots labelled by the mod: mobs 85% precision (17 of 20 answers, 2 false alarms in 177 screenshots without one); biomes 42% (30 of 71).',
        'Those figures are published as measured on the landing page. They are why the mob detector is tuned to stay quiet unless sure, and why biomes from the local model are shown as an estimate below F3, the mod and advanced vision.',
      ],
      es: [
        'Publicado: versiones de la app y del mod en GitHub, con el instalador de Windows compilado en GitHub Actions; landing en línea con GitHub Pages.',
        '172 tests automatizados; el OCR lee las capturas vanilla con 100 % de precisión en la suite de tests.',
        'Modelo local medido sobre 248 capturas etiquetadas por el mod: mobs 85 % de precisión (17 de 20 respuestas, 2 falsas alarmas en 177 capturas sin mob); biomas 42 % (30 de 71).',
        'Esas cifras se publican tal cual en la landing. Por ellas el detector de mobs está ajustado para callar si no está seguro, y los biomas del modelo local se muestran como estimación, por debajo del F3, el mod y la visión avanzada.',
      ],
    },
    stack: [
      'Electron',
      'React',
      'TypeScript',
      'Zustand',
      'Vitest',
      'CLIP',
      'transformers.js (ONNX)',
      'Java',
      'Fabric',
      'Astro',
      'GitHub Actions',
    ],
    links: [
      { label: 'mguevaraj.github.io/f2f3-web', href: 'https://mguevaraj.github.io/f2f3-web/' },
      { label: 'github.com/MguevaraJ/f2f3', href: 'https://github.com/MguevaraJ/f2f3' },
      {
        label: 'github.com/MguevaraJ/f2f3-companion',
        href: 'https://github.com/MguevaraJ/f2f3-companion',
      },
      { label: 'github.com/MguevaraJ/f2f3-web', href: 'https://github.com/MguevaraJ/f2f3-web' },
    ],
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
