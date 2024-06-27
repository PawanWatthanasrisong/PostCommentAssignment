const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { findByUsername, findById } = require("../helpers/userHelper.js");

module.exports = function(passport){
passport.use(
    new LocalStrategy(function(username, password, done){
        findByUsername(username, async function(err,user){
            if(err){
                console.log('Error finding user:', err);
                return done(err);
            }
            const match = await bcrypt.compare(password, user.password);
            if(!user || !match){
                console.log('User or Password does not match');
                return done(null,false);
            }
            console.log('Authentication Successful');
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
};
