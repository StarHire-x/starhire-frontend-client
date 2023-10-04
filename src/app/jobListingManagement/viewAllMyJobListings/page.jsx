'use client';

import React, { useEffect, useState } from 'react';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { findAllJobListingsByCorporate } from '@/app/api/jobListing/route';
import styles from '../page.module.css';
import 'primeflex/primeflex.css';
import Enums from '@/common/enums/enums';

const ViewAllMyJobListingsManagementPage = () => {
  const [jobListing, setJobListing] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
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

  console.log(session);
  console.log(userIdRef);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  /*
  const getStatus = (status) => {
    switch (status) {
      case Enums.ACTIVE:
        return 'success';
      case 'Unverified':
        return 'danger';
      case Enums.INACTIVE:
        return 'danger';
    }
  };
  */

  const getStatus = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Unverified':
        return 'danger';
      case 'Rejected':
        return 'danger';
    }
  };

  useEffect(() => {
    if (session.status === 'unauthenticated' || session.status === 'loading') {
      router.push('/login');
    } else if (session.status === 'authenticated') {
      findAllJobListingsByCorporate(userIdRef, accessToken)
        .then((jobListing) => setJobListing(jobListing))
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, [refreshData, userIdRef, accessToken]);

  const itemTemplate = (jobListing) => {
    const cardLink = `/jobListingManagement/viewAllMyJobListings/viewJobApplications?id=${jobListing.jobListingId}`;
    <a href={cardLink} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardHeader}></div>
      </div>
    </a>;
    return (
      <a href={cardLink} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>{jobListing.title}</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardRow}>
              <span>Job ID:</span>
              <span>{jobListing.jobListingId}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Location:</span>
              <span>{jobListing.jobLocation}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Average Salary</span>
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
            <div className={styles.cardRow}>
              <span>Status:</span>
              <Tag
                value={jobListing.jobListingStatus}
                severity={getStatus(jobListing.jobListingStatus)}
              />
            </div>
          </div>
        </div>
      </a>
    );
  };

  if (session.status === 'unauthenticated') {
    router?.push('/login');
  }

  // if (session.status === 'authenticated') {
  //   return (
  //     <div className={styles.container}>
  //       <DataView
  //         value={jobListing}
  //         className={styles.dataViewContainer}
  //         layout="grid"
  //         rows={10}
  //         paginator
  //         header={<h2 className={styles.headerTitle}>My Job Listings</h2>}
  //         currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
  //         rowsPerPageOptions={[10, 25, 50]}
  //         emptyMessage="No job listing found"
  //         itemTemplate={itemTemplate}
  //         pt={{
  //           grid: { className: 'surface-ground' },
  //         }}
  //       />
  //     </div>
  //   );
  // }

  if (session.status === 'authenticated') {
    return (
      <>
        <div className={styles.header}>
          <h1 className={styles.headerTitle} style={{ marginBottom: '15px' }}>
            My Job Listings
          </h1>
        </div>

        <div className={styles.cardsGrid}>
          {jobListing && jobListing.map((job) => itemTemplate(job))}
        </div>
      </>
    );
  }
};

export default ViewAllMyJobListingsManagementPage;
