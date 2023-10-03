'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
  findAssignedJobListingsByJobSeeker,
  saveJobListing,
  unsaveJobListing,
} from '../api/jobListing/route';
import styles from './page.module.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Enums from '@/common/enums/enums';

const JobListingPage = () => {
  const [jobListings, setJobListings] = useState([]);
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

  const params = useSearchParams();
  const id = params.get('id');

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

  const filteredJobListings = jobListings.filter((jobListing) => {
    return jobListing.title.toLowerCase().includes(filterKeyword.toLowerCase());
  });

  const handleSaveJobListing = async (jobListing) => {
    try {
      if (jobListing.isSaved) {
        await unsaveJobListing(jobListing.jobListingId, accessToken);
        alert('Job Listing Unsaved Successfully!');
      } else {
        await saveJobListing(jobListing.jobListingId, accessToken);
        alert('Job Listing Saved Successfully!');
      }
      // Update the state to force a re-render
      setJobListings([...jobListings]);
      // Refresh the data after saving/un-saving
      setRefreshData(!refreshData);
    } catch (error) {
      console.error('Error when saving/un-saving:', error);
      alert(
        `Error: ${error.message || 'Failed to save/un-save the job listing.'}`
      );
    }
  };

  const itemTemplate = (jobListing) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>{jobListing.title}</h3>
          <h4>{jobListing.corporate.userName}</h4>
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
            <span>{formatDate(jobListing.listingDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Start Date:</span>
            <span>{formatDate(jobListing.jobStartDate)}</span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <Button
            label="Details"
            rounded
            onClick={() => {
              saveStatusChange(jobListing);
            }}
          />
          <Button
            className={styles.saveButton}
            icon={jobListing.isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'}
            onClick={() => handleSaveJobListing(jobListing)}
            rounded
          />
        </div>
      </div>
    );
  };

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
          Assigned Jobs
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
        <Button
          className={styles.savedJobsButton}
          label="My Saved Job Listings"
          onClick={() =>
            router.push('/jobListing/viewSavedJobListingsJobSeeker')
          }
          rounded
        />
      </div>

      <div className={styles.cardsGrid}>
        {filteredJobListings.map((jobListing) => itemTemplate(jobListing))}
      </div>
    </>
  );
};

export default JobListingPage;
