import { Link as RouterLink } from "react-router-dom";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useAppContext } from "../context/AppContext.jsx";

function ProductCard({ product }) {
  const { isSaved, toggleSavedProduct } = useAppContext();
  const saved = isSaved(product.id);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 22px 46px rgba(30, 66, 56, 0.12)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={`${product.title} product image`}
        className="product-image"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
          <Chip label={product.category} size="small" />
          <Typography fontWeight={800}>${product.price.toFixed(2)}</Typography>
        </Stack>
        <Typography variant="h6" component="h2" gutterBottom>
          {product.title}
        </Typography>
        <Typography className="line-clamp" color="text.secondary">
          {product.description}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mt={2}>
          <Rating
            value={product.rating.rate}
            precision={0.1}
            readOnly
            size="small"
            aria-label={`${product.rating.rate} out of 5 stars`}
          />
          <Typography variant="body2" color="text.secondary">
            {product.rating.rate.toFixed(1)} ({product.rating.count})
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button component={RouterLink} to={`/products/${product.id}`}>
          View details
        </Button>
        <Tooltip title={saved ? "Remove from saved" : "Save product"}>
          <IconButton
            color={saved ? "primary" : "default"}
            onClick={() => toggleSavedProduct(product.id)}
            aria-label={saved ? "Remove saved product" : "Save product"}
            aria-pressed={saved}
          >
            {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
