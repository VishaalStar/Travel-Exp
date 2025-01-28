"use client";

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  useEffect(() => {
    // Create a map instance and set its initial position and zoom level
    const map = L.map('map').setView([51.505, -0.09], 13);  // Example: London

    // Add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a click event to the map
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      // Add a marker where the user clicked
      L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>Latitude:</b> ${lat}<br/><b>Longitude:</b> ${lng}`)
        .openPopup();

      // You can also update your state or do something with the selected coordinates
      console.log(`Selected location: Latitude: ${lat}, Longitude: ${lng}`);
    });
  }, []);

  return (
    <div>
      <h2>Click on the map to select a location</h2>
      <div id="map" style={{ height: '500px' }}></div>
    </div>
  );
};

export default MapComponent;
