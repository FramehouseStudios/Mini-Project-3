import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useFilms from "../hooks/useFilms.js";

function RentalBagPage() {
  const { films, loading, error, reload } = useFilms();
  const { rentalFilmIds, clearRentalBag, toggleRentalFilm } = useAppContext();
  const rentalFilms = films.filter((film) => rentalFilmIds.includes(film.id));
  const totalRuntime = rentalFilms.reduce((sum, film) => sum + film.runtime, 0);
  const averageRating = rentalFilms.length
    ? rentalFilms.reduce((sum, film) => sum + film.rating, 0) / rentalFilms.length
    : 0;
  const aisleCount = new Set(rentalFilms.map((film) => film.genre)).size;

  return (
    <>
      <PageHeader
        eyebrow="Persistent React Context"
        title="Rental Bag"
        description="A single saved-film state follows you across the dashboard, film cards, detail routes, and this checkout view."
        action={
          <Button variant="outlined" onClick={clearRentalBag} disabled={!rentalFilms.length}>
            Clear bag
          </Button>
        }
      />
      <StatusPanel loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <Stack spacing={3}>
          {!rentalFilms.length ? (
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h5">Your rental bag is empty</Typography>
                  <Typography color="text.secondary">
                    Pull a few films from the digital aisles to build tonight's stack.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/films"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ alignSelf: "start" }}
                  >
                    Browse films
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <StatCard label="Tonight's stack" value={rentalFilms.length} helper="Persisted in localStorage" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <StatCard label="Total runtime" value={`${totalRuntime} min`} helper="Calculated from saved films" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <StatCard label="Average rating" value={averageRating.toFixed(1)} helper={`${aisleCount} aisle${aisleCount === 1 ? "" : "s"} represented`} />
                </Grid>
              </Grid>

              <Stack spacing={2}>
                {rentalFilms.map((film, index) => (
                  <Card key={film.id} component="article">
                    <CardContent>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <CardMedia
                          component="img"
                          image={film.poster}
                          alt={`${film.title} poster`}
                          sx={{ width: 84, height: 118, objectFit: "cover", borderRadius: 1, flexShrink: 0 }}
                        />
                        <Stack spacing={0.75} flexGrow={1}>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip label={`Tape ${index + 1}`} size="small" color="secondary" />
                            <Chip label={film.genre} size="small" />
                          </Stack>
                          <Typography variant="h6" component="h2">{film.title}</Typography>
                          <Typography color="text.secondary">
                            {film.year} · {film.runtime} min · {film.rating.toFixed(1)}/10
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: "stretch", sm: "center" } }}>
                          <Button component={RouterLink} to={`/films/${film.slug}`} variant="outlined">Details</Button>
                          <Button startIcon={<DeleteOutlineIcon />} onClick={() => toggleRentalFilm(film.id)} color="secondary">
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

export default RentalBagPage;
