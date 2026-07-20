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
  { label: "Films", to: "/films" },
  { label: "Rental Bag", to: "/rentals" },
  { label: "Catalog Manager", to: "/catalog-manager" },
  { label: "About", to: "/about" },
];

function Layout() {
  const { rentalCount } = useAppContext();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 72, gap: 3 }}>
            <Stack
              component={NavLink}
              to="/"
              direction="row"
              spacing={1.25}
              alignItems="center"
              flexGrow={1}
              aria-label="Blockbuster Plus dashboard"
            >
              <LocalMoviesOutlinedIcon />
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
                  color="inherit"
                  component={NavLink}
                  to={item.to}
                  end={item.to === "/"}
                  sx={{ "&.active": { bgcolor: "rgba(255,255,255,0.14)" } }}
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

      <Container component="main" maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;
