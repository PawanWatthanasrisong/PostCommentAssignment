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
}


module.exports = {  userExists,
                    userCreate};