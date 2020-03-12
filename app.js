const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const users = [];

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
	res.render('pug/index', { pageTitle: 'Home', users: users });
});

app.get('/users', (req, res, next) => {
	res.render('pug/users', { pageTitle: 'Add Users Page', users: users });
});

app.post('/add-users', (req, res, next) => {
	users.push({ name: req.body.username });
	res.redirect('/users');
});

app.listen(8080);
