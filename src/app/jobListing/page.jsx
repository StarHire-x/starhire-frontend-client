'use client';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { findAssignedJobListingsByJobSeeker } from '../api/auth/jobListing/route'; // Assuming this is the correct path
import styles from './page.module.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const JobListingPage = () => {
  const [jobListings, setJobListings] = useState([]);
  // const [jobListing, setJobListing] = useState(null);
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
      findAssignedJobListingsByJobSeeker(userIdRef, accessToken)
        .then((data) => {
          setJobListings(data);
          console.log('Received job listings:', data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job listings:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, userIdRef, accessToken]);

  // const handleOnClick = (jobId) => {
  //   // Navigate to the job details page for the clicked job
  //   router.push(`/jobDetails/${jobId}`);
  // };

  // const renderJobCard = (job) => {
  //   return (
  //     <Card
  //       key={job.jobListingId}
  //       title={job.title}
  //       style={{ marginBottom: '2em' }}
  //     >
  //       <p>
  //         <b>Location:</b> {job.jobLocation}
  //       </p>
  //       <p>
  //         <b>Listing Date:</b> {new Date(job.listingDate).toLocaleDateString()}
  //       </p>
  //       <p>
  //         <b>Average Salary:</b> ${job.averageSalary}
  //       </p>
  //       <p>
  //         <b>Job Start Date:</b>{' '}
  //         {new Date(job.jobStartDate).toLocaleDateString()}
  //       </p>
  //       <p>
  //         <b>Overview:</b> {job.overview}
  //       </p>
  //       <p>
  //         <b>Responsibilities:</b> {job.responsibilities}
  //       </p>
  //       <p>
  //         <b>Requirements:</b> {job.requirements}
  //       </p>
  //       <p>
  //         <b>Status:</b> {job.jobListingStatus}
  //       </p>
  //     </Card>
  //   );
  // };

  return (
    <div className={styles.container}>
      <h1>Your Assigned Jobs</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : jobListings.length === 0 ? (
        <p>No job listings assigned yet.</p>
      ) : (
        jobListings.map((jobListing) => (
          <Card className={styles.card} title={jobListing.title}>
            <div className={styles.cardHeader}>
              {/* <h4>{jobListing.corporate.userName}</h4> */}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardRow}>
                <span>Location:</span>
                <span>{jobListing.jobLocation}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Average Salary:</span>
                <span>${jobListing.averageSalary}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Listing Date:</span>
                <span>
                  {new Date(jobListing.listingDate).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.cardRow}>
                <span>Start Date:</span>
                <span>
                  {new Date(jobListing.jobStartDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className={styles.cardFooter}>
              {/* Add any buttons/actions here */}
              <button className={styles.buttonSpacing}>Details</button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default JobListingPage;
