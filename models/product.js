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
	constructor(title, price, imageUrl, description) {
		this.title = title;
		this.price = price;
		this.imageUrl = imageUrl;
		this.description = description;
	}

	save() {
		// products.push(this);
		this.id = Math.random().toString();
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

	static findById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(p => p.id === id);
			cb(product);
		});
	}
};
