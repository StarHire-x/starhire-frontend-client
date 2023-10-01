'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchSavedJobListings } from '@/app/api/auth/jobListing/route';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import styles from './page.module.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import Enums from '@/common/enums/enums';

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

  const createLink = (id) => {
    const link = `/jobListing/viewJobListingDetailsJobSeeker?id=${id}`;
    return link;
  };

  const saveStatusChange = async (rowData) => {
    const jobListingId = rowData.jobListingId;
    if (session.data.user.role === Enums.JOBSEEKER) {
      try {
        // Use router.push to navigate to another page with a query parameter
        let link = createLink(jobListingId);
        router.push(link);
      } catch (error) {
        console.error('Error changing status:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const itemTemplate = (savedJobListing) => {
    const jobDetails = savedJobListing.jobListing;
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>{jobDetails.title}</h3>
        </div>
        <div className={styles.cardBody}>
          {/* Include similar details to mimic the UI */}
          <div className={styles.cardRow}>
            <span>Location:</span>
            <span>{jobDetails.jobLocation}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Average Salary:</span>
            <span>${jobDetails.averageSalary}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Listing Date:</span>
            <span>{formatDate(jobDetails.listingDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Start Date:</span>
            <span>{formatDate(jobDetails.jobStartDate)}</span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <Button
            label="Details"
            rounded
            onClick={() => {
              saveStatusChange(jobDetails);
            }}
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <ProgressSpinner
          style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <DataView
        value={savedJobListings}
        className={styles.dataViewContainer}
        layout="grid"
        rows={10}
        paginator
        header={<h2 className={styles.headerTitle}>My Saved Job Listings</h2>}
        emptyMessage="No saved job listings found"
        itemTemplate={itemTemplate}
      />
    </div>
  );

  // return (
  //   <div className="container">
  //     {savedJobListings.length === 0 ? (
  //       <p>You have no saved job listings.</p>
  //     ) : (
  //       savedJobListings.map((savedJobListing) => (
  //         <Card key={savedJobListing.savedJobListingId}>
  //           {/* Render job listing details here */}
  //           <h2>{savedJobListing.jobListing.title}</h2>
  //           <p>{savedJobListing.jobListing.overview}</p>
  //           {/* ... other job listing details */}
  //         </Card>
  //       ))
  //     )}
  //   </div>
  // );
}

export default ViewSavedJobListingsJobSeeker;
