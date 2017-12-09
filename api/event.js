const express = require('express');
const routes = express.Router();
const Event = require('../model/event.model');
const mongodb = require('../config/mongo.db');

routes.get('/event', (req,res) => {

    Event.find()
        .sort('-pastDate')
        .then((events) => {
        res.status(200).json(events);
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

routes.get('/event/:id', (req,res) => {
    let id = req.params.id;

    Event.findOne({_id: id})
        .then((event) => {
            res.status(200).json(event);
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

routes.post('/event', (req,res) => {
    let body = req.body;
    let event  = new Event({
        pokemonName: body.pokemonName,
        gym: {
            gymName: body.gymName,
            gymColor: body.gymColor
        },
        time: body.time,
        player: []
        });
    event.pastDate = Date.now();

    event.save()
        .then((event) => {
            res.status(200).json(event);
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

routes.post('/event/:eventId', (req,res) => {
    let eventId = req.params.eventId;
    let event = req.body.event;
    let playerId = req.body.playerId;

    event.player.push(playerId);

    Event.findOneAndUpdate({_id: eventId}, event)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

routes.put('/event/rp/:eventId', (req,res) => {
    let eventId = req.params.eventId;
    let event = req.body.event;
    let playerId = req.body.playerId;

    event.player.splice(event.player.indexOf(playerId), 1);

    Event.findOneAndUpdate({_id: eventId}, event)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

routes.put('/event/:id', (req,res) => {
    let id = req.params.id;
    let body = req.body;
    let event  = {
            pokemonName: body.pokemonName,
            gym: {
                gymName: body.gymName,
                gymColor: body.gymColor
            },
            time: body.time
        };

    Event.findOneAndUpdate({_id: id}, event)
        .then((event) => {
            res.status(200).json(event);
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

routes.delete('/event/:id', (req,res) => {
    let id = req.params.id;

    Event.findOneAndRemove({_id: id})
        .then((event) => {
            res.status(200).json(event);
        })
        .catch((error) => {
            res.status(400).json(error)
        });
});

module.exports = routes;