// UserProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    // Fetch user data and favorite items when the component mounts
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/api/user');
        setUser(userResponse.data);

        const favoritesResponse = await axios.get(`/api/user/favorites?id=${userResponse.data.id}`);
        setFavoriteItems(favoritesResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      <p>Welcome, {user.username}!</p>
      <h3>Favorite Movies/Shows</h3>
      <ul>
        {favoriteItems.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
