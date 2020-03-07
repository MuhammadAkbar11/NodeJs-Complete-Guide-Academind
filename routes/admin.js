const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
	res.send(`
	<h1>the "Add product" page</h1>
	<form action="/product" method="POST">
		<input type="text" name="title" id="titile">
		<button type="submit">Add Product</button>
	</form>
	`);
});

router.post('/product', (req, res, next) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
