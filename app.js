const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
	console.log('in The Midddleware');
	next(); //* Allows the request to continue to the next moddleeware in line
});
app.use((req, res, next) => {
	console.log('in another Midddleware');
	res.send(`<h1>Hello from Express.js</h1>`);
});

const server = http.createServer(app);

server.listen(5000);
