const express = require('express');
const bcrypt = require('bcrypt');
const userRouter = express.Router();
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const {getNewId} = require('../helpers/helpers.js');
const {userExists, userCreate} = require('../helpers/userHelper.js');

const ensureAuthentication = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/api/user/login');
    }
};

//Function

const defineRegister = (req, res, next) => {
    const { username, password, password2 } = req.body;
    if (username && password && password2) {
        next();
    } else {
        res.status(400).json({ message: 'Invalid Username or Password Input'});
    }
}

//Register
userRouter.post('/register', defineRegister, async (req, res) => {
    const type = 'users';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = await getNewId(type);
    try{
        const userCheck = await userExists(username);
        if (userCheck) {
            console.log('User already exists!');
            return res.status(500).send('User already exists!');
        }
        //Hash password storing in local DB
        const newUser = {id: id, username: username, password: hashedPassword };

        //store
        const userCreateCheck = await userCreate(id, username, hashedPassword);
        if (userCreateCheck){
            res.status(201).json(newUser);
        } else{
            throw new Error("Internal Server: User Create Failed");
        }
        //res.redirect("login");
    } catch(err){
        res.status(500).json({message: err.message});
    }
});


// //login
// userRouter.post('/login', (req, res) => {
//     const {username, passwordd} = req.body;
//     findByUsername(username, (err, user) => {
//         if(user.password === password) {
//             req.session.authenticaed = true;
//             req.session.user = {
//                 username,
//                 password,
//             }
//             console.log(req.session);
//             res.redirect("/");
//         } else {
//             res.status(403).json({msg: "Bad Credentials"});
//         }
//     });
// } );

//Another way
userRouter.post('/login', (req, res, next) => {
    console.log('Hello');
    passport.authenticate('local', { 
            failureRedirect: '/api/user/login', 
            failureMessage: true,
            failureFlash: true,
            successRedirect: '/api/dashboard',
            successMessage: true
        })(req, res, next);
    console.log('Here');
});

//log out user
userRouter.post('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    console.log(`Logout!`);
    res.redirect("/api/user/login");
    });
});

userRouter.get('/login', (req,res)=> {
    if (req.isAuthenticated()){
        req.logout(function(err) {
            if (err) { return next(err); }
        })
        console.log(`Logout!`);
    }
    res.render('login');
})

userRouter.get('/register', (req,res) => {

    res.render('register');
})

module.exports = userRouter;