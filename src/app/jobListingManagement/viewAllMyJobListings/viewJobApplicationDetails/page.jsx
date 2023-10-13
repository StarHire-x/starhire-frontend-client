"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { viewJobApplicationDetails } from "@/app/api/jobApplication/route";
import { Card } from "primereact/card";
import styles from "./page.module.css";
import Image from "next/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { Checkbox } from "primereact/checkbox";
import { updateJobApplicationStatus } from "@/app/api/jobApplication/route";
import moment from "moment";
import HumanIcon from "../../../../../public/icon.png";
import { getJobSeekersByJobApplicationId } from "@/app/api/jobListing/route";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import {
  createChat,
  createChatMessage,
  getAllUserChats,
} from "@/app/api/chat/route";

const ViewJobApplicationDetails = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") {
    router?.push("/login");
  }

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const currentUserId =
    session.status === "authenticated" && session.data.user.userId;

  const currentUserName =
    session.status === "authenticated" && session.data.user.name;
  console.log(session);

  const params = useSearchParams();
  const jobApplicationId = params.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [jobSeeker, setJobSeeker] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [jobApplication, setJobApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [jobListing, setJobListing] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [userDialog, setUserDialog] = useState(false);
  const [status, setStatus] = useState(null);

  const [interviewDateTimes, setInterviewDateTimes] = useState([]);
  const [showArrangeInterviewDialog, setShowArrangeInterviewDialog] =
    useState(false);
  const [interviewDate, setInterviewDate] = useState(""); // State to store the interview date
  const [interviewTime, setInterviewTime] = useState(""); // State to store the interview time
  const [interviewNotes, setInterviewNotes] = useState("");
  const [confirmSendDialog, setConfirmSendDialog] = useState(false);

  const displayStatus = (status) => {
    switch (status) {
      case "offer_Accepted":
        return "Offer Accepted";
      case "offer_Rejected":
        return "Offer Rejected";
      case "Processing":
        return "Processing";
      case "to_be_submitted":
        return "To Be Submitted";
      case "waiting_for_interview":
        return "Waiting For Interview";
      default:
        return "Unknown";
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case 'to_be_submitted':
        return 'info';
      case 'Processing':
        return 'warning';
      case 'waiting_for_interview':
        return 'info';
      case 'offer_Rejected':
        return 'warning';
      case 'offer_Accepted':
        return 'success';
      case 'Unverified':
        return 'warning';
      default:
        return '';
    }
  };

  const showConfirmSendDialog = () => {
    setConfirmSendDialog(true);
  };

  const hideConfirmSendDialog = () => {
    setConfirmSendDialog(false);
  };

  const renderInterviewDateTimes = () => {
    return interviewDateTimes.map((entry, index) => (
      <div key={index} className={styles.interviewDateTimeEntry}>
        <span>
          Date:{" "}
          {moment(entry.date).format("DD/MM/YYYY HH:mm")}
        </span>
        <Button
          label="Remove"
          icon="pi pi-trash"
          onClick={() => removeInterviewDateTime(index)}
          className="p-button-danger"
        />
      </div>
    ));
  };
  
  const addInterviewDateTime = () => {
    if (interviewDate) {
      const newEntry = {
        date: moment(interviewDate).format(),
      };
  
      setInterviewDateTimes([...interviewDateTimes, newEntry]);
      setInterviewDate(""); // Clear the input
    }
  };
  

  /*
  const addInterviewDateTime = () => {
    if (interviewDate) {
      const newEntry = {
        date: interviewDate.toLocaleString(), // Convert to string
      };

      setInterviewDateTimes([...interviewDateTimes, newEntry]);
      setInterviewDate("");
    }
  };
  */

  const handleArrangeInterview = () => {
    setShowArrangeInterviewDialog(true);
  };

  const hideArrangeInterviewDialog = () => {
    setShowArrangeInterviewDialog(false);
  };

  const confirmSendDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={hideConfirmSendDialog}
      />
      <Button
        label="Confirm"
        icon="pi pi-check"
        outlined
        onClick={async () => {
          console.log("Sending to Recruiter...");
          // Add the chat logic here
          const chatId = await createNewChat();

          console.log("Interview Date-Times:", interviewDateTimes);
          console.log("Interview Notes:", interviewNotes);

          setInterviewDateTimes([]);
          setInterviewNotes("");

          hideConfirmSendDialog();
          hideArrangeInterviewDialog();

          const recruiterEmail = recruiter?.email;
          const jobSeekerName = jobSeeker?.fullName;
          const formattedDates = interviewDateTimes
            .map((item) => moment(item.date).format("DD/MM/YYYY HH:mm"))
            .join("\n");


            const finalMessage = `Hi ${recruiterEmail},
Here are the interview details:
${interviewNotes}\n
These are the dates that we would like to interview candidate: ${jobSeekerName}\n
Interview Date-Times:
${formattedDates}
Hope to hear from you soon\n${currentUserName}` ;

          await sendMessage(finalMessage, chatId);

          router.push(`/chat?id=${chatId}`);
        }}
      />
    </React.Fragment>
  );

  const confirmSendDialogContent = (
    <div>
      <p>Are you sure you want to send this to the recruiter?</p>
    </div>
  );

  const arrangeInterviewDialogFooter = (
    <React.Fragment>
      <Button
        label="Discard"
        icon="pi pi-times"
        outlined
        onClick={hideArrangeInterviewDialog}
      />
      <Button
        label="Send to Recruiter"
        icon="pi pi-check"
        outlined
        onClick={() => {
          //console.log("Interview Date-Times:", interviewDateTimes);
          //console.log("Interview Notes:", interviewNotes);

          // Clear the interviewDateTimes array after saving
          //setInterviewDateTimes([]);
          //setInterviewNotes("");
          //hideArrangeInterviewDialog();
          showConfirmSendDialog();
        }}
      />
    </React.Fragment>
  );

  const convertTimestampToDate = (timestamp) => {
    return moment(timestamp).format("DD/MM/YYYY");
  };

  const formattedDate = (timestamp) => {
    return moment(timestamp).format("DD/MM/YYYY HH:mm");
  };

  const removeInterviewDateTime = (index) => {
    const updatedDateTimes = [...interviewDateTimes];
    updatedDateTimes.splice(index, 1);
    setInterviewDateTimes(updatedDateTimes);
  };

  /*
  const renderInterviewDateTimes = () => {
    return interviewDateTimes.map((entry, index) => (
      <div key={index} className={styles.interviewDateTimeEntry}>
        <span>
          Date:{" "}
          {moment(entry.date, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm")}
        </span>
        <Button
          label="Remove"
          icon="pi pi-trash"
          onClick={() => removeInterviewDateTime(index)}
          className="p-button-danger"
        />
      </div>
    ));
  };
  /*
  const getSeverity = (status) => {
    switch (status) {
      case "Rejected":
        return "danger";

      case "Accepted":
        return "success";

      case "Submitted":
        return "success";

      case "Processing":
        return "warning";

      case "To_Be_Submitted":
        return "null";

      case "Accept":
        return "success";

      case "Waiting_For_Interview":
        return null;
    }
  };
  */

  /*
  const getApplicationStatus = () => {
    const severity = getSeverity(jobApplication?.jobApplicationStatus);
    return (
      <Tag severity={severity} value={jobApplication?.jobApplicationStatus} />
    );
  };
  */
  const getApplicationStatus = () => {
    return (
      <Tag
        value={displayStatus(jobApplication?.jobApplicationStatus)}
        severity={getStatus(jobApplication?.jobApplicationStatus)}
      />
    );
  };

  const handleOnBackClick = () => {
    router.back();
  };

  const updateJobApplication = async (newStatus) => {
    try {
      const request = {
        jobApplicationStatus: newStatus,
      };
      const response = await updateJobApplicationStatus(
        request,
        jobApplicationId,
        accessToken
      );
      console.log("Status is " + response.status);

      if (response.status === 200) {
        router.back();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong! ERROR CODE:" + response.statusCode,
          life: 5000,
        });
      }
      console.log("Status changed successfully:", response);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const createNewChat = async () => {
    // Check if chat exists already
    try {
      const corporateChats = await getAllUserChats(currentUserId, accessToken);
      const matchingChats = corporateChats.filter(
        (chat) => chat?.recruiter?.userId === recruiter?.userId
      );
      let chatId = null;
      if (matchingChats.length === 0) {
        const request = {
          recruiterId: recruiter?.userId,
          corporateId: currentUserId,
          lastUpdated: new Date(),
        };
        const response = await createChat(request, accessToken);
        chatId = response?.chatId;
      } else {
        chatId = matchingChats[0]?.chatId;
      }
      return chatId;
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message, chatId) => {
    try {
      const request = {
        message: message,
        timestamp: new Date(),
        chatId: chatId,
        isImportant: false,
        userId: currentUserId,
        fileURL: "",
      };

      await createChatMessage(request, accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  const hideDialog = () => {
    setUserDialog(false);
  };

  const showUserDialog = (action) => {
    setUserDialog(true);
    setStatus(action);
  };

  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button
        label="Yes"
        icon="pi pi-check"
        outlined
        onClick={() => {
          updateJobApplication(status);
        }}
      />
    </React.Fragment>
  );

  const nodes = [
    {
      key: "0",
      label: "Basic Details",
      children: [
        { key: "0-0", label: `Title: ${jobListing?.title}` },
        { key: "0-1", label: `Overview: ${jobListing?.overview}` },
        { key: "0-2", label: `Location: ${jobListing?.jobLocation}` },
        {
          key: "0-3",
          label: `Job Start Date: ${convertTimestampToDate(
            jobListing?.jobStartDate
          )}`,
        },
      ],
    },
    {
      key: "1",
      label: "Qualifications & Requirements",
      children: [
        {
          key: "1-0",
          label: `Responsibilities: ${jobListing?.responsibilities}`,
        },
        { key: "1-1", label: `Requirements: ${jobListing?.requirements}` },
        {
          key: "1-2",
          label: `Required Documents: ${jobListing?.requiredDocuments}`,
        },
      ],
    },
  ];

  const onDocumentChange = (e) => {
    let _selectedDocuments = [...selectedDocuments];

    if (e.checked) _selectedDocuments.push(e.value);
    else
      _selectedDocuments = _selectedDocuments.filter(
        (document) => document.documentId !== e.value.documentId
      );

    setSelectedDocuments(_selectedDocuments);
  };

  useEffect(() => {
    if (accessToken) {
      getJobSeekersByJobApplicationId(jobApplicationId, accessToken)
        .then((details) => {
          setJobApplication(details);
          setJobSeeker(details.jobSeeker);
          setDocuments(details.documents);
          setJobListing(details.jobListing);
          setRecruiter(details.recruiter);
          setIsLoading(false);
          //console.log(jobApplication);
        })
        .catch((error) => {
          console.error("Error fetching job listings:", error);
          setIsLoading(false);
        });
    }
  }, [accessToken]);

  return (
    <>
      {isLoading && (
        <div className="card flex justify-content-center">
          <ProgressSpinner
            style={{
              display: "flex",
              height: "100vh",
              "justify-content": "center",
              "align-items": "center",
            }}
          />
        </div>
      )}
      {!isLoading && (
        <div className={styles.container}>
          <div className={styles.jobSeekerDetails}>
            {jobSeeker && jobSeeker.profilePictureUrl != "" ? (
              <img
                src={jobSeeker.profilePictureUrl}
                alt="user"
                className={styles.avatar}
              />
            ) : (
              <Image
                src={HumanIcon}
                alt="Profile Picture"
                className={styles.avatar}
              />
            )}
            <Card className={styles.jobSeekerCard} title="Personal Particulars">
              <p className={styles.text}>
                <b>Full Name: </b>
                {jobSeeker?.fullName}
              </p>
              <p className={styles.text}>
                <b>User ID: </b>
                {jobSeeker?.userId}
              </p>
              <p className={styles.text}>
                <b>Contact Number: </b>
                {jobSeeker?.contactNo}
              </p>
              <p className={styles.text}>
                <b>Email Address: </b>
                {jobSeeker?.email}
              </p>
              <p className={styles.text}>
                <b>Date of Birth: </b>
                {convertTimestampToDate(jobSeeker?.dateOfBirth)}
              </p>
              <p className={styles.text}>
                <b>Place of Residence: </b>
                {jobSeeker?.homeAddress}
              </p>
            </Card>
          </div>
          <div className={styles.jobSeekerApplication}>
            <Card className={styles.childCard} title="Job Listing">
              <Dropdown nodes={nodes} />
            </Card>
            <Card
              className={styles.childCard}
              title="Application Details"
              subTitle={getApplicationStatus}
            >
              <div className={styles.dates}>
                <p>
                  <b>Available Dates</b>
                  <br />
                  {convertTimestampToDate(
                    jobApplication?.availableStartDate
                  )}{" "}
                  to {convertTimestampToDate(jobApplication?.availableEndDate)}
                </p>
              </div>
              <div className={styles.checkboxes}>
                <p>
                  {" "}
                  <b>Documents Submitted:</b>
                </p>
                {documents.map((document) => (
                  <div
                    key={document.documentId}
                    className={styles.childCheckbox}
                  >
                    <Checkbox
                      inputId={document.documentId}
                      name="document"
                      value={document}
                      onChange={onDocumentChange}
                      checked={selectedDocuments.some(
                        (item) => item.documentId === document.documentId
                      )}
                    />
                    <label htmlFor={document.documentId} className="ml-2">
                      {document.documentName}
                    </label>
                    <a href={`${document.documentLink}`} target="_blank">
                      <Button
                        icon="pi pi-download"
                        rounded
                        text
                        severity="info"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              className={styles.jobSeekerCard}
              title="Recruiter's Particulars"
            >
              {recruiter && recruiter.profilePictureUrl !== "" ? (
                <img
                  src={recruiter.profilePictureUrl}
                  alt="user"
                  className={styles.avatarRecruiter}
                />
              ) : (
                <Image
                  src={HumanIcon}
                  alt="Profile Picture"
                  className={styles.avatarRecruiter}
                />
              )}
              <p className={styles.text}>
                <b>User ID: </b>
                {recruiter?.userId}
              </p>
              {recruiter?.fullName && (
                <p className={styles.text}>
                  <b>Full Name: </b>
                  {recruiter.fullName}
                </p>
              )}
              <p className={styles.text}>
                <b>Contact Number: </b>
                {recruiter?.contactNo}
              </p>
              <p className={styles.text}>
                <b>Email: </b>
                {recruiter?.email}
              </p>
            </Card>
          </div>
          <div className={styles.buttons}>
            <Button
              label="Back"
              className={styles.backButton}
              icon="pi pi-chevron-left"
              rounded
              severity="primary"
              onClick={() => handleOnBackClick()}
            />
            {jobApplication?.jobApplicationStatus === "Processing" && (
              <div className={styles.subButtons}>
                <Button
                  label="Reject"
                  icon="pi pi-thumbs-down"
                  rounded
                  severity="danger"
                  onClick={() => showUserDialog("offer_Rejected")}
                />
                <Button
                  label="Accept"
                  icon="pi pi-thumbs-up"
                  rounded
                  severity="success"
                  onClick={() => showUserDialog("offer_Accepted")}
                />
                <Button
                  label="Arrange Interview"
                  icon="pi pi-calendar"
                  rounded
                  severity="info"
                  onClick={handleArrangeInterview}
                />

                <Dialog
                  visible={userDialog}
                  style={{ width: "32rem" }}
                  breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                  header="Are you sure?"
                  className="p-fluid"
                  footer={userDialogFooter}
                  onHide={hideDialog}
                ></Dialog>

                <Dialog
                  visible={confirmSendDialog}
                  style={{ width: "32rem" }}
                  header="Are you sure?"
                  className="p-fluid"
                  footer={confirmSendDialogFooter}
                  onHide={hideConfirmSendDialog}
                >
                  {confirmSendDialogContent}
                </Dialog>

                <Dialog
                  visible={showArrangeInterviewDialog}
                  style={{ width: "52rem" }}
                  breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                  header="Arrange Interview"
                  className="p-fluid"
                  footer={arrangeInterviewDialogFooter}
                  onHide={hideArrangeInterviewDialog}
                >
                  <div>
                    <label htmlFor="interviewDate">
                      Choose Interview Date and Time:
                    </label>
                    <Calendar
                      id="interviewDate"
                      showTime
                      showSeconds={false}
                      value={interviewDate}
                      minDate={new Date()}
                      dateFormat="dd/mm/yy"
                      onChange={(e) => setInterviewDate(e.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="interviewNotes">
                      Add Interview details (Including Video meeting links)
                    </label>
                    <InputTextarea
                      id="interviewNotes"
                      value={interviewNotes}
                      onChange={(e) => setInterviewNotes(e.target.value)}
                    />
                  </div>
                  <Button
                    label="Add Interview Date-Time"
                    icon="pi pi-plus"
                    onClick={addInterviewDateTime}
                    className="p-button-success"
                  />
                  {interviewDateTimes.length > 0 && (
                    <div>
                      <label>Selected Interview Date-Times:</label>
                      {renderInterviewDateTimes()}
                    </div>
                  )}
                </Dialog>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewJobApplicationDetails;
