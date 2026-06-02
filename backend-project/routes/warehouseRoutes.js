const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', warehouseController.createWarehouse);
router.get('/', warehouseController.getAllWarehouses);
router.put('/:code', warehouseController.updateWarehouse);
router.delete('/:code', warehouseController.deleteWarehouse);

module.exports = router;
