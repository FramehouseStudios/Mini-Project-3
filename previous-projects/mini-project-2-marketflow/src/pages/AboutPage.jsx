import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";

const sections = [
  {
    title: "Process",
    body: "Requirements were pulled from the assignment README, then translated into routes, component boundaries, and a wireframe in docs/DESIGN.md.",
  },
  {
    title: "Data",
    body: "Products are fetched from Fake Store API with Axios inside a custom useProducts hook. The hook exposes products, categories, loading, error, and average rating.",
  },
  {
    title: "Interaction",
    body: "Users browse products, search, filter, sort, open dynamic detail pages, and save products to a planner.",
  },
  {
    title: "Hooks",
    body: "The app uses useState for filters and saved items, useEffect for API loading, useContext for global saved-product state, and useMemo for derived data.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Presentation guide"
        title="How the app is built"
        description="This page is intentionally included to help explain the project during the 5-10 minute presentation."
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
