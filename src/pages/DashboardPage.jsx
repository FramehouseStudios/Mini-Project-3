import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import DataObjectOutlinedIcon from "@mui/icons-material/DataObjectOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
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
  const averagePrice = products.length
    ? products.reduce((sum, product) => sum + product.price, 0) / products.length
    : 0;
  const savedProgress = products.length ? (savedCount / products.length) * 100 : 0;
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
            endIcon={<ArrowForwardIcon />}
          >
            Browse products
          </Button>
        }
      />

      <StatusPanel loading={loading} error={error} />

      {!loading && !error && (
        <Stack spacing={4}>
          <Card
            sx={{
              bgcolor: "primary.main",
              color: "#fffaf6",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2}>
                    <Chip
                      label="Live React dashboard"
                      sx={{
                        alignSelf: "start",
                        bgcolor: "rgba(255,250,246,0.18)",
                        color: "inherit",
                      }}
                    />
                    <Typography variant="h4" component="h2">
                      Search, save, and review products across routed pages.
                    </Typography>
                    <Typography sx={{ color: "rgba(255,250,246,0.82)" }}>
                      This page summarizes fetched API data, while saved products
                      are shared through Context and persist in localStorage.
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button
                        component={RouterLink}
                        to="/products"
                        variant="contained"
                        color="secondary"
                      >
                        Explore catalog
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/planner"
                        variant="outlined"
                        sx={{
                          borderColor: "rgba(255,250,246,0.75)",
                          color: "inherit",
                        }}
                      >
                        View planner
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Card sx={{ bgcolor: "rgba(255,250,246,0.96)" }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Typography variant="h6" component="h3">
                          Assignment signal
                        </Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <DataObjectOutlinedIcon color="primary" />
                            <Typography color="text.secondary">
                              {products.length} products fetched with Axios
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <RouteOutlinedIcon color="primary" />
                            <Typography color="text.secondary">
                              Routed views for dashboard, catalog, planner, details
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <BookmarkAddedOutlinedIcon color="primary" />
                            <Typography color="text.secondary">
                              {savedCount} saved through shared Context state
                            </Typography>
                          </Stack>
                        </Stack>
                        <Divider />
                        <Box>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            mb={0.75}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Planner progress
                            </Typography>
                            <Typography variant="body2" fontWeight={800}>
                              {savedCount}/{products.length}
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={savedProgress}
                            sx={{ height: 8, borderRadius: 10 }}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Products loaded"
                value={products.length}
                helper={`Average price $${averagePrice.toFixed(2)}`}
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
            >
              <Stack spacing={0.5}>
                <Typography variant="h4" component="h2">
                  Featured products
                </Typography>
                <Typography color="text.secondary">
                  High-rated API products selected with array filtering and map rendering.
                </Typography>
              </Stack>
              <Chip label="Rating 4.0+" color="secondary" />
            </Stack>
            <ProductGrid products={featuredProducts} />
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default DashboardPage;
