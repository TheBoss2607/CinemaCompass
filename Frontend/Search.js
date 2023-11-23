// Search.js

import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Fetch search results based on the entered search term
    axios.get(`/api/search?term=${searchTerm}`).then((response) => {
      setSearchResults(response.data);
    });
  };

  return (
    <div>
      <h2>Search</h2>
      <label>
        Enter Search Term:
        <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
      </label>
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
