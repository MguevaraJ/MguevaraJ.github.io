# moises@portfolio — nvim

Personal portfolio of **Moisés Guevara**, Fullstack Developer (TypeScript · NestJS · React · Angular).

The site is a terminal running Neovim: every section of the portfolio is a **Vim tab**,
navigable with real Vim keys — and fully usable with the mouse or on a phone for people who
have never touched Vim.

```
README.md  experience.md  projects.md  stack.ts  contact.md  cv.pdf
```

## Features

- **Vim tabs as navigation** — `gt` / `gT` / `{n}gt`, `:e file` (with `<Tab>` completion), `:q`, or click.
- **Real Vim engine** — normal / insert / command modes, counts (`5j`), `gg` / `G`, `w` / `b`,
  `0` / `$`, `CTRL-D` / `CTRL-U`, `/search` with `n` / `N`, `gx` / `<Enter>` on links,
  Vim-accurate error messages (`E492: Not an editor command`).
- **Contact form as a buffer** — `i` to type, `<Esc>` to leave, `:w` to send.
- **Bilingual** (EN / ES), auto-detected, `:set lang=es` or the `ES` button.
- **Themes** — Gruvbox dark by default, `:set background=light` or `◐`.
- Deep links (`/#/projects`), browser back/forward between tabs, a boot sequence that types
  `nvim -p ...`, file tree (`<Space>e`), `:help`.

## Stack

React 19 · TypeScript (strict) · Vite · CSS Modules · Vitest + Testing Library · ESLint · Prettier.
No UI or state libraries.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script                                  | What it does                    |
| --------------------------------------- | ------------------------------- |
| `npm run dev`                           | Dev server with HMR             |
| `npm run build`                         | Type-check and build to `dist/` |
| `npm run preview`                       | Serve the production build      |
| `npm test`                              | Unit and integration tests      |
| `npm run lint` / `typecheck` / `format` | Code quality                    |

## Architecture

```
src/
├── content/        ← YOUR DATA: profile, experience, projects, skills (typed, EN + ES)
├── buffers/        ← turns content into "files" (README.md, stack.ts…) — one module per tab
├── editor/
│   ├── vim/        ← the Vim engine: a pure reducer (keys, motions, ex commands, search)
│   ├── model/      ← buffer / line / token types and helpers
│   ├── syntax/     ← tiny highlighters: markdown, typescript, vim help
│   ├── hooks/      ← keyboard, URL hash, side-effects runner, viewport size
│   └── components/ ← TabLine, BufferView, StatusLine, CommandLine, FileTree…
├── app/            ← terminal window, boot sequence, preferences
├── i18n/           ← locales and UI messages
├── services/       ← contact form delivery
└── styles/         ← theme tokens (Gruvbox dark/light) and globals
```

Key decisions:

- **The editor is a pure reducer** (`editor/vim/reducer.ts`). It never touches the DOM or
  the network; it queues `effects` (open URL, send form, change language) that
  `useEffectsRunner` executes. That keeps all Vim behaviour unit-testable.
- **The reducer is locale-agnostic** — it emits message keys, components translate them.
- **Content is data, not markup.** Buffers are generated from `src/content/*`, so updating
  the CV means editing one typed object, in both languages, in one place.

### Editing content

- Jobs → `src/content/experience.ts` · Projects → `src/content/projects.ts`
- Skills → `src/content/skills.ts` · Bio, links, languages → `src/content/profile.ts`
- CV PDFs → `public/cv/` (regenerate from `~/Proyectos/job-hunt/cv/build.sh` and copy them over)

### Adding a new tab

1. Create `src/buffers/<name>.ts` exporting `(locale) => BufferSource`.
2. Register it in `src/buffers/index.ts` (and in `STARTUP_TABS` to open it on load).

## Contact form

Set `VITE_CONTACT_ENDPOINT` (see `.env.example`) to any endpoint that accepts a JSON POST
with `{ name, email, message }` — e.g. a free [Formspree](https://formspree.io) form. Without
it, the form falls back to opening the visitor's mail client.

## Deploy

Any static host works; routing is hash-based, so no rewrites are needed.

- **Vercel / Netlify / Cloudflare Pages** — import the repo, build `npm run build`, output `dist`.
  Add `VITE_CONTACT_ENDPOINT` as an environment variable.
- **GitHub Pages** under `/<repo>/` — build with `npx vite build --base=/<repo>/`.

## License

MIT
