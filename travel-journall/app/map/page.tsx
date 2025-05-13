"use client";

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapComponentProps {
  initialCenter?: {
    lat: number;
    lng: number;
  };
  initialZoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialCenter = { lat: 51.505, lng: -0.09 },
  initialZoom = 13,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyAO_MxTQlfLzU3aDByNllfJS2N7AVivRH8',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      // Create the map instance
      const map = new google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });

      mapInstanceRef.current = map;

      // Create a custom search box container
      const searchBoxContainer = document.createElement('div');
      searchBoxContainer.className = 'custom-search-container';

      // Create and style the search input
      const input = document.createElement('input');
      input.className = 'custom-search-box';
      input.placeholder = 'Search for a location...';
      searchBoxContainer.appendChild(input);

      // Add custom search box to the map
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchBoxContainer);

      // Add click event listener to the map
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // Remove existing marker if there is one
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Create a new marker
        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          animation: google.maps.Animation.DROP
        });

        // Create an info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px">
              <h3 style="margin: 0 0 10px 0; font-size: 16px;">Selected Location</h3>
              <p style="margin: 0">
                Latitude: ${lat.toFixed(6)}<br/>
                Longitude: ${lng.toFixed(6)}
              </p>
            </div>
          `
        });

        // Open info window when marker is clicked
        markerRef.current.addListener('click', () => {
          infoWindow.open(map, markerRef.current);
        });

        // Open info window immediately after placing marker
        infoWindow.open(map, markerRef.current);

        console.log(`Selected location: Latitude: ${lat}, Longitude: ${lng}`);
      });

      // Initialize the SearchBox
      const searchBox = new google.maps.places.SearchBox(input);

      // Bias the SearchBox results towards current map's viewport
      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds() || null);
      });

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places?.length === 0) return;

        const place = places?.[0];

        if (!place?.geometry || !place.geometry.location) return;

        // Zoom to the selected place
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          animation: google.maps.Animation.DROP
        });
      });
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        // Clean up map instance if needed
      }
    };
  }, [initialCenter, initialZoom]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Click on the map to select a location</h2>
      <div 
        ref={mapRef} 
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      />
      <style jsx global>{`
        .custom-search-container {
          position: absolute;
          top: 10px;
          width: 50%;
          max-width: 400px;
          min-width: 200px;
          z-index: 1;
        }

        .custom-search-box {
          width: 100%;
          padding: 12px 20px;
          margin: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          background: white;
          outline: none;
          transition: all 0.3s ease;
        }

        .custom-search-box:focus {
          border-color: #4a90e2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .custom-search-box::placeholder {
          color: #666;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;