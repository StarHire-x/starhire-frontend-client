import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./CreateResumeModal.module.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Enums from "@/common/enums/enums";
import { Tag } from "primereact/tag";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchData } from "next-auth/client/_utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/navigation";
import { TabMenu } from "primereact/tabmenu";
import { Checkbox } from "primereact/checkbox";
import { getJobSeekerInformation, updateUser } from "@/app/api/auth/user/route";
import { generateResume } from "@/app/api/upload/route";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";

const CreateResumeModal = ({ accessToken, userId, roleRef }) => {
  const toast = useRef(null);

  const cardHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 className={styles.cardHeader}>Generate Resume</h2>
      </div>
    );
  };

  const [jobSeekerData, setJobSeekerData] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const toggleConfirmDialog = () => {
    setShowConfirmDialog(!showConfirmDialog);
  };

  const confirmCreateResume = (e) => {
    createResume(e);
    toggleConfirmDialog();
  };

  const handleCreateResumeClick = (e) => {
    e.preventDefault();
    toggleConfirmDialog();
  };

  const createResume = async (e) => {
    e.preventDefault();

    try {
      console.log(JSON.stringify(jobSeekerData));
      const resumeUrl = await generateResume(jobSeekerData, accessToken);

      console.log(resumeUrl);

      const updateUserDetails = {
        role: roleRef,
        resumePdf: resumeUrl.url,
      };

      const response = await updateUser(updateUserDetails, userId, accessToken);

      if (response) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Resume created successfully!",
          life: 5000,
        });
      }
    } catch (error) {
      console.log("Failed to create resume");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
  };

  const totalCheckboxes = 10; // Total number of checkboxes
  const checkedCount = [
    jobSeekerData.fullName,
    jobSeekerData.contactNo,
    jobSeekerData.email,
    jobSeekerData.instituteName,
    jobSeekerData.dateOfGraduation,
    jobSeekerData.highestEducationStatus,
    jobSeekerData.proficientLanguages,
    jobSeekerData.experience,
    jobSeekerData.certifications,
    jobSeekerData.jobExperiences && jobSeekerData.jobExperiences.length > 0,
  ].filter(Boolean).length; // This will count how many of these are truthy (checked)

  const progressPercentage = (checkedCount / totalCheckboxes) * 100;

  useEffect(() => {
    const fetchData = async () => {
      const information = await getJobSeekerInformation(userId, accessToken);
      setJobSeekerData(information);
    };

    fetchData();
  }, [accessToken, userId]);

  return (
    <div className={styles.mainContainer}>
      <Toast ref={toast} />
      <Card className="md:w-50rem" header={cardHeader}>
        <div className="card flex flex-wrap justify-content-center gap-3">
          <h3>Resume Completion Status</h3>
          <ProgressBar value={progressPercentage}></ProgressBar>
          <br />
          <h3>Personal Particulars</h3>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox1"
              name="fullName"
              checked={jobSeekerData.fullName !== ""}
            />
            <label htmlFor="checkBox1" className="ml-2">
              Full Name
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox2"
              name="contactNo"
              checked={jobSeekerData.contactNo !== ""}
            />
            <label htmlFor="checkBox2" className="ml-2">
              Contact Number
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox3"
              name="email"
              checked={jobSeekerData.email !== ""}
            />
            <label htmlFor="checkBox3" className="ml-2">
              Email Address
            </label>
          </div>
          <br />
          <h3>Education Details</h3>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox4"
              name="contactNo"
              checked={jobSeekerData.instituteName !== ""}
            />
            <label htmlFor="checkBox4" className="ml-2">
              Name of Institution
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox5"
              name="dateOfGraduation"
              checked={jobSeekerData.dateOfGraduation !== null}
            />
            <label htmlFor="checkBox5" className="ml-2">
              Date of Graduation
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox6"
              name="highestEducationStatus"
              checked={jobSeekerData.highestEducationStatus !== ""}
            />
            <label htmlFor="checkBox6" className="ml-2">
              Highest Education Status
            </label>
          </div>
          <br />
          <h3>Skills and Professional Certificates</h3>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox7"
              name="proficientLanguages"
              checked={jobSeekerData.proficientLanguages !== ""}
            />
            <label htmlFor="checkBox7" className="ml-2">
              Proficient Languages
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox8"
              name="experience"
              checked={jobSeekerData.experience !== ""}
            />
            <label htmlFor="checkBox8" className="ml-2">
              Teaching Experience
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox9"
              name="certifications"
              checked={jobSeekerData.certifications !== ""}
            />
            <label htmlFor="checkBox9" className="ml-2">
              Certifications
            </label>
          </div>
          <br />
          <h3>Work Experiences</h3>
          <div className="flex align-items-center">
            <Checkbox
              inputId="checkBox7"
              name="proficientLanguages"
              checked={
                jobSeekerData.jobExperiences &&
                jobSeekerData.jobExperiences.length > 0
              }
            />
            <label htmlFor="checkBox7" className="ml-2">
              1 or more work experience
            </label>
          </div>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            label="Create Resume"
            severity="success"
            raised
            onClick={handleCreateResumeClick}
          />
        </div>
      </Card>
      <Dialog
        visible={showConfirmDialog}
        onHide={toggleConfirmDialog}
        header="Confirm Resume Creation"
        modal
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={toggleConfirmDialog}
              className="p-button-text"
            />
            <Button
              label="Confirm"
              icon="pi pi-check"
              onClick={confirmCreateResume}
              autoFocus
            />
          </div>
        }
      >
        <p>
          Please confirm if you wish to proceed with creating your new resume.
        </p>
        <p>Your action will overwrite your existing resume in our system.</p>
        <p>Do you want to continue?</p>
      </Dialog>
    </div>
  );
};

export default CreateResumeModal;
