import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
                helper="Generated from product data"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Saved items"
                value={savedCount}
                helper={`Average rating ${averageRating.toFixed(1)}`}
              />
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Requirements covered
              </Typography>
              <Typography color="text.secondary">
                Functional components, React Router, `useState`, `useEffect`,
                `useContext`, a custom hook, Axios, MUI components, fetched
                product data, dynamic detail routing, and reusable cards.
              </Typography>
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
