'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchSavedJobListings } from '@/app/api/auth/jobListing/route'; // Adjust path if needed
import { Card } from 'primereact/card';

function ViewSavedJobListingsJobSeeker() {
  const [savedJobListings, setSavedJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();
  const router = useRouter();

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  console.log(session);
  console.log(userIdRef);

  useEffect(() => {
    if (session.status === 'unauthenticated' || session.status === 'loading') {
      router.push('/login');
    } else if (session.status === 'authenticated') {
      fetchSavedJobListings(userIdRef, accessToken)
        .then((data) => {
          setSavedJobListings(data);
          console.log('Received job listings:', data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job listings:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, userIdRef, accessToken]);

  return (
    <div className="container">
      {savedJobListings.length === 0 ? (
        <p>You have no saved job listings.</p>
      ) : (
        savedJobListings.map((savedJobListing) => (
          <Card key={savedJobListing.savedJobListingId}>
            {/* Render job listing details here */}
            <h2>{savedJobListing.jobListing.title}</h2>
            <p>{savedJobListing.jobListing.overview}</p>
            {/* ... other job listing details */}
          </Card>
        ))
      )}
    </div>
  );
}

export default ViewSavedJobListingsJobSeeker;
