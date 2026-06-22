import { Outlet, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useAppContext } from "../context/AppContext.jsx";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Planner", to: "/planner" },
  { label: "About", to: "/about" },
];

function Layout() {
  const { savedCount } = useAppContext();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ gap: 3 }}>
          <Stack direction="row" spacing={1.3} alignItems="center" flexGrow={1}>
            <ShoppingBagOutlinedIcon />
            <Typography variant="h6" component="div">
              MarketFlow
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            component="nav"
            aria-label="Primary navigation"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                color="inherit"
                component={NavLink}
                to={item.to}
                sx={{
                  "&.active": {
                    bgcolor: "rgba(255,255,255,0.16)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Tooltip title={`${savedCount} saved product${savedCount === 1 ? "" : "s"}`}>
            <Badge
              badgeContent={savedCount}
              color="secondary"
              aria-label={`${savedCount} saved products`}
            >
              <ShoppingBagOutlinedIcon />
            </Badge>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          display: { xs: "block", sm: "none" },
          bgcolor: "background.paper",
          borderBottom: "1px solid #dce7e2",
        }}
        aria-label="Mobile navigation"
      >
        <Container>
          <Stack direction="row" spacing={1} sx={{ py: 1, overflowX: "auto" }}>
            {navItems.map((item) => (
              <Button key={item.to} component={NavLink} to={item.to}>
                {item.label}
              </Button>
            ))}
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 4, md: 6 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;
