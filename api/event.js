const express = require('express');
const routes = express.Router();
const Event = require('../model/event.model');
const mongodb = require('../config/mongo.db');

routes.get('/event', (req,res) => {
    Event.find()
        .populate('player')
        .then((events) => {
        res.status(200).json(events);
        })
        .catch(() => {
        res.status(400).json({'error':'error in get events'})
        });
});

routes.get('/event/:id', (req,res) => {
    let id = req.params.id;

    Event.findOne({_id: id})
        .populate('player')
        .then((event) => {
            res.status(200).json(event);
        })
        .catch(() => {
            res.status(400).json({'error':'error in get event by id'})
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
        time: body.time
        }
    );
    event.pastDate = Date.now();

    event.save()
        .then((event) => {
            res.status(200).json(event);
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
        }
    ;

    Event.findOneAndUpdate({_id: id}, event)
        .then((event) => {
            res.status(200).json(event);
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({'error':'error in put event'})
        });
});

routes.delete('/event/:id', (req,res) => {
    let id = req.params.id;

    Event.findOneAndRemove({_id: id})
        .then(() => {
            res.status(200).json();
        })
        .catch(() => {
            res.status(400).json({'error':'error in delete event'})
        });
});

module.exports = routes;