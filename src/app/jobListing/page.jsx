'use client';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { findAssignedJobListings } from '../api/auth/jobListing/route';
import styles from './page.module.css';

const JobListingPage = () => {
  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      findAssignedJobListings(userIdRef, accessToken)
        .then((data) => {
          setJobListings(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job listings:', error);
          setIsLoading(false);
        });
    }
  }, [accessToken, userIdRef]);

  const handleOnClick = (jobId) => {
    // Navigate to the job details page for the clicked job
    router.push(`/jobDetails/${jobId}`);
  };

  return (
    <div className={styles.container}>
      {' '}
      {/* <-- Use styles here */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {jobListings.length > 0 ? (
            jobListings.map((job) => (
              <Card key={job.id} className={styles.card}>
                {' '}
                {/* <-- Use styles here */}
                <h2>{job.title}</h2>
                <p>{job.description}</p>
                <button onClick={() => handleOnClick(job.id)}>View More</button>
              </Card>
            ))
          ) : (
            <p>No jobs have been assigned to you yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListingPage;
