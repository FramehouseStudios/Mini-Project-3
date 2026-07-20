import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FilmGrid from "../components/FilmGrid.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useFilms from "../hooks/useFilms.js";

function DashboardPage() {
  const { films, genres, averageRating, loading, error, reload } = useFilms();
  const { rentalCount } = useAppContext();
  const spotlight = films[0];
  const featuredFilms = films.slice(0, 4);
  const totalRewatches = films.reduce((sum, film) => sum + film.rewatches, 0);

  return (
    <Stack spacing={4}>
      <StatusPanel loading={loading} error={error} onRetry={reload} />

      {!loading && !error && spotlight && (
        <>
          <Box
            component="section"
            className="spotlight-hero"
            aria-labelledby="dashboard-spotlight-title"
            sx={{
              minHeight: { xs: 390, md: 440 },
              display: "flex",
              alignItems: "flex-end",
              position: "relative",
              overflow: "hidden",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              backgroundImage: `url(${spotlight.banner || spotlight.poster})`,
              backgroundSize: "cover",
              backgroundPosition: { xs: "62% center", md: "right center" },
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.38)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(3, 7, 20, 0.98) 0%, rgba(3, 7, 20, 0.88) 38%, rgba(3, 7, 20, 0.28) 76%, rgba(3, 7, 20, 0.5) 100%)",
              },
            }}
          >
            <Stack
              spacing={2}
              sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 5 }, maxWidth: 720 }}
            >
              <Chip
                label={`Tonight's staff pick · ${spotlight.title}`}
                color="secondary"
                sx={{ alignSelf: "start" }}
              />
              <Typography
                id="dashboard-spotlight-title"
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: "4rem", md: "6.5rem" }, maxWidth: 640 }}
              >
                Pull from the shelf.
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {spotlight.year} · {spotlight.genre} · {spotlight.runtime} min
              </Typography>
              <Typography sx={{ maxWidth: 620 }}>
                Open the case for details, reviews, and tonight's rental bag.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={RouterLink}
                  to={`/films/${spotlight.slug}`}
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardIcon />}
                >
                  Open rental box
                </Button>
                <Button component={RouterLink} to="/films" variant="outlined" color="inherit">
                  Browse all films
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Films available" value={films.length} helper="Loaded from the SQLite catalog" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Curated aisles" value={genres.length} helper="Generated from live film data" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Average rating" value={averageRating.toFixed(1)} helper="Across the current catalog" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Rental bag"
                value={rentalCount}
                helper={`${totalRewatches.toLocaleString()} community rewatches`}
              />
            </Grid>
          </Grid>

          <Stack spacing={2} component="section" aria-labelledby="featured-films-title">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" component="h2" id="featured-films-title">
                  Fresh on the return cart
                </Typography>
                <Typography color="text.secondary">
                  Four staff picks, ready for a closer look.
                </Typography>
              </Box>
              <Button component={RouterLink} to="/films?sort=rating-high" endIcon={<ArrowForwardIcon />}>
                See the shelf
              </Button>
            </Stack>
            <FilmGrid films={featuredFilms} />
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default DashboardPage;
