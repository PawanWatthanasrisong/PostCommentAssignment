const express = require('express');
const postRouter = express.Router();
const {query} = require('./db.js');


//Define para
const definePost = (req, res, next) => {
    req.postId = req.body.id;
    req.postContent = req.body.content;
    next();
}

//GET function
postRouter.get('/', async (req, res, next) => {
    const postData = await query(`SELECT * FROM post;`);
    res.json(postData.rows);
})

//POST function
postRouter.post('/', definePost, async (req, res, next) => {
    if (req.postId && req.postContent) {
        const newPost = {
            id: req.postId,
            content: req.postContent
        };
        try {
            await query(`INSERT INTO post
                        VALUES ($1,$2);`,[newPost.id, newPost.content]);
            res.status(201).json(newPost);
        } catch(err){
            console.log(`Error: ${err}`);
            res.status(400).json({ message: 'Invald Input'});
        }
    } else {
        res.status(400).json({ message: 'Invalid Input'});
    };
});

module.exports = postRouter;