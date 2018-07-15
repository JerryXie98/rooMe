const fb = require('../../src/facebook.js')

/**
* Main friend finding function
* @param {string} room 
* @returns {string}
*/
module.exports = (room = 'world', context, callback) => {
    let result = fb(20);
    callback(null, `hello ${result}`);
  };
  
