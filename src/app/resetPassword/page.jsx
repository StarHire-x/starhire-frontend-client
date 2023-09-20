"use client";
import React from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { hashing } from "@/app/api/auth/register/route";
import { useSession } from "next-auth/react";
import { updateUserPassword } from "../api/auth/forgetPassword/route";

const ResetPassword = () => {
  const router = useRouter();
  const session = useSession();

  const [err, setErr] = useState(false);
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

    const v1 = formData.password;
    const v2 = formData.confirmPassword;
    if (v1 !== v2) {
      // Display a validation message near the password fields
      setErr(true);
      alert("Password does not match");
      return; // Exit early if passwords don't match
    }

    const inputTokenId = formData.tokenId;
    const inputEmail = formData.email;
    const inputRole = formData.role;

    const dateTime = Date.now();

    if (dateTime > Number(storedTokenExpiry)) {
      setErr(true);
      alert("Token has expired");
      return;
    }

    if (
      inputTokenId !== storedToken ||
      inputEmail !== storedEmail ||
      inputRole !== storedRole
    ) {
      setErr(true);
      alert("Fields are incorrect");
      return;
    }

    const hashedPassword = await hashing(formData.password);
    const resetPassword = {
      role: inputRole,
      password: hashedPassword,
    };
    try {
      const response = await updateUserPassword(resetPassword, storedUserId);
      alert("Password changed successfully");
      localStorage.removeItem("passwordResetToken");
      localStorage.removeItem("passwordResetExpire");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      router.push("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reset Password</h1>
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
          <label>
            <input
              type="radio"
              name="role"
              value="Job_Seeker"
              checked={formData.role === "Job_Seeker"}
              onChange={handleInputChange}
            />
            Job Seeker
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Corporate"
              checked={formData.role === "Corporate"}
              onChange={handleInputChange}
            />
            Corporate
          </label>
        </div>
        <button className={styles.button}>Reset Password</button>
      </form>
      <Link href="/register">I don&apos;t have an account </Link>
      <Link href="/login">Login with an existing account</Link>
    </div>
  );
};

export default ResetPassword;
