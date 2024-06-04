const express = require('express');
const apiRouter = express.Router();
const postRouter = require('./post.js');
const commentRouter = require('./comment.js');

apiRouter.use('/post',postRouter);
apiRouter.use('/comment',commentRouter);

module.exports = apiRouter;