const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { findById } = require("./data/db");

passport.use(
    new LocalStrategy(function(username, password, done){
        findByUsername(username, async function(err,user){
            if(err){
                return done(err);
            }
            const match = await bcrypt.compare(password, user.password);
            if(!user || !match){
                return done(null,false);
            }
            return done(null, user);
        })
    })
);

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    findById(id, function(err, user){
        if(err){
            return done(err);
        }
        return done(null, user);
    })
});