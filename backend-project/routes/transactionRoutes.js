const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

router.get('/reports/daily', transactionController.getDailyReport);
router.get('/reports/weekly', transactionController.getWeeklyReport);
router.get('/reports/monthly', transactionController.getMonthlyReport);
router.get('/reports/available-stock', transactionController.getAvailableStockReport);
router.get('/reports/stock-in', transactionController.getStockInReport);
router.get('/reports/stock-out', transactionController.getStockOutReport);
router.get('/reports/dashboard', transactionController.getDashboardStats);

module.exports = router;
