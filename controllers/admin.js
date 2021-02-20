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
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(null, title, imageUrl, price, description);
	product.save();
	res.redirect('/');
};

// eslint-disable-next-line no-unused-vars
exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
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
exports.postEditProducts = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const UpdatedProduct = new Product(
		prodId,
		updatedTitle,
		updatedImageUrl,
		updatedPrice,
		updatedDescription
	);
	UpdatedProduct.save();
	res.redirect('/admin/products');
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
// eslint-disable-next-line no-unused-vars
exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId);
	res.redirect('/admin/products');
};
