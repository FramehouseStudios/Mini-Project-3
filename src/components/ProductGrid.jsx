import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProductCard from "./ProductCard.jsx";

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <Card role="status" aria-live="polite">
        <CardContent>
          <Stack spacing={0.75}>
            <Typography variant="h6" component="p">
              No matching products
            </Typography>
            <Typography color="text.secondary">
              Try clearing the search or choosing a different category.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
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
