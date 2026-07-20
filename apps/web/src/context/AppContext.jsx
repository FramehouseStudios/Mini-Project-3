/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);
const RENTAL_BAG_KEY = "blockbuster-plus:rental-film-ids";

function getInitialRentalFilmIds() {
  try {
    const savedValue = window.localStorage.getItem(RENTAL_BAG_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];
    return Array.isArray(parsedValue)
      ? [...new Set(parsedValue.map(Number).filter(Number.isInteger))]
      : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }) {
  const [rentalFilmIds, setRentalFilmIds] = useState(getInitialRentalFilmIds);

  useEffect(() => {
    window.localStorage.setItem(RENTAL_BAG_KEY, JSON.stringify(rentalFilmIds));
  }, [rentalFilmIds]);

  const toggleRentalFilm = (filmId) => {
    setRentalFilmIds((currentIds) =>
      currentIds.includes(filmId)
        ? currentIds.filter((id) => id !== filmId)
        : [...currentIds, filmId],
    );
  };

  const clearRentalBag = () => setRentalFilmIds([]);

  const value = useMemo(
    () => ({
      rentalFilmIds,
      rentalCount: rentalFilmIds.length,
      toggleRentalFilm,
      clearRentalBag,
      isInRentalBag: (filmId) => rentalFilmIds.includes(filmId),
    }),
    [rentalFilmIds],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
