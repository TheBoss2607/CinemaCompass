// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateUser, authorizeUser } = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost/cinemacompass', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Models
const User = require('./models/User');
const Movie = require('./models/Movie');
const Review = require('./models/Review');

// Middleware
app.use(bodyParser.json());

// Routes

// Add a movie to a user's watchlist
app.post('/api/watchlist', authenticateUser, async (req, res) => {
    try {
      const { movieId } = req.body;
      const user = req.user;
  
      // Check if the movie is already in the user's watchlist
      if (user.watchlist.includes(movieId)) {
        return res.status(400).json({ success: false, message: 'Movie already in watchlist' });
      }
  
      // Add the movie to the user's watchlist
      user.watchlist.push(movieId);
      await user.save();
  
      res.json({ success: true, message: 'Movie added to watchlist successfully' });
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  // Get user's watchlist
  app.get('/api/watchlist', authenticateUser, async (req, res) => {
    try {
      const user = req.user;
      const watchlist = await Movie.find({ _id: { $in: user.watchlist } });
  
      res.json({ success: true, watchlist });
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  // Add a review for a movie
  app.post('/api/reviews', authenticateUser, async (req, res) => {
    try {
      const { movieId, rating, comment } = req.body;
      const user = req.user;
  
      // Check if the user has already reviewed the movie
      const existingReview = await Review.findOne({ user: user._id, movie: movieId });
      if (existingReview) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this movie' });
      }
  
      // Create a new review
      const newReview = new Review({ user: user._id, movie: movieId, rating, comment });
      await newReview.save();
  
      // Add the review to the movie's reviews array
      const movie = await Movie.findById(movieId);
      movie.reviews.push(newReview._id);
      await movie.save();
  
      res.json({ success: true, message: 'Review added successfully' });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  // Get reviews for a movie
  app.get('/api/reviews/:movieId', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const reviews = await Review.find({ movie: movieId }).populate('user', 'username');
  
      res.json({ success: true, reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // Check if the user exists and the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

      res.json({ success: true, token, user: { id: user._id, username: user.username } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Protected route example - requires authentication
app.get('/api/user/profile', authenticateUser, (req, res) => {
  // The user is authenticated, and their information is available in req.user
  res.json({ success: true, user: req.user });
});

// Movie CRUD operations
app.post('/api/movies', authorizeUser, async (req, res) => {
  // Create a new movie
  try {
    const { title, genre, releaseDate } = req.body;
    const newMovie = new Movie({ title, genre, releaseDate });
    await newMovie.save();
    res.json({ success: true, movie: newMovie });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/movies', async (req, res) => {
  // Get a list of all movies
  try {
    const movies = await Movie.find();
    res.json({ success: true, movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  // Get details of a specific movie
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Add update and delete routes as needed

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
