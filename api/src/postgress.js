const { Client } = require('pg');
const squel = require('squel');
squel.useFlavour('postgres');

const client = new Client({
  connectionString: process.env.CONNECTION_STRING
});
client.on('notification', msg => console.log(msg));
client.on('notice', msg => console.log(msg));

module.exports = {
  db: {
    query: async (text, values, callback) => {
      await client.connect();
      let result = await client.query(text, values, callback);
      await client.end();
      return result;
    }
  },
  squel: squel
};
