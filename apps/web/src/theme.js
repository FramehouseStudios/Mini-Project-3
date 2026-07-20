import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2f63d8",
      light: "#6f96ef",
      dark: "#14337d",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffd21f",
      light: "#ffe36b",
      dark: "#d7a900",
      contrastText: "#071126",
    },
    background: { default: "#050816", paper: "#101a35" },
    text: { primary: "#fff8e9", secondary: "#aeb9cf" },
    divider: "rgba(255, 210, 31, 0.18)",
    error: { main: "#ff7474" },
    success: { main: "#4cdaa7" },
    warning: { main: "#ffba4a" },
    info: { main: "#6f96ef" },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily:
      '"Space Grotesk", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif',
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 0.96,
    },
    h2: {
      fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif',
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 0.98,
    },
    h3: {
      fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif',
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 1,
    },
    h4: {
      fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif',
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 1.05,
    },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 800, letterSpacing: 0 },
    button: { textTransform: "none", fontWeight: 800, letterSpacing: 0 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(3, 7, 20, 0.96)",
          borderBottom: "1px solid rgba(111, 150, 239, 0.2)",
          backdropFilter: "blur(16px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(155deg, rgba(20, 33, 66, 0.98), rgba(8, 15, 34, 0.98))",
          border: "1px solid rgba(111, 150, 239, 0.22)",
          boxShadow: "0 22px 52px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 6,
          paddingInline: 18,
          "&:focus-visible": {
            outline: "3px solid rgba(255, 210, 31, 0.68)",
            outlineOffset: 3,
          },
        },
        containedSecondary: {
          boxShadow: "0 10px 28px rgba(255, 210, 31, 0.18)",
          "&:hover": {
            backgroundColor: "#ffe36b",
            boxShadow: "0 14px 34px rgba(255, 210, 31, 0.24)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 5, fontWeight: 800 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(4, 10, 25, 0.64)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(174, 185, 207, 0.32)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 210, 31, 0.56)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffd21f",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage:
            "linear-gradient(155deg, rgba(20, 33, 66, 1), rgba(8, 15, 34, 1))",
          border: "1px solid rgba(255, 210, 31, 0.24)",
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: { color: "#ffd21f" },
        iconHover: { color: "#ffe36b" },
      },
    },
  },
});

export default theme;
