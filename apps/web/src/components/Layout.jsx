import { NavLink, Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LocalMoviesOutlinedIcon from "@mui/icons-material/LocalMoviesOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useAppContext } from "../context/AppContext.jsx";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Browse Aisles", to: "/films" },
  { label: "Rental Bag", to: "/rentals" },
  { label: "Catalog Manager", to: "/catalog-manager" },
  { label: "About", to: "/about" },
];

function Layout() {
  const { rentalCount } = useAppContext();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 76, gap: 3 }}>
            <Stack
              component={NavLink}
              to="/"
              direction="row"
              spacing={1.25}
              alignItems="center"
              flexGrow={1}
              aria-label="Blockbuster Plus dashboard"
            >
              <LocalMoviesOutlinedIcon color="secondary" />
              <Typography variant="h6" component="span" className="brand-wordmark">
                BLOCKBUSTER<span>+</span>
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              component="nav"
              aria-label="Primary navigation"
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  color={item.to === "/films" ? "secondary" : "inherit"}
                  variant={item.to === "/films" ? "contained" : "text"}
                  component={NavLink}
                  to={item.to}
                  end={item.to === "/"}
                  sx={{
                    "&.active": {
                      bgcolor: item.to === "/films" ? "secondary.light" : "rgba(255, 210, 31, 0.12)",
                      color: item.to === "/films" ? "secondary.contrastText" : "secondary.main",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Tooltip title={`${rentalCount} film${rentalCount === 1 ? "" : "s"} in your rental bag`}>
              <Button
                component={NavLink}
                to="/rentals"
                color="inherit"
                aria-label={`${rentalCount} film${rentalCount === 1 ? "" : "s"} in rental bag`}
                sx={{ minWidth: 44 }}
              >
                <Badge badgeContent={rentalCount} color="secondary">
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </Button>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="nav"
        sx={{
          display: { xs: "block", lg: "none" },
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
        aria-label="Mobile navigation"
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(5, minmax(0, 1fr))" },
              gap: 0.5,
              py: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.to === "/"}
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: "text.primary",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&.active": { bgcolor: "rgba(255,214,51,0.14)", color: "secondary.main" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="xl"
        className="storefront-main"
        sx={{ py: { xs: 3, md: 5 } }}
      >
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          mt: { xs: 5, md: 8 },
          py: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(3, 7, 20, 0.76)",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Typography variant="body2" color="text.secondary">
              Blockbuster+ · Submitted by Joshua Ojeda
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mini Labs 1–3 · React, MVC, SQLite, and complete CRUD
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
