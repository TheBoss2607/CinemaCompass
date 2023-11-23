// App.js

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Explore from './components/Explore';
import Recommendations from './components/Recommendations';
import TopMoviesShows from './components/TopMoviesShows';
import Search from './components/Search';
import UserProfile from './components/UserProfile';
import './styles.css'; // Import the CSS file


const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>
              <Link to="/recommendations">Recommendations</Link>
            </li>
            <li>
              <Link to="/top">Top Movies/Shows</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/profile">User Profile</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          {/* Other routes... */}
          <Route path="/profile">
            <UserProfile />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
