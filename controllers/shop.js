const Product = require('../models/product');
const Cart = require('../models/cart');

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
exports.getDetailProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId, product => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title + '| phoenix.com',
			path: '/products'
		});
	});
};

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		pageTitle: 'Your Cart | phoenix.com',
		path: '/cart'
	});
};

// eslint-disable-next-line no-unused-vars
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, product => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect('/cart');
};

// eslint-disable-next-line no-unused-vars
exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout | phoenix.com',
		path: '/checkout'
	});
};

// eslint-disable-next-line no-unused-vars
exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		pageTitle: 'You Order | phoenix.com',
		path: '/orders'
	});
};
