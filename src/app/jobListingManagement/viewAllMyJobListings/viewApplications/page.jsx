"use client"
import React, { useEffect, useState } from 'react';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { useSession } from 'next-auth/react';

import { findAllJobListingsByCorporate } from '@/app/api/auth/jobListing/route';
import styles from 'src/app/jobListingManagement/page.module.css';
import 'primeflex/primeflex.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const ViewApplicationsPage = () => {
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

    const params = useSearchParams();
    const id = params.get("id");


      const itemTemplate = (jobListing) => {
        return (
          <a href={cardLink} className={styles.cardLink}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h5>{jobListing.title}</h5>
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

      if (session.status === 'authenticated') {
        return (
          <div className={styles.container}>
            <DataView
              value={jobListing}
              className={styles.dataViewContainer}
              layout="grid"
              rows={10}
              paginator
              header={<h2 className={styles.headerTitle}>All Applicants</h2>}
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              rowsPerPageOptions={[10, 25, 50]}
              emptyMessage="No Applicants found for this Job Listing"
              itemTemplate={itemTemplate}
              pt={{
                grid: { className: 'surface-ground' },
              }}
            />
          </div>
        );
      }
}

export default ViewApplicationsPage;