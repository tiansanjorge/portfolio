# Sebastián Sanjorge — Portfolio

Full Stack Engineer with a Frontend specialization. This repository is the source code of my personal portfolio: a static, multi-page site (no framework, no build step) covering my experience, projects, and case studies.

**Live site:** https://ssanjorge.netlify.app/

---

## Pages

- **Home** (`index.html`) — introduction, featured work, and skills.
- **Experience** (`pages/experience.html`) — IPH, Terragene, Freelance, and Henry Bootcamp, as tabs.
- **Projects** (`pages/works.html`) — FleetOps, Microfrontend Architecture, Rick & Morty Wiki, and Taste Labs.
- **Case Studies** (`pages/case-studies.html`) — four Problem → Decision → Result write-ups going deeper than the project teasers.
- **Contact** (`pages/contact.html`) — social links and CV download.

## Experience

- **IPH (Spain)** — Frontend Engineer on a real-time geolocation and traceability platform for mining operations, inside a microfrontend architecture. Designed and implemented the platform's RBAC system from scratch.
- **Terragene** — Freelance. Rebuilt the corporate web platform as a Next.js frontend on a WordPress Headless architecture, owning Frontend architecture, integration, and delivery.
- **Freelance** — Two production clients (a law firm and a mental health practice), plus Terragene above.
- **Henry Bootcamp** — Graduation project (VetsForPets), technical lead on a 9-person full-stack team.

Full narratives for IPH, Terragene, and two personal projects (FleetOps, Taste Labs) are in [Case Studies](https://ssanjorge.netlify.app/pages/case-studies.html).

## Projects

| Project | Stack | Link |
|---|---|---|
| FleetOps | Next.js, React, TypeScript, Zustand, React Query, MSW, Leaflet | [Live](https://fleetoperations.vercel.app/) · [Repo](https://github.com/tiansanjorge/fleet-ops) |
| Microfrontend Architecture | React, TypeScript, Webpack Module Federation | [Repo](https://github.com/tiansanjorge/microfrontends-architecture) |
| Rick & Morty Wiki | Next.js, TypeScript, Vitest, React Testing Library | [Live](https://rickandmortyexp.netlify.app/) · [Repo](https://github.com/tiansanjorge/intramed-challenge) |
| Taste Labs Assessment | React, Tailwind, WebGL2, GLSL, Claude Code | [Live](https://lambda-ai-clone.vercel.app/) · [Repo](https://github.com/tiansanjorge/lambda-ai-clone) |

## Tech stack of this site

- HTML, CSS, and vanilla JavaScript — no build tool, no framework.
- Bootstrap 5 (CDN) for the grid and base utilities.
- Custom i18n: `i18n/translations.json` + `data-i18n` attributes, applied at runtime via `fetch()` in `script.js`.
- Tab/accordion interactions (experience tabs, project grid, case studies) are plain JS, no library.

### Running locally

Because translations are loaded with `fetch()`, opening `index.html` directly (`file://`) will fail silently due to CORS. Serve the folder with any static server, e.g. VS Code's Live Server extension.

## Contact

- GitHub: https://github.com/tiansanjorge
- LinkedIn: https://www.linkedin.com/in/sebastian-sanjorge-fullstack-engineer/
- Portfolio: https://ssanjorge.netlify.app/
