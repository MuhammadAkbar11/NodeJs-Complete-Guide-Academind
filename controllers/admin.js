const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		pageTitle: 'Admin - Add Products | phoenix.com',
		path: '/admin/add-product'
	});
};

exports.postAddProducts = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;

	const product = new Product(title, imageUrl, price, description);
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
