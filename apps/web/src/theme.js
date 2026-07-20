import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1757d1", dark: "#0a2c74", contrastText: "#ffffff" },
    secondary: { main: "#ffd633", dark: "#d9a900", contrastText: "#121b31" },
    background: { default: "#071126", paper: "#101d38" },
    text: { primary: "#f6f8ff", secondary: "#aebbd3" },
    divider: "rgba(174, 187, 211, 0.2)",
    error: { main: "#ff6b72" },
    success: { main: "#69d7ad" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      '"Space Grotesk", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 800, letterSpacing: 0 },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: 0 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(174, 187, 211, 0.2)",
          boxShadow: "0 20px 48px rgba(0, 0, 0, 0.22)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 40,
          "&:focus-visible": {
            outline: "3px solid rgba(255, 214, 51, 0.62)",
            outlineOffset: 2,
          },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
  },
});

export default theme;
