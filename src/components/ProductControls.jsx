import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

function ProductControls({
  categories,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  sortMode,
  onSortModeChange,
}) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 5 }}>
        <TextField
          fullWidth
          label="Search products"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3.5 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
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
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: low to high</MenuItem>
            <MenuItem value="price-high">Price: high to low</MenuItem>
            <MenuItem value="rating-high">Rating: high to low</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default ProductControls;
