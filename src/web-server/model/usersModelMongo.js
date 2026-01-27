const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateAndStarSchema = new Schema({
    lastAccessed: { type: Date, default: Date.now, required: true},
    starred: { type: Boolean, default: false, required: true}
}, {_id: false});

const userNodeSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    nickname : {
        type: String,
        required: true
    },
    photo : {
        type: String,
        required: true
    },
    tokenVersion : {
        type: Number,
        default: 1
    },
    filemap : {
        type: Map,
        of: dateAndStarSchema,
        default: () => new Map()
    }

});

module.exports = mongoose.model('User', userNodeSchema);
