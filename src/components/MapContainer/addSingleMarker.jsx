export const addSingleMarkers = ({ jobListings, map, setSelectedJob }) => {
  let count = 0;
  jobListings.forEach((jobListing) => {
    const position = { lat: jobListing.lat, lng: jobListing.lng }; // Corrected position assignment
    const marker = new google.maps.Marker({
      position: position, // Assign the correct position object
      map: map,
      label: String(count),
      clickable: true,
    });
    count++;

    // Add an onClick event listener to the marker
    marker.addListener("click", () => {
      // Handle the marker click event here, e.g., open an info window or perform some action
      console.log("Marker clicked", position);
      setSelectedJob(jobListing);
    });
  });
  console.log("Markers added");
};
