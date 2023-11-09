import React, { useState } from "react";
import styles from "./editAccountForm.module.css";
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
  numOfFollowings,
  toast,
  refreshData,
  setRefreshData,
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

  const [showMyFollowingsDialog, setShowMyFollowingsDialog] = useState(false);

  const hideMyFollowingsDialog = () => {
    setShowMyFollowingsDialog(false);
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <Card className={styles.card}>
        <p className={styles.title}>My Account Details</p>
        {session.data.user.role === Enums.JOBSEEKER && (
          <div className={styles.followingContainer}>
            <Button
              label="My Following"
              severity="info"
              outlined
              badge={numOfFollowings}
              badgeClassName="p-badge-success"
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
          <div>
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
                  onChange={(e) =>
                    handleInputNumberChange("contactNo", e.value)
                  }
                  useGrouping={false}
                />
              </div>
            </div>

            {session.data.user.role === Enums.JOBSEEKER && (
              <div className={styles.inputFields}>
                <div className={styles.field}>
                  <label htmlFor="firstName">First Name:</label>
                  <InputText
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="country">Country:</label>
                  <InputText
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
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
                  <label htmlFor="proficientLanguages">
                    Proficient Languages:
                  </label>
                  <InputText
                    name="proficientLanguages"
                    value={formData.proficientLanguages}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="experience">Experience Level:</label>
                  <InputText
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="certifications">Certifications:</label>
                  <InputText
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="recentRole">Recent Role:</label>
                  <InputText
                    name="recentRole"
                    value={formData.recentRole}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="startDate">Job Start Date:</label>
                  <Calendar
                    id="startDate"
                    name="startDate"
                    dateFormat="dd/mm/yy"
                    value={new Date(formData.startDate)}
                    maxDate={new Date()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="preferredRegions">Preferred Regions:</label>
                  <InputText
                    name="preferredRegions"
                    value={formData.preferredRegions}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="preferredJobType">Preferred Job Type:</label>
                  <InputText
                    name="preferredJobType"
                    value={formData.preferredJobType}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="preferredSchedule">Preferred Schedule:</label>
                  <InputText
                    name="preferredSchedule"
                    value={formData.preferredSchedule}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="payRange">Expected Pay:</label>
                  <InputText
                    name="payRange"
                    value={formData.payRange}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="visaRequirements">Visa Requirements:</label>
                  <InputText
                    name="visaRequirements"
                    value={formData.visaRequirements}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="ranking">Ranking:</label>
                  <InputText
                    name="ranking"
                    value={formData.ranking}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="otherInfo">Other Information:</label>
                  <InputText
                    name="otherInfo"
                    value={formData.otherInfo}
                    onChange={handleInputChange}
                  />
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
              </div>
            )}
            {session.data.user.role === Enums.CORPORATE && (
              <div className={styles.inputFields}>
                <div className={styles.field}>
                  <label htmlFor="firstName">First Name:</label>
                  <InputText
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="schoolName">Scbool Name:</label>
                  <InputText
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="schoolCategory">School Category:</label>
                  <InputText
                    name="schoolCategory"
                    value={formData.schoolCategory}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="companyAddress">School Address:</label>
                  <InputText
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="postalCode">Postal Code:</label>
                  <InputText
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="companyRegistrationId">UEN number:</label>
                  <InputText
                    name="companyRegistrationId"
                    value={formData.companyRegistrationId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="firstName">Regions:</label>
                  <InputText
                    name="regions"
                    value={formData.regions}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            <div className={styles.inputFields}>
              <div className={styles.field}>
                <label htmlFor="profilePicture">Profile Picture:</label>
                <input
                  type="file"
                  id="profilePicture"
                  onChange={handleFileChange}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="resumePdf">Upload Resume:</label>
                <input type="file" id="resumePdf" onChange={handleFileChange} />
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
            </div>
            <div className={styles.inputFields}>
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
          </div>

          <div>
            <Button label="Save" className={styles.customButton} raised />
          </div>
        </form>
      </Card>

      <Dialog
        header="My Followings"
        visible={showMyFollowingsDialog}
        onHide={hideMyFollowingsDialog}
        className={styles.cardFollowing}
      >
        <Following refreshData={refreshData} setRefreshData={setRefreshData} />
      </Dialog>
    </div>
  );
};

export default EditAccountForm;
