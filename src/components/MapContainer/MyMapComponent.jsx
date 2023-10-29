import React, { useEffect, useRef } from 'react';
import { addSingleMarkers } from './addSingleMarker';

const MyMapComponent = ({ center, zoom, jobListings, setSelectedJob }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Display the map
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: center,
        zoom: zoom,
        mapId: "e3175da757425014"
      });
      addSingleMarkers({jobListings, map, setSelectedJob})
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      style={{ width: "50%", height: "600px" }}
    />
  );
}

export default MyMapComponent;
