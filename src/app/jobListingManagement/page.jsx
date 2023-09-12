'use client';
import React, { useEffect, useState } from 'react';
import JobListingTable from '@/components/JobListingTable/JobListingTable';
import CreateJobListingForm from '@/components/CreateJobListingForm/CreateJobListingForm';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useSession } from 'next-auth/react';

const JobListingManagementPage = () => {
  const [jobListings, setJobListings] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false); // State to handle the modal visibility
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch(`http://localhost:8080/job-listing/my-listings`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setJobListings(data));
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      window.location.href = '/login'; // Redirect to login if not authenticated
    }
  }, [session]);

  const handleJobListingCreation = async (newJobListing) => {
    try {
      // Send the new listing data to the backend
      const response = await fetch(`http://localhost:8080/job-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          ...newJobListing,
          corporateId: session.user.userId, // Assuming the session has the user's ID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create the listing');
      }

      // Fetch the updated job listings
      const updatedListingsResponse = await fetch(
        `http://localhost:8080/job-listing?userId=${session.user.userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const updatedListings = await updatedListingsResponse.json();
      setJobListings(updatedListings);

      // Close the modal dialog
      setShowCreateDialog(false);
    } catch (error) {
      console.error(
        'There was an error creating the job listing:',
        error.message
      );
      // You can also set some state here to display the error message to the user, if you wish.
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
