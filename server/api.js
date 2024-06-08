const express = require('express');
const apiRouter = express.Router();
const postRouter = require('./post.js');
const commentRouter = require('./comment.js');
const userRouter = require('./user.js');

apiRouter.use('/post',postRouter);
apiRouter.use('/comment',commentRouter);
apiRouter.use('/user',userRouter);

module.exports = apiRouter;