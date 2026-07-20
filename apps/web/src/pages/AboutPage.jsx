import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";

const sections = [
  {
    title: "One full-stack product",
    body: "Blockbuster+ combines the earlier React/Vite requirements with Mini Project 3's Express MVC API and SQLite database. The root workspace runs both layers as one submission.",
  },
  {
    title: "Data integration",
    body: "A startup seed service imports external film data into a matching relational schema. React then reads that database through a custom Axios-powered useFilms hook.",
  },
  {
    title: "Complete CRUD",
    body: "The Catalog Manager creates, reads, updates, and deletes films through REST endpoints. Swagger at /api-docs provides a second, frontend-independent demonstration path.",
  },
  {
    title: "React architecture",
    body: "The interface uses functional components, routed pages, controlled forms, useState, useEffect, useMemo, Context, immutable list updates, localStorage, reusable cards, and Material UI.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Architecture at a glance"
        title="How Blockbuster+ is built"
        description="A concise map of the requirements demonstrated by this single, cohesive Mini Project 3 submission."
      />

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid key={section.title} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h5" component="h2">
                    {section.title}
                  </Typography>
                  <Typography color="text.secondary">{section.body}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default AboutPage;
