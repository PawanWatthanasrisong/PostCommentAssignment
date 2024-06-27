const express = require('express');
const apiRouter = express.Router();
const postRouter = require('./post.js');
const commentRouter = require('./comment.js');
const userRouter = require('./user.js');

//Authentication check middleware
const ensureAuthentication = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/api/user/login');
    }
};


apiRouter.use('/post',postRouter);
apiRouter.use('/comment',commentRouter);
apiRouter.use('/user',userRouter);

apiRouter.get('/dashBoard', ensureAuthentication , (req, res) => {
    res.render('dashboard');
})

apiRouter.get('/', (req, res) => {
    res.render('welcome');
});



module.exports = apiRouter;