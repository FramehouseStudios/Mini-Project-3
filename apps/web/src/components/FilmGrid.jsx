import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FilmCard from "./FilmCard.jsx";

function FilmGrid({ films }) {
  if (!films.length) {
    return (
      <Card role="status" aria-live="polite">
        <CardContent>
          <Stack spacing={0.75}>
            <Typography variant="h6" component="p">No matching films</Typography>
            <Typography color="text.secondary">
              Clear the search or choose a different aisle.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {films.map((film) => (
        <Grid key={film.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
          <FilmCard film={film} />
        </Grid>
      ))}
    </Grid>
  );
}

export default FilmGrid;
