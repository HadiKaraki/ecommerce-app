if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ObjectID } = require("mongodb");
const Cors = require("cors");
const { request } = require("express");
const ejsMate = require('ejs-mate');
const ejsLint = require('ejs-lint');
const flash = require('connect-flash');
const User = require('./models/user');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser")
const methodOverride = require('method-override');
//const bcrypt = require('bcrypt');
const helmet = require('helmet');
const session = require('express-session')
const MongoDBStore = require("connect-mongo");
const LocalStrategy = require('passport-local');
const catchAsync = require('./utils/catchAsync');
const path = require('path');
const { isLoggedIn } = require('./middleware');
var collection;

// ROUTES
const user = require('./routes/user');
const product = require('./routes/product');
const review = require('./routes/review');
const brand = require('./routes/brand');
const home = require('./routes/home');

// MONGODB ATLAS
const dbUrl = process.env.URL || 'mongodb://localhost:27017/ecommerceDB';
const client = new MongoClient(dbUrl);
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to mongodb")
    })
    .catch(err => {
        console.log("Error connecting to mongod")
        console.log(err)
    })

const secret = process.env.SECRET || 'bIlKPnuBwYddk45bzxrAQQweidhaludgalugaC1kLj7qy';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});


// Create collection 'session' on mongo atlas
const sessionConfig = {
    store,
    name: 'session',
    secret,
    //secure: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 // milliseconds seconds minutes days weeks
    }
}

app.use(helmet.xssFilter());

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Executed every time the app receives a request
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// EXPRESS
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));

// STATIC FILES (for serving css, images, and JS files)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/css'))
app.use(express.static(__dirname + '/assets'))
app.use(express.static(__dirname + '/utils'))

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
// combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Cors());

// ROUTING
app.use('/brand', brand)
app.use('/review', review)
app.use('/product', product)
app.use('/user', user)
app.use('/home', home)

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get("/search", async(req, res) => {
    let name = req.query.name;
    try {
        const agg = [
            { $search: { autocomplete: { query: name, path: "name", fuzzy: { maxEdits: 2, prefixLength: 3 } } } },
            { $limit: 20 },
            { $project: { _id: 1, name: 1, price: 1, brand: 1, images: 1 } }
        ];
        // RESULTS IS AN ARRAY
        const results = await collection.aggregate(agg).toArray();
        res.render('products/found', { results });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

app.get('/back', (req, res) => {
    const redirectUrl = req.session.returnTo;
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

app.all('*', (req, res) => {
    // req.flash('error', 'Page not found')
    // res.redirect('back');
    res.render('notfound')
})

const port = process.env.PORT || 3000; // if first does not work, go to the second
app.listen(port, async() => {
    try {
        await client.connect();
        collection = client.db("test").collection("products");
        console.log(`Serving on port ${port}`)
    } catch (e) {
        console.error(e);
    }
})

//msUmz38PI9crSPZh
//enigmatic-cove-37838