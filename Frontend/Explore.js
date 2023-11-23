// Explore.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Explore = () => {
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    // Fetch the list of streaming platforms
    axios.get('/api/platforms').then((response) => {
      setPlatforms(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Explore</h2>
      <ul>
        {platforms.map((platform) => (
          <li key={platform.id}>{platform.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Explore;
