"use client";
import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "../api/auth/user/route";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import Enums from "@/common/enums/enums";
import { useSession } from "next-auth/react";
import { Toast } from "primereact/toast";

const Register = () => {
  const router = useRouter();
  const session = useSession();
  const toast = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    userName: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const { userName, email, password, role } = formData;

    if (!userName) {
      setErrorMessage("Please fill in your username!");
      return;
    } else if (!email) {
      setErrorMessage("Please fill in your email!");
      return;
    } else if (!password) {
      setErrorMessage("Please fill in your password!");
      return;
    } else if (!role) {
      setErrorMessage("Please select your role!");
      return;
    } else {
      const data = {
        userName: userName,
        email: email,
        password: password,
        role: role,
      };

      try {
        setLoading(true);
        const response = await createUser(data);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);
          setErrorMessage(errorData.error);
          setLoading(false);
        } else {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "You have registered successfully!",
            life: 5000,
          });
          router.push("/login?success=Account has been created");
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage(error);
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <h1 className={styles.title}>Find or Be the next StarHire</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form className={styles.form}>
        <div className={styles.inputContainer}>
          <p>Username</p>
          <input
            type="text"
            name="userName"
            className={styles.input}
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
        </div>
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
            Join StarHire
          </button>
        )}
      </form>
      <div className={styles.signInContainer}>
        <div>
          <p>Already on StarHire?</p>
        </div>
        <Link href="/login" className={styles.signInLink}>
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
