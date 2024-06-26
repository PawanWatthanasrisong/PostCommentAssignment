const {query} = require('../data/db.js');

//Create new ID
const getNewId = async (type) => {
    try{
        const result = await query(`SELECT max(id) FROM ${type}`);
        const idAmount= result.rows[0].max;
        if (idAmount !== 0) {
            const newId = idAmount + 1;
            return newId;
        } else if (idAmount == 0) {
            return 1;
        } else {
            throw new Error("New Id Failed");
        }
    } catch(err){
        console.log(err);
    }
    
};


//Select all from tables
const getAllOrderById = (type) => {
    const result = query(`SELECT * FROM ${type} ORDER BY id`);
    if (result.rowCount !== 0){
        return result;
    } else {
        throw new Error("Result not found");
    }
}

//Get by id 
const findById = (type, id) => {
    const result = query(`SELECT * FROM ${type} WHERE id = ${id}`);
    if (result.rowCount !== 0){
        return result;
    } else {
        throw new Error("ID not found");
    };
};

//Create new post
const createPost = async (userId, postId, content) => {
    try {
        await query(`INSERT INTO post(user_id, id, content)
                VALUES ($1,$2,$3);`,[userId, postId, content]);
        return true;
    } catch(err){
        console.log(`${err}`);
        return false;
    }
};

//Update post
const updatePost = async (postId, content) => {
    try {
        await query(`   UPDATE post
                        SET content = $1
                        WHERE id = $2`,[content, postId]);
        return true;
    } catch(err) {
        console.log(`${err}`);
        return false;
    }
};

//DELETE post
const deletePost = async (postId) => {
    try {
        await query(`   DELETE FROM post
                        WHERE id = $1`, [postId]);
        return true;
    } catch(err) {
        console.log(` ${err}`);
        return false;
    }
}

//Get comment from post id 
const getCommentByPostId = async(postId) => {
    try {
        const commentData = await query(`   SELECT comment.id, comment.post_id, commentcontent, comment.user_id 
                                            FROM comment
                                            INNER JOIN post
                                            ON  post.id = comment.post_id
                                            WHERE post.id = $1;`,[postId]);
        return commentData;
    } 
    catch(err) {
        console.log(err);
        return false;
    }
};

const createComment = async(commentId, postId, commentContent, userId) => {
    try {
        await query (`  INSERT INTO comment(id, post_id, commentcontent, user_id)
                        VALUES ($1,$2,$3,$4);`,[commentId, postId, commentContent, userId]);
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

const deleteComment = async(commentId) => {
    try {
        await query(`   DELETE FROM comment
                        WHERE comment.id = $1;`, [commentId]);
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
};

const updateComment = async(commentId, commentContent) => {
    try {
        const result = await query(`   UPDATE comment
                        SET commentcontent = $1
                        WHERE id = $2`,[commentContent, commentId]);
        if (result !== undefined){
            return true;
        } else {
            return false;
        }
        
    } catch(err) {
        console.log(err);
        return false;
    }
};

const checkCommentByUserId = async(userId, commentId) => {
    try {
        const commentData = await query(`   SELECT comment.id, comment.post_id, commentcontent 
                                            FROM comment
                                            INNER JOIN users
                                            ON  users.id = comment.user_id
                                            WHERE users.id = $1
                                            AND comment.id = $2;`,[userId, commentId]);
        if (commentData.rowCount !== 0) {
            return true;
        } else {
            return false;
        };
    } 
    catch(err) {
        console.log(`Error: ${err}`);
        return false;
    }
}


//export
module.exports = {  getNewId,
                    findById, 
                    getAllOrderById, 
                    createPost, 
                    updatePost, 
                    deletePost, 
                    getCommentByPostId,
                    createComment,
                    deleteComment,
                    updateComment,
                    checkCommentByUserId};