/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);
const SAVED_PRODUCTS_KEY = "marketflow:saved-products";

function getInitialSavedProducts() {
  try {
    const savedValue = window.localStorage.getItem(SAVED_PRODUCTS_KEY);
    return savedValue ? JSON.parse(savedValue) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }) {
  const [savedProductIds, setSavedProductIds] = useState(getInitialSavedProducts);

  useEffect(() => {
    window.localStorage.setItem(
      SAVED_PRODUCTS_KEY,
      JSON.stringify(savedProductIds),
    );
  }, [savedProductIds]);

  const toggleSavedProduct = (productId) => {
    setSavedProductIds((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId],
    );
  };

  const clearSavedProducts = () => setSavedProductIds([]);

  const value = useMemo(
    () => ({
      savedProductIds,
      savedCount: savedProductIds.length,
      toggleSavedProduct,
      clearSavedProducts,
      isSaved: (productId) => savedProductIds.includes(productId),
    }),
    [savedProductIds],
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
