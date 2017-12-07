const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GymSchema = require('../schema/gym.schema');


const EventSchema = new Schema({
    pokemonName: {
        type: String,
        required: true
    },
    gym: [GymSchema],
    time: {
        type: Date,
        required: true
    },
    pastDate: {
        type: Date,
        required: true
    },
    player: [{
        type: Schema.Types.ObjectId,
        ref: 'player'
    }]
});
const Event = mongoose.model('event', EventSchema);

module.exports = Event;