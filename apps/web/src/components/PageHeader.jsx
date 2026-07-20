import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "flex-end" }}
      spacing={3}
      sx={{ mb: 4 }}
    >
      <Stack spacing={1.5} className="page-header-copy">
        {eyebrow && (
          <Chip label={eyebrow} color="secondary" sx={{ alignSelf: "start" }} />
        )}
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: { xs: "3rem", md: "4.75rem" }, maxWidth: 900 }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            {description}
          </Typography>
        )}
      </Stack>
      {action}
    </Stack>
  );
}

export default PageHeader;
