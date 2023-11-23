// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
    watchlist: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
