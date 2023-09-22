"use client";
import React from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { headers } from "../../../next.config";
import bcrypt from "bcryptjs";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";

const Login = () => {
  const session = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (session.status === "loading") {
    return <ProgressSpinner />;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    if (!email) {
      setErrorMessage("Please fill in your email!");
      return;
    } else if (!password) {
      setErrorMessage("Please fill in your password!");
      return;
    } else if (!role) {
      setErrorMessage("Please fill in your role!");
      return;
    } else {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          role,
        });
        if (!result.error) {
          // User signed in successfully
          router.push("/dashboard");
        } else {
          // Handle the error result.error
          console.error(`Login error: ${result.error}`);
          setErrorMessage(result.error);
        }
      } catch (error) {
        console.error("An error occurred during authentication:", error);
        setErrorMessage(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.input}
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <div className={styles.radio}>
          <p>I am a:</p>
          <RadioButton
            inputId="Job_Seeker"
            name="role"
            value="Job_Seeker"
            onChange={handleInputChange}
            checked={formData.role === "Job_Seeker"}
            required
          />
          <label htmlFor="Job_Seeker" className="ml-2">
            Job Seeker
          </label>
          <RadioButton
            inputId="Corporate"
            name="role"
            value="Corporate"
            onChange={handleInputChange}
            checked={formData.role === "Corporate"}
            required
          />
          <label htmlFor="Corporate" className="ml-2">
            Corporate
          </label>
          {/* <label>
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
          </label> */}
        </div>
        <button className={styles.button}>Login</button>
      </form>
      <Link href="/register">I don&apos;t have an account </Link>
      <Link href="/forgetPassword">Forget Password</Link>
    </div>
  );
};

export default Login;
