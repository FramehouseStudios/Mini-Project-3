import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2f5b52",
      dark: "#203f39",
    },
    secondary: {
      main: "#b9845f",
    },
    background: {
      default: "#f2f7f4",
      paper: "#ffffff",
    },
    text: {
      primary: "#17231f",
      secondary: "#66756f",
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
          border: "1px solid #dce7e2",
          boxShadow: "0 16px 36px rgba(30, 66, 56, 0.07)",
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
            outline: "3px solid rgba(185, 132, 95, 0.45)",
            outlineOffset: "2px",
          },
        },
      },
    },
  },
});

export default theme;
