const {query} = require('../data/db.js');


const userExists = async (username) => {
    const result = await query(`SELECT * FROM users WHERE username = $1`, [username]);
    if (result.rowCount == 0){
        return false;
    } else {
        return true;
    }
};

const userCreate = async (id, username, password) => {
    try {
        await query(`   INSERT INTO users (id, username, password)
                        VALUES ($1,$2,$3);`,[id, username, password]);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const findByUsername = async (username, cb) => {
    const result = await query(` SELECT * FROM users WHERE username = $1;`, [username]);
    const user =  result.rows[0];
    if (user) {
        console.log(`Username with username ${username} found!`);
        return cb(null, user);
    }
    return cb(null, null);
}

const findById = async (id, cb) => {
    const result = await query( `SELECT * FROM users WHERE id = $1`, [id]);
    const user =  result.rows[0];
    if(user) {
        return cb(null, user);
    } else {
        cb(new Error(`User ${id} does not exist`));
    }
}

module.exports = {  userExists,
                    userCreate,
                    findByUsername,
                    findById};