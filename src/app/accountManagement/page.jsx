"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserByUserId, updateUser } from "../api/auth/user/route";
import { uploadFile } from "../api/auth/upload/route";
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
import {
  createJobPreference,
  getExistingJobPreference,
  updateJobPreference,
} from "../api/auth/preference/route";
import { getJobExperience } from "../api/auth/jobExperience/route";
import JobExperiencePanel from "@/components/JobExperiencePanel/JobExperiencePanel";

const AccountManagement = () => {
  const session = useSession();
  const router = useRouter();
  const [refreshData, setRefreshData] = useState(false);
  const [jobExperience, setJobExperience] = useState([]);
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
    visibilityOptions: ""
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
      getUserByUserId(userIdRef, roleRef, sessionTokenRef)
        .then((user) => {
          // const formattedDOB = formatDate(user.data.dateOfBirth);
          setFormData(user.data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });

      getExistingJobPreference(userIdRef, sessionTokenRef).then((response) => {
        if (response.status === 200) {
          setFormData((prevState) => ({
            ...prevState,
            ...preference.data,
          }));
        } else {
          console.error("Error fetching job preference:", response.json());
          setIsJobPreferenceAbsent(true);
        }
      });

      // Set Job Experience testing code
      getJobExperience(userIdRef, sessionTokenRef)
        .then((jobExp) => {
          setJobExperience(jobExp.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
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

  const saveChanges = async (e) => {
    e.preventDefault();
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
      visibility: formData.visibility
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
        />
        <br />
        {roleRef === "Job_Seeker" && (
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
