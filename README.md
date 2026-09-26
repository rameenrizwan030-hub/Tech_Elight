# BudgetBasics — React SPA

This version migrates the existing BudgetBasics single-page website into a Vite + React application while preserving the existing content, JSON datasets, CSS, image assets, interactive calculators/planners, games, Explore search/sort/filter, chatbot, modals, and responsive behavior.

## Structure

```text
src/
  components/
    footer/footer.jsx
    navbar/navbar.jsx
    router/HashRouter.jsx
  pages/
    home/home.jsx
  App.jsx
  main.jsx
  routes.js
  styles/

public/
  assets/
  data/
  legacy/
  sitemap.xml
```

The existing feature controllers are kept in `public/legacy/` as a compatibility layer so the migration does not silently remove working functionality. The page shell and component structure are React-based, and Vite owns the build.

## Run

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run preview
```

No backend, banking integration, payment service, or permanent server-side financial storage was introduced.
