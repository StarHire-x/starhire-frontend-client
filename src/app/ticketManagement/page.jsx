"use client"
import React from "react";
import styles from "./ticketManagement.module.css";
import CustomCard from "./Card"; 

const TicketManagement = () => {
  const cardContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center", 
    marginBottom: "20px", 
  };

  const eventIssuesUrl = '/ticketManagement/createATicket?problem=event';
  const jobListingIssuesUrl = '/ticketManagement/createATicket?problem=jobListing';
  const technicalSupportUrl = '/ticketManagement/createATicket?problem=technicalSupport';
  const reportingVulnerabiltyUrl = '/ticketManagement/createATicket?problem=reportVulnerability';
  const generalQuestionsUrl = '/ticketManagement/createATicket?problem=generalEnquiries';

  return (
    <div className={styles.container}>
      <h1>Ticket Management</h1>
      <div style={cardContainerStyle}>
        <div>
        <a href={eventIssuesUrl}>
            <CustomCard image="./booking-issues.jpg" />
            <p>Event Related Issues</p>
          </a>
        </div>
        <div>
        <a href={jobListingIssuesUrl}>
            <CustomCard image="./payment-problems.jpg" />
            <p>Job Listings Issues</p>
          </a>
        </div>

        <div>
        <a href={technicalSupportUrl}>
            <CustomCard image="./account-support.jpg" />
            <p>Technical Support</p>
          </a>
        </div>

        <div>
        <a href={reportingVulnerabiltyUrl}>
            <CustomCard image="./account-support.jpg" />
            <p>Report a Vulnerability / Bug</p>
          </a>
        </div>

        <div>
        <a href={generalQuestionsUrl}>
            <CustomCard image="/icon.png" />
            <p>General Questions and Enquiries</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;










