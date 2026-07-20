import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SORT_OPTIONS } from "../lib/filmCatalog.js";

function FilmControls({
  genres,
  genre,
  onGenreChange,
  query,
  onQueryChange,
  sortMode,
  onSortModeChange,
  visibleCount,
  totalCount,
  onReset,
  activeFilters,
}) {
  return (
    <Stack spacing={2.5} sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            label="Search films"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel>Aisle</InputLabel>
            <Select
              label="Aisle"
              value={genre}
              onChange={(event) => onGenreChange(event.target.value)}
            >
              <MenuItem value="all">All aisles</MenuItem>
              {genres.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>
            <Select
              label="Sort"
              value={sortMode}
              onChange={(event) => onSortModeChange(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
      >
        <Stack spacing={1}>
          <Typography color="text.secondary">
            Showing {visibleCount} of {totalCount} films
          </Typography>
          {!!activeFilters.length && (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {activeFilters.map((filter) => (
                <Chip key={filter} label={filter} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Stack>
        <Button variant="outlined" onClick={onReset} disabled={!activeFilters.length}>
          Reset filters
        </Button>
      </Stack>
    </Stack>
  );
}

export default FilmControls;
