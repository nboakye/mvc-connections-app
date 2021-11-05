// Require all the third-party modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { MongoClient, Db } = require('mongodb');
const connectionRoutes = require('./routes/connectionRoutes');
const mainRoutes = require('./routes/mainRoutes');

// Create application
const app = express();

// Configure the application
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017';
app.set('view engine', 'ejs');

// Use middleware functions
app.use(express.static('public'));    // Be able to serve static files, looks in public folder
app.use(express.urlencoded({extended: true}));        // Parse data in request body for PUT requests
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// connect to database
/* MongoClient.connect(url, (err, client) => {
    if(err) {
        console.log(err.message);
    } else {
        db = client.db('4166app');
        // Start server
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        });
    }
}); */

MongoClient.connect(url)
.then(client => {
    db = client.db('4166app');
    // Start server
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch(err => console.log(err.message));

// Set up routes
app.use('/', mainRoutes);
app.use('/connections', connectionRoutes);

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

