'use client';
import React, { useEffect, useState } from 'react';
import JobListingTable from '@/components/JobListingTable/JobListingTable';
import CreateJobListingForm from '@/components/CreateJobListingForm/CreateJobListingForm';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useSession } from 'next-auth/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import EditJobListingForm from '@/components/EditJobListingForm/EditJobListingForm';

const JobListingManagementPage = () => {
  const [jobListings, setJobListings] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false); // State to handle the modal visibility
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();

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

  /*  
useEffect(() => {
    // If session doesn't exist, redirect to login
    if (!session) {
      window.location.href = "/login";
      return; // Exit the useEffect if there's no session
    }

    // Function to fetch job listings for the corporate user
    const fetchCorporateJobListings = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/job-listing/corporate/${userIdRef}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        // Check for response errors
        if (!response.ok) {
          console.error("Error fetching job listings:", await response.text());
          return;
        }

        const data = await response.json();
        setJobListings(data);
      } catch (error) {
        console.error(
          "There was an error fetching the job listings:",
          error.message
        );
      }
    };
    // Call the function
    fetchCorporateJobListings();
  }, []);
  */
  useEffect(() => {
    fetch(`http://localhost:8080/job-listing/corporate/${userIdRef}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setJobListings(data);
        //setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        //setIsLoading(false);
      });
  }, [refreshData, accessToken]);

  //console.log("HERE" + JSON.stringify(jobListings.));

  const handleJobListingCreation = async (newJobListing) => {
    try {
      // Send the new listing data to the backend
      console.log("Hellooo");
      const response = await fetch(`http://localhost:8080/job-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...newJobListing,
          corporateId: userIdRef, // Assuming the session has the user's ID
        }),
      });

      const payload = {
        ...newJobListing,
        corporateId: userIdRef,
      };
      console.log('Payload:', payload);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to create the job listing'
        );
      }
      setRefreshData((prev) => !prev);
      // Close the modal dialog
      setShowCreateDialog(false);
    } catch (error) {
      console.error(
        'There was an error creating the job listing:',
        error.message
      );
      // Can also set some state here to display the error message to the user
    }
  };

  const header = (
    <div className="p-d-flex p-jc-between">
      <h2 style={styles.title}>Job Listing Management</h2>
      <div className="p-d-flex p-ai-end">
        <Button
          label="Add A Job Listing"
          onClick={() => setShowCreateDialog(true)}
        />
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <Toolbar left={header}></Toolbar>
      <div style={styles.tableContainer}>
        <JobListingTable listings={jobListings} />
      </div>
      <Dialog
        header="Create Job Listing"
        visible={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
        style={{ width: '50vw' }}
      >
        <CreateJobListingForm onCreate={handleJobListingCreation} />
      </Dialog>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#edf6f9',
    padding: '40px 60px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    margin: '40px auto',
    maxWidth: '1200px',
  },
  title: {
    color: '#006d77',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    borderBottom: '3px solid #e29578',
    paddingBottom: '10px',
  },
  tableContainer: {
    width: '100%',
  },
};

export default JobListingManagementPage;
