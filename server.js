//Import Express
const dotenv = require('dotenv').config();
const pg = require('pg');
const express = require('express');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const configurePassport = require('./config/passport.js');

const app = express();
//Dedicate PORT 4000
const PORT = process.env.PORT || 4000;
const SECRET = process.env.SESSION_SECRET;

const pgPool = new pg.Pool({
    host: 'localhost',
    database: 'PostCommentProject',
    user: 'postgres',
    port: 5432
});

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body Parser Middleware
app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Session Middleware
app.use(
    session({
        secret: SECRET,
        cookie: {maxAge: 1000 * 60 * 60 *24, secure: false, sameSite: true},
        resave: false,
        saveUnitialized: false,
        store: new pgSession({
            pool: pgPool,
            tableName : 'users_session',
            createTableIfMissing: true
        }),
    })
);

// Initialize Paassport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
    })

app.use('/api', apiRouter);

//Listen to PORT 4000
app.listen(PORT, () => {
    console.log(`Server ${PORT} is running`);
});

