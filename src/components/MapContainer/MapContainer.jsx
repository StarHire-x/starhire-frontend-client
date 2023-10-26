import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MyMapComponent from "./MyMapComponent";
import { useEffect } from "react";

export const MapContainer = ({ jobListings }) => {
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

  jobListings.forEach((jobListing) => {
    LOCATIONS.push({ ...current }); // Push a copy of the current location
    current.lng += 0.01;
    current.lat += 0.01;
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
        />
      </Wrapper>
    </>
  );
};
