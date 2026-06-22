import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "https://fakestoreapi.com/products";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);

        if (!ignore) {
          setProducts(response.data);
          setError("");
        }
      } catch {
        if (!ignore) {
          setError("Products could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const averageRating = useMemo(() => {
    if (!products.length) return 0;
    const total = products.reduce(
      (sum, product) => sum + product.rating.rate,
      0,
    );
    return total / products.length;
  }, [products]);

  return {
    products,
    categories,
    averageRating,
    loading,
    error,
  };
}
