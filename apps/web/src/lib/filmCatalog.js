export const SORT_OPTIONS = [
  { value: "featured", label: "Staff favorites" },
  { value: "title", label: "Title: A to Z" },
  { value: "newest", label: "Newest releases" },
  { value: "rating-high", label: "Rating: high to low" },
  { value: "runtime-short", label: "Runtime: shortest first" },
  { value: "rewatched", label: "Most rewatched" },
];

export function filterAndSortFilms(films, filters = {}) {
  const query = String(filters.query || "").trim().toLowerCase();
  const genre = filters.genre || "all";
  const sortMode = filters.sortMode || "featured";
  let nextFilms = [...(films || [])];

  if (genre !== "all") {
    nextFilms = nextFilms.filter((film) => film.genre === genre);
  }

  if (query) {
    nextFilms = nextFilms.filter((film) =>
      [film.title, film.director, film.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }

  nextFilms.sort((a, b) => {
    if (sortMode === "title") return a.title.localeCompare(b.title);
    if (sortMode === "newest") return b.year - a.year || a.title.localeCompare(b.title);
    if (sortMode === "rating-high") return b.rating - a.rating || a.title.localeCompare(b.title);
    if (sortMode === "runtime-short") return a.runtime - b.runtime || a.title.localeCompare(b.title);
    if (sortMode === "rewatched") return b.rewatches - a.rewatches || a.title.localeCompare(b.title);
    return b.rating - a.rating || b.lateNightScore - a.lateNightScore || a.id - b.id;
  });

  return nextFilms;
}

export function getActiveFilmFilters({ query = "", genre = "all", sortMode = "featured" } = {}) {
  return [
    query.trim() ? `Search: ${query.trim()}` : "",
    genre !== "all" ? `Aisle: ${genre}` : "",
    sortMode !== "featured"
      ? SORT_OPTIONS.find((option) => option.value === sortMode)?.label || sortMode
      : "",
  ].filter(Boolean);
}

export function summarizeFilms(films) {
  if (!films?.length) {
    return { averageRating: 0, totalRuntime: 0, topRating: 0 };
  }

  return {
    averageRating: films.reduce((sum, film) => sum + film.rating, 0) / films.length,
    totalRuntime: films.reduce((sum, film) => sum + film.runtime, 0),
    topRating: Math.max(...films.map((film) => film.rating)),
  };
}
