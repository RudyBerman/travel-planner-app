import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';
import React from 'react';
import Home from './Home';
import Map from './Map';
import Itinerary from './Itinerary';
import Budget from './Budget';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/budget" element={<Budget />} />
        </Routes>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    </Router>
  );
}

export default App;
