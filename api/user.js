const express = require('express');
const routes = express.Router();
const Player = require('../model/player.model');
const session = require('../config/neo4j.db');

routes.get('/user', (req,res) => {
    let user = session.run(
        'MATCH (user: User) return user'
    );
    user
        .then((result) => {
            session.close();
            res.status(200).json(result);
        })
        .catch((error) => {
            session.close();
            res.status(400).json({error})
        });
});

routes.get('/user/:id', (req,res) => {
    let id = req.params.id;
    let query = session.run(
        'match (n:User) where ID(n) = ' + id +' return n',
        {id: id}
    );

    query
        .then((user) => {
            session.close();
            res.status(200).json(user);
        })
        .catch((error) => {
            session.close();
            res.status(400).json(error)
        });
});

routes.post('/user', (req,res) => {
    let user = req.body;
    let query = session.run(
        'CREATE (n:User {username: $username, password: $password, level: $level, gymColor: $gymColor}) RETURN n',
        {username: user.username,
        password: user.password,
        level: user.level,
        gymColor: user.gymColor}
    );

    query
        .then((user) => {
            session.close();
            res.status(200).json(user);
        })
        .catch((error) => {
            session.close();
            res.status(400).json({error})
        });
});

routes.post('/login', (req,res) => {
    let user = req.body;
    let query = session.run(
        'MATCH (n:User {username: $username, password: $password}) RETURN n',
        {username: user.username,
            password: user.password}
    );

    query
        .then((user) => {
            session.close();
            if (user.records[0] !== undefined){
                res.status(200).json(user);
            }else{
                res.status(401).json({})
            }

        })
        .catch(() => {
            session.close();
            res.status(400).json({})
        });
});

routes.put('/user/:id', (req,res) => {
    let id = req.params.id;
    let user = req.body;
    let query = session.run(
        'MATCH (n:User)' +
        ' WHERE ID(n) = ' + id +
        ' SET n.username = $username, n.password = $password, n.level = $level, n.gymColor = $gymColor' +
        ' RETURN n',
        {username: user.username,
            password: user.password,
            level: user.level,
            gymColor: user.gymColor}
    );

    query
        .then((user) => {
            session.close();
            res.status(200).json(user);
        })
        .catch((error) => {
            session.close();
            res.status(400).json({error})
        });
});

routes.delete('/user/:id', (req,res) => {
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
            res.status(400).json(error)
        });
});

module.exports = routes;