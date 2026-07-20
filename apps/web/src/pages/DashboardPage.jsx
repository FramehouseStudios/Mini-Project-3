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
            aria-labelledby="dashboard-spotlight-title"
            sx={{
              minHeight: { xs: 470, md: 520 },
              display: "flex",
              alignItems: "flex-end",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundImage: `url(${spotlight.banner || spotlight.poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(3, 9, 24, 0.74)",
              },
            }}
          >
            <Stack spacing={2} sx={{ position: "relative", p: { xs: 3, md: 6 }, maxWidth: 760 }}>
              <Chip label="Tonight's staff pick" color="secondary" sx={{ alignSelf: "start" }} />
              <Typography id="dashboard-spotlight-title" variant="h2" component="h1">
                {spotlight.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {spotlight.year} · {spotlight.genre} · {spotlight.runtime} min
              </Typography>
              <Typography sx={{ maxWidth: 680 }}>{spotlight.description}</Typography>
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
                  Featured after hours
                </Typography>
                <Typography color="text.secondary">High-rated picks ready for tonight.</Typography>
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
