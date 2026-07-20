const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/stats', productController.getStats);
router.get('/categories', productController.getCategories);
router.post('/seed', productController.reseedProducts);
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
