"use client";
import React from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { forgetPassword, sendEmail } from "../api/auth/forgetPassword/route";
import ReactLoading from "react-loading";

const ForgetPassword = () => {
  const session = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false)
    setErrorMessage("")
    const email = formData.email;
    const role = formData.role;

    if (!email) {
      setErrorMessage("Please fill in your email!");
      return;
    } else if (!role) {
      setErrorMessage("Please fill in your role!");
      return;
    } else {
      try {
        setLoading(true);
        const result = await forgetPassword(email, role);
        if (!result.error) {
          router.push("/resetPassword");
          setLoading(false);
        }
      } catch (error) {
        console.error("An error occurred during password reset:", error);
        setErrorMessage(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Forget Password</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {loading && (
        <div className={styles.loadingContainer}>
          <ReactLoading type="bars" color="white"/>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.input}
          value={formData.email}
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

export default ForgetPassword;
