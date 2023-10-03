'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchSavedJobListings } from '@/app/api/jobListing/route';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './page.module.css';
import Enums from '@/common/enums/enums';

function ViewSavedJobListingsJobSeeker() {
  const [savedJobListings, setSavedJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('');
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

  const filteredJobListings = savedJobListings.filter((jobListing) =>
    jobListing.jobListing.title
      .toLowerCase()
      .includes(filterKeyword.toLowerCase())
  );

  const itemTemplate = (savedJobListing) => {
    const jobDetails = savedJobListing.jobListing;
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>{jobDetails.title}</h3>
        </div>
        <div className={styles.cardBody}>
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

  const header = (
    <div className="p-d-flex p-ai-center p-jc-between">
      <h2 className={styles.headerTitle}>My Saved Job Listings</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          placeholder="Keyword Search"
          style={{ width: '180px' }}
        />
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.headerTitle} style={{ marginBottom: '15px' }}>
          My Saved Job Listings
        </h1>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Keyword Search"
            style={{ width: '265px' }}
          />
        </span>
      </div>

      <div className={styles.cardsGrid}>
        {filteredJobListings.map((jobListing) => itemTemplate(jobListing))}
      </div>
    </>
  );
}

export default ViewSavedJobListingsJobSeeker;
