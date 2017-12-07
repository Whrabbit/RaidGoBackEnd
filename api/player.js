const express = require('express');
const routes = express.Router();
const Player = require('../model/player.model');
const session = require('../config/neo4j.db');

routes.get('/player', (req,res) => {
    let player = session.run(
        'MATCH (user: User) return user'
    );
    player
        .then((result) => {
            session.close();
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(400).json({error})
        });
});

routes.get('/player/:id', (req,res) => {
    let id = req.params.id;
    let query = session.run(
        'match (n:User) where ID(n) = ' + id +' return n',
        {id: id}
    );

    query
        .then((player) => {
            session.close();
            res.status(200).json(player);
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

routes.post('/player', (req,res) => {
    let player = req.body;
    let query = session.run(
        'CREATE (n:User {username: $username, password: $password, level: $level, gymColor: $gymColor}) RETURN n',
        {username: player.username,
        password: player.password,
        level: player.level,
        gymColor: player.gymColor}
    );

    query
        .then((player) => {
            session.close();
            res.status(200).json(player);
        })
        .catch((error) => {
            res.status(400).json({error})
        });
});

routes.put('/player/:id', (req,res) => {
    let id = req.params.id;
    let player = req.body;
    let query = session.run(
        'MATCH (n:User)' +
        ' WHERE ID(n) = ' + id +
        ' SET n.username = $username, n.password = $password, n.level = $level, n.gymColor = $gymColor' +
        ' RETURN n',
        {username: player.username,
            password: player.password,
            level: player.level,
            gymColor: player.gymColor}
    );

    query
        .then((player) => {
            session.close();
            res.status(200).json(player);
        })
        .catch((error) => {
            res.status(400).json({error})
        });
});

routes.delete('/player/:id', (req,res) => {
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
            res.status(400).json(error)
        });
});

module.exports = routes;