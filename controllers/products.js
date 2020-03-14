const products = [];

exports.getAddProduct = (req, res, next) => {
	res.render('add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		activeAddProduct: true,
		formsCSS: true,
		productCSS: true
	});
};

exports.postAddProducts = (req, res, next) => {
	products.push({ title: req.body.title, price: req.body.price });
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	// const products = adminData.products;
	res.render('home', {
		prods: products,
		pageTitle: 'Home | Shop.com',
		path: '/',
		hasProducts: products.length > 0,
		activeShop: true,
		productCSS: true
	});
};
