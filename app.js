if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ObjectID } = require("mongodb");
const { request } = require("express");
const cookies = require("cookie")
const signCookies = require("cookie-signature")
const ejsMate = require('ejs-mate');
const ejsLint = require('ejs-lint');
const flash = require('connect-flash');
const User = require('./models/user');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser")
const methodOverride = require('method-override');
const helmet = require('helmet');
const Cors = require("cors");
const hpkp = require("hpkp");
const permissionsPolicy = require("permissions-policy");
const session = require('express-session')
const MongoDBStore = require("connect-mongo");
const LocalStrategy = require('passport-local');
const catchAsync = require('./utils/catchAsync');
const path = require('path');
const { isLoggedIn, setCache } = require('./middleware');
const Product = require('./models/product');
var collection;

// ROUTES
const user = require('./routes/user');
const product = require('./routes/product');
const review = require('./routes/review');
const brand = require('./routes/brand');

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
        //secure: true, (be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.)
        sameSite: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24, // milliseconds seconds minutes days weeks
        signed: true
    }
}

app.use(helmet({ crossOriginEmbedderPolicy: false }));

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// URL's for contentSecurityPolicy
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/",
    "https://ajax.googleapis.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://maxcdn.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/",
    "https://ajax.googleapis.com/",
    "https://cdnjs.cloudflare.com/",
    "https://code.jquery.com/"
];
const connectSrcUrls = [
    "https://ajax.googleapis.com/",
    "https://ecommerce.hadikaraki.net/"
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://cdnjs.cloudflare.com/"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvxvgwx9m/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            frameAncestors: ["'none'"]
        }
    })
);

app.use(
    helmet.frameguard({
        action: "deny",
    })
);

// const ninetyDaysInSeconds = 7776000;
// app.use(
//     hpkp({
//         maxAge: ninetyDaysInSeconds,
//         sha256s: ["AbCdEf123=", "ZyXwVu456="],
//         includeSubDomains: true, // optional
//         reportOnly: false, // optional

//         // Set the header based on a condition.
//         // This is optional.
//         setIf(req, res) {
//             return req.secure;
//         },
//     })
// );

app.use(
    permissionsPolicy({
        features: {
            fullscreen: ["self"], // fullscreen=()
            //vibrate: ["none"], // vibrate=(none)
            accelerometer: ["self"],
            //ambientLigntSensor: ["none"],
            autoplay: ["self"],
            //battery: ["none"],
            camera: ["self"],
            geolocation: ["self"],
            gyroscope: ["self"],
            //layoutAnimations: ["self"],
            microphone: ["self"],
            //oversizedImages: ["none"],
            payment: ["self"],
            //speakerSelection: ["none"],
            webShare: ["self"],
            syncXhr: ["self"]
        },
    })
);

// app.use(setCache)
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
app.use(express.static(path.join(__dirname + '/css')))
app.use(express.static(path.join(__dirname + '/assets')))
app.use(express.static(path.join(__dirname + '/utils')))

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

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', async(req, res) => {
    const products = await Product.find({});
    res.render('home', {products})
})

app.get("/search", async(req, res) => {
    let name = req.query.name;
    let option = req.query.option
    if (option === 'All') {
        option = ['APPLIANCE, MOBILE, TV', 'CAMERA', 'GAMING', 'LAPTOP']
    } else {
        option = option.toUpperCase();
    }
    try {
        const agg = [
            { $search: { compound: { must: [{ text: { query: option, path: "category", fuzzy: { maxEdits: 2, prefixLength: 3 } } }, { autocomplete: { query: name, path: "name", fuzzy: { maxEdits: 2, prefixLength: 3 } } }] } } },
            { $limit: 20 },
            { $project: { _id: 1, name: 1, price: 1, brand: 1, images: 1 } }
        ];
        // RESULTS IS AN ARRAY
        const results = await collection.aggregate(agg).toArray();
        res.render('products/search_results', { results });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

app.get("/autocomplete", async(req, res) => {
    let option = req.query.option
    if (option === 'All') {
        option = ['APPLIANCE, MOBILE, TV', 'CAMERA', 'GAMING', 'LAPTOP']
    } else {
        option = option.toUpperCase();
    }
    try {
        const agg = [
            { $search: { compound: { must: [{ text: { query: option, path: "category", fuzzy: { maxEdits: 2, prefixLength: 3 } } }, { autocomplete: { query: req.query.name, path: "name", fuzzy: { maxEdits: 2, prefixLength: 3 } } }] } } },
            { $limit: 20 },
            { $project: { _id: 1, name: 1, price: 1, brand: 1, images: 1 } }
        ];
        const result = await collection.aggregate(agg).toArray();
        res.send(result);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

app.get('/back', (req, res) => {
    const redirectUrl = req.session.returnTo;
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

app.get('/test', async(req, res) => {
    const products = await Product.find({});
    res.render('test', {products})
})

app.all('*', (req, res) => {
    res.render('notfound')
})

const port = process.env.PORT || 3000;
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
//The page did not request an origin-keyed agent cluster, but was put in one anyway because the origin 'http://localhost:3000' had previously been placed in an origin-keyed agent cluster. Update your headers to uniformly request origin-keying for all pages on the origin.