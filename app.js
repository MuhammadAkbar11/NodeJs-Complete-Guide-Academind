const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
	console.log('in The Midddleware');
	next();
});
app.use((req, res, next) => {
	console.log('in another Midddleware');
});

const server = http.createServer(app);

server.listen(3000);
