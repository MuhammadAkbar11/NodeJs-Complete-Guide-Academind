const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		pageTitle: 'Admin - Add Products | phoenix.com',
		path: '/admin/add-product'
	});
};

exports.postAddProducts = (req, res, next) => {
	const product = new Product(req.body.title, req.body.price);
	// products.push({ title: req.body.title, price: req.body.price });

	product.save();
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin - products | phoenix.com',
			path: '/admin/products'
		});
	});
};
