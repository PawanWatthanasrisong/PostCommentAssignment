//Import Express
const express = require('express');
const apiRouter = require('./routes/api');
const app = express();
const bodyParser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const store = new session.MemoryStore();

//Dedicate PORT 4000
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(
    session({
        secret: "sdfsdfssdf",
        cookie: {maxAge: 1000 * 60 * 60 *24, secure: true, sameSite: "none"},
        resave: false,
        saveUnitialized: false,
        store,
    })
);

app.use(passport.initialize());

app.use(passport.session());

app.use('/api', apiRouter);

//Listen to PORT 4000
app.listen(PORT, () => {
    console.log(`Server ${PORT} is running`);
});

