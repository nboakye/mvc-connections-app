// Require all the third-party modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const connectionRoutes = require('./routes/connectionRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const {initCollection} = require('./models/connection');

// Create application
const app = express();

// Configure the application
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017';
app.set('view engine', 'ejs');

// connect to the database
mongoose.connect('mongodb://localhost:27017/4166app')
.then(()=> {
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch(err => console.log(err.message));

// Use middleware functions
app.use(express.static('public'));    // Be able to serve static files, looks in public folder
app.use(express.urlencoded({extended: true}));        // Parse data in request body for PUT requests
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: '1i2u291h8ni13409j1io34j023j',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/4166app'})   // default collection name is sessions
}));

app.use(flash());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

// Set up routes
app.use('/', mainRoutes);
app.use('/connections', connectionRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});

