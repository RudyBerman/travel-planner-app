import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/map">Map</Link></li>
          <li><Link to="/itinerary">Itinerary</Link></li>
          <li><Link to="/budget">Budget</Link></li>
        </ul>
      </nav>
    );
};
  
export default Navbar;