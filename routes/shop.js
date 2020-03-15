const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);

// router.get('/boot', (req, res, next) => {
// 	res.render('layout/bootstrap-layout', { pageTitle: 'Test Bootstrap' });
// });
module.exports = router;
