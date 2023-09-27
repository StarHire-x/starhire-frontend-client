'use client';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
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

  const createLink = (id) => {
    const link = `/jobListing/viewJobListingDetailsJobSeeker?id=${id}`;
    return link;
  };

  const saveStatusChange = async (rowData) => {
    const jobListingId = rowData.jobListingId;
    if (session.data.user.role === 'Job_Seeker') {
      try {
        // Use router.push to navigate to another page with a query parameter
        let link = createLink(jobListingId);
        // console.log('Generated Link:', link);
        router.push(link);
      } catch (error) {
        console.error('Error changing status:', error);
      }
    }
  };

  // const handleOnClick = (jobId) => {
  //   // Navigate to the job details page for the clicked job
  //   router.push(`/jobDetails/${jobId}`);
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
              <Button
                label="Details"
                onClick={(e) => {
                  saveStatusChange(jobListing);
                }}
              />
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default JobListingPage;
