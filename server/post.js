const express = require('express');
const postRouter = express.Router();
const { query, 
        findById, 
        getAllOrderById, 
        createPost, 
        updatePost, 
        deletePost} = require('./db.js');

//Function for Update Post
const validatePostUpdate = (req,res,next) => {
    if (req.body.content) {
        req.postContent = req.body.content;
        req.postId = req.paramId;
        req.updatedPost = {
            id: req.postId,
            content: req.postContent
        };
        next();
    } else {
        res.status(400).json({ message: 'Invalid Input'});
    }
}

//Function for Create Post
const validatePostCreate = (req, res, next) => {
    if (req.body.userId && req.body.id && req.body.content) {
        req.postUserId = req.body.userId;
        req.postId = req.body.id;
        req.postContent = req.body.content;
        req.newPost = {
            userId: req.postUserId,
            id: req.postId,
            content: req.postContent
        };
        next();
    } else {
        res.status(400).json({ message: 'Invalid Input'});
    }
};

postRouter.param('postId', async (req, res, next, id) => {
    req.type = 'post';
    const postId = await findById(req.type, id);
    if (postId.rowCount) {
        req.paramId = id;
        next();
    } else {
        res.status(404).send('Post ID not found');
    }
});

postRouter.param('userId', async (req, res, next, id) => {
    req.type= 'users';
    const userId = await findById(req.type, id);
    if (userId.rowCount) {
        req.paramId = id;
        next();
    } else {
        res.status(404).send('User ID not found');
    }
});

//GET All Function
postRouter.get('/', async (req, res, next) => {
    const type = 'post';
    const postData = await getAllOrderById(type);
    res.json(postData.rows);
})

//GET by Post id 
postRouter.get('/:postId', async (req, res, next) => {
    const postData = await findById(req.type, req.paramId);
    res.status(200).send(postData.rows);
});

//GET by User id
postRouter.get('/user/:userId', async (req, res, next) => {
    const postData = await findById(req.type, req.paramId);
    res.status(200).send(postData.rows);
});

//POST function by body JSON
postRouter.post('/', validatePostCreate, async (req, res, next) => {
    const result = await createPost(req.postUserId, req.postId, req.postContent);
    if (result) {
        res.status(201).send(req.newPost);
    } else {
        res.status(400).send('Create Post Failed');
    }
});

//Edit UPATE by body JSON
postRouter.put('/:postId', validatePostUpdate, async(req, res, next) => {
    const result = await updatePost(req.postId, req.postContent);
    if (result) {
        res.status(200).send(req.updatedPost);
    } else {
        res.status(400).send('Update Post Failed');
    }
});

//DELETE post
postRouter.delete('/:postId', async(req,res,next) => {
    const result = await deletePost(req.paramId);
    const type = 'post'
    if (result) {
        res.status(200).send(getAllOrderById(type));
    } else {
        res.status(400).send('Delete Post Failed');
    }
});


module.exports = postRouter;