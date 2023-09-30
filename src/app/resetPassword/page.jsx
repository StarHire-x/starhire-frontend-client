"use client";
import React from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { hashing } from "@/app/api/auth/register/route";
import { useSession } from "next-auth/react";
import { updateUserPassword } from "../api/auth/forgetPassword/route";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import Enums from "@/common/enums/enums";

const ResetPassword = () => {
  const router = useRouter();
  const session = useSession();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [storedToken, setStoredToken] = useState("");
  const [storedTokenExpiry, setStoredTokenExpiry] = useState("");
  const [storedRole, setStoredRole] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [storedUserId, setStoredUserId] = useState("");

  const [formData, setFormData] = useState({
    tokenId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (session.status === "authenticated") {
    router?.push("/dashboard");
  }

  useEffect(() => {
    const emailFromLocalStorage = localStorage.getItem("resetEmail");
    const token = localStorage.getItem("passwordResetToken");
    const tokenExpire = localStorage.getItem("passwordResetExpire");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    if (emailFromLocalStorage) {
      setFormData((prevData) => ({
        ...prevData,
        email: emailFromLocalStorage,
        role: role,
      }));
      setStoredEmail(emailFromLocalStorage);
    }
    if (token) {
      setStoredToken(token);
    }
    if (tokenExpire) {
      setStoredTokenExpiry(tokenExpire);
    }
    if (role) {
      setStoredRole(role);
    }
    if (userId) {
      setStoredUserId(userId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(false);
    const { tokenId, email, password, confirmPassword, role } = formData;

    if (!tokenId) {
      setErrorMessage("Please fill in your token ID!");
      return;
    } else if (!password) {
      setErrorMessage("Please fill in your password!");
      return;
    } else if (!confirmPassword) {
      setErrorMessage("Please confirm your password!");
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage("Please ensure that the password provided match!");
      return;
    } else if (Date.now() > Number(storedTokenExpiry)) {
      setErrorMessage("Your token has expired!");
      return;
    } else if (tokenId !== storedToken) {
      setErrorMessage("You have provided the wrong token ID!");
      return;
    } else if (email !== storedEmail) {
      setErrorMessage("You have provided the wrong email!");
      return;
    } else if (role !== storedRole) {
      setErrorMessage("You have selected the wrong role!");
      return;
    } else {
      const hashedPassword = await hashing(password);
      const resetPassword = {
        role: role,
        password: hashedPassword,
      };
      try {
        setLoading(true);
        const response = await updateUserPassword(resetPassword, storedUserId);
        alert("Password changed successfully");
        localStorage.removeItem("passwordResetToken");
        localStorage.removeItem("passwordResetExpire");
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        router.push("/login");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("An error occurred during password reset: ", error.message);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reset Password</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="tokenId"
          placeholder="Token Id"
          className={styles.input}
          value={formData.tokenId}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.input}
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.input}
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className={styles.input}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        <div className={styles.radio}>
          <p>I am a...</p>
          <RadioButton
            inputId={Enums.JOBSEEKER}
            name="role"
            value={Enums.JOBSEEKER}
            onChange={handleInputChange}
            checked={formData.role === Enums.JOBSEEKER}
            required
          />
          <label htmlFor={Enums.JOBSEEKER} className="ml-2">
            Job Seeker
          </label>
          <RadioButton
            inputId={Enums.CORPORATE}
            name="role"
            value={Enums.CORPORATE}
            onChange={handleInputChange}
            checked={formData.role === Enums.CORPORATE}
            required
          />
          <label htmlFor={Enums.CORPORATE} className="ml-2">
            Corporate
          </label>
        </div>
        {loading && (
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        )}
        {!loading && <button className={styles.button}>Reset Password</button>}
      </form>
      <Link href="/register">I don&apos;t have an account </Link>
      <Link href="/login">Login with an existing account</Link>
    </div>
  );
};

export default ResetPassword;
