const express = require('express');
const userRouter = express.Router();
const {query} = require('./db.js');

//Function
const defineUserId = (req, res, next) => {
    if (req.body.userId) {
        req.userId = req.body.userId;
        next();
    } else {
        res.status(400).json({ message: 'Invalid UserId Input'});
    }
};

const defineUsername = (req, res, next) => {
    if (req.body.username) {
        req.username = req.body.username;
        next();
    } else {
        res.status(400).json({ message: 'Invalid Username Input'});
    }
}

//Define Param

//Create User
userRouter.post('/', defineUserId, defineUsername, async(req, res, next) => {
    try {
        const newUser = {
            userId: req.userId,
            username: req.username
        };
        await query(`   INSERT INTO users
                        VALUES($1,$2);`,[req.userId, req.username]);
        res.status(201).send(newUser);
    } catch(err) {
        console.log(`Error: ${err}`);
        res.status(400).send(`Failed to create new user.`);
    }
});