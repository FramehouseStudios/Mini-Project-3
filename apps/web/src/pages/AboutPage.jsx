import { Link as RouterLink } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";

const projects = [
  {
    label: "Mini Lab 1",
    title: "The original storefront",
    summary:
      "This is where Blockbuster+ first became a real browsing experience: responsive pages, movie data, search, filters, a rental bag, and a VHS-inspired visual identity.",
    color: "warning",
    items: [
      {
        title: "A multi-page, responsive foundation",
        body: "The original three-page goal now lives as six responsive React Router views with shared navigation and semantic main, section, and article structure.",
      },
      {
        title: "Dynamic movie browsing",
        body: "The local JSON and Fetch assignment grew into reusable film cards backed by Axios, an Express API, and SQLite while keeping title search and genre filtering intact.",
      },
      {
        title: "An interactive rental bag",
        body: "Visitors can add and remove films from any route. React Context shares the state, immutable updates keep it predictable, and localStorage remembers the bag after refresh.",
      },
      {
        title: "VHS personality and reviews",
        body: "The dark video-store shelves, yellow case spines, ratings, and controlled review form preserve the original VHS and Letterboxd-inspired direction.",
      },
      {
        title: "The Bootstrap goal, modernized honestly",
        body: "Mini Lab 1 used Bootstrap for responsive layout and buttons. The unified React assignment upgrades that layer to Material UI; the original Bootstrap snapshot remains preserved in mini-lab-1.",
      },
    ],
  },
  {
    label: "Mini Lab 2",
    title: "The React experience",
    summary:
      "This is the part people click through. It turns the original React assignment into a useful movie-browsing experience.",
    color: "secondary",
    items: [
      {
        title: "React + Vite workspace",
        body: "The frontend lives in apps/web and is registered in the root npm workspace, so the whole project runs from one place.",
      },
      {
        title: "Real routed pages",
        body: "Dashboard, Films, Film Details, Rental Bag, Catalog Manager, and About all use React Router instead of separate HTML pages.",
      },
      {
        title: "React state doing real work",
        body: "Hooks power search, filters, forms, reviews, dialogs, and loading states. Context keeps the rental bag in sync, and localStorage remembers it after a refresh.",
      },
      {
        title: "Reusable and responsive UI",
        body: "Film cards, controls, feedback states, and Material UI components are shared across the app and adapt to desktop and mobile screens.",
      },
      {
        title: "Live data instead of hardcoded cards",
        body: "Axios and the custom useFilms hook load the catalog from the Blockbuster+ API, with clear loading, error, empty, and success states.",
      },
    ],
  },
  {
    label: "Mini Lab 3",
    title: "The full-stack system",
    summary:
      "This is what works behind the screen. It gives the React app a real API, database, and complete movie-management workflow.",
    color: "primary",
    items: [
      {
        title: "A clear MVC backend",
        body: "Routes receive requests, controllers decide how to respond, and the Film model handles the SQLite database work.",
      },
      {
        title: "The database fills itself",
        body: "On first startup, a seed service fetches movie data from an external API and maps it into the local film schema. A curated fallback keeps the project usable offline.",
      },
      {
        title: "Complete CRUD",
        body: "Films can be created, read, updated, and deleted. The Catalog Manager demonstrates every action without needing a separate frontend project.",
      },
      {
        title: "Two easy ways to grade it",
        body: "The professor can use Catalog Manager visually or open Swagger to call the REST endpoints directly, just like using Postman.",
      },
      {
        title: "Checked from browser to database",
        body: "Linting, the production build, API integration tests, CRUD tests, and seed-data validation confirm that both sides work together.",
      },
    ],
  },
];

function AboutPage() {
  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="Mini Labs 1 + 2 + 3"
        title="One movie store, three assignments"
        description="Blockbuster+ began as a responsive JavaScript storefront, became a React/Vite experience, and then grew into one complete full-stack app. Here is the casual version of what each assignment added."
      />

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid key={project.label} size={{ xs: 12, lg: 4 }}>
            <Card component="section" sx={{ height: "100%" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2.5}>
                  <Stack spacing={1}>
                    <Chip
                      label={project.label}
                      color={project.color}
                      sx={{ alignSelf: "flex-start" }}
                    />
                    <Typography variant="h4" component="h2">
                      {project.title}
                    </Typography>
                    <Typography color="text.secondary">{project.summary}</Typography>
                  </Stack>

                  <List disablePadding>
                    {project.items.map((item) => (
                      <ListItem
                        key={item.title}
                        disableGutters
                        alignItems="flex-start"
                        sx={{ py: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
                          <CheckCircleOutlineIcon color={project.color} fontSize="small" />
                        </ListItemIcon>
                        <Stack spacing={0.25}>
                          <Typography fontWeight={700}>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.body}
                          </Typography>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card component="section">
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            spacing={3}
          >
            <Stack spacing={1} sx={{ maxWidth: 760 }}>
              <Typography variant="h5" component="h2">
                The short version
              </Typography>
              <Typography color="text.secondary">
                Mini Lab 1 created the storefront and core interactions. Mini Lab 2 rebuilt
                that experience with reusable React components, routes, hooks, and shared
                state. Mini Lab 3 added the MVC API, startup data import, SQLite database,
                complete CRUD, and Swagger. Blockbuster+ connects all three in one project.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button component={RouterLink} to="/films" variant="contained" color="secondary">
                Browse films
              </Button>
              <Button component={RouterLink} to="/catalog-manager" variant="outlined">
                Open Catalog Manager
              </Button>
              <Button
                component="a"
                href="/api-docs/"
                target="_blank"
                rel="noreferrer"
                variant="text"
                endIcon={<OpenInNewIcon />}
              >
                Open Swagger
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default AboutPage;
