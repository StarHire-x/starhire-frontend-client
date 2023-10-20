"use client";
import React, { useRef } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import Enums from "@/common/enums/enums";

const Login = () => {
  const session = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  if (session.status === "loading") {
    return (
      <div className={styles.loadingSession}>
        <ProgressSpinner />
      </div>
    );
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(false);
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
        setLoading(true);
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          role,
        });
        if (!result.error) {
          // User signed in successfully
          router.push("/dashboard");
          setLoading(false);
        } else {
          // Handle the error result.error
          console.error(`Login error: ${result.error}`);
          setLoading(false);
          setErrorMessage(result.error);
        }
      } catch (error) {
        console.error("An error occurred during authentication:", error);
        setLoading(false);
        setErrorMessage(error);
      }
    }
  };

  const handleRegister = async (e) => {
    setLoadingRegister(true);
    router.push("/register");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Join StarHire</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form className={styles.form}>
        <div className={styles.inputContainer}>
          <p>Email</p>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <p>Password</p>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={styles.input}
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.showPasswordButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          <Link className={styles.forgotPassword} href="/forgetPassword">
            Forgot Password?
          </Link>
        </div>

        <div className={styles.radio}>
          <p>I am a:</p>
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
        {!loading && (
          <button className={styles.button} onClick={handleSubmit}>
            Sign in
          </button>
        )}
      </form>
      <div className={styles.orContainer}>
        <div className={styles.orSeparator}></div>
        <span className={styles.orText}>or</span>
        <div className={styles.orSeparator}></div>
      </div>
      {loadingRegister && <ProgressSpinner style={{ width: "50px", height: "50px" }} />}
      {!loadingRegister && (
        <button className={styles.registerButton} onClick={handleRegister}>
          New to StarHire? Join Now!
        </button>
      )}
    </div>
  );
};

export default Login;
