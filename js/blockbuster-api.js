(function attachBlockbusterApi(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.BlockbusterApi = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, function createBlockbusterApi() {
  const API_BASE_URL = '/api/v1';

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload?.error?.message || `API request failed with ${response.status}`;
      throw new Error(message);
    }

    return payload;
  }

  async function loadFilms({ fallbackUrl = 'data/films.json', query = {} } = {}) {
    const searchParams = new URLSearchParams({ limit: '100', ...query });

    try {
      const payload = await request(`/films?${searchParams}`);
      const films = Array.isArray(payload?.data) ? payload.data : [];
      if (!films.length) throw new Error('The database returned an empty film shelf');
      return { films, source: 'sqlite-api', page: payload.page };
    } catch (apiError) {
      const response = await fetch(fallbackUrl);
      if (!response.ok) throw apiError;
      const films = await response.json();
      return { films, source: 'curated-json', warning: apiError.message };
    }
  }

  function getFilm(idOrSlug) {
    return request(`/films/${encodeURIComponent(idOrSlug)}`);
  }

  function createFilm(film) {
    return request('/films', { method: 'POST', body: JSON.stringify(film) });
  }

  function updateFilm(id, updates) {
    return request(`/films/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  function deleteFilm(id) {
    return request(`/films/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  return {
    API_BASE_URL,
    request,
    loadFilms,
    getFilm,
    createFilm,
    updateFilm,
    deleteFilm,
  };
});
