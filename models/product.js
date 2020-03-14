const fs = require('fs');
const path = require('path');

module.exports = class Product {
	constructor(t) {
		this.title = t;
	}

	save() {
		// products.push(this);
		const pathData = path.join(
			path.dirname(process.mainModule.filename),
			'data',
			'products.json'
		);

		fs.readFile(pathData, (err, res) => {
			let products = [];
			if (!err) {
				products = JSON.parse(res);
			}
			products.push(this);
			fs.writeFile(pathData, JSON.stringify(products), err => {
				console.log(err);
			});
		});
	}

	static fetchAll() {
		const pathData = path.join(
			path.dirname(process.mainModule.filename),
			'data',
			'products.json'
		);
		fs.readFile(pathData, (err, res) => {
			if (err) {
				return [];
			}
			return JSON.parse(res);
		});
		// return products;
	}
};
