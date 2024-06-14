const express = require('express');
const pg = require('pg');
const { Pool } = pg;

//connet to database
const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'PostCommentProject'
});

//query fucntion
const query = (text, params, callback) => {
    return pool.query(text,params, callback);
}

//Select all from tables
const getAllOrderById = (type) => {
    console.log(type);
    const result = query(`SELECT * FROM ${type} ORDER BY id`);
    if (result.rowCount !== 0){
        return result;
    } else {
        throw new Error("Result not found");
    }
}

const findById = (type, id) => {
    const result = query(`SELECT * FROM ${type} WHERE id = ${id}`);
    if (result.rowCount !== 0){
        return result;
    } else {
        throw new Error("ID not found")
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
//export
module.exports = {query, findById, getAllOrderById, createPost, updatePost, deletePost};