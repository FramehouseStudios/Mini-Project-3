import { Link as RouterLink } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppContext } from "../context/AppContext.jsx";

function FilmCard({ film }) {
  const { isInRentalBag, toggleRentalFilm } = useAppContext();
  const inBag = isInRentalBag(film.id);

  return (
    <Card
      component="article"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 28px 58px rgba(0, 0, 0, 0.34)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={film.poster || film.banner}
        alt={`${film.title} poster`}
        className="film-image"
        loading="lazy"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={film.genre} size="small" />
            {inBag && <Chip label="In rental bag" size="small" color="secondary" />}
          </Stack>
          <Typography fontWeight={800}>{film.year}</Typography>
        </Stack>
        <Typography variant="h6" component="h2" gutterBottom>
          {film.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Directed by {film.director}
        </Typography>
        <Typography className="line-clamp" color="text.secondary">
          {film.description}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mt={2}>
          <Rating
            value={film.rating / 2}
            precision={0.1}
            readOnly
            size="small"
            aria-label={`${film.rating} out of 10 rating`}
          />
          <Typography variant="body2" color="text.secondary">
            {film.rating.toFixed(1)}/10
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {film.runtime} min · {film.rewatches.toLocaleString()} rewatches
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button component={RouterLink} to={`/films/${film.slug || film.id}`}>
          View details
        </Button>
        <Button
          variant={inBag ? "outlined" : "contained"}
          color={inBag ? "secondary" : "primary"}
          startIcon={inBag ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
          onClick={() => toggleRentalFilm(film.id)}
          aria-pressed={inBag}
        >
          {inBag ? "Bagged" : "Rent"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default FilmCard;
