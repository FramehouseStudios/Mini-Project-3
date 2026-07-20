import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e24b3d",
      dark: "#b9362d",
    },
    secondary: {
      main: "#c9835b",
    },
    background: {
      default: "#f9ddc8",
      paper: "#fffaf6",
    },
    text: {
      primary: "#261715",
      secondary: "#7a6259",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #efc8b4",
          boxShadow: "0 18px 42px rgba(154, 65, 46, 0.12)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          "&:focus-visible": {
            outline: "3px solid rgba(226, 75, 61, 0.35)",
            outlineOffset: "2px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
