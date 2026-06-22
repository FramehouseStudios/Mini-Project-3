import { Link as RouterLink, useParams } from "react-router-dom";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useProducts from "../hooks/useProducts.js";

function ProductDetailPage() {
  const { productId } = useParams();
  const { products, loading, error } = useProducts();
  const { isSaved, toggleSavedProduct } = useAppContext();
  const product = products.find((item) => item.id === Number(productId));

  if (loading || error) {
    return <StatusPanel loading={loading} error={error} />;
  }

  if (!product) {
    return (
      <Stack spacing={2}>
        <Typography variant="h3">Product not found</Typography>
        <Button component={RouterLink} to="/products" startIcon={<ArrowBackIcon />}>
          Back to products
        </Button>
      </Stack>
    );
  }

  const saved = isSaved(product.id);

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        to="/products"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: "start" }}
      >
        Back to products
      </Button>

      <Card>
        <CardContent>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <img className="detail-image" src={product.image} alt={product.title} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                <Chip label={product.category} sx={{ alignSelf: "start" }} />
                <Typography variant="h3" component="h1">
                  {product.title}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Rating value={product.rating.rate} precision={0.1} readOnly />
                  <Typography color="text.secondary">
                    {product.rating.rate} from {product.rating.count} reviews
                  </Typography>
                </Stack>
                <Typography variant="h4" color="primary">
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography color="text.secondary">{product.description}</Typography>
                <Button
                  variant={saved ? "outlined" : "contained"}
                  startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={() => toggleSavedProduct(product.id)}
                  sx={{ alignSelf: "start" }}
                >
                  {saved ? "Remove from planner" : "Save to planner"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default ProductDetailPage;
