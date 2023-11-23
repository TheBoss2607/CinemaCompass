// TopMoviesShows.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TopMoviesShows = () => {
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    // Fetch the top-rated movies and shows
    axios.get('/api/top').then((response) => {
      setTopItems(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Top Movies/Shows</h2>
      <ul>
        {topItems.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopMoviesShows;
