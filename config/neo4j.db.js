const neo4j = require('neo4j-driver').v1;

const neo = {
    uri: 'bolt://localhost',
    username: 'neo4j',
    password: 'password'
    //
    // uri: 'bolt://hobby-fombiclecffdgbkeemblpial.dbs.graphenedb.com:24786',
    // username: 'admin',
    // password: 'b.EElh3VqwOSiP.gXiD9H3gtLuKa9MJ'
};
const driver = neo4j.driver(
    neo.uri,
    neo4j.auth.basic(
        neo.username,
        neo.password
    ));

const session = driver.session();

module.exports = session;