const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GymSchema = new Schema({
    gymName: {
        type: String,
        required: true
    },
    gymColor: {
        type: String,
        required: true
    }
});

module.exports = GymSchema;