const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	// const products = adminData.products;
	Product.fetchAll(products => {
		res.render('shop/products-list', {
			prods: products,
			pageTitle: 'All Products | phoenix.com',
			path: '/products'
		});
	});
};
exports.getIndex = (req, res, next) => {
	// const products = adminData.products;
	Product.fetchAll(products => {
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Home | phoenix.com',
			path: '/'
		});
	});
};

exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		pageTitle: 'Your Cart | phoenix.com',
		path: '/cart'
	});
};
exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout | phoenix.com',
		path: '/checkout'
	});
};
