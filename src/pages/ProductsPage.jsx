import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import ProductControls from "../components/ProductControls.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import useProducts from "../hooks/useProducts.js";

function ProductsPage() {
  const { products, categories, loading, error } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortMode, setSortMode] = useState("featured");

  const visibleProducts = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    let nextProducts = [...products];

    if (category !== "all") {
      nextProducts = nextProducts.filter((product) => product.category === category);
    }

    if (searchTerm) {
      nextProducts = nextProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm),
      );
    }

    nextProducts.sort((a, b) => {
      if (sortMode === "price-low") return a.price - b.price;
      if (sortMode === "price-high") return b.price - a.price;
      if (sortMode === "rating-high") return b.rating.rate - a.rating.rate;
      return a.id - b.id;
    });

    return nextProducts;
  }, [products, category, query, sortMode]);

  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Products"
        description="Search, filter, sort, and save products. These controls use local page state while product data comes from a custom API hook."
      />

      <StatusPanel loading={loading} error={error} />

      {!loading && !error && (
        <>
          <ProductControls
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            query={query}
            onQueryChange={setQuery}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
          />
          <ProductGrid products={visibleProducts} />
        </>
      )}
    </>
  );
}

export default ProductsPage;
