import axios from "axios";

const filmApi = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: { Accept: "application/json" },
});

function unwrap(response) {
  return response.data?.data;
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.error?.message || error.message || fallback;
}

export async function listFilms(options = {}) {
  try {
    const response = await filmApi.get("/films", {
      params: { limit: 100, sort: "rating", order: "desc" },
      signal: options.signal,
    });
    return unwrap(response) || [];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    throw new Error(getErrorMessage(error, "The film catalog could not be loaded."));
  }
}

export async function getFilm(identifier, options = {}) {
  try {
    const response = await filmApi.get(`/films/${encodeURIComponent(identifier)}`, {
      signal: options.signal,
    });
    return unwrap(response);
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    throw new Error(getErrorMessage(error, "The film could not be loaded."));
  }
}

export async function createFilm(input) {
  try {
    return unwrap(await filmApi.post("/films", input));
  } catch (error) {
    throw new Error(getErrorMessage(error, "The film could not be created."));
  }
}

export async function updateFilm(id, input) {
  try {
    return unwrap(await filmApi.patch(`/films/${id}`, input));
  } catch (error) {
    throw new Error(getErrorMessage(error, "The film could not be updated."));
  }
}

export async function deleteFilm(id) {
  try {
    return unwrap(await filmApi.delete(`/films/${id}`));
  } catch (error) {
    throw new Error(getErrorMessage(error, "The film could not be deleted."));
  }
}
