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
      <Stack spacing={1.5}>
        {eyebrow && (
          <Chip label={eyebrow} color="secondary" sx={{ alignSelf: "start" }} />
        )}
        <Typography variant="h2" component="h1">
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
