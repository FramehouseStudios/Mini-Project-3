import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/PageHeader.jsx";
import StatusPanel from "../components/StatusPanel.jsx";
import useFilms from "../hooks/useFilms.js";
import { createFilm, deleteFilm, updateFilm } from "../services/filmApi.js";

const EMPTY_FORM = {
  title: "",
  genre: "",
  director: "",
  year: String(new Date().getFullYear()),
  rating: "8",
  runtime: "100",
  description: "",
  poster: "",
};

function toFormValues(film) {
  return {
    title: film.title,
    genre: film.genre,
    director: film.director,
    year: String(film.year),
    rating: String(film.rating),
    runtime: String(film.runtime),
    description: film.description,
    poster: film.poster || "",
  };
}

function CatalogManagerPage() {
  const { films, loading, error, reload } = useFilms();
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const sortedFilms = useMemo(
    () => [...films].sort((first, second) => first.title.localeCompare(second.title)),
    [films],
  );

  const resetForm = () => {
    setFormValues(EMPTY_FORM);
    setEditingId(null);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);

    const payload = {
      ...formValues,
      year: Number(formValues.year),
      rating: Number(formValues.rating),
      runtime: Number(formValues.runtime),
      source: editingId ? undefined : "manual",
    };

    try {
      if (editingId) {
        await updateFilm(editingId, payload);
        setNotice({ severity: "success", message: `Updated ${formValues.title}.` });
      } else {
        await createFilm(payload);
        setNotice({ severity: "success", message: `Added ${formValues.title} to the catalog.` });
      }
      resetForm();
      reload();
    } catch (requestError) {
      setNotice({ severity: "error", message: requestError.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (film) => {
    setEditingId(film.id);
    setFormValues(toFormValues(film));
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    const film = pendingDelete;
    setPendingDelete(null);
    setSubmitting(true);
    setNotice(null);

    try {
      await deleteFilm(film.id);
      if (editingId === film.id) resetForm();
      setNotice({ severity: "success", message: `Deleted ${film.title}.` });
      reload();
    } catch (requestError) {
      setNotice({ severity: "error", message: requestError.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="MVC + REST"
        title="Catalog Manager"
        description="Demonstrate complete CRUD against the SQLite film database. Every action travels through the Express controller, model, and versioned API."
      />

      {notice && <Alert severity={notice.severity}>{notice.message}</Alert>}

      <Card component="section">
        <CardContent>
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <Stack spacing={0.75}>
              <Typography variant="h4" component="h2">
                {editingId ? "Edit film" : "Add a film"}
              </Typography>
              <Typography color="text.secondary">
                Required fields mirror server-side validation. Poster URL is optional.
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth required label="Title" name="title" value={formValues.title} onChange={handleFieldChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField fullWidth required label="Genre" name="genre" value={formValues.genre} onChange={handleFieldChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField fullWidth required label="Director" name="director" value={formValues.director} onChange={handleFieldChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Release year"
                  name="year"
                  value={formValues.year}
                  onChange={handleFieldChange}
                  slotProps={{ htmlInput: { min: 1888, max: new Date().getFullYear() + 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Rating out of 10"
                  name="rating"
                  value={formValues.rating}
                  onChange={handleFieldChange}
                  slotProps={{ htmlInput: { min: 0, max: 10, step: 0.1 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Runtime (minutes)"
                  name="runtime"
                  value={formValues.runtime}
                  onChange={handleFieldChange}
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={3}
                  label="Description"
                  name="description"
                  value={formValues.description}
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth type="url" label="Poster URL (optional)" name="poster" value={formValues.poster} onChange={handleFieldChange} />
              </Grid>
            </Grid>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button type="submit" variant="contained" startIcon={editingId ? <EditOutlinedIcon /> : <AddIcon />} disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Save changes" : "Create film"}
              </Button>
              {editingId && (
                <Button type="button" variant="outlined" onClick={resetForm} disabled={submitting}>
                  Cancel edit
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <StatusPanel loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <Stack component="section" spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="h4" component="h2">Database records</Typography>
            <Typography color="text.secondary">{sortedFilms.length} films</Typography>
          </Stack>
          <Grid container spacing={2}>
            {sortedFilms.map((film) => (
              <Grid key={film.id} size={{ xs: 12, md: 6 }}>
                <Card component="article" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3">{film.title}</Typography>
                    <Typography color="text.secondary">
                      {film.year} · {film.genre} · {film.runtime} min · {film.rating.toFixed(1)}/10
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Directed by {film.director} · Source: {film.source}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button startIcon={<EditOutlinedIcon />} onClick={() => handleEdit(film)} disabled={submitting}>
                      Edit
                    </Button>
                    <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setPendingDelete(film)} disabled={submitting}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}

      <Dialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Delete film?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingDelete ? `This permanently removes ${pendingDelete.title} from the SQLite catalog.` : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete film</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default CatalogManagerPage;
