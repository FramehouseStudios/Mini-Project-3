# MarketFlow Design Plan

Submitted by Joshua Ojeda.

## Requirements Gathered

- Build a React SPA with functional components.
- Include at least three routes.
- Use React Router for navigation.
- Use `useState` for UI/application state.
- Use `useEffect` for API side effects.
- Use an external API and display fetched data.
- Use a UI component library.
- Keep components reusable and organized.
- Prepare a 5-10 minute presentation explaining process, data, interactions, architecture, hooks, tools, and future improvements.

## App Scope

MarketFlow helps a user browse a product catalog, inspect individual product details, and build a lightweight saved-product list. The app stays intentionally focused so the core React requirements are easy to demonstrate.

## Data Source

External API: `https://fakestoreapi.com/products`

The app fetches product objects with:

- `id`
- `title`
- `price`
- `description`
- `category`
- `image`
- `rating`

## Routes

- `/` - Dashboard summary with featured products and project overview.
- `/products` - Browse, search, filter, and sort fetched products.
- `/products/:id` - Dynamic product detail route.
- `/planner` - Saved product shortlist using global context state.
- `/about` - Presentation notes and architecture summary.

## Wireframe

See [`wireframes.svg`](wireframes.svg) for full page-by-page wireframes (Dashboard, Products, Product Detail, Planner, About) plus a wireframe key and component hierarchy. Low-fidelity ASCII version below:

```text
+--------------------------------------------------+
| MarketFlow                         nav links     |
+--------------------------------------------------+
| Dashboard headline + data summary cards          |
| [Products loaded] [Categories] [Saved items]      |
| Featured product cards                           |
+--------------------------------------------------+

+--------------------------------------------------+
| Products                                         |
| Search input | Category filter | Sort control     |
| Product Card | Product Card | Product Card        |
| Product Card | Product Card | Product Card        |
+--------------------------------------------------+

+--------------------------------------------------+
| Product Detail                                   |
| Product image | Title, category, rating, price    |
| Description                                       |
| [Save Product] [Back to Products]                 |
+--------------------------------------------------+

+--------------------------------------------------+
| Planner                                          |
| Saved item list                                  |
| Estimated total                                  |
| Notes / presentation talking points              |
+--------------------------------------------------+
```

## Component Hierarchy

```text
App
  AppProvider
    Layout
      AppHeader
      Outlet
    DashboardPage
      StatCard
      ProductCard
    ProductsPage
      ProductControls
      ProductGrid
        ProductCard
    ProductDetailPage
    PlannerPage
      SavedProductList
    AboutPage
```

## State Plan

- `useProducts` custom hook:
  - `products`
  - `loading`
  - `error`
  - API fetching with `useEffect`
- `AppContext`:
  - saved product IDs
  - `toggleSavedProduct`
  - `isSaved`
- Page state:
  - search query
  - category filter
  - sort mode

## UI Direction

Minimal, polished, dashboard-like interface:

- MUI AppBar and cards
- Quiet green/neutral palette
- Responsive product grid
- Clear empty, loading, and error states
- Small but useful interactions: save/unsave, filter, sort, detail navigation

## Presentation Outline

1. Process: requirements from README, wireframe, route planning.
2. Overview: MarketFlow as product discovery and planning app.
3. Data: Fake Store API, Axios, `useEffect`, custom hook.
4. Interaction: browse, search, filter, sort, save, detail route.
5. Architecture: reusable components and context.
6. Hooks: `useState`, `useEffect`, `useContext`, custom hook.
7. Tools: Vite, React Router, MUI, Axios.
8. Future: authentication, checkout, persistence, API backend, deployment.
