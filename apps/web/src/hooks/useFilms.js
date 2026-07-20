import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getFilm, listFilms } from "../services/filmApi.js";

export default function useFilms() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setFilms(await listFilms({ signal: controller.signal }));
        setError("");
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [revision]);

  const genres = useMemo(
    () => [...new Set(films.map((film) => film.genre))].sort(),
    [films],
  );
  const averageRating = useMemo(() => {
    if (!films.length) return 0;
    return films.reduce((sum, film) => sum + film.rating, 0) / films.length;
  }, [films]);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  return { films, genres, averageRating, loading, error, reload };
}

export function useFilm(identifier) {
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setFilm(await getFilm(identifier, { signal: controller.signal }));
        setError("");
      } catch (requestError) {
        if (!axios.isCancel(requestError)) setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [identifier, revision]);

  const reload = useCallback(() => setRevision((value) => value + 1), []);
  return { film, loading, error, reload };
}
