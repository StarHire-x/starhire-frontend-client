import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import styles from "./JobExperiencePanel.module.css"
import CreateJobExperienceForm from "../CreateJobExperienceForm/CreateJobExperienceForm";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import {
  createJobExperience,
  updateJobExperience,
  deleteJobExperience
} from "@/app/api/jobExperience/route";
import EditJobExperienceForm from "../EditJobExperienceForm/EditJobExperienceForm";

const JobExperiencePanel = ({
  formData,
  setFormData,
  jobExperience,
  sessionTokenRef,
  setRefreshData,
  handleInputChange,
}) => {

  const [showCreateJobExperienceDialog, setShowCreateJobExperienceDialog] =
    useState(false);
  const [showEditJobExperienceDialog, setShowEditJobExperienceDialog] =
    useState(false);
  const [showDeleteJobExperienceDialog, setShowDeleteJobExperienceDialog] =
    useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [selectedJobExperienceData, setSelectedJobExperienceData] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const initialFormData = {
    userId: "",
    employerName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    jobDescription: "",
  };

  const jobExperienceHeader = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 className={styles.headerTitle}>My Job Experience</h2>
      <div>
        <Dropdown
          value={sortKey}
          options={[
            { label: "Start Date", value: "startDate" },
            { label: "Job Title", value: "jobTitle" },
          ]}
          onChange={(e) => setSortKey(e.value)}
          placeholder="Sort By"
        />
        <Dropdown
          value={sortOrder}
          options={[
            { label: "Asc", value: 1 },
            { label: "Desc", value: -1 },
          ]}
          onChange={(e) => setSortOrder(e.value)}
          placeholder="Order"
        />
      </div>
      <Button
        icon="pi pi-plus"
        rounded
        severity="success"
        onClick={() => setShowCreateJobExperienceDialog(true)}
      />
    </div>
  );

  const sortFunction = (data) => {
    if (sortKey && sortOrder) {
      return [...data].sort((a, b) => {
        const value1 = a[sortKey];
        const value2 = b[sortKey];
        if (value1 < value2) return -1 * sortOrder;
        if (value1 > value2) return 1 * sortOrder;
        return 0;
      });
    }
    return data;
  };

  const hideCreateJobExperienceDialog = () => {
    setShowCreateJobExperienceDialog(false);
  };

  const hideEditJobExperienceDialog = () => {
    setShowEditJobExperienceDialog(false);
  }

  const hideDeleteJobExperienceDialog = () => {
    setShowDeleteJobExperienceDialog(false);
  }

  const deleteDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() =>
          removeJobExperience(selectedJobExperienceData.jobExperienceId)
        }
      />
    </React.Fragment>
  );

  const addJobExperience = async (e) => {
    e.preventDefault();
    const userId = formData.userId;

    console.log("Hello")

    if (Object.keys(formErrors).length > 0) {
      // There are validation errors
      alert("Please fix the form errors before submitting.");
      return;
    }

    let reqBody;

    if(formData.endDate === "null") {
      reqBody = {
        jobSeekerId: userId,
        employerName: formData.employerName,
        jobTitle: formData.jobTitle,
        startDate: formData.startDate,
        jobDescription: formData.jobDescription,
      };
    } else {
      reqBody = {
        jobSeekerId: userId,
        employerName: formData.employerName,
        jobTitle: formData.jobTitle,
        startDate: formData.startDate,
        endDate: formData.endDate,
        jobDescription: formData.jobDescription,
      };
    }

    console.log(reqBody);
    try {
      const response = await createJobExperience(reqBody, sessionTokenRef);
      if (!response.error) {
        console.log("Job experience created successfully:", response);
        alert("Job experience created successfully!");
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      alert(error.message)
    }
    setFormData(initialFormData);
    setShowCreateJobExperienceDialog(false);
  };

  const editJobExperience = async (e) => {
    e.preventDefault();
    const jobExperienceId = formData.jobExperienceId;

    if (Object.keys(formErrors).length > 0) {
      // There are validation errors
      alert("Please fix the form errors before submitting.");
      return;
    }

    let reqBody;

    if (formData.endDate === "null") {
      reqBody = {
        employerName: formData.employerName,
        jobTitle: formData.jobTitle,
        startDate: formData.startDate,
        endDate: null,
        jobDescription: formData.jobDescription,
      };
    } else {
      reqBody = {
        employerName: formData.employerName,
        jobTitle: formData.jobTitle,
        startDate: formData.startDate,
        endDate: formData.endDate,
        jobDescription: formData.jobDescription,
      };
    }
    
    try {
      const response = await updateJobExperience(
        jobExperienceId, 
        reqBody,
        sessionTokenRef
      );
      if (!response.error) {
        console.log("Job experience updated successfully:", response);
        alert("Job experience updated successfully!");
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      alert(error.message);
    }
    setSelectedJobExperienceData(null);
    setShowEditJobExperienceDialog(false);
  }

  const removeJobExperience = async (jobExperienceId) => {
    try {
      const response = await deleteJobExperience(jobExperienceId, sessionTokenRef)
      console.log('User is deleted', response);
      alert('Deleted job experience successfully');
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error deleting job experience:", error);
      alert("There was an error deleting the job experience:");
    }
    setSelectedJobExperienceData(null);
    setShowDeleteJobExperienceDialog(false);
  };

  const itemTemplate = (jobExperience) => {
    return (
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <h4>{jobExperience.jobTitle}</h4>
            <h4 className={styles.hideOnMobile}>|</h4>
            <h4>{jobExperience.employerName}</h4>
          </div>
          <div className={styles.cardHeaderRight}>
            <h4>{formatDate(jobExperience.startDate)}</h4>
            <h4 className={styles.hideOnMobile}>-</h4>
            <h4>
              {formatDate(jobExperience.endDate) === "01/01/1970"
                ? "Present"
                : formatDate(jobExperience.endDate)}
            </h4>
          </div>
        </div>
        <div className={styles.cardDescription}>
          <p>{jobExperience.jobDescription}</p>
        </div>
        <div className={styles.cardFooter}>
          <Button
            label="Edit"
            icon="pi pi-pencil"
            severity="success"
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedJobExperienceData(jobExperience);
              setShowEditJobExperienceDialog(jobExperience);
            }}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedJobExperienceData(jobExperience);
              setShowDeleteJobExperienceDialog(jobExperience);
            }}
          />
        </div>
      </Card>
    );
  };

  return (
    <Panel header="Job Experience" toggleable>
      <div className={styles.container}>
        <DataView
          value={sortFunction(jobExperience)}
          className={styles.dataViewContainer}
          layout="grid"
          rows={3}
          header={jobExperienceHeader}
          itemTemplate={itemTemplate}
        ></DataView>

        <Dialog
          header="Create Job Experience"
          visible={showCreateJobExperienceDialog}
          onHide={hideCreateJobExperienceDialog}
          className={styles.cardDialog}
        >
          <CreateJobExperienceForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            addJobExperience={addJobExperience}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
        </Dialog>

        <Dialog
          header="Edit Job Experience"
          visible={showEditJobExperienceDialog}
          onHide={hideEditJobExperienceDialog}
          className={styles.cardDialog}
        >
          <EditJobExperienceForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            editJobExperience={editJobExperience}
            selectedJobExperience={selectedJobExperienceData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
        </Dialog>

        <Dialog
          header="Delete Job Experience"
          visible={showDeleteJobExperienceDialog}
          onHide={hideDeleteJobExperienceDialog}
          className={styles.cardDialog}
          footer={deleteDialogFooter}
        >
          <h3>
            Confirm Delete Job Experience:{" "}
            {showDeleteJobExperienceDialog &&
              showDeleteJobExperienceDialog.jobTitle}
            ,
            {showDeleteJobExperienceDialog &&
              showDeleteJobExperienceDialog.employerName}
          </h3>
        </Dialog>
      </div>
    </Panel>
  );
};

export default JobExperiencePanel;