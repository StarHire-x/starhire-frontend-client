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
import JobExperiencePanel from "@/components/JobExperiencePanel/JobExperiencePanel";

const AccountManagement = () => {
  const session = useSession();
  const router = useRouter();
  const [refreshData, setRefreshData] = useState(false);
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
    jobPreferenceId: "",
    resumePdf: "",
    locationPreference: 0,
    salaryPreference: 0,
    culturePreference: 0,
    diversityPreference: 0,
    workLifeBalancePreference: 0,
  });

  // this is to do a reload of userContext if it is updated in someway
  const { userData, fetchUserData } = useContext(UserContext);

  const [isJobPreferenceAbsent, setIsJobPreferenceAbsent] = useState(false);

  let roleRef, sessionTokenRef, userIdRef;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0 based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // NOTE: Changed format
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    } else if (session.status !== "loading") {
      getUserByUserId(userIdRef, roleRef, sessionTokenRef)
        .then((user) => {
          const formattedDOB = formatDate(user.data.dateOfBirth);
          setFormData({ ...user.data, dateOfBirth: formattedDOB });
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });

      getExistingJobPreference(userIdRef, sessionTokenRef)
        .then((preference) => {
          setFormData((prevState) => ({
            ...prevState,
            ...preference.data,
          }));
        })
        .catch((error) => {
          console.error("Error fetching job preference:", error);
          setIsJobPreferenceAbsent(true);
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

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   try {
  //     const response = await uploadFile(file, sessionTokenRef);
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       profilePictureUrl: response.url,
  //     }));
  //   } catch (error) {
  //     console.error("There was an error uploading the file", error);
  //   }
  // };

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
    };
    try {
      console.log(userId);
      console.log(updateUserDetails);
      const response = await updateUser(
        updateUserDetails,
        userId,
        sessionTokenRef
      );

      if(response) {
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

  const newJobPreferences = async (e) => {
    e.preventDefault();
    const userId = formData.userId;

    const reqBody = {
      jobSeekerId: userId,
      locationPreference: formData.locationPreference,
      culturePreference: formData.culturePreference,
      salaryPreference: formData.salaryPreference,
      diversityPreference: formData.diversityPreference,
      workLifeBalancePreference: formData.workLifeBalancePreference,
    };

    try {
      console.log(userId);
      console.log(createJobPreference);
      const response = await createJobPreference(reqBody, sessionTokenRef);
      if (!response.error) {
        console.log("Job preference created successfully:", response);
        alert("Job preference created successfully!");
        setRefreshData((prev) => !prev);
      }
    } catch (error){
      console.log("Failed to update job preference");
      alert(error.message);
    }
  };

  const modifyJobPreference = async (e) => {
    e.preventDefault();
    const jobPreferenceId = formData.jobPreferenceId;

    const reqBody = {
      locationPreference: formData.locationPreference,
      culturePreference: formData.culturePreference,
      salaryPreference: formData.salaryPreference,
      diversityPreference: formData.diversityPreference,
      workLifeBalancePreference: formData.workLifeBalancePreference,
    };

    try {
      const response = await updateJobPreference(
        jobPreferenceId,
        reqBody,
        sessionTokenRef
      );
      if(!response.error) {
        console.log("Job preference update successfully:", response);
        alert("Job preference update successfully!");
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      console.log("Failed to update job preference");
      alert(error.message);
    }
  };

  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        <EditAccountForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          saveChanges={saveChanges}
          session={session}
          removePdf={removePdf}
        />
        <JobPreferencePanel
          isJobPreferenceAbsent={isJobPreferenceAbsent}
          formData={formData}
          setFormData={setFormData}
          newJobPreferences={newJobPreferences}
          modifyJobPreference={modifyJobPreference}
        />
        <JobExperiencePanel />
      </div>
    );
  }
};

export default AccountManagement;
