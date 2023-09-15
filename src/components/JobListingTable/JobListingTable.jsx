import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import EditJobListingForm from '@/components/EditJobListingForm/EditJobListingForm';
import { useSession } from 'next-auth/react';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const JobListingTable = ({ listings }) => {
  const session = useSession();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentListing, setCurrentListing] = useState(null); // Holds the listing data you want to edit
  const [isLoading, setIsLoading] = useState(false);
  const [jobListings, setJobListings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // To store the job that's being edited

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
    const fetchJobListings = async () => {
      try {
        const response = await fetch('http://localhost:8080/job-listing');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobListings(data);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    fetchJobListings();
  }, []);
  */

  const handleEdit = async (jobListingId, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/job-listing/${jobListingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...updatedData,
            corporateId: userIdRef,
          }),
        }
      );

      const payload = {
        ...updatedData,
        corporateId: userIdRef,
      };
      console.log('Payload:', payload);

      if (response.ok) {
        // Handle success case. You can update the state of the job listings to reflect the change or fetch again from the backend.
        console.log('Job Listing updated successfully');
        // Update the jobListings state to reflect the changes
        setJobListings((prevListings) =>
          prevListings.map((listing) =>
            listing.jobListingId === jobListingId
              ? { ...listing, ...updatedData }
              : listing
          )
        );
      } else {
        console.error(
          'Failed to update job listing. Response status:',
          response.status
        );
      }
    } catch (error) {
      // Handle error scenarios like network errors, validation errors, etc.
      console.error(
        'Error while updating job listing:',
        error.message || error
      );
    }
  };

  // When edit button is clicked, populate the form and show it
  const onEditButtonClick = (jobListing) => {
    setFormData(jobListing); // Assuming you have some state method to set form data
    setShowEditForm(true); // Assuming you're using a state variable to toggle the display of the edit form
  };

  // onSave callback for the EditJobListingForm
  const onSave = (updatedData) => {
    handleEdit(currentListing.jobListingId, updatedData);
    setShowEditForm(false); // Hide the form after saving
  };

  const handleDelete = async (jobListingId) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this job listing?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/job-listing/${jobListingId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        // Remove the deleted job listing from the local state
        setJobListings((prevListings) =>
          prevListings.filter(
            (listing) => listing.jobListingId !== jobListingId
          )
        );
        alert('Job listing deleted successfully!');
      } else {
        // Handle errors
        const data = await response.json();
        alert(`Error: ${data.message || 'Could not delete job listing.'}`);
      }
    } catch (error) {
      console.error('There was an error deleting the job listing.', error);
      //alert('There was an error deleting the job listing.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DataTable
      value={listings}
      paginator
      rows={10}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      rowsPerPageOptions={[10, 25, 50]}
      style={styles.table}
      filterDisplay="menu"
      globalFilterFields={[
        'jobListingId',
        'description',
        'jobLocation',
        'averageSalary',
        'listingDate',
        'jobStartDate',
        'jobListingStatus',
      ]}
    >
      <Column field="title" header="Title" style={{ width: '50px' }}></Column>
      <Column
        field="description"
        header="Description"
        style={{ width: '50px' }}
        sortable
      ></Column>
      <Column
        field="jobLocation"
        header="Location"
        style={{ width: '50px' }}
        sortable
      ></Column>
      <Column
        field="averageSalary"
        header="Average Salary"
        style={{ width: '50px' }}
        sortable
      ></Column>
      <Column
        field="listingDate"
        header="Listing Date"
        body={(rowData) => formatDate(rowData.listingDate)}
        sortable
      ></Column>
      <Column
        field="jobStartDate"
        header="Start Date"
        body={(rowData) => formatDate(rowData.jobStartDate)}
        sortable
      ></Column>
      <Column
        field="jobListingStatus"
        header="Status"
        body={(rowData) => (
          <span
            style={{
              color: rowData.jobListingStatus === 'Active' ? 'green' : 'red',
            }}
          >
            {rowData.jobListingStatus}
          </span>
        )}
        sortable
      ></Column>

      <Column
        body={(rowData) => {
          if (session) {
            return (
              <>
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  onClick={() => {
                    setCurrentListing(rowData);
                    setShowEditDialog(true);
                  }}
                />
                <Dialog
                  header="Edit Job Listing"
                  visible={showEditDialog && currentListing === rowData}
                  onHide={() => {
                    setCurrentListing(null);
                    setShowEditDialog(false);
                  }}
                  style={{ width: '50vw' }}
                >
                  <EditJobListingForm
                    initialData={currentListing}
                    onSave={(updatedData) => {
                      handleEdit(currentListing.jobListingId, updatedData);
                      setCurrentListing(null); // Reset current listing
                      setShowEditDialog(false); // Close the dialog after saving
                    }}
                  />
                </Dialog>
              </>
            );
          }
          return null;
        }}
      ></Column>
      <Column
        body={(rowData) => (
          <Link href="/dashboard">
            <Button
              icon="pi pi-trash"
              rounded
              outlined
              className="mr-2"
              onClick={() => handleDelete(rowData.jobListingId)}
            />
          </Link>
        )}
      ></Column>
    </DataTable>
  );
};

const styles = {
  table: {
    backgroundColor: '#edf6f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 109, 119, 0.1)',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    color: '#006d77',
    cursor: 'pointer',
    transition: 'color 0.3s',
    fontSize: '18px',
    margin: '0 5px',
    padding: '5px',
  },
  deleteButton: {
    color: '#e29578',
  },
  editForm: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#edf6f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 109, 119, 0.1)',
  },
};

export default JobListingTable;
