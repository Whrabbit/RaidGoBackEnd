const neo4j = require('neo4j-driver').v1;

const neo = {
    uri: 'bolt://hobby-ilfijjnckhclgbkehogmpial.dbs.graphenedb.com:24786',
    username: 'admin',
    password: 'b.9li1e3wFG7MB.QSJGuhtIT8ueUhy1'
};
const driver = neo4j.driver(
    neo.uri,
    neo4j.auth.basic(
        neo.username,
        neo.password
    ));

const session = driver.session();

module.exports = session;