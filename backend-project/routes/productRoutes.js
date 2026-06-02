const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.put('/:code', productController.updateProduct);
router.delete('/:code', productController.deleteProduct);

module.exports = router;
