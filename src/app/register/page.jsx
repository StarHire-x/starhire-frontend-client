"use client";

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hashing } from "@/app/api/auth/register/route";
import { registerUser } from "@/app/api/auth/register/route";

const Register = () => {
  const [err, setErr] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    companyRegistrationId: "",
    role: "",
  })

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    const v1 = formData.password;
    const v2 = formData.confirmPassword;
    if (v1 !== v2) {
      // Display a validation message near the password fields
      setErr(true);
      return; // Exit early if passwords don't match
    }

    // const hashedPassword = await hashing(formData.password);
    const data = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      contactNo: formData.contactNumber,
      companyRegistrationId: formData.companyRegistrationId,
      role: formData.role,
    };

    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message);
        throw new Error(errorData.message);
      }
      alert("Account has been created!")
      router.push("/login?success=Account has been created");
    } catch (err) {
      // Handle errors more gracefully (e.g., display an error message to the user)
      console.error("Fetch error:", err);
      alert(err);
      setErr(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registration</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          className={styles.input}
          value={formData.userName}
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
          placeholder="Confirm password"
          className={styles.input}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          className={styles.input}
          value={formData.contactNumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="companyRegistrationId"
          placeholder="Company Registration ID (Corporate Only)"
          className={styles.inputCompanyRegistrationIdField}
          value={formData.companyRegistrationId}
          onChange={handleInputChange}
          required={formData.role === "Corporate"}
        />
        <div className={styles.radio}>
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
        <button className={styles.button}>Register</button>
        {err && "Something went wrong!"}
      </form>
      <Link href="/login">Login with an existing account</Link>
      <Link href="/forgetPassword">Forget Password</Link>
    </div>
  );
};

export default Register;