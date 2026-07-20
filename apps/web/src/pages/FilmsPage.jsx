import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import FilmControls from "../components/FilmControls.jsx";
import FilmGrid from "../components/FilmGrid.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useFilms from "../hooks/useFilms.js";
import {
  filterAndSortFilms,
  getActiveFilmFilters,
  summarizeFilms,
} from "../lib/filmCatalog.js";

function FilmsPage() {
  const { films, genres, loading, error, reload } = useFilms();
  const { rentalCount } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "all";
  const sortMode = searchParams.get("sort") || "featured";

  const updateFilter = (key, value, defaultValue = "") => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (!value || value === defaultValue) next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  };

  const resetFilters = () => setSearchParams({}, { replace: true });
  const visibleFilms = useMemo(
    () => filterAndSortFilms(films, { query, genre, sortMode }),
    [films, query, genre, sortMode],
  );
  const activeFilters = getActiveFilmFilters({ query, genre, sortMode });
  const summary = summarizeFilms(visibleFilms);

  return (
    <>
      <PageHeader
        eyebrow="Digital rental aisles"
        title="Films"
        description="Search by title, director, or synopsis, choose an aisle, and sort a database-backed catalog without losing the current URL state."
      />
      <StatusPanel loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <Stack spacing={3}>
          <FilmControls
            genres={genres}
            genre={genre}
            onGenreChange={(value) => updateFilter("genre", value, "all")}
            query={query}
            onQueryChange={(value) => updateFilter("q", value)}
            sortMode={sortMode}
            onSortModeChange={(value) => updateFilter("sort", value, "featured")}
            visibleCount={visibleFilms.length}
            totalCount={films.length}
            onReset={resetFilters}
            activeFilters={activeFilters}
          />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Visible rentals"
                value={visibleFilms.length}
                helper={`${activeFilters.length} active filter${activeFilters.length === 1 ? "" : "s"}`}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Average visible rating"
                value={summary.averageRating.toFixed(1)}
                helper={`${summary.totalRuntime.toLocaleString()} total minutes`}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Rental bag"
                value={rentalCount}
                helper={`Top visible rating ${summary.topRating.toFixed(1)}`}
              />
            </Grid>
          </Grid>

          <FilmGrid films={visibleFilms} />
        </Stack>
      )}
    </>
  );
}

export default FilmsPage;
