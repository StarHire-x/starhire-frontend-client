export const addSingleMarkers = ({ locations, map }) => {
    let count = 0;
  locations.map((position) => {
    const marker = new google.maps.Marker({
      position: position,
      map: map,
      label: String(count),
      clickable: true,
    });
    count++
    // Add an onClick event listener to the marker
    marker.addListener("click", () => {
      // Handle the marker click event here, e.g., open an info window or perform some action
      console.log("Marker clicked", position);
    });
  });
  console.log("Markers added");
};
