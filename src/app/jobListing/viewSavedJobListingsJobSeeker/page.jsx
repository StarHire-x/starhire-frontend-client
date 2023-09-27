'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from 'primereact/card';
import { getSavedJobListings } from '@/app/api/auth/jobListing/route'; // Import the getSavedJobListings function

export default function viewSavedJobListingsJobSeeker() {
  const session = useSession();
  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const [savedJobListings, setSavedJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      getSavedJobListings(accessToken)
        .then((data) => {
          setSavedJobListings(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching saved job listings:', error);
          setIsLoading(false);
        });
    }
  }, [accessToken]);

  return (
    <div className="container">
      <h1>Your Saved Jobs</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : savedJobListings.length === 0 ? (
        <p>No saved job listings found.</p>
      ) : (
        savedJobListings.map((jobListing) => (
          <Card title={jobListing.title} subTitle={jobListing.jobLocation}>
            {/* Add any additional details or buttons you want displayed for each saved job listing here */}
          </Card>
        ))
      )}
    </div>
  );
}
