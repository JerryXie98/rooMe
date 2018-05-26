const { db, squel } = require('../../src/postgress.js');

// QUERIES
let getAll = squel.select().from("food").toString(); 

/**
* Database Testing
*/
module.exports = async (context) => {
    let result = await db.query(getAll)
    return result;

  };