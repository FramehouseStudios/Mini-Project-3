import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import { useFilm } from "../hooks/useFilms.js";

const REVIEW_KEY = "blockbuster-plus:viewer-reviews";

function getSavedReviews() {
  try {
    const savedValue = window.localStorage.getItem(REVIEW_KEY);
    return savedValue ? JSON.parse(savedValue) : {};
  } catch {
    return {};
  }
}

function FilmReviewForm({ film }) {
  const initialReview = getSavedReviews()[film.id] || null;
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
    window.localStorage.setItem(
      REVIEW_KEY,
      JSON.stringify({ ...getSavedReviews(), [film.id]: nextReview }),
    );
    setSubmittedReview(nextReview);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1}>
              <Chip label="Viewer review" sx={{ alignSelf: "start" }} />
              <Typography variant="h4" component="h2">Leave a shelf note</Typography>
              <Typography color="text.secondary">
                Your rating is controlled by React state and saved locally on this device.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack component="form" spacing={2} onSubmit={handleReviewSubmit}>
              <Stack spacing={0.75}>
                <Typography fontWeight={800}>Your rating</Typography>
                <Rating
                  name={`review-rating-${film.id}`}
                  value={reviewRating}
                  onChange={(_, nextValue) => setReviewRating(nextValue || 0)}
                  size="large"
                />
              </Stack>
              <TextField
                label="Review note"
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                placeholder="What stayed with you after the credits?"
                multiline
                minRows={3}
              />
              <Button type="submit" variant="contained" disabled={!reviewRating} sx={{ alignSelf: "start" }}>
                Save review
              </Button>
              {submittedReview && (
                <Alert severity="success">
                  Saved {submittedReview.rating} star{submittedReview.rating === 1 ? "" : "s"}
                  {submittedReview.note ? `: “${submittedReview.note}”` : ""} ({submittedReview.updatedAt})
                </Alert>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function FilmDetailPage() {
  const { filmId } = useParams();
  const { film, loading, error, reload } = useFilm(filmId);
  const { isInRentalBag, toggleRentalFilm } = useAppContext();

  if (loading || error) {
    return <StatusPanel loading={loading} error={error} onRetry={reload} />;
  }

  if (!film) {
    return (
      <Stack spacing={2}>
        <Typography variant="h3">Film not found</Typography>
        <Button component={RouterLink} to="/films" startIcon={<ArrowBackIcon />}>
          Back to films
        </Button>
      </Stack>
    );
  }

  const inBag = isInRentalBag(film.id);

  return (
    <Stack spacing={3}>
      <Button component={RouterLink} to="/films" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "start" }}>
        Back to films
      </Button>

      <Card>
        <CardContent>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <img className="detail-image" src={film.poster || film.banner} alt={`${film.title} poster`} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={film.genre} />
                  <Chip label={`${film.year}`} variant="outlined" />
                  <Chip label={film.source === "curated" ? "Staff curated" : "External API"} color="secondary" />
                </Stack>
                <Typography variant="h3" component="h1">{film.title}</Typography>
                <Typography variant="h6" color="text.secondary">
                  Directed by {film.director} · {film.runtime} min
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Rating value={film.rating / 2} precision={0.1} readOnly />
                  <Typography color="text.secondary">
                    {film.rating.toFixed(1)}/10 · {film.rewatches.toLocaleString()} rewatches
                  </Typography>
                </Stack>
                <Typography color="text.secondary">{film.description}</Typography>
                {!!film.moods?.length && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {film.moods.map((mood) => <Chip key={mood} label={mood} size="small" variant="outlined" />)}
                  </Stack>
                )}
                <Button
                  variant={inBag ? "outlined" : "contained"}
                  color={inBag ? "secondary" : "primary"}
                  startIcon={inBag ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
                  onClick={() => toggleRentalFilm(film.id)}
                  sx={{ alignSelf: "start" }}
                >
                  {inBag ? "Remove from rental bag" : "Add to rental bag"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <FilmReviewForm key={film.id} film={film} />
    </Stack>
  );
}

export default FilmDetailPage;
