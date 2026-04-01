# Frontend Engineer — React · TypeScript · Next.js · Scalable Systems

Frontend Engineer building production-grade frontend systems with a focus on scalability, performance, and maintainability.

This repository contains my personal portfolio, showcasing real-world experience in complex applications, including real-time systems and modular architectures.

Portfolio: https://ssanjorge.netlify.app/

---

## About

I specialize in developing scalable web applications using React, TypeScript, and modern frontend architecture patterns.

My experience includes building and maintaining a real-time geolocation platform for underground mining operations, working within an international team and contributing to architectural decisions in production environments.

---

## Experience Highlights

- Built and maintained a real-time geolocation and traceability platform used in underground mining operations
- Contributed to architectural decisions within a team of 15 engineers
- Designed and implemented a **RBAC (Role-Based Access Control)** system across routes and components
- Developed applications using a **microfrontend architecture**, enabling modular development and independent deployments
- Optimized rendering and state management in real-time views, improving responsiveness
- Applied **TDD practices** using Vitest and React Testing Library in critical features
- Delivered features aligned with business-critical workflows in short development cycles

---

## Technical Focus

- **Architecture**: Microfrontends, modular systems, scalable frontend design
- **State Management**: Handling complex and real-time application state
- **Performance**: Render optimization and efficient data flow
- **Access Control**: Consistent RBAC implementation across the application
- **Testing**: TDD with high coverage in critical paths
- **Accessibility**: ARIA, semantic HTML, keyboard navigation

---

## Tech Stack

- **Frontend**: React, TypeScript, Next.js
- **State & UI**: Zustand, MUI, Tailwind CSS
- **Testing**: Vitest, React Testing Library
- **Backend (foundations)**: Node.js, Express, PostgreSQL

---

## Featured Project — Microfrontend Architecture

A modular frontend system built with **Webpack Module Federation**, composed of a host application, two independently deployed microfrontends, and a custom shared UI library.

Designed to simulate a real-world environment where multiple teams can develop, ship, and scale features independently without tightly coupling applications.

**Architecture:**

- Host application responsible for routing, layout composition, and runtime integration
- Two domain-based microfrontends:
  - Character List (data fetching + list rendering)
  - Character Detail (dynamic detail view loaded at runtime)
- Custom shared UI library (`tarjeta-lib`) to decouple UI from business logic and enforce consistency

**Key technical decisions:**

- Runtime composition via Module Federation (no build-time coupling)
- Monorepo setup using workspaces to improve developer experience and local orchestration
- Shared dependencies managed as singletons to avoid duplication and version conflicts
- Independent module boundaries to enable scalability across teams

**What this demonstrates:**

- How to structure frontend systems beyond a single SPA
- Separation of concerns across distributed applications
- Shared UI strategy without creating tight coupling
- Trade-offs involved in microfrontend architectures (complexity, coordination, runtime concerns)

This project focuses on **architecture, modularity, and maintainability**, rather than visual complexity.

→ Repository: https://github.com/tiansanjorge/microfrontends-architecture

---

## Contact

- GitHub: https://github.com/tiansanjorge
- LinkedIn: https://www.linkedin.com/in/sebastian-sanjorge-frontend-developer/
- Portfolio: https://ssanjorge.netlify.app/

---

## Introduction (35s)

https://www.youtube.com/watch?v=qlBhpazVkCQ
