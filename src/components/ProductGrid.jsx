import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ProductCard from "./ProductCard.jsx";

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <Typography color="text.secondary">
        No products match the current filters.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductGrid;
