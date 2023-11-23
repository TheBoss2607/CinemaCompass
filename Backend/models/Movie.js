// models/Movie.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
