"use client"
import React, { useEffect, useState } from 'react';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { useSession } from 'next-auth/react';


import { getJobApplicationsByJobListingId } from '@/app/api/auth/jobListing/route';
import styles from 'src/app/jobListingManagement/page.module.css';
import 'primeflex/primeflex.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import "./styles.css";
const ViewApplicationsPage = () => {
    const [jobApplications, setJobApplications] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
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
    const id = params.get("id");

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
      if (accessToken) {
        getJobApplicationsByJobListingId(id, accessToken)
          .then((response) => {
            setJobApplications(response);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching job listings:", error);
            setIsLoading(false);
          });
      }
    }, [userIdRef, accessToken]);


    const itemTemplate = (jobApplications) => {
      const cardLink = `/jobListingManagement/viewAllMyJobListings/viewApplications`;
      return (
        <a href={cardLink} className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{"Application ID: " + jobApplications.jobApplicationId}</h3>
            </div>
            <div className={styles.cardBody}>
              {isLoading ? (
                <div className="loading-animation">
                  <div className="spinner"></div>
                </div>
              ) : (
                <>
                  <div className={styles.cardRow}>
                    <span>Available start Date:</span>
                    <span>
                      {formatDate(jobApplications.availableStartDate)}
                    </span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Available End Date:</span>
                    <span>{formatDate(jobApplications.availableEndDate)}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Submitted on:</span>
                    <span>{formatDate(jobApplications.submissionDate)}</span>
                  </div>

                  <div className={styles.cardRow}>
                    <span>Status:</span>
                    <span
                      className={
                        jobApplications.jobApplicationStatus === "Accepted"
                          ? styles.greenText
                          : styles.redText
                      }
                    >
                      {jobApplications.jobApplicationStatus}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </a>
      );
    };
    
    if (session.status === 'authenticated') {
      return (
        <div className={styles.container}>
          <DataView
            value={jobApplications}
            className={styles.dataViewContainer}
            layout="grid"
            rows={10}
            paginator
            header={<h2 className={styles.headerTitle}>All Applications for Current Job Listing</h2>}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            rowsPerPageOptions={[10, 25, 50]}
            emptyMessage="No Application found for this Job Listing"
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