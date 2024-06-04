const express = require('express');
const commentRouter = express.Router();
const {query} = require('./db.js');

commentRouter.param('/:postId', async(req, res, next, id) => {
    const postId = await query (`SELECT id FROM post WHERE id = $1`,[id]);
    if (postId !== null){
        req.postId = id;
        next();
    } else {
        res.status(404).send('Post Not Found');
    }

})

//GET comment FROM post
commentRouter.get('/:postId', async (req, res, next) => {
    console.log(postId);
    console.log(id);
    const commentData = await query(`   SELECT comment.id, commentContent 
                                        FROM comment
                                        INNER JOIN post
                                        ON  post.id = comment.post_id
                                        WHERE post.id = $1;`,[req.postId]);
    res.status(200).send(req.postId);
});

module.exports = commentRouter;