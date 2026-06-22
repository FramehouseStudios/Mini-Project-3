import { Link as RouterLink } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useProducts from "../hooks/useProducts.js";

function PlannerPage() {
  const { products, loading, error } = useProducts();
  const { savedProductIds, clearSavedProducts, toggleSavedProduct } =
    useAppContext();
  const savedProducts = products.filter((product) =>
    savedProductIds.includes(product.id),
  );
  const total = savedProducts.reduce((sum, product) => sum + product.price, 0);

  return (
    <>
      <PageHeader
        eyebrow="Global state"
        title="Planner"
        description="Saved products live in React Context, so the planner updates from product cards, detail pages, and this route without prop drilling."
        action={
          <Button
            variant="outlined"
            color="primary"
            onClick={clearSavedProducts}
            disabled={!savedProducts.length}
          >
            Clear saved
          </Button>
        }
      />

      <StatusPanel loading={loading} error={error} />

      {!loading && !error && (
        <Card>
          <CardContent>
            {!savedProducts.length ? (
              <Stack spacing={2}>
                <Typography variant="h5">No saved products yet</Typography>
                <Typography color="text.secondary">
                  Browse the product catalog and save a few items to build a
                  shortlist for comparison.
                </Typography>
                <Button component={RouterLink} to="/products" sx={{ alignSelf: "start" }}>
                  Browse products
                </Button>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Typography variant="h5">
                  Saved shortlist: ${total.toFixed(2)}
                </Typography>
                <List>
                  {savedProducts.map((product, index) => (
                    <Stack key={product.id}>
                      <ListItem
                        secondaryAction={
                          <Button
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => toggleSavedProduct(product.id)}
                          >
                            Remove
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={product.title}
                          secondary={`${product.category} - $${product.price.toFixed(2)}`}
                        />
                      </ListItem>
                      {index < savedProducts.length - 1 && <Divider />}
                    </Stack>
                  ))}
                </List>
              </Stack>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default PlannerPage;
