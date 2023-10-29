import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MyMapComponent from "./MyMapComponent";
import { useEffect } from "react";

export const MapContainer = ({ jobListings, selectedJob, setSelectedJob }) => {
  const render = (status) => {
    if (status === Status.LOADING) return <h3>Loading: {status} ..</h3>;
    if (status === Status.FAILURE) return <h3>Loading2: {status} ...</h3>;
    return null;
  };

  const center = { lat: 1.332995, lng: 103.816476 };
  const zoom = 12;

  // To be changed: Need to use google geospational API to convert postal code into
  // latitude and longitude
  const LOCATIONS = [];
  let current = { lat: 1.323719, lng: 103.790547 };

  jobListings.forEach((jobListing, index) => {
    jobListing.lat = center.lat + 0.01 * index; // Increment latitude
    jobListing.lng = center.lng + 0.01 * index; // Increment longitude
  });

  return (
    <>
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        render={render}
      >
        <MyMapComponent
          center={center}
          zoom={zoom}
          jobListings={jobListings}
          setSelectedJob={setSelectedJob}
        />
      </Wrapper>
    </>
  );
};
