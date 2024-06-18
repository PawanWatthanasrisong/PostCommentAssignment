const express = require('express');
const commentRouter = express.Router();
const { findById, 
        getCommentByPostId, 
        getAllOrderById,
        createComment,
        deleteComment,
        updateComment,
        checkCommentByUserId,
        getNewId} = require('../helpers/helpers.js');

commentRouter.param('postId', async(req, res, next, id) => {
    const type = 'post';
    const postId = await findById(type, id);
    if (postId.rowCount){
        req.postId = id;
        next();
    } else {
        res.status(404).send('Post ID Not Found');
    }
})

commentRouter.param('commentId', async(req, res, next, id) => {
    const type = 'comment';
    const commentId = await findById(type, id);
    if (commentId.rowCount){
        req.commentId = id;
        next();
    } else {
        res.status(404).send('Comment ID Not Found');
    }
})


//Validate Create Comment
const validateCommentCreate = async (req, res, next) => {
    if (req.body.content && req.body.userId) {
        const type = 'comment';
        req.commentId = await getNewId(type);
        req.commentContent = req.body.content;
        req.commentUserId = req.body.userId;
        req.newComment = {
            id: req.commentId,
            post_id: req.postId,
            commentcontent: req.commentContent,
            user_id: req.commentUserId
        };
        next();
    } else {
        res.status(400).send('Invalid Input');
    }
}

const validateCommentUpdate = async (req, res, next) => {
    if (req.body.content && req.body.userId) {
        if(await checkCommentByUserId(req.body.userId, req.commentId)){
            req.commentContent  = req.body.content;
            req.commentUserId = req.body.userId;
            req.updateComment = {
                id: req.commentId,
                post_id: req.postId,
                commentcontent: req.commentContent,
                user_id: req.commentUserId
            };
            next();
        } else {
            res.status(400).send('Invalid User and Comment');
        }
    } else {
        res.status(400).send('Invalid Input');
    }
}


//GET ALL comment
commentRouter.get('/', async (req,res,next) => {
    const type = 'comment'
    const result = await getAllOrderById(type);
    res.status(200).send(result.rows);
})

//GET comment FROM post
commentRouter.get('/:postId', async (req, res, next) => {
    console.log(req.postId);
    const result =  await getCommentByPostId(req.postId);
    if (result.rowCount === 0) {
        res.status(200).send('No Comment Yet');
    } else {
        res.status(200).send(result.rows);
    }
});

//Create Comment in Post Id 
commentRouter.post('/:postId', validateCommentCreate, async (req, res, next) => {
    const result = await createComment(req.commentId, req.postId, req.commentContent, req.commentUserId);
    if (result) {
        res.status(201).send(req.newComment);
    } else {
        res.status(500).send('Create Comment Failed');
    }
});

//Delete Comment
commentRouter.delete('/:postId/:commentId', async(req, res, next) => {
    const result = await deleteComment(req.commentId);
    if (result) {
        const remainingComment = await getCommentByPostId(req.postId);
        res.status(200).send(remainingComment.rows);
    } else {
        res.status(500).send('Delete Commment Failed');
    }
});

//Edit Comment
commentRouter.put('/:postId/:commentId', validateCommentUpdate, async(req, res, next) => {
    const result = await updateComment(req.commentId, req.commentContent);
    if (result) {
        res.status(200).send(req.updateComment);
    } else {
        res.status(500).send('Edit Comment Failed');
    }
});

module.exports = commentRouter;