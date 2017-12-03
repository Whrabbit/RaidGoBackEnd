const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    pokemonName: {
        type: String,
        required: true
    },
    gymName: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    pastDate: {
        type: String,
        required: true
    },
    pastTime: {
        type: String,
        required: true
    },
    players: [{
        username: String,
        playerLevel: Number
    }]
});
const Event = mongoose.model('event', EventSchema);

module.exports = Event;