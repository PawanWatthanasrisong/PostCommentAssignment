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

//export
module.exports = {query};