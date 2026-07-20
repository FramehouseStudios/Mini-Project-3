const path = require('node:path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const Film = require('./models/Film');
const filmRoutes = require('./routes/filmRoutes');
const openApiDocument = require('./docs/openapi.json');

const app = express();
const rootDirectory = __dirname;
const webDistDirectory = path.join(rootDirectory, 'apps', 'web', 'dist');

app.disable('x-powered-by');
app.use(express.json({ limit: '250kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'Blockbuster+ Film API',
    database: 'SQLite',
    architecture: 'MVC',
    films: Film.stats().total_films,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1', (_req, res) => {
  res.json({
    success: true,
    name: 'Blockbuster+ Film API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      films: '/api/v1/films',
      genres: '/api/v1/films/genres',
      stats: '/api/v1/films/stats',
      health: '/health',
    },
  });
});

app.use('/api/v1/films', filmRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, {
  customSiteTitle: 'Blockbuster+ API Documentation',
}));

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `No API route matches ${req.method} ${req.originalUrl}` },
  });
});

app.get('/index.html', (_req, res) => res.redirect(308, '/'));
app.get('/films.html', (_req, res) => res.redirect(308, '/films'));
app.get('/about.html', (_req, res) => res.redirect(308, '/about'));
app.use(express.static(webDistDirectory, { index: false }));

app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    return res.sendFile(path.join(webDistDirectory, 'index.html'));
  }
  return next();
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `No route matches ${req.method} ${req.originalUrl}` },
  });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: status === 400 ? 'BAD_REQUEST' : 'INTERNAL',
      message: status === 500 ? 'Unexpected server error' : error.message,
    },
  });
});

module.exports = app;
