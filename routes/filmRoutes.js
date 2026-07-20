const express = require('express');
const filmController = require('../controllers/filmController');

const router = express.Router();

router.get('/stats', filmController.getStats);
router.get('/genres', filmController.getGenres);
router.post('/seed', filmController.reseedFilms);
router.get('/', filmController.listFilms);
router.post('/', filmController.createFilm);
router.get('/:identifier', filmController.getFilm);
router.put('/:id', filmController.updateFilm);
router.patch('/:id', filmController.updateFilm);
router.delete('/:id', filmController.deleteFilm);

module.exports = router;
