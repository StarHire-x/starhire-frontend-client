"use client"
import React from "react";
import styles from "./ticketManagement.module.css"; // Import your CSS file
import CustomCard from "./Card"; // Import your custom Card component

const TicketManagement = () => {
  const cardContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center", // Center align items vertically
    marginBottom: "20px", // Adjust the margin-bottom value to control vertical spacing
  };
  //const cardLink = `/jobListingManagement/viewAllMyJobListings/viewJobApplicationDetails?id=${jobApplication.jobApplicationId}`;
  const generalQuestionsUrl = '/ticketManagement/createATicket?problem=website';
  return (
    <div className={styles.container}>
      <h1>Ticket Management</h1>
      <div style={cardContainerStyle}>
        <div>
          <a href="/website-issues"> {/* Specify the URL you want for the "Website Issues" card */}
            <CustomCard image="./booking-issues.jpg" />
            <p>Website Issues</p>
          </a>
        </div>
        <div>
          <a href="/job-listings-problems"> {/* Specify the URL you want for the "Job Listings Problems" card */}
            <CustomCard image="./payment-problems.jpg" />
            <p>Job Listings Problems</p>
          </a>
        </div>
        <div>
          <a href="/chat-issues"> {/* Specify the URL you want for the "Chat" card */}
            <CustomCard image="./account-support.jpg" />
            <p>Chat</p>
          </a>
        </div>
        <div>
        <a href={generalQuestionsUrl}>
            <CustomCard image="/icon.png" />
            <p>General Questions</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;










