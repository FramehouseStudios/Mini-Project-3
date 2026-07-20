const { db } = require('../config/database');

const TAG_TYPES = {
  vibeTags: 'vibe',
  cultureTags: 'culture',
  moods: 'mood',
  weatherTags: 'weather',
};

function safeJson(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cleanString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => cleanString(item)).filter(Boolean))];
}

function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeReview(review = {}, fallbackIndex = 0) {
  const stars = Number(review.stars ?? 0);
  return {
    stars: Number.isFinite(stars) ? stars : 0,
    username: cleanString(review.username, `viewer${fallbackIndex + 1}`),
    avatar: cleanString(review.avatar, 'BB').slice(0, 4).toUpperCase(),
    quote: cleanString(review.quote, 'A memorable night at the video store.'),
  };
}

function normalizeFilmInput(input = {}) {
  const title = cleanString(input.title);
  const year = Number(input.year ?? input.releaseDate ?? input.release_date);
  const rating = Number(input.rating ?? input.rtScore ?? input.rt_score ?? 0);
  const runtime = Number(input.runtime ?? input.runningTime ?? input.running_time ?? 1);
  const reviews = Array.isArray(input.reviews)
    ? input.reviews.map(normalizeReview)
    : input.review
      ? [normalizeReview(input.review)]
      : [];

  return {
    id: Number.isInteger(Number(input.id)) ? Number(input.id) : null,
    externalId: cleanString(input.externalId ?? input.external_id) || null,
    title,
    slug: cleanString(input.slug) || `${slugify(title)}-${year}`,
    originalTitle: cleanString(input.originalTitle ?? input.original_title),
    originalTitleRomanised: cleanString(
      input.originalTitleRomanised ?? input.original_title_romanised,
    ),
    genre: cleanString(input.genre, 'Drama'),
    director: cleanString(input.director, 'Unknown'),
    producer: cleanString(input.producer),
    year,
    rating,
    runtime,
    rewatches: Number(input.rewatches ?? 0),
    lateNightScore: Number(input.lateNightScore ?? input.late_night_score ?? 50),
    favoriteScene: cleanString(input.favoriteScene ?? input.favorite_scene),
    description: cleanString(input.description),
    poster: cleanString(input.poster ?? input.image),
    banner: cleanString(input.banner ?? input.movieBanner ?? input.movie_banner),
    trailer: cleanString(input.trailer),
    vibeTags: cleanStringArray(input.vibeTags ?? input.vibe_tags),
    cultureTags: cleanStringArray(input.cultureTags ?? input.culture_tags),
    moods: cleanStringArray(input.moods),
    weatherTags: cleanStringArray(input.weatherTags ?? input.weather_tags),
    soundtrack: cleanString(input.soundtrack),
    drinkPairing: cleanString(input.drinkPairing ?? input.drink_pairing),
    cinematicQuote: cleanString(input.cinematicQuote ?? input.cinematic_quote),
    visualMood: cleanString(input.visualMood ?? input.visual_mood),
    emotionalSynopsis: cleanString(input.emotionalSynopsis ?? input.emotional_synopsis),
    reviews,
    source: cleanString(input.source, 'manual'),
    sourceUrl: cleanString(input.sourceUrl ?? input.source_url ?? input.url),
    people: cleanStringArray(input.people),
    species: cleanStringArray(input.species),
    locations: cleanStringArray(input.locations),
    vehicles: cleanStringArray(input.vehicles),
  };
}

function validateFilm(film) {
  const currentYear = new Date().getFullYear();
  if (!film.title) return 'Title is required';
  if (!film.description) return 'Description is required';
  if (!film.genre) return 'Genre is required';
  if (!film.director) return 'Director is required';
  if (!Number.isInteger(film.year) || film.year < 1888 || film.year > currentYear + 3) {
    return 'Year must be a valid film release year';
  }
  if (!Number.isFinite(film.rating) || film.rating < 0 || film.rating > 10) {
    return 'Rating must be between 0 and 10';
  }
  if (!Number.isInteger(film.runtime) || film.runtime < 1) {
    return 'Runtime must be a positive whole number';
  }
  if (!Number.isInteger(film.rewatches) || film.rewatches < 0) {
    return 'Rewatches must be a positive whole number';
  }
  if (!Number.isInteger(film.lateNightScore) || film.lateNightScore < 0 || film.lateNightScore > 100) {
    return 'Late-night score must be between 0 and 100';
  }
  if (film.reviews.some((review) => review.stars < 0 || review.stars > 5)) {
    return 'Review stars must be between 0 and 5';
  }
  return null;
}

function withTransaction(callback) {
  db.exec('BEGIN;');
  try {
    const result = callback();
    db.exec('COMMIT;');
    return result;
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

function getTags(filmId) {
  const grouped = { vibeTags: [], cultureTags: [], moods: [], weatherTags: [] };
  const keyByType = Object.fromEntries(Object.entries(TAG_TYPES).map(([key, type]) => [type, key]));

  db.prepare(`
    SELECT tag_type, value
    FROM film_tags
    WHERE film_id = ?
    ORDER BY tag_type, sort_order, value COLLATE NOCASE
  `).all(filmId).forEach((tag) => grouped[keyByType[tag.tag_type]].push(tag.value));

  return grouped;
}

function getReviews(filmId) {
  return db.prepare(`
    SELECT stars, username, avatar, quote, is_featured
    FROM reviews
    WHERE film_id = ?
    ORDER BY is_featured DESC, id ASC
  `).all(filmId).map((review) => ({
    stars: review.stars,
    username: review.username,
    avatar: review.avatar,
    quote: review.quote,
    isFeatured: Boolean(review.is_featured),
  }));
}

function mapFilm(row) {
  if (!row) return null;
  const tags = getTags(row.id);
  const reviews = getReviews(row.id);
  const publicReviews = reviews.map(({ isFeatured: _isFeatured, ...review }) => review);
  const featured = reviews.find((review) => review.isFeatured) || reviews[0];

  return {
    id: row.id,
    externalId: row.external_id,
    slug: row.slug,
    title: row.title,
    originalTitle: row.original_title,
    originalTitleRomanised: row.original_title_romanised,
    genre: row.genre,
    director: row.director,
    producer: row.producer,
    year: row.year,
    rating: row.rating,
    runtime: row.runtime,
    rewatches: row.rewatches,
    lateNightScore: row.late_night_score,
    favoriteScene: row.favorite_scene,
    description: row.description,
    poster: row.poster,
    banner: row.banner,
    trailer: row.trailer,
    ...tags,
    soundtrack: row.soundtrack,
    drinkPairing: row.drink_pairing,
    cinematicQuote: row.cinematic_quote,
    visualMood: row.visual_mood,
    emotionalSynopsis: row.emotional_synopsis,
    review: featured
      ? {
          stars: featured.stars,
          username: featured.username,
          avatar: featured.avatar,
          quote: featured.quote,
        }
      : null,
    reviews: publicReviews,
    source: row.source,
    sourceUrl: row.source_url,
    externalMetadata: {
      people: safeJson(row.people_json),
      species: safeJson(row.species_json),
      locations: safeJson(row.locations_json),
      vehicles: safeJson(row.vehicles_json),
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function replaceTags(filmId, film) {
  db.prepare('DELETE FROM film_tags WHERE film_id = ?').run(filmId);
  const insert = db.prepare(`
    INSERT INTO film_tags (film_id, tag_type, value, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  Object.entries(TAG_TYPES).forEach(([key, type]) => {
    film[key].forEach((value, index) => insert.run(filmId, type, value, index));
  });
}

function replaceReviews(filmId, reviews) {
  db.prepare('DELETE FROM reviews WHERE film_id = ?').run(filmId);
  const insert = db.prepare(`
    INSERT INTO reviews (film_id, stars, username, avatar, quote, is_featured)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  reviews.forEach((review, index) => {
    insert.run(filmId, review.stars, review.username, review.avatar, review.quote, index === 0 ? 1 : 0);
  });
}

function insertFilm(film, preserveId = false) {
  const columns = preserveId && film.id ? 'id, ' : '';
  const placeholders = preserveId && film.id ? '?, ' : '';
  const values = preserveId && film.id ? [film.id] : [];
  const result = db.prepare(`
    INSERT INTO films (
      ${columns}external_id, title, slug, original_title, original_title_romanised,
      genre, director, producer, year, rating, runtime, rewatches, late_night_score,
      favorite_scene, description, poster, banner, trailer, soundtrack, drink_pairing,
      cinematic_quote, visual_mood, emotional_synopsis, source, source_url,
      people_json, species_json, locations_json, vehicles_json, created_at, updated_at
    ) VALUES (
      ${placeholders}?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
  `).run(
    ...values,
    film.externalId,
    film.title,
    film.slug,
    film.originalTitle,
    film.originalTitleRomanised,
    film.genre,
    film.director,
    film.producer,
    film.year,
    film.rating,
    film.runtime,
    film.rewatches,
    film.lateNightScore,
    film.favoriteScene,
    film.description,
    film.poster,
    film.banner,
    film.trailer,
    film.soundtrack,
    film.drinkPairing,
    film.cinematicQuote,
    film.visualMood,
    film.emotionalSynopsis,
    film.source,
    film.sourceUrl,
    JSON.stringify(film.people),
    JSON.stringify(film.species),
    JSON.stringify(film.locations),
    JSON.stringify(film.vehicles),
  );

  return Number(result.lastInsertRowid || film.id);
}

const Film = {
  list(filters = {}) {
    const where = [];
    const params = {};

    if (filters.q) {
      where.push('(LOWER(f.title) LIKE :q OR LOWER(f.director) LIKE :q OR LOWER(f.description) LIKE :q)');
      params.q = `%${String(filters.q).toLowerCase()}%`;
    }
    if (filters.genre) {
      where.push('LOWER(f.genre) = LOWER(:genre)');
      params.genre = String(filters.genre);
    }
    if (filters.source) {
      where.push('f.source = :source');
      params.source = String(filters.source);
    }
    if (filters.minRating !== undefined) {
      where.push('f.rating >= :minRating');
      params.minRating = Number(filters.minRating);
    }
    if (filters.year !== undefined) {
      where.push('f.year = :year');
      params.year = Number(filters.year);
    }
    if (filters.mood) {
      where.push(`EXISTS (
        SELECT 1 FROM film_tags ft
        WHERE ft.film_id = f.id AND ft.tag_type = 'mood' AND LOWER(ft.value) = LOWER(:mood)
      )`);
      params.mood = String(filters.mood);
    }

    const sortColumn = {
      rating: 'f.rating',
      year: 'f.year',
      rewatches: 'f.rewatches',
      title: 'f.title COLLATE NOCASE',
      newest: 'f.created_at',
    }[filters.sort] || 'f.rating';
    const order = String(filters.order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const requestedLimit = Number(filters.limit ?? 100);
    const requestedOffset = Number(filters.offset ?? 0);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 100;
    const offset = Number.isInteger(requestedOffset) ? Math.max(requestedOffset, 0) : 0;
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = db.prepare(`SELECT COUNT(*) AS count FROM films f ${whereSql}`).get(params).count;
    const rows = db.prepare(`
      SELECT f.* FROM films f
      ${whereSql}
      ORDER BY ${sortColumn} ${order}, f.id ASC
      LIMIT :limit OFFSET :offset
    `).all({ ...params, limit, offset });

    return {
      data: rows.map(mapFilm),
      page: { limit, offset, total },
    };
  },

  findById(id) {
    return mapFilm(db.prepare('SELECT * FROM films WHERE id = ?').get(Number(id)));
  },

  findBySlug(slug) {
    return mapFilm(db.prepare('SELECT * FROM films WHERE slug = ?').get(String(slug)));
  },

  create(input, options = {}) {
    const film = normalizeFilmInput(input);
    const validationError = validateFilm(film);
    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      throw error;
    }

    const filmId = withTransaction(() => {
      const id = insertFilm(film, options.preserveId);
      replaceTags(id, film);
      replaceReviews(id, film.reviews);
      return id;
    });

    return this.findById(filmId);
  },

  upsertSeed(input, options = {}) {
    const film = normalizeFilmInput(input);
    const existing = film.externalId
      ? db.prepare('SELECT id, source FROM films WHERE external_id = ?').get(film.externalId)
      : null;
    const titleMatch = db.prepare('SELECT id, source FROM films WHERE title = ? AND year = ?').get(
      film.title,
      film.year,
    );
    const match = existing || titleMatch;

    if (match) {
      if (match.source === 'curated' && film.source !== 'curated') {
        return this.findById(match.id);
      }
      return this.update(match.id, film);
    }

    return this.create(film, options);
  },

  update(id, input) {
    const existing = this.findById(id);
    if (!existing) return null;

    const externalMetadata = existing.externalMetadata || {};
    const merged = normalizeFilmInput({
      ...existing,
      ...input,
      id: existing.id,
      externalId: input.externalId ?? existing.externalId,
      rating: input.rating ?? existing.rating,
      reviews: input.reviews ?? existing.reviews,
      vibeTags: input.vibeTags ?? existing.vibeTags,
      cultureTags: input.cultureTags ?? existing.cultureTags,
      moods: input.moods ?? existing.moods,
      weatherTags: input.weatherTags ?? existing.weatherTags,
      people: input.people ?? externalMetadata.people,
      species: input.species ?? externalMetadata.species,
      locations: input.locations ?? externalMetadata.locations,
      vehicles: input.vehicles ?? externalMetadata.vehicles,
    });
    const validationError = validateFilm(merged);
    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      throw error;
    }

    withTransaction(() => {
      db.prepare(`
        UPDATE films SET
          external_id = ?, title = ?, slug = ?, original_title = ?, original_title_romanised = ?,
          genre = ?, director = ?, producer = ?, year = ?, rating = ?, runtime = ?, rewatches = ?,
          late_night_score = ?, favorite_scene = ?, description = ?, poster = ?, banner = ?,
          trailer = ?, soundtrack = ?, drink_pairing = ?, cinematic_quote = ?, visual_mood = ?,
          emotional_synopsis = ?, source = ?, source_url = ?, people_json = ?, species_json = ?,
          locations_json = ?, vehicles_json = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        merged.externalId,
        merged.title,
        merged.slug,
        merged.originalTitle,
        merged.originalTitleRomanised,
        merged.genre,
        merged.director,
        merged.producer,
        merged.year,
        merged.rating,
        merged.runtime,
        merged.rewatches,
        merged.lateNightScore,
        merged.favoriteScene,
        merged.description,
        merged.poster,
        merged.banner,
        merged.trailer,
        merged.soundtrack,
        merged.drinkPairing,
        merged.cinematicQuote,
        merged.visualMood,
        merged.emotionalSynopsis,
        merged.source,
        merged.sourceUrl,
        JSON.stringify(merged.people),
        JSON.stringify(merged.species),
        JSON.stringify(merged.locations),
        JSON.stringify(merged.vehicles),
        Number(id),
      );
      replaceTags(Number(id), merged);
      replaceReviews(Number(id), merged.reviews);
    });

    return this.findById(id);
  },

  delete(id) {
    const existing = this.findById(id);
    if (!existing) return null;
    db.prepare('DELETE FROM films WHERE id = ?').run(Number(id));
    return existing;
  },

  genres() {
    return db.prepare(`
      SELECT genre, COUNT(*) AS count, ROUND(AVG(rating), 1) AS average_rating
      FROM films
      GROUP BY genre
      ORDER BY genre COLLATE NOCASE ASC
    `).all();
  },

  stats() {
    return db.prepare(`
      SELECT
        COUNT(*) AS total_films,
        COUNT(DISTINCT genre) AS total_genres,
        ROUND(AVG(rating), 1) AS average_rating,
        ROUND(AVG(runtime), 0) AS average_runtime,
        SUM(CASE WHEN source = 'curated' THEN 1 ELSE 0 END) AS curated_films,
        SUM(CASE WHEN source != 'curated' THEN 1 ELSE 0 END) AS external_films,
        MAX(updated_at) AS last_updated
      FROM films
    `).get();
  },
};

module.exports = Film;
module.exports.normalizeFilmInput = normalizeFilmInput;
module.exports.validateFilm = validateFilm;
