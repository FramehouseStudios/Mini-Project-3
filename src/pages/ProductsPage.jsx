import { useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import PageHeader from "../components/PageHeader.jsx";
import ProductControls from "../components/ProductControls.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useProducts from "../hooks/useProducts.js";

function ProductsPage() {
  const { products, categories, loading, error } = useProducts();
  const { savedCount } = useAppContext();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortMode, setSortMode] = useState("featured");

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSortMode("featured");
  };

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
  const activeFilters = [
    query.trim() ? `Search: ${query.trim()}` : "",
    category !== "all" ? `Category: ${category}` : "",
    sortMode !== "featured"
      ? `Sort: ${sortMode.replace("-", " ").replace("-", " ")}`
      : "",
  ].filter(Boolean);
  const averageVisiblePrice = visibleProducts.length
    ? visibleProducts.reduce((sum, product) => sum + product.price, 0) /
      visibleProducts.length
    : 0;
  const topVisibleRating = visibleProducts.length
    ? Math.max(...visibleProducts.map((product) => product.rating.rate))
    : 0;

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
            visibleCount={visibleProducts.length}
            totalCount={products.length}
            onReset={resetFilters}
            activeFilters={activeFilters}
          />
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                  label="Visible results"
                  value={visibleProducts.length}
                  helper={`${activeFilters.length} active filter${activeFilters.length === 1 ? "" : "s"}`}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                  label="Average visible price"
                  value={`$${averageVisiblePrice.toFixed(2)}`}
                  helper="Recomputed after filters and sorting"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                  label="Saved shortlist"
                  value={savedCount}
                  helper={`Top visible rating ${topVisibleRating.toFixed(1)}`}
                />
              </Grid>
            </Grid>
            <ProductGrid products={visibleProducts} />
          </Stack>
        </>
      )}
    </>
  );
}

export default ProductsPage;
