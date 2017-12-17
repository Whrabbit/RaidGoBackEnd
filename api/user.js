const express = require('express');
const routes = express.Router();
const session = require('../config/neo4j.db');

routes.get('/user', (req, res) => {
    let user = session.run(
        'MATCH (user: User) RETURN user'
    );
    user
        .then((result) => {
            session.close();
            res.status(200).json(result);
        })
        .catch((error) => {
            session.close();
            res.status(400).json(error);
        });
});

routes.get('/user/:id', (req, res) => {
    let id = req.params.id;
    let query = session.run(
        'MATCH (n:User)-[:hasGymColor]->(g:gymColor) WHERE ID(n) = ' + id + ' RETURN n, g',
        {id: id}
    );

    query
        .then((user) => {
            session.close();
            res.status(200).json(
                {
                username: user.records[0]._fields[0].properties.username,
                password: user.records[0]._fields[0].properties.password,
                level: user.records[0]._fields[0].properties.level,
                gymColor: user.records[0]._fields[1].properties.gymColor,
                id: user.records[0]._fields[0].identity.low
            }
            );
        })
        .catch((error) => {
            session.close();
            res.status(400).json(error);
        });
});

routes.post('/user', (req, res) => {
    let user = req.body;

    let usernameExist = session.run(
        'MATCH(n:User{username: $username})' +
        'RETURN n'
        , {username: user.username}
    );

    let colorExist = session.run(
        'MATCH (c:gymColor{gymColor:"Geel"})' +
        ' RETURN c'
    );

    colorExist
        .then((result) => {
            if (result.records.length != 0) {
                console.log('found')
                usernameExist
                    .then((result) => {
                        if (result.records.length === 0) {
                            let query = session.run(
                                'MATCH (c:gymColor{gymColor:$gymColor})' +
                                ' CREATE (n:User {username: $username, password: $password, level: $level})-[:hasGymColor]->(c)' +
                                ' RETURN n',
                                {
                                    username: user.username.toLowerCase(),
                                    password: user.password,
                                    level: user.level,
                                    gymColor: user.gymColor
                                }
                            );

                            query
                                .then((user) => {
                                    session.close();
                                    res.status(200).json(user);
                                })
                                .catch((error) => {
                                    session.close();
                                    res.status(400).json(error);
                                });
                        } else {
                            res.status(200).json({error: 'user already exists'});
                        }
                    })
            } else {
                console.log('not found')
                let createColor = session.run(
                    'CREATE (g:gymColor{gymColor:"Geel"}),(b:gymColor {gymColor:"Blauw"}),(r:gymColor {gymColor:"Rood"})' +
                    ' RETURN g,b,r'
                );

                createColor
                    .then((result) => {
                        usernameExist
                            .then((result) => {
                                if (result.records.length === 0) {
                                    let query = session.run(
                                        'MATCH (c:gymColor{gymColor: $gymColor})' +
                                        ' CREATE (n:User {username: $username, password: $password, level: $level})-[:hasGymColor]->(c)' +
                                        ' RETURN n',
                                        {
                                            username: user.username.toLowerCase(),
                                            password: user.password,
                                            level: user.level,
                                            gymColor: user.gymColor
                                        }
                                    );

                                    query
                                        .then((user) => {
                                            session.close();
                                            res.status(200).json(user);
                                        })
                                        .catch((error) => {
                                            session.close();
                                            res.status(400).json(error);
                                        });
                                } else {
                                    res.status(200).json({error: 'user already exists'});
                                }
                            })
                    })
            }
        })


});

routes.post('/login', (req, res) => {
    let user = req.body;
    let query = session.run(
        'MATCH (n:User {username: $username, password: $password}) RETURN n',
        {
            username: user.username.toLowerCase(),
            password: user.password
        }
    );

    query
        .then((user) => {

            if (user.records[0] !== undefined) {
                res.status(200).json({
                    "authentication": true,
                    "user": {
                        username: user.records[0]._fields[0].properties.username,
                        level: user.records[0]._fields[0].properties.level,
                        id: user.records[0]._fields[0].identity.low
                    }
                });
            } else {
                res.status(200).json({"authentication": false});
            }
            session.close();
        })
        .catch(() => {
            session.close();
            res.status(400).json({});
        });
});

routes.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let user = req.body;
    let query = session.run(
        'MATCH (u:User)-[rel:hasGymColor]->(g:gymColor) WHERE ID(u) = ' + id +
        ' MATCH (x:gymColor{gymColor: $gymColor})' +
        ' DELETE rel' +
        ' CREATE (u)-[:hasGymColor]->(x)' +
        ' SET u.username = $username, u.password = $password, u.level = $level' +
        ' RETURN u',
        {
            username: user.username.toLowerCase(),
            password: user.password,
            level: user.level,
            gymColor: user.gymColor
        }
    );

    query
        .then((user) => {
            session.close();
            res.status(200).json(user);
        })
        .catch((error) => {
            session.close();
            res.status(400).json(error);
        });
});

routes.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    let query = session.run(
        'MATCH (n:User)' +
        ' WHERE ID(n) = ' + id +
        ' DETACH DELETE n'
    );
    query
        .then(() => {
            session.close();
            res.status(200).json();
        })
        .catch((error) => {
            session.close();
            res.status(400).json(error);
        });
});

module.exports = routes;