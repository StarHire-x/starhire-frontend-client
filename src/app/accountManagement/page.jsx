"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserByUserId, updateUser } from "../api/auth/user/route";
import { uploadFile } from "../api/upload/route";
import styles from "./page.module.css";
import { UserContext } from "@/context/UserContext";
import { RadioButton } from "primereact/radiobutton";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import EditAccountForm from "@/components/EditAccountForm/EditAccountForm";
import JobPreferencePanel from "@/components/JobPreferencePanel/JobPreferencePanel";
import { getExistingJobPreference } from "../api/preference/route";
import { getJobExperience } from "../api/jobExperience/route";
import JobExperiencePanel from "@/components/JobExperiencePanel/JobExperiencePanel";
import { Dialog } from "primereact/dialog";
import Enums from "@/common/enums/enums";

const AccountManagement = () => {
  const session = useSession();
  const router = useRouter();
  const [refreshData, setRefreshData] = useState(false);
  const [jobExperience, setJobExperience] = useState([]);
  const [deactivateAccountDialog, setDeactivateAccountDialog] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    fullName: "",
    homeAddress: "",
    companyName: "",
    companyAddress: "",
    profilePictureUrl: "",
    notificationMode: "",
    status: "",
    contactNo: "",
    dateOfBirth: "",
    instituteName: "",
    dateOfGraduation: "",
    jobPreferenceId: "",
    resumePdf: "",
    locationPreference: 0,
    salaryPreference: 0,
    culturePreference: 0,
    diversityPreference: 0,
    workLifeBalancePreference: 0,
    jobExperienceId: "",
    employerName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    jobDescription: "",
    highestEducationStatus: "",
    visibilityOptions: "",
  });

  // this is to do a reload of userContext if it is updated in someway
  const { userData, fetchUserData } = useContext(UserContext);

  const [isJobPreferenceAbsent, setIsJobPreferenceAbsent] = useState(false);

  // Cap the number of stars
  const [totalStarsUsed, setTotalStarsUsed] = useState(0);

  let roleRef, sessionTokenRef, userIdRef;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0 based
  //   const year = date.getFullYear();
  //   return `${year}-${month}-${day}`; // NOTE: Changed format
  // };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    } else if (session.status !== "loading") {
      const populateFormDataWithUserInfo = async (formData) => {
        try {
          const response = await getUserByUserId(
            userIdRef,
            roleRef,
            sessionTokenRef
          );
          for (const key in response.data) {
            formData[key] = response.data[key];
          }
          setFormData(formData);
          return formData;
        } catch (error) {
          console.log("Error fetching user Info: ", error.message);
        }
      };

      const populateFormDataWithUserPreference = async (formData) => {
        try {
          const response = await getExistingJobPreference(
            userIdRef,
            sessionTokenRef
          );
          if (response.statusCode === 200) {
            for (const key in response.data) {
              formData[key] = response.data[key];
            }
            setFormData(formData);
            const { jobPreferenceId, ...currentPreference } = response.data;
            const currentStarsUsed = Object.keys(currentPreference).reduce(
              (total, key) => total + currentPreference[key],
              0
            );
            setTotalStarsUsed(currentStarsUsed);
            return formData;
          } else {
            // 404 returned- User has no job preference
            setIsJobPreferenceAbsent(true)
          }
        } catch (error) {
          console.log("Error fetching user preference: ", error.message);
        }
      };

      const retrieveJobExperience = async () => {
        try {
          const response = await getJobExperience(userIdRef, sessionTokenRef);
          if (response.statusCode === 200) {
            return response.data;
          }
        } catch (error) {
          console.log("Error fetching user job experience: ", error.message);
        }
      };


      populateFormDataWithUserInfo(formData).then((formData) =>
        populateFormDataWithUserPreference(formData)
      );
      retrieveJobExperience().then((result) => setJobExperience(result));

    }
  }, [session.status, userIdRef, roleRef, refreshData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const inputId = e.target.id; // Get the ID of the input that triggered the event
    if (!file) return;
    try {
      const response = await uploadFile(file, sessionTokenRef);

      if (inputId === "profilePicture") {
        setFormData((prevState) => ({
          ...prevState,
          profilePictureUrl: response.url,
        }));
      } else if (inputId === "resumePdf") {
        setFormData((prevState) => ({
          ...prevState,
          resumePdf: response.url,
        }));
      }
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const removePdf = () => {
    setFormData((prevState) => ({
      ...prevState,
      resumePdf: "",
    }));
  };

  const hideDeactivateAccountDialog = () => {
    setDeactivateAccountDialog(false);
  };

  const deactivateAccountDialogFooter = () => (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        rounded
        outlined
        onClick={hideDeactivateAccountDialog}
      />
      <Button label="Yes" rounded icon="pi pi-check" onClick={saveChanges} />
    </React.Fragment>
  );

  const confirmChanges = async (e) => {
    e.preventDefault();
    if (formData.status === Enums.INACTIVE) {
      setDeactivateAccountDialog(true);
    } else {
      await saveChanges();
    }
  };

  const saveChanges = async (e) => {
    // e.preventDefault();
    const userId = formData.userId;

    const updateUserDetails = {
      role: roleRef,
      email: formData.email,
      userName: formData.userName,
      fullName: formData.fullName,
      homeAddress: formData.homeAddress,
      companyName: formData.companyName,
      companyAddress: formData.companyAddress,
      contactNo: formData.contactNo,
      dateOfBirth: formData.dateOfBirth,
      profilePictureUrl: formData.profilePictureUrl,
      resumePdf: formData.resumePdf,
      notificationMode: formData.notificationMode,
      status: formData.status,
      instituteName: formData.instituteName,
      dateOfGraduation: formData.dateOfGraduation,
      highestEducationStatus: formData.highestEducationStatus,
      visibility: formData.visibility,
    };
    try {
      console.log(userId);
      console.log(updateUserDetails);
      const response = await updateUser(
        updateUserDetails,
        userId,
        sessionTokenRef
      );

      if (response) {
        alert("Status changed successfully!");
        if (deactivateAccountDialog) {
          hideDeactivateAccountDialog();
        }
        setRefreshData((prev) => !prev);
        // this is to do a reload of userContext if it is updated so that navbar can change
        fetchUserData();
      }
    } catch {
      console.log("Failed to update user");
      alert("Failed to update user particulars");
    }
  };
  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        <EditAccountForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          saveChanges={saveChanges}
          session={session}
          removePdf={removePdf}
          confirmChanges={confirmChanges}
        />
        <Dialog
          visible={deactivateAccountDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Warning on self-deactivation of account"
          className="p-fluid"
          footer={deactivateAccountDialogFooter}
          onHide={hideDeactivateAccountDialog}
        >
          <p>
            You may have accidentally selected Inactive for your account status.
            Are you sure you want to deactivate your account? Please note that
            this action is irreversible, and you need to contact our Admin to
            activate back your account if needed.
          </p>
        </Dialog>
        <br />
        {roleRef === Enums.JOBSEEKER && (
          <>
            <JobPreferencePanel
              formData={formData}
              setFormData={setFormData}
              sessionTokenRef={sessionTokenRef}
              setRefreshData={setRefreshData}
              isJobPreferenceAbsent={isJobPreferenceAbsent}
              setIsJobPreferenceAbsent={setIsJobPreferenceAbsent}
              totalStarsUsed={totalStarsUsed}
              setTotalStarsUsed={setTotalStarsUsed}
            />
            <br />
            <JobExperiencePanel
              formData={formData}
              setFormData={setFormData}
              sessionTokenRef={sessionTokenRef}
              setRefreshData={setRefreshData}
              jobExperience={jobExperience}
              handleInputChange={handleInputChange}
            />
          </>
        )}
      </div>
    );
  }
};

export default AccountManagement;
