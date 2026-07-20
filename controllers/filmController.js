const Film = require('../models/Film');
const { seedFilmDatabase } = require('../services/filmSeedService');

function sendSuccess(res, data, status = 200, extra = {}) {
  res.status(status).json({ success: true, ...extra, data });
}

function sendError(res, error, fallbackStatus = 500) {
  const status = error.statusCode || fallbackStatus;
  res.status(status).json({
    success: false,
    error: {
      code: status === 404 ? 'NOT_FOUND' : status === 400 ? 'BAD_REQUEST' : 'INTERNAL',
      message: error.message,
    },
  });
}

function listFilms(req, res) {
  try {
    const result = Film.list(req.query);
    sendSuccess(res, result.data, 200, { page: result.page, filters: req.query });
  } catch (error) {
    sendError(res, error);
  }
}

function getFilm(req, res) {
  const film = /^\d+$/.test(req.params.identifier)
    ? Film.findById(req.params.identifier)
    : Film.findBySlug(req.params.identifier);

  if (!film) {
    return sendError(res, Object.assign(new Error('Film not found'), { statusCode: 404 }));
  }

  return sendSuccess(res, film);
}

function createFilm(req, res) {
  try {
    sendSuccess(res, Film.create(req.body), 201);
  } catch (error) {
    sendError(res, error, 400);
  }
}

function updateFilm(req, res) {
  try {
    const film = Film.update(req.params.id, req.body);
    if (!film) {
      return sendError(res, Object.assign(new Error('Film not found'), { statusCode: 404 }));
    }
    return sendSuccess(res, film);
  } catch (error) {
    return sendError(res, error, 400);
  }
}

function deleteFilm(req, res) {
  const film = Film.delete(req.params.id);
  if (!film) {
    return sendError(res, Object.assign(new Error('Film not found'), { statusCode: 404 }));
  }
  return sendSuccess(res, film, 200, { message: 'Film deleted' });
}

function getGenres(_req, res) {
  sendSuccess(res, Film.genres());
}

function getStats(_req, res) {
  sendSuccess(res, Film.stats());
}

async function reseedFilms(_req, res) {
  try {
    const result = await seedFilmDatabase();
    sendSuccess(res, result.stats, 200, {
      message: `Loaded ${result.curatedCount} curated and ${result.externalCount} external films`,
      source: result.externalSource,
      warning: result.externalError,
    });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  listFilms,
  getFilm,
  createFilm,
  updateFilm,
  deleteFilm,
  getGenres,
  getStats,
  reseedFilms,
};
