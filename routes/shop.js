const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/', productsController.getProducts);

// router.get('/boot', (req, res, next) => {
// 	res.render('layout/bootstrap-layout', { pageTitle: 'Test Bootstrap' });
// });
module.exports = router;
