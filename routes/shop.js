const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
	const products = adminData.products;
	res.render('home', {
		prods: products,
		pageTitle: 'Home | Shop.com',
		path: '/'
	});
});

router.get('/boot', (req, res, next) => {
	res.render('layout/bootstrap-layout', { pageTitle: 'Test Bootstrap' });
});
module.exports = router;
