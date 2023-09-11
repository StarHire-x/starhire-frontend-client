'use client';
import React, { useEffect, useState } from 'react';
import JobListingTable from '@/components/JobListingTable/JobListingTable';
import { Toolbar } from 'primereact/toolbar';
import { useSession } from 'next-auth/react';

const JobListingManagementPage = () => {
  const [jobListings, setJobListings] = useState([]);

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch('http://localhost:8080/job-listing?userId=${session.user.userId')
        .then((response) => response.json())
        .then((data) => setJobListings(data));
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      window.location.href = '/login'; // Redirect to login if not authenticated
    }
  }, [session]);

  const header = (
    <div className="p-d-flex p-jc-between">
      <h2 style={styles.title}>Job Listing Management</h2>
      {/* You can add action buttons here in the future, e.g., Add New Listing */}
    </div>
  );

  return (
    <div style={styles.container}>
      <Toolbar left={header}></Toolbar>
      <div style={styles.tableContainer}>
        <JobListingTable listings={jobListings} />
      </div>
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
