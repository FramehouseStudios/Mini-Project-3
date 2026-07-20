import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CatalogManagerPage from "./pages/CatalogManagerPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FilmDetailPage from "./pages/FilmDetailPage.jsx";
import FilmsPage from "./pages/FilmsPage.jsx";
import RentalBagPage from "./pages/RentalBagPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="films" element={<FilmsPage />} />
        <Route path="films/:filmId" element={<FilmDetailPage />} />
        <Route path="rentals" element={<RentalBagPage />} />
        <Route path="catalog-manager" element={<CatalogManagerPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
