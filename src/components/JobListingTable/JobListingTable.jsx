import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Link from 'next/link';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const JobListingTable = ({ listings }) => {
  const handleEdit = (rowData) => {
    // Handle edit logic here
  };

  const handleDelete = (rowData) => {
    // Handle delete logic here
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DataTable value={listings} style={styles.table}>
      <Column
        field="jobListingId"
        header="ID"
        style={{ width: '50px' }}
      ></Column>
      <Column field="title" header="Title" style={{ width: '50px' }}></Column>
      <Column
        field="description"
        header="Description"
        style={{ width: '50px' }}
      ></Column>
      <Column
        field="jobLocation"
        header="Location"
        style={{ width: '50px' }}
      ></Column>
      <Column
        field="averageSalary"
        header="Average Salary"
        style={{ width: '50px' }}
      ></Column>
      <Column
        field="listingDate"
        header="Listing Date"
        body={(rowData) => formatDate(rowData.listingDate)}
      ></Column>
      <Column
        field="jobStartDate"
        header="Start Date"
        body={(rowData) => formatDate(rowData.listingDate)}
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
