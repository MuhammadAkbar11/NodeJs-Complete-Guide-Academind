const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
	res.render();
});

app.get('/users', (req, res, next) => {
	res.render();
});

app.post('/add-uses', (req, res, next) => {
	res.redirect('/');
});

app.listen(8080);
