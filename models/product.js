const fs = require('fs');
const path = require('path');

const pathData = path.join(
	path.dirname(process.mainModule.filename),
	'data',
	'products.json'
);

const getProductsFromFile = cb => {
	fs.readFile(pathData, (err, res) => {
		if (err) {
			return cb([]);
		} else {
			cb(JSON.parse(res));
		}
	});
};

module.exports = class Product {
	constructor(t, p) {
		this.title = t;
		this.price = p;
	}

	save() {
		// products.push(this);
		getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(pathData, JSON.stringify(products), err => {
				console.log(err);
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
		// return products;
	}
};
