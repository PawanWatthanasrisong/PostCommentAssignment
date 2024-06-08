const express = require('express');
const postRouter = express.Router();
const {query} = require('./db.js');
 

//Define para
const defineUserId = (req, res, next) => {
    if (req.body.userId) {
        req.postUserId = req.body.userId;
        next();
    } else {
        res.status(400).json({ message: 'Invalid UserId Input'});
    }
};

const definePostId = (req, res, next) => {
    if (req.body.id) {
        req.postId = req.body.id;
        next();
    } else {
        res.status(400).json({ message: 'Invalid Id Input'});
    }
};

const definePostContent = (req, res, next) => {
    if (req.body.content) {
        req.postContent = req.body.content;
        next();
    } else {
        res.status(400).json({ message: 'Invalid Content Input'});
    }
}

postRouter.param('postId', async (req, res, next, id) => {
    const postId = await query(`SELECT id FROM post WHERE id = $1;`, [id]);
    if (postId.rowCount !== 0) {
        req.paramId = id;
        next();
    } else {
        res.status(404).send('Post ID not found');
    }
})

postRouter.param('userId', async (req, res, next, id) => {
    const userId = await query(`SELECT id FROM user WHERE id = $1;`, [id]);
    if (userId.rowCount !== 0) {
        req.paramId = id;
        next();
    } else {
        res.status(404).send('User ID not found');
    }
})

//GET All Function
postRouter.get('/', async (req, res, next) => {
    const postData = await query(`SELECT * FROM post ORDER BY id;`);
    res.json(postData.rows);
})

//GET by Post id 
postRouter.get('/:postId', async (req, res, next) => {
    console.log(req.paramId);
    const postData = await query(`SELECT * FROM post WHERE id = $1;`,[req.paramId]);
    res.status(200).send(postData.rows);
});

//GET by User id
postRouter.get('/user/:userId', async (req, res, next) => {
    console.log(req.paramId);
    const postData = await query(`SELECT * FROM post WHERE id = $1;`,[req.paramId]);
    res.status(200).send(postData.rows);
});

//POST function by body JSON
postRouter.post('/', definePostId, definePostContent, defineUserId, async (req, res, next) => {
    try {
        const newPost = {
            userId: req.postUserId,
            id: req.postId,
            content: req.postContent
        };
        await query(`INSERT INTO post
                    VALUES ($1,$2);`,[req.postId, req.postContent]);
        res.status(201).json(newPost);
    } catch(err){
        console.log(`Error: ${err}`);
        res.status(400).json({ message: 'Invald Input'});
    }
});

//Edit UPATE by body JSON
postRouter.put('/:postId', definePostContent, async(req, res, next) => {
    try {
        const newPost = {
            id: req.paramId,
            content: req.postContent
        };
        await query(`   UPDATE post
                        SET content = $1
                        WHERE id = $2`,[req.postContent, req.paramId]);
        res.status(201).json(newPost);
    } catch(err) {
        console.log(`Error: ${err}`);
        res.status(400).send('Failed to edit');
    }
});

//DELETE post
postRouter.delete('/:postId', async(req,res,next) => {
    try {
        await query(`   DELETE FROM post
                        WHERE id = $1`, [req.paramId]);
        res.status(201).send('');
    } catch(err) {
        console.log(`Error: ${err}`);
        res.status(400).send('Failed to delete');
    }
});


module.exports = postRouter;