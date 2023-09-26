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
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button"

const ViewApplicationsPage = () => {
    const [jobApplications, setJobApplications] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    /*
    useEffect(() => {
      if (accessToken) {
        getJobApplicationsByJobListingId(id, accessToken)
          .then((data) => {
            setJobApplications(data);
            //setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching job listings:', error);
            //setIsLoading(false);
          });
      }
    }, [accessToken]);
    */

    useEffect(() => {
      // Define the URL you want to fetch
      const apiUrl = `http://localhost:8080/job-listing/corporate/jobApplications/${id}`;
    
      // Use the fetch API to make the request with the access token in the headers
      fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming the response is JSON data
        })
        .then((responseData) => {
          setJobApplications(responseData); // Store the fetched data in state
          //setLoading(false); // Set loading to false
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          //setLoading(false); // Set loading to false in case of an error
        });
    }, [accessToken]);
    


      const itemTemplate = (jobApplications) => {
        return (
          <a href={cardLink} className={styles.cardLink}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h5>{jobApplications.jobApplicationStatus}</h5>
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

      return (
        <div className="card">
          {isLoading ? (
            <div className="loading-animation">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <DataTable
                value={jobApplications}
                paginator
                rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                dataKey="id"
                selectionMode="checkbox"
                emptyMessage="No Job Listings found."
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
                <Column
                  field="jobApplicationId"
                  header="Listing ID"
                  sortable
                ></Column>
                <Column field="title" header="Title" sortable></Column>
                <Column
                  field="jobApplicationStatus"
                  header="Company Name"
                  sortable
                />
                <Column
                  field="availableStartDate"
                  header="Job Location"
                  sortable
                ></Column>
              </DataTable>
            </>
          )}
        </div>
      );
      

      /*
      if (session.status === 'authenticated') {
        return (
          <div className={styles.container}>
            <DataView
              value={jobApplications}
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
      */
}

export default ViewApplicationsPage;