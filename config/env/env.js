var env = {
    webPort: process.env.PORT || 3040,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || 'Whrabbit',
    dbPassword: process.env.DB_PASSWORD || 'test123',
    dbDatabase: process.env.DB_DATABASE || 'raidgo',
    dbMongo: 'ds129386.mlab.com:29386/raidgo'
}

var dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbMongo :
    // 'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase

module.exports = {
    env: env,
    dburl: dburl
};
