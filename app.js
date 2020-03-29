const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const errorController = require('./controllers/error');

// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

// app.listen(5050);
