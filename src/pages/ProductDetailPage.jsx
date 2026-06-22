import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useProducts from "../hooks/useProducts.js";

const REVIEW_KEY = "marketflow:product-reviews";

function getSavedReviews() {
  try {
    const savedValue = window.localStorage.getItem(REVIEW_KEY);
    return savedValue ? JSON.parse(savedValue) : {};
  } catch {
    return {};
  }
}

function ProductReviewForm({ product }) {
  const initialReview = getSavedReviews()[product.id] || null;
  const [reviewRating, setReviewRating] = useState(initialReview?.rating || 0);
  const [reviewNote, setReviewNote] = useState(initialReview?.note || "");
  const [submittedReview, setSubmittedReview] = useState(initialReview);

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!reviewRating) return;

    const nextReview = {
      rating: reviewRating,
      note: reviewNote.trim(),
      updatedAt: new Date().toLocaleDateString(),
    };
    const savedReviews = getSavedReviews();

    window.localStorage.setItem(
      REVIEW_KEY,
      JSON.stringify({ ...savedReviews, [product.id]: nextReview }),
    );
    setSubmittedReview(nextReview);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1}>
              <Chip label="Interactive review" sx={{ alignSelf: "start" }} />
              <Typography variant="h4" component="h2">
                Leave your review
              </Typography>
              <Typography color="text.secondary">
                This rating is user-controlled with React state and saved in
                localStorage, separate from the fetched API rating above.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack component="form" spacing={2} onSubmit={handleReviewSubmit}>
              <Stack spacing={0.75}>
                <Typography fontWeight={800}>Your rating</Typography>
                <Rating
                  name={`review-rating-${product.id}`}
                  value={reviewRating}
                  onChange={(_, nextValue) => setReviewRating(nextValue || 0)}
                  size="large"
                />
              </Stack>
              <TextField
                label="Review note"
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                placeholder="What stood out about this product?"
                multiline
                minRows={3}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!reviewRating}
                sx={{ alignSelf: "start" }}
              >
                Save review
              </Button>
              {submittedReview && (
                <Alert severity="success">
                  Review saved: {submittedReview.rating} star
                  {submittedReview.rating === 1 ? "" : "s"}
                  {submittedReview.note ? ` - "${submittedReview.note}"` : ""}{" "}
                  ({submittedReview.updatedAt})
                </Alert>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

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

      <ProductReviewForm key={product.id} product={product} />
    </Stack>
  );
}

export default ProductDetailPage;
