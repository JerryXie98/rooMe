const { Client } = require('pg');
const squel = require('squel');
squel.useFlavour('postgres');

const client = new Client({
  connectionString: process.env.CONNECTION_STRING
});
client.on('notification', msg => console.log(msg));
client.on('notice', msg => console.log(msg));

const query = async (text, values) => {
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING
  });
  client.connect();
  let result = await client.query(text, values);
  client.end()
  return result;
}

module.exports = {
  query,
  squel
}