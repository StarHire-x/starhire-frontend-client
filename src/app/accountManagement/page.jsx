"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getMyFollowings,
  getUserByUserId,
  updateUser,
} from "../api/auth/user/route";
import { uploadFile } from "../api/upload/route";
import styles from "./page.module.css";
import { UserContext } from "@/context/UserContext";
import { Button } from "primereact/button";
import EditAccountForm from "@/components/EditAccountForm/EditAccountForm";
import CollectJobSeekerInfoForm from "@/components/CollectJobSeekerInfoForm/CollectJobSeekerInfoForm";
import CollectCorporateInfoForm from "@/components/CollectCorporateInfoForm/CollectCorporateInfoForm";
import JobPreferencePanel from "@/components/JobPreferencePanel/JobPreferencePanel";
import { getExistingJobPreference } from "../api/preference/route";
import { getJobExperience } from "../api/jobExperience/route";
import JobExperiencePanel from "@/components/JobExperiencePanel/JobExperiencePanel";
import { Dialog } from "primereact/dialog";
import Enums from "@/common/enums/enums";
import {
  fetchTypeFormResponsesCorporate,
  fetchTypeFormResponsesJobSeeker,
} from "../api/typeform/routes";

const AccountManagement = () => {
  const session = useSession();
  const router = useRouter();
  const [refreshData, setRefreshData] = useState(false);
  const [jobExperience, setJobExperience] = useState([]);
  const [deactivateAccountDialog, setDeactivateAccountDialog] = useState(false);
  const [typeformSubmitted, setTypeformSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Common Fields
    userId: "",
    userName: "",
    email: "",
    firstName: "",
    profilePictureUrl: "",
    notificationMode: "",
    status: "",
    contactNo: "",

    // Corporate Fields
    schoolName: "",
    schoolCategory: "",
    companyAddress: "",
    postalCode: "",
    companyRegistrationId: "",
    regions: "",

    //Job Seeker Fields
    jobPreferenceId: "",
    resumePdf: "",
    benefitPreference: 0,
    salaryPreference: 0,
    workLifeBalancePreference: 0,
    jobExperienceId: "",
    employerName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    jobDescription: "",
    highestEducationStatus: "",
    visibilityOptions: "",
    country: "",
    description: "",
    proficientLanguages: "",
    experience: "",
    certifications: "",
    recentRole: "",
    preferredRegions: "",
    preferredJobType: "",
    preferredSchedule: "",
    payRange: "",
    visaRequirements: "",
    ranking: "",
    otherInfo: "",
  });

  const toast = useRef(null);

  // this is to do a reload of userContext if it is updated in someway
  const { userData, fetchUserData } = useContext(UserContext);

  const [isJobPreferenceAbsent, setIsJobPreferenceAbsent] = useState(false);

  // Cap the number of stars
  const [totalStarsUsed, setTotalStarsUsed] = useState(0);

  const [numOfFollowings, setNumOfFollowings] = useState("0");

  let roleRef, sessionTokenRef, userIdRef;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

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
            roleRef,
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
            setIsJobPreferenceAbsent(true);
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

      const retrieveTypeformSubmissionJobSeeker = async (email) => {
        const response = await fetchTypeFormResponsesJobSeeker(
          sessionTokenRef,
          email
        );
        return response;
      };

      const retrieveTypeformSubmissionCorporate = async (email) => {
        const response = await fetchTypeFormResponsesCorporate(
          sessionTokenRef,
          email
        );
        return response;
      };

      getMyFollowings(userIdRef, sessionTokenRef)
        .then((data) => {
          setNumOfFollowings(data);
        })
        .catch((error) => {
          console.log("Error fetching followings of user: ", error.message);
        });

      populateFormDataWithUserInfo(formData).then((formDataWithUserInfo) =>
        populateFormDataWithUserPreference(formDataWithUserInfo)
      );
      retrieveJobExperience().then((result) => setJobExperience(result));

      if (session.data.user.role === "Corporate") {
        retrieveTypeformSubmissionCorporate(session.data.user.email).then(
          (result) => {
            if (result) {
              setTypeformSubmitted(true);
            }
          }
        );
      } else {
        retrieveTypeformSubmissionJobSeeker(session.data.user.email).then(
          (result) => {
            console.log("result");
            console.log(result);
            if (result) {
              setTypeformSubmitted(true);
            }
          }
        );
      }
    }
  }, [session.status, userIdRef, roleRef, refreshData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputNumberChange = (name, value) => {
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
    //e.preventDefault();
    const userId = formData.userId;

    const updateUserDetails = {
      // Common Fields
      role: roleRef,
      email: formData.email,
      userName: formData.userName,
      firstName: formData.firstName,
      contactNo: formData.contactNo,
      visibility: formData.visibility,
      profilePictureUrl: formData.profilePictureUrl,
      notificationMode: formData.notificationMode,
      status: formData.status,

      // Job Seeker Fields
      resumePdf: formData.resumePdf,
      highestEducationStatus: formData.highestEducationStatus,
      country: formData.country, 
      proficientLanguages: formData.proficientLanguages,
      experience: formData.experience,
      certifications: formData.certifications, 
      recentRole: formData.recentRole, 
      startDate: formData.startDate, 
      preferredRegions: formData.preferredRegions,
      preferredJobType: formData.preferredJobType, 
      preferredSchedule: formData.preferredSchedule, 
      payRange: formData.payRange, 
      visaRequirements: formData.visaRequirements,
      ranking: formData.ranking, 
      otherInfo: formData.otherInfo, 

      // Corporate Fields
      schoolName: formData.schoolName,
      schoolCategory: formData.schoolCategory,
      companyAddress: formData.companyAddress,
      postalCode: formData.postalCode,
      companyRegistrationId: formData.companyRegistrationId,
      regions: formData.regions,
    };

    if (formData.contactNo && formData.contactNo.toString().length !== 8) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Contact number must contain 8 digits.",
        life: 5000,
      });
    } else {
      try {
        console.log(userId);
        console.log(updateUserDetails);

        const response = await updateUser(
          updateUserDetails,
          userId,
          sessionTokenRef
        );

        if (response) {
          //alert("Status changed successfully!");
          if (deactivateAccountDialog) {
            hideDeactivateAccountDialog();
          }
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Account details updated successfully!",
            life: 5000,
          });
          setRefreshData((prev) => !prev);
          // this is to do a reload of userContext if it is updated so that navbar can change
          fetchUserData();
        }
      } catch (error) {
        console.log("Failed to update user");
        // alert("Failed to update user particulars");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 5000,
        });
      }
    }
  };
  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        {roleRef === Enums.JOBSEEKER && !typeformSubmitted && (
          <CollectJobSeekerInfoForm
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            email={session.data.user.email}
            accessToken={sessionTokenRef}
          />
        )}
        {roleRef === Enums.JOBSEEKER && typeformSubmitted && (
          <EditAccountForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleInputNumberChange={handleInputNumberChange}
            handleFileChange={handleFileChange}
            saveChanges={saveChanges}
            session={session}
            removePdf={removePdf}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            confirmChanges={confirmChanges}
            numOfFollowings={numOfFollowings}
            toast={toast}
          />
        )}
        {roleRef === Enums.CORPORATE && !typeformSubmitted && (
          <CollectCorporateInfoForm
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            email={session.data.user.email}
            accessToken={sessionTokenRef}
          />
        )}
        {roleRef === Enums.CORPORATE && typeformSubmitted && (
          <EditAccountForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleInputNumberChange={handleInputNumberChange}
            handleFileChange={handleFileChange}
            saveChanges={saveChanges}
            session={session}
            removePdf={removePdf}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            confirmChanges={confirmChanges}
            numOfFollowings={numOfFollowings}
            toast={toast}
          />
        )}

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
        <JobPreferencePanel
          formData={formData}
          setFormData={setFormData}
          sessionTokenRef={sessionTokenRef}
          roleRef={roleRef}
          setRefreshData={setRefreshData}
          isJobPreferenceAbsent={isJobPreferenceAbsent}
          setIsJobPreferenceAbsent={setIsJobPreferenceAbsent}
          totalStarsUsed={totalStarsUsed}
          setTotalStarsUsed={setTotalStarsUsed}
        />
        <br />
        {roleRef === Enums.JOBSEEKER && (
          <>
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
