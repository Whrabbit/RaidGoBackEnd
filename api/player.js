const express = require('express');
const routes = express.Router();
const Player = require('../model/player.model');
const mongodb = require('../config/mongo.db');

routes.get('/player', (req,res) => {
    Player.find()
        .then((players) => {
            res.status(200).json(players);
        })
        .catch(() => {
            res.status(400).json({'error':'error in get players'})
        });
});

routes.get('/player/:id', (req,res) => {
    let id = req.params.id;

    Player.findOne({_id: id})
        .then((player) => {
            res.status(200).json(player);
        })
        .catch(() => {
            res.status(400).json({'error':'error in get player by id'})
        });
});

routes.post('/player', (req,res) => {
    let player  = new Player(req.body);

    player.save()
        .then((player) => {
            res.status(200).json(player);
        })
        .catch(() => {
            res.status(400).json({'error':'error in post player'})
        });
});

routes.put('/player/:id', (req,res) => {
    let id = req.params.id;
    let player = req.body;

    Player.findByIdAndUpdate(id, player)
        .then((player) => {
            res.status(200).json(player);
        })
        .catch(() => {
            res.status(400).json({'error':'error in put player'})
        });
});

routes.delete('/player/:id', (req,res) => {
    let id = req.params.id;

    Player.findOneAndRemove({_id: id})
        .then(() => {
            res.status(200).json();
        })
        .catch(() => {
            res.status(400).json({'error':'error in delete player'})
        });
});

module.exports = routes;