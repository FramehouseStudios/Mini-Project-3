import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useProducts from "../hooks/useProducts.js";

function DashboardPage() {
  const { products, categories, averageRating, loading, error } = useProducts();
  const { savedCount } = useAppContext();
  const featuredProducts = products
    .filter((product) => product.rating.rate >= 4)
    .slice(0, 3);
  const topCategory = categories[0] || "Loading";
  const topRatedProduct = products.reduce(
    (topProduct, product) =>
      product.rating.rate > (topProduct?.rating.rate || 0) ? product : topProduct,
    null,
  );
  const savedHelper =
    savedCount > 0
      ? `${savedCount} product${savedCount === 1 ? "" : "s"} saved locally`
      : `Average rating ${averageRating.toFixed(1)}`;
  const coveredRequirements = [
    "React Router",
    "useState",
    "useEffect",
    "useContext",
    "custom hook",
    "Axios",
    "MUI",
    "dynamic routes",
  ];

  return (
    <>
      <PageHeader
        eyebrow="Mini Project 2"
        title="Product discovery, routed in React."
        description="MarketFlow uses React Router, hooks, context, Material UI, and live API data to create a focused product discovery dashboard."
        action={
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            size="large"
          >
            Browse products
          </Button>
        }
      />

      <StatusPanel loading={loading} error={error} />

      {!loading && !error && (
        <Stack spacing={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Products loaded"
                value={products.length}
                helper="Fetched from Fake Store API"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Categories"
                value={categories.length}
                helper={`First category: ${topCategory}`}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Saved items"
                value={savedCount}
                helper={savedHelper}
              />
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack spacing={0.75}>
                    <Typography variant="h5" component="h2">
                      Requirements covered
                    </Typography>
                    <Typography color="text.secondary">
                      Functional components, routed pages, shared context,
                      immutable saved-item updates, reusable cards, and API data
                      from a custom Axios hook.
                    </Typography>
                  </Stack>
                  {topRatedProduct && (
                    <Chip
                      label={`Top rated: ${topRatedProduct.rating.rate.toFixed(1)}`}
                      variant="outlined"
                      sx={{ alignSelf: { xs: "start", md: "center" } }}
                    />
                  )}
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {coveredRequirements.map((requirement) => (
                    <Chip key={requirement} label={requirement} size="small" />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Stack spacing={2}>
            <Typography variant="h4" component="h2">
              Featured products
            </Typography>
            <ProductGrid products={featuredProducts} />
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default DashboardPage;
