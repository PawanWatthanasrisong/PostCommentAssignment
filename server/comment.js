const express = require('express');
const commentRouter = express.Router();
const {query} = require('./db.js');

commentRouter.param('postId', async(req, res, next, id) => {
    const postId = await query (`SELECT id FROM post WHERE id = $1;`,[id]);
    if (postId.rowCount !== 0){
        req.postId = id;
        next();
    } else {
        res.status(404).send('Post Not Found');
    }
})

commentRouter.param('commentId', async(req, res, next, id) => {
    const commentId = await query (`SELECT id FROM comment WHERE id = $1;`, [id]);
    if (commentId.rowCount !== 0){
        req.commentId = id;
        next();
    } else {
        res.status(404).send('Comment Not Found');
    }
})

const defineUserId = (req, res, next) => {
    if (req.body.userId) {
        req.commentUserId = req.body.userId;
        next();
    } else {
        res.status(400).json({ message: 'Invalid UserId Input'});
    }
};

const defineCommentId = (req, res, next) => {
    if (req.body.id){
        req.commmentId = req.body.id;
        next();
    } else {
        res.status(400).send('Invalid ID input');
    }
}

const defineCommentContent  = (req, res, next) => {
    if (req.body.content){
        req.commentContent = req.body.content;
        next();
    } else {
        res.status(400).send('Invalid Content Input');
    }
}

//GET comment FROM post
commentRouter.get('/:postId', async (req, res, next) => {
    console.log(req.postId);
    const commentData = await query(`   SELECT comment.id, comment.post_id, commentContent 
                                        FROM comment
                                        INNER JOIN post
                                        ON  post.id = comment.post_id
                                        WHERE post.id = $1;`,[req.postId]);
    res.status(200).send(commentData.rows);
});

//Post Comment 
commentRouter.post('/:postId', defineCommentId, defineCommentContent, async (req, res, next) => {
    console.log(req.postId);
    try {
        await query (`  INSERT INTO comment
                        VALUES ($1,$2,$3);`,[req.commmentId, req.postId, req.commentContent]);
        res.status(200).send();
    } catch(err) {
        res.status(400).send('Failed to comment');
    }
});

//Delete Comment
commentRouter.delete('/:postId/:commentId', async(req, res, next) => {
    try {
        await query(`   DELETE FROM comment
                        WHERE comment.id = $1;`, [req.commentId]);
        res.status(200).send();
    } catch(err) {
        res.status(400).send(`Failed to delete`);
    }
});

//Edit Comment
commentRouter.put('/:postId/:commentId', async(req, res, next) => {
    try {
        const newComment = {
            id: req.commentId,
            post_id: req.postId,
            commentContent: req.commentContent
        }
        await query(`   UPDATE comment
                        SET comment.commentContent = $1
                        WHERE comment.id = $2`,[req.commentContent], [req.commentId]);
        res.status(200).send(newComment);
    } catch(err) {
        res.status(400).send(`Failed to update`);
    }
})

module.exports = commentRouter;