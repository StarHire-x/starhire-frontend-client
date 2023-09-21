"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserByEmailRole, getUserByUserId } from "../api/auth/user/route";
import { uploadFile } from "../api/auth/upload/route";
import { updateUser } from "../api/auth/user/route";
import styles from "./page.module.css";
import { UserContext } from "@/context/UserContext";
import { RadioButton } from "primereact/radiobutton";

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
  });

  // this is to do a reload of userContext if it is updated in someway
  const { userData, fetchUserData } = useContext(UserContext);

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
    if (!file) return;
    try {
      const response = await uploadFile(file, sessionTokenRef);
      setFormData((prevState) => ({
        ...prevState,
        profilePictureUrl: response.url,
      }));
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    const userId = formData.userId;
    const email = formData.email;
    const userName = formData.userName;
    const fullName = formData.fullName;
    const homeAddress = formData.homeAddress;
    const companyName = formData.companyName;
    const dateOfBirth = formData.dateOfBirth;
    const contactNo = formData.contactNo;
    const companyAddress = formData.companyAddress;
    const profilePictureUrl = formData.profilePictureUrl;
    const notificationMode = formData.notificationMode;
    const status = formData.status;

    const updateUserDetails = {
      role: roleRef,
      email: email,
      userName: userName,
      fullName: fullName,
      homeAddress: homeAddress,
      companyName: companyName,
      companyAddress: companyAddress,
      contactNo: contactNo,
      dateOfBirth: dateOfBirth,
      profilePictureUrl: profilePictureUrl,
      notificationMode: notificationMode,
      status: status,
    };
    try {
      console.log(userId);
      console.log(updateUserDetails);
      const response = await updateUser(
        updateUserDetails,
        userId,
        sessionTokenRef
      );
      console.log("Status changed successfully:", response);
      alert("Status changed successfully!");

      setRefreshData((prev) => !prev);
      // this is to do a reload of userContext if it is updated so that navbar can change
      fetchUserData();
    } catch {
      console.log("Failed to update user");
      alert("Failed to update user particulars");
    }
  };

  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>My Account Details</h1>
        <form className={styles.form} onSubmit={saveChanges}>
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
              <label className={styles.label} htmlFor="userName">
                User Name:
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                className={styles.input}
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="contactNo">Contact Number:</label>
              <input
                type="number"
                id="contactNo"
                name="contactNo"
                className={styles.input}
                value={formData.contactNo}
                onChange={handleInputChange}
              />
            </div>
            {session.data.user.role === "Job_Seeker" && (
              <>
                <div className={styles.field}>
                  <label htmlFor="fullName">Full Name:</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={styles.input}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="homeAddress">Home Address:</label>
                  <input
                    type="text"
                    id="homeAddress"
                    name="homeAddress"
                    className={styles.input}
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="dateOfBirth">Date of Birth:</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className={styles.input}
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            {session.data.user.role === "Corporate" && (
              <>
                <div className={styles.field}>
                  <label htmlFor="companyName">Company Name:</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    className={styles.input}
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="companyAddress">Company Address:</label>
                  <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    className={styles.input}
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
            <div className={styles.fileField}>
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
                  inputId="notificationMode"
                  name="notificationMode"
                  value="Email"
                  onChange={handleInputChange}
                  checked={formData.notificationMode === "Email"}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Email
                </label>
                <br />
                <RadioButton
                  inputId="notificationMode"
                  name="notificationMode"
                  value="Sms"
                  onChange={handleInputChange}
                  checked={formData.notificationMode === "Sms"}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Sms
                </label>
              </div>

              <div className={styles.radioHeader}>
                <p>Status</p>
              </div>
              <div className={styles.radioOption}>
                <RadioButton
                  inputId="status"
                  name="status"
                  value="Active"
                  onChange={handleInputChange}
                  checked={formData.status === "Active"}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Active
                </label>
                <br />
                <RadioButton
                  inputId="status"
                  name="status"
                  value="Inactive"
                  onChange={handleInputChange}
                  checked={formData.status === "Inactive"}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.button}>Save Changes</button>
          </div>
        </form>
      </div>
    );
  }
};

export default AccountManagement;
