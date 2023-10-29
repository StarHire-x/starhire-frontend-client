'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getJobApplicationsByJobListingId } from '@/app/api/jobListing/route';
// import 'primeflex/primeflex.css';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const ViewJobApplicationsPage = () => {
  const [jobApplications, setJobApplications] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const router = useRouter();

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const params = useSearchParams();
  const id = params.get('id');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const displayStatus = (status) => {
    switch (status) {
      case 'Offered':
        return 'Offered';
      case 'Rejected':
        return 'Rejected';
      case 'Offer_Accepted':
        return 'Offer Accepted';
      case 'Offer_Rejected':
        return 'Offer Rejected';
      case 'Processing':
        return 'Processing';
      case 'To_Be_Submitted':
        return 'To Be Submitted';
      case 'Waiting_For_Interview':
        return 'Interview in Process';
      default:
        return 'Unknown';
    }
  };

  useEffect(() => {
    if (accessToken) {
      getJobApplicationsByJobListingId(id, accessToken)
        .then((response) => {
          setJobApplications(response);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job listings:', error);
          setIsLoading(false);
        });
    }
  }, [userIdRef, accessToken]);

  const getStatus = (status) => {
    switch (status) {
      case 'To_Be_Submitted':
        return 'info';
      case 'Processing':
        return 'warning';
      case 'Waiting_For_Interview':
        return 'info';
      case 'Offer_Rejected':
        return 'danger';
      case 'Offer_Accepted':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Offered':
        return 'success';
      case 'Unverified':
        return 'warning';
      default:
        return '';
    }
  };

  const itemTemplate = (jobApplication) => {
    const cardLink = `/jobListingManagement/viewAllMyJobListings/viewJobApplicationDetails?id=${jobApplication.jobApplicationId}`;
    return (
      <a href={cardLink} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Job Application Id:</span>
            <h5>{jobApplication.jobApplicationId}</h5>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardRow}>
              <span>Available Start Date:</span>
              <span>{formatDate(jobApplication.availableStartDate)}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Submission Date:</span>
              <span>{formatDate(jobApplication.submissionDate)}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Status</span>
              <span>
                <Tag
                  value={displayStatus(jobApplication.jobApplicationStatus)}
                  severity={getStatus(jobApplication.jobApplicationStatus)}
                />
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  };

  if (session.status === 'unauthenticated') {
    router?.push('/login');
  }

  if (session.status === 'authenticated') {
    return (
      <div className={styles.container}>
        {isLoading ? (
          <ProgressSpinner
            style={{
              display: 'flex',
              height: '100vh',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ) : (
          <DataView
            value={jobApplications}
            className={styles.dataViewContainer}
            layout="grid"
            rows={10}
            paginator
            header={
              <h2 className={styles.headerTitle}>
                All Applications for Current Job Listing
              </h2>
            }
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            rowsPerPageOptions={[10, 25, 50]}
            emptyMessage="No Application found for this Job Listing"
            itemTemplate={itemTemplate}
          />
        )}
      </div>
    );
  }
};

export default ViewJobApplicationsPage;
