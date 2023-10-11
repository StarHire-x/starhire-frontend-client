import React, { useState } from "react";
import styles from "./editAccountForm.module.css"
import { RadioButton } from "primereact/radiobutton";
import { Card } from "primereact/card";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import Enums from "@/common/enums/enums";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import Following from "../Following/Following";

const EditAccountForm = ({
  formData,
  setFormData,
  handleInputChange,
  handleInputNumberChange,
  handleFileChange,
  saveChanges,
  session,
  removePdf,
  confirmChanges,
  toast,
}) => {

  const educationOptions = [
    { label: "No School", value: "No_School" },
    { label: "High School", value: "High_School" },
    { label: "Bachelor", value: "Bachelor" },
    { label: "Master", value: "Master" },
    { label: "Doctorate", value: "Doctorate" },
  ];

  const visibilityOptions = [
    { label: "Public", value: "Public" },
    { label: "Limited (Hide Sensitive Details)", value: "Limited" },
  ];

  const [showMyFollowingsDialog, setShowMyFollowingsDialog] =
    useState(false);

  const hideMyFollowingsDialog = () => {
    setShowMyFollowingsDialog(false);
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <Card>
        <h1 className={styles.title}>My Account Details</h1>
        {session.data.user.role === Enums.JOBSEEKER && (
          <div className={styles.followingContainer}>
            <Button
              label="My Following"
              severity="info"
              raised
              onClick={() => setShowMyFollowingsDialog(true)}
            />
          </div>
        )}
        <form className={styles.form} onSubmit={confirmChanges}>
          <div className={styles.avatarContainer}>
            {formData?.profilePictureUrl && (
              <img
                src={formData.profilePictureUrl}
                alt="User Profile"
                className={styles.avatar}
              />
            )}
          </div>

          <div className={styles.inputFields}>
            <div className={styles.field}>
              <label htmlFor="userName">User Name:</label>
              <InputText
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email Address:</label>
              <InputText
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="contactNo">Contact Number:</label>
              <InputNumber
                name="contactNo"
                value={formData.contactNo}
                onChange={(e) => handleInputNumberChange("contactNo", e.value)}
                useGrouping={false}
              />
            </div>
            {session.data.user.role === Enums.JOBSEEKER && (
              <>
                <div className={styles.field}>
                  <label htmlFor="fullName">Full Name:</label>
                  <InputText
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="homeAddress">Home Address:</label>
                  <InputText
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="dateOfBirth">Date of Birth:</label>
                  <Calendar
                    id="dateOfBirth"
                    name="dateOfBirth"
                    dateFormat="dd/mm/yy"
                    value={new Date(formData.dateOfBirth)}
                    maxDate={new Date()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dateOfBirth: e.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="highestEducationStatus">
                    Highest Education Status:
                  </label>
                  <Dropdown
                    id="highestEducationStatus" // make sure the htmlFor and id values match for accessibility
                    name="highestEducationStatus"
                    value={formData.highestEducationStatus}
                    options={educationOptions}
                    onChange={handleInputChange}
                    placeholder="Select Education Status"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="instituteName">Education Institution:</label>
                  <InputText
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="dateOfGraduation">Date of Graduation:</label>
                  <Calendar
                    id="dateOfGraduation"
                    name="dateOfGraduation"
                    dateFormat="dd/mm/yy"
                    value={new Date(formData.dateOfGraduation)}
                    maxDate={new Date()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dateOfGraduation: e.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="resumePdf">Upload Resume:</label>
                  <input
                    type="file"
                    id="resumePdf"
                    onChange={handleFileChange}
                  />
                  {formData?.resumePdf && (
                    <div className={styles.pdfButtons}>
                      <Button
                        type="button"
                        icon="pi pi-file-pdf"
                        onClick={(e) => {
                          e.stopPropagation(); // This stops the event from propagating up
                          window.open(formData.resumePdf, "_blank");
                        }}
                        className="p-button-rounded p-button-danger"
                        aria-label="Open PDF"
                      />
                      <Button
                        type="button"
                        label="X"
                        onClick={removePdf}
                        className={`p-button-rounded p-button-danger ${styles.smallButton}`}
                        aria-label="Remove PDF"
                      />
                    </div>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="visibility">Visibility Settings:</label>
                  <Dropdown
                    id="visibility" // make sure the htmlFor and id values match for accessibility
                    name="visibility"
                    value={formData.visibility}
                    options={visibilityOptions}
                    onChange={handleInputChange}
                    placeholder="Select Visibility Options"
                  />
                </div>
              </>
            )}
            {session.data.user.role === Enums.CORPORATE && (
              <>
                <div className={styles.field}>
                  <label htmlFor="companyName">Company Name:</label>
                  <InputText
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="companyAddress">Company Address:</label>
                  <InputText
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            {/* This is just to check the image link */}
            {/* <div className={styles.field}>
            <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
            <input
              type="url"
              id="profilePictureUrl"
              name="profilePictureUrl"
              className={styles.input}
              value={formData.profilePictureUrl}
              onChange={handleInputChange}
            />
            </div> */}

            {/* <div className={styles.field}>
              <label htmlFor="resumePdf">Resume Pdf:</label>
              <input
                type="url"
                id="resumePdf"
                name="resumePdf"
                className={styles.input}
                value={formData.resumePdf}
                onChange={handleInputChange}
              />
            </div> */}
            <div className={styles.field}>
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
              />
            </div>

            <div className={styles.radioFields}>
              <div className={styles.radioHeader}>
                <p>Notifications</p>
              </div>
              <div className={styles.radioOption}>
                <RadioButton
                  inputId="Email"
                  name="notificationMode"
                  value="Email"
                  onChange={handleInputChange}
                  checked={formData.notificationMode === "Email"}
                />
                <label htmlFor="Email" className="ml-2">
                  Email
                </label>
                <br />
                <RadioButton
                  inputId="Sms"
                  name="notificationMode"
                  value="Sms"
                  onChange={handleInputChange}
                  checked={formData.notificationMode === "Sms"}
                />
                <label htmlFor="Sms" className="ml-2">
                  Sms
                </label>
              </div>
            </div>

            <div className={styles.radioFields}>
              <div className={styles.radioHeader}>
                <p>Status</p>
              </div>
              <div className={styles.radioOption}>
                <RadioButton
                  inputId="status"
                  name="status"
                  value={Enums.ACTIVE}
                  onChange={handleInputChange}
                  checked={formData.status === Enums.ACTIVE}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Active
                </label>
                <br />
                <RadioButton
                  inputId="status"
                  name="status"
                  value={Enums.INACTIVE}
                  onChange={handleInputChange}
                  checked={formData.status === Enums.INACTIVE}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button label="Save Changes" severity="success" raised />
          </div>
        </form>
      </Card>

      <Dialog
        header="My Followings"
        visible={showMyFollowingsDialog}
        onHide={hideMyFollowingsDialog}
        className={styles.cardFollowing}
      >
        <Following />
      </Dialog>
    </div>
  );
};

export default EditAccountForm;
