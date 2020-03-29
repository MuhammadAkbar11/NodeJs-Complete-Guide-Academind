const Product = require('../models/product');

// eslint-disable-next-line no-unused-vars
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Admin - Add Products | phoenix.com',
		path: '/admin/add-product',
		editing: false
	});
};

// eslint-disable-next-line no-unused-vars
exports.postAddProducts = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const product = new Product(title, price, imageUrl, description);
	product.save();
	res.redirect('/');
};

// eslint-disable-next-line no-unused-vars
exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	console.log(editMode);
	if (!editMode) {
		return res.redirect('/');
	}

	const prodId = req.params.productId;
	Product.findById(prodId, product => {
		if (!product) {
			return res.redirect('/');
		}
		res.render('admin/edit-product', {
			pageTitle: 'Admin - Add Products | phoenix.com',
			path: '/admin/edit-product',
			editing: editMode,
			product: product
		});
	});
};

// eslint-disable-next-line no-unused-vars
exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin - products | phoenix.com',
			path: '/admin/products'
		});
	});
};
