'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import Image from 'next/image';
import HumanIcon from './../../../public/icon.png';
import {
  findAssignedJobListingsByJobSeeker,
  saveJobListing,
  unsaveJobListing,
} from '../api/jobListing/route';
import styles from './page.module.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import JobDetailPanel from '@/components/JobDetailPanel/JobDetailPanel';

const JobListingPage = () => {
  const session = useSession();
  const router = useRouter();

  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('');

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const jobSeekerId =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const [selectedJob, setSelectedJob] = useState(null);

  const toast = useRef(null);

  const params = useSearchParams();
  const id = params.get('id');

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Redirect to login if the user is unauthenticated
    if (session.status === 'unauthenticated' || session.status === 'loading') {
      router.push('/login');
    }

    // Only run the logic if the user is authenticated
    if (accessToken) {
      findAssignedJobListingsByJobSeeker(jobSeekerId, accessToken)
        .then((data) => {
          setJobListings(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job listings:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, accessToken, id, jobSeekerId]);

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
        //alert('Job Listing Unsaved Successfully!');
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job Listing Unsaved Successfully!',
          life: 5000,
        });
      } else {
        await saveJobListing(jobListing.jobListingId, accessToken);
        //alert('Job Listing Saved Successfully!');
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job Listing Saved Successfully!',
          life: 5000,
        });
      }
      // Update the state to force a re-render
      setJobListings([...jobListings]);
      // Refresh the data after saving/un-saving
      setRefreshData(!refreshData);
    } catch (error) {
      console.error('Error when saving/un-saving:', error);
      // alert(
      //   `Error: ${error.message || 'Failed to save/un-save the job listing.'}`
      // );
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
  };

  const itemTemplate = (jobListing) => (
    <div
      className={styles.listingItem}
      onClick={() => setSelectedJob(jobListing)}
    >
      <div className={styles.titleWithSaveButton}>
        <h3>{jobListing.title}</h3>
        <Button
          className={styles.saveButton}
          icon={jobListing.isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'}
          onClick={(e) => {
            e.stopPropagation(); // To prevent setSelectedJob from being triggered
            handleSaveJobListing(jobListing);
          }}
          rounded
        />
      </div>
      <div className={styles.pCardContent}>
        <div className={styles.companyInfo}>
          {jobListing.corporate.profilePictureUrl === '' ? (
            <Image src={HumanIcon} alt="User" className={styles.avatar} />
          ) : (
            <img
              src={jobListing.corporate.profilePictureUrl}
              alt="Corporate Profile"
              className={styles.avatar}
            />
          )}
          <div>
            <p>{jobListing.corporate.userName}</p>
          </div>
        </div>
      </div>
      <p>
        <strong>{jobListing.jobLocation}</strong>
      </p>
      <p>
        <span>$</span>
        {jobListing.averageSalary}
        <span> monthly</span>
      </p>
      <p>
        <span>Posted on </span>
        {formatDate(jobListing.listingDate)}
      </p>
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
    <div className={styles.test}>
      Hello
    </div>
      <Toast ref={toast} />
      <div className={styles.header}>
        <h1 style={{ marginBottom: '15px', color: 'white' }}>Assigned Jobs</h1>
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
      <div className={styles.container}>
        {/* Left Panel - Job Listings */}
        <div className={styles.listingsPanel}>
          {filteredJobListings.map((jobListing) => itemTemplate(jobListing))}
        </div>

        {/* Right Panel - Job Details */}
        <div className={styles.detailsPanel}>
          {selectedJob ? (
            <JobDetailPanel
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              accessToken={accessToken}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              jobSeekerId={jobSeekerId}
              toast={toast}
            />
          ) : (
            <p>Select a job listing to view details.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default JobListingPage;
