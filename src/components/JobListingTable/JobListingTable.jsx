import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const JobListingTable = ({ listings }) => {
  const handleEdit = (rowData) => {
    // Handle edit logic here
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
      <Column
        field="jobListingId"
        header="ID"
        style={{ width: '50px' }}
        sortable
      ></Column>
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
        body={(rowData) => (
          <Link href="/dashboard">
            <Button
              icon="pi pi-pencil"
              rounded
              outlined
              className="mr-2"
              onClick={() => handleEdit(rowData.jobListingId)}
            />
          </Link>
        )}
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
};

export default JobListingTable;
