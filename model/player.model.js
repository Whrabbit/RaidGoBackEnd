const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    playerLevel: {
        type: Number,
        required: true
    }
});
const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;