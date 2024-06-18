const express = require('express');
const bcrypt = require('bcrypt');
const userRouter = express.Router();
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const {getNewId} = require('../helpers/helpers.js');
const {userExists, userCreate} = require('../helpers/userHelper.js');

// function ensureAuthentication(req, res, next) {
//     if (req.session.authenticaed) {
//         return next();
//     } else {
//         res.status(403).json({ msg: "You're not authorized to view this page"});
//     }
// }

//Function

const defineUserPassword = (req, res, next) => {
    const { username, password } = req.body;
    if (username && password) {
        next();
    } else {
        res.status(400).json({ message: 'Invalid Username or Password Input'});
    }
}

//register
userRouter.post('/register', defineUserPassword, async (req, res) => {
    const type = 'users';
    const { username, password} = req.body;
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
userRouter.post('/login', (req, res) => {
    passport.authenticate("local", { failureRedirect: "/login", failureMessage: true }),
    function(req, res) {
        res.send("login successful");
    }
});

//log out user
userRouter.post('/logout', (req, res) => {
    req.logout();
    res.redirect("../");
})

userRouter.get('/login', (req,res)=> {
    res.send("here's login page");
})

module.exports = userRouter;