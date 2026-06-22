# Mini-Project-2

Submitted by Joshua Ojeda.

## Project Concept

**MarketFlow** is a React product discovery dashboard for browsing products from the Fake Store API, viewing product details, saving favorites, and planning a small shopping shortlist. It is intentionally focused: the app demonstrates React Router, hooks, API integration, reusable components, MUI, and global state without becoming too large to present clearly.

## Planned Tech Stack

- React functional components with Vite
- React Router for multi-page navigation
- Material UI for layout, cards, forms, loading states, and navigation
- Axios for external API requests
- React hooks: `useState`, `useEffect`, `useContext`, and a custom `useProducts` hook
- External API: `https://fakestoreapi.com/products`

## How to Run

```bash
npm install
npm run dev
```

Then open the local Vite URL, usually `http://localhost:5173`.

Useful checks:

```bash
npm run lint
npm run build
```

## MVP Checklist

- [x] Design plan in `docs/DESIGN.md`
- [x] Functional React app created with Vite
- [x] At least three routes using React Router
- [x] `useState` for search, filters, sorting, and saved products
- [x] `useEffect` for API calls
- [x] MUI component library
- [x] External API data displayed dynamically
- [x] Dynamic product detail route
- [x] Global state with Context
- [x] Custom hook for product fetching
- [x] Saved-product persistence with `localStorage`
- [x] Presentation notes in app and design doc

## Presentation Quick Script

1. Start with `docs/DESIGN.md` and `docs/wireframes/README.md` to show planning, separate page wireframes, routes, and component hierarchy.
2. Open the Dashboard and explain the app purpose: product discovery with live API data.
3. Go to Products and demonstrate search, category filter, sorting, reset filters, and saved products.
4. Open a Product Detail page to show dynamic routing with `products/:productId`.
5. Go to Planner to show global context state and saved products persisting after refresh.
6. Finish on About to summarize hooks, architecture, tools, and future improvements.

## Project Planning

See [docs/DESIGN.md](docs/DESIGN.md) for requirements, routes, component hierarchy, and presentation notes.

Separate page wireframes are available here:

- [Wireframe index](docs/wireframes/README.md)
- [Dashboard wireframe](docs/wireframes/dashboard.md)
- [Products wireframe](docs/wireframes/products.md)
- [Product Detail wireframe](docs/wireframes/product-detail.md)
- [Planner wireframe](docs/wireframes/planner.md)
- [About wireframe](docs/wireframes/about.md)

This is the second major coding project designed to consolidate everything learned in Modules 5 - 7: Back-end Development, Node.js, APIs, React, Router, Hooks, External UI Libraries, and API integration.

## Tools & AI Use

In the interest of academic honesty, here is how this project was built and where AI assistance was used:

- **React application (`src/`)** — written by me (Joshua Ojeda): the components, pages, React Router setup, the custom `useProducts` hook, Context, and all state/filter/sort logic.
- **AI assistance (Claude / Claude Code)** was used for two specific things:
  - **Code review** — auditing the app, running `npm run lint` / `npm run build`, and flagging improvements (e.g., that `useProducts` refetches on each page).
  - **Wireframes** — generating the diagrams in `docs/wireframes/`, `docs/wireframes.svg`, and `docs/wireframes-lofi/` from my existing app and design plan.
- I reviewed every AI-generated artifact and can explain the design decisions and code during the presentation.

## Overview

This project is designed to consolidate your knowledge of modern Front-End development using **React**. You will build a Single Page Application (SPA) that demonstrates your ability to manage component-based architecture, client-side routing, and complex state management.

The goal is to move beyond static pages and simple DOM manipulation (which you did in Mini-Project #1) and create a dynamic, responsive user experience similar to modern commercial web applications.

Your project should demonstrate clear design thinking, a solid grasp of the React lifecycle (via Hooks), and the ability to integrate external UI libraries.

## Project Goals

Your web app should:

* Be built entirely using **React Functional Components**.
* Utilize **React Router** to create a multi-page experience within a single-page application.
* Demonstrate appropriate use of **React Hooks** (`useState`, `useEffect`, and optionally `useContext`).
* Fetch and display data from an **external API** (or complex internal data structure).
* Integrate a **React UI Library** (e.g., Material UI, React Bootstrap, Chakra UI) for styling and components.
* Break down the UI into small, reusable **components** with clear parent/child relationships.
* Be version-controlled using **Git** with meaningful commits and branches.
* Be clearly explained during a **5–10 minute presentation**.

## Presentation Goals

During your presentation, please address the following specific points:

1.  **Process:** What was your requirements gathering and design process? (Show your wireframes/Figma).
2.  **Overview:** Give a high-level overview of your application and its features.
3.  **Data:** Where does your data come from? How does the application process and display it?
4.  **Interaction:** How does the user interact with your application?
5.  **Architecture:**
    * How did you structure/break up your components?
6.  **Hooks:** What kinds of React hooks have you used (e.g., state, context, effect, navigate) and how?
7.  **Tools:** What external tools or libraries have you used (e.g., Axios, MUI)? Why did you choose them?
8.  **Future:** How might you extend the features of your application in the future?

## Minimum Viable Project (MVP)

Your project must include:

- [ ] A **design plan** (wireframe, sketch, or Figma link)
- [ ] A functional **React application** (created via Vite)
- [ ] At least **three distinct routes** (pages) navigable via React Router
- [ ] Proper usage of `useState` to manage application data
- [ ] Proper usage of `useEffect` to handle side effects (like API calls)
- [ ] Integration of a **UI Component Library** (MUI, Bootstrap, etc.)
- [ ] **Fetched data** displayed dynamically on the UI
- [ ] Proper **Git version control** (meaningful commits, repository hosted on GitHub)
- [ ] Minimum 2 Branches, merged into **main** via **Pull Requests**
- [ ] A **5–10 minute presentation** explaining your app, process, and code

## Optional Enhancements (Stretch Goals)

Not required, but these can elevate your project and score:

- **Global State Management:** Use `useContext` to avoid "prop-drilling" across multiple levels.
- **Custom Hooks:** Extract repetitive logic into your own custom hooks.
- **Dynamic Routing:** Use URL parameters (e.g., `/product/:id`) to render detailed views for specific items.
- **Form Handling:** Complex form validation or controlled components.
- **Deployment:** Host your app live on Vercel, Netlify, or GitHub Pages.

## Rubric

The project is graded out of **10 points** based on the following criteria:

| Category | Description |
| :--- | :--- |
| **Design & Planning** | Evidence of requirements gathering, wireframes (Figma/Sketches), and component hierarchy planning prior to coding. |
| **Functionality** | The application runs without errors, navigation works correctly, and the app meets the objectives defined in your scope. |
| **Code Quality** | Code is tidy, logical, and well-structured. avoids repetition (DRY), and components are small and focused. |
| **React Concepts** | Correct implementation of Functional Components, Hooks (`useState`, `useEffect`), and Routing. |
| **UI/UX** | Application is visually attractive, responsive, and makes good use of the chosen UI library. |
| **Presentation** | Engaging 5–10 minute delivery that clearly answers the presentation questions listed above. |

| Score | Description |
| :--- | :--- |
| 10 points | Fully functional, original application that meets all objectives, uses well structured code and includes evidence of design/requirements planning |
| 8–9 points | Mostly functional application covering main objectives, with tidy code and evidence of planning |
| 7 points | Minimal planning/design, application includes core features with some attempts at well structured code |
| 6 points or below | Reliance on code copied from elsewhere, important features incomplete, mostly messy/unstructured code, no design process |

## Tips for Success

* **Think in React:** Before coding, draw a box around every component in your design. Decide what is a parent, what is a child, and where the "State" should live.
* **Don't Over-complicate:** A simple, working app is better than a complex, broken one. Aim for 8–10 hours of effort.
* **Console is your Friend:** Keep your browser developer tools (and React Dev Tools extension) open to watch for errors and log your data flow.
* **Read the Docs:** React and Material UI/Bootstrap have excellent documentation. Refer to them often.
