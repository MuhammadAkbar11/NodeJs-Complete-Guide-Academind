// const http = require('http');

const express = require('express');

const app = express();

// app.use((req, res, next) => {
// 	console.log('in The Midddleware');
// 	next(); //* Allows the request to continue to the next moddleeware in line
// });

app.use('/add-product', (req, res, next) => {
	console.log('in another Midddleware');
	res.send(`<h1>the "add product " page</h1>`);
});
app.use('/', (req, res, next) => {
	console.log('in another Midddleware');
	res.send(`<h1>Hello from Express.js</h1>`);
});

app.listen(5050);

// const server = http.createServer(app);

// server.listen(5000);
