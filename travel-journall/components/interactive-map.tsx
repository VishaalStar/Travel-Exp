"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Location {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

interface InteractiveMapProps {
  locations: Location[];
  onLocationSelect?: (location: Location) => void;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  height?: string;
}

export function InteractiveMap({
  locations,
  onLocationSelect,
  center,
  zoom = 2,
  height = "400px",
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current && !map) {
        const initialCenter = center || { lat: 0, lng: 0 };
        const newMap = new google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        setMap(newMap);

        if (onLocationSelect) {
          newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
            const lat = e.latLng?.lat();
            const lng = e.latLng?.lng();
            if (lat && lng) {
              onLocationSelect({
                lat,
                lng,
                name: "Selected Location",
              });
            }
          });
        }
      }
    });
  }, [center, zoom, onLocationSelect, map]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      // Add new markers
      const newMarkers = locations.map((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: location.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3 class="font-semibold">${location.name}</h3>
              ${location.address ? `<p>${location.address}</p>` : ""}
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);

      // Adjust map bounds to fit all markers
      if (locations.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });
        map.fitBounds(bounds);
      }
    }
  }, [map, locations]);

  return <div ref={mapRef} style={{ width: "100%", height }} />;
}
