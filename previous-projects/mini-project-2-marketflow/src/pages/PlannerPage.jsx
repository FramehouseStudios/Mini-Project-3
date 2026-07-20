import { Link as RouterLink } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useProducts from "../hooks/useProducts.js";

function PlannerPage() {
  const { products, loading, error } = useProducts();
  const { savedProductIds, clearSavedProducts, toggleSavedProduct } =
    useAppContext();
  const savedProducts = products.filter((product) =>
    savedProductIds.includes(product.id),
  );
  const total = savedProducts.reduce((sum, product) => sum + product.price, 0);
  const averageRating = savedProducts.length
    ? savedProducts.reduce((sum, product) => sum + product.rating.rate, 0) /
      savedProducts.length
    : 0;
  const categorySummary = [
    ...new Set(savedProducts.map((product) => product.category)),
  ].join(", ");
  const mostExpensiveProduct = savedProducts.reduce(
    (topProduct, product) =>
      product.price > (topProduct?.price || 0) ? product : topProduct,
    null,
  );

  return (
    <>
      <PageHeader
        eyebrow="Global state"
        title="Planner"
        description="Saved products live in React Context, so the planner updates from product cards, detail pages, and this route without prop drilling."
        action={
          <Button
            variant="outlined"
            color="primary"
            onClick={clearSavedProducts}
            disabled={!savedProducts.length}
          >
            Clear saved
          </Button>
        }
      />

      <StatusPanel loading={loading} error={error} />

      {!loading && !error && (
        <Stack spacing={3}>
          {!savedProducts.length ? (
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h5">No saved products yet</Typography>
                  <Typography color="text.secondary">
                    Browse the product catalog and save a few items to build a
                    shortlist for comparison.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/products"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ alignSelf: "start" }}
                  >
                    Browse products
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <StatCard
                    label="Shortlist total"
                    value={`$${total.toFixed(2)}`}
                    helper={`${savedProducts.length} saved product${savedProducts.length === 1 ? "" : "s"}`}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <StatCard
                    label="Average rating"
                    value={averageRating.toFixed(1)}
                    helper="Calculated from saved items"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <StatCard
                    label="Highest price"
                    value={`$${mostExpensiveProduct.price.toFixed(2)}`}
                    helper={mostExpensiveProduct.title}
                  />
                </Grid>
              </Grid>

              <Card>
                <CardContent>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h5" component="h2">
                        Saved shortlist
                      </Typography>
                      <Typography color="text.secondary">
                        Saved product IDs are stored in Context and persisted
                        locally, then matched against live API products here.
                      </Typography>
                    </Stack>
                    <Chip
                      label={categorySummary || "No categories"}
                      color="secondary"
                      sx={{ alignSelf: { xs: "start", md: "center" } }}
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Stack spacing={2}>
                {savedProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Box
                          sx={{
                            width: 96,
                            height: 96,
                            borderRadius: 2,
                            bgcolor: "#fff3eb",
                            border: "1px solid #f0c9b7",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={product.image}
                            alt={`${product.title} product image`}
                            sx={{
                              width: "78%",
                              height: "78%",
                              objectFit: "contain",
                            }}
                          />
                        </Box>

                        <Stack spacing={0.75} flexGrow={1}>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            <Chip label={product.category} size="small" />
                            <Chip
                              label={`$${product.price.toFixed(2)}`}
                              size="small"
                              color="secondary"
                            />
                          </Stack>
                          <Typography variant="h6" component="h3">
                            {product.title}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Rating
                              value={product.rating.rate}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              {product.rating.rate.toFixed(1)} rating from{" "}
                              {product.rating.count} reviews
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                        >
                          <Button
                            component={RouterLink}
                            to={`/products/${product.id}`}
                            variant="outlined"
                          >
                            Details
                          </Button>
                          <Button
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => toggleSavedProduct(product.id)}
                            color="primary"
                          >
                            Remove
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      )}
    </>
  );
}

export default PlannerPage;
