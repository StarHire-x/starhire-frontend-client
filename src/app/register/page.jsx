"use client";
import React, { useDeferredValue } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hashing } from "@/app/api/auth/register/route";
import { registerUser } from "@/app/api/auth/register/route";
import { createUser } from "../api/auth/user/route";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import Enums from "@/common/enums/enums";
import { useSession } from "next-auth/react";

// const Step1 = ({ formData, setFormData, onNext }) => {
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleNext = () => {
//     setErrorMessage("");
//     const { role, userName, email } = formData;
//     if (!role) {
//       setErrorMessage("Please fill in your role!");
//       return;
//     } else if (!userName) {
//       setErrorMessage("Please fill in your username!");
//       return;
//     } else if (!email) {
//       setErrorMessage("Please fill in your email!");
//       return;
//     } else {
//       onNext();
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.subTitle}>User Information</h2>
//       {errorMessage && <p className={styles.error}>{errorMessage}</p>}
//       <form className={styles.form}>
//         <div className={styles.userRole}>
//           <div>
//             <p>I am registering as a:</p>
//           </div>

//           <div className={styles.radio}>
//             <RadioButton
//               inputId={Enums.JOBSEEKER}
//               name="role"
//               value={Enums.JOBSEEKER}
//               onChange={handleInputChange}
//               checked={formData.role === Enums.JOBSEEKER}
//               required
//             />
//             <label htmlFor={Enums.JOBSEEKER} className="ml-2">
//               Job Seeker
//             </label>
//             <RadioButton
//               inputId={Enums.CORPORATE}
//               name="role"
//               value={Enums.CORPORATE}
//               onChange={handleInputChange}
//               checked={formData.role === Enums.CORPORATE}
//               required
//             />
//             <label htmlFor={Enums.CORPORATE} className="ml-2">
//               Corporate
//             </label>
//           </div>
//         </div>

//         <div className={styles.inputFields}>
//           <input
//             type="text"
//             name="userName"
//             placeholder="Username"
//             className={styles.input}
//             value={formData.userName}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className={styles.input}
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <button className={styles.button} onClick={handleNext}>
//           Next
//         </button>
//       </form>
//     </div>
//   );
// };

// const Step2 = ({ formData, setFormData, onNext, onPrevious }) => {
//   const [errorMessage, setErrorMessage] = useState("");
//   const handleNext = () => {
//     setErrorMessage("");
//     const { password, confirmPassword } = formData;
//     if (!password || !confirmPassword) {
//       setErrorMessage("Please fill in your password!");
//       return;
//     } else if (password !== confirmPassword) {
//       setErrorMessage("The passwords provided do not match!");
//       return;
//     } else {
//       onNext();
//     }
//   };

//   const handlePrevious = () => {
//     onPrevious();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.subTitle}>Create Your Password</h2>
//       {errorMessage && <p className={styles.error}>{errorMessage}</p>}
//       <form className={styles.form}>
//         <div className={styles.inputFields}>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className={styles.input}
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm password"
//             className={styles.input}
//             value={formData.confirmPassword}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//       </form>
//       <div className={styles.stepTwoThreeButton}>
//         <button className={styles.previousButton} onClick={handlePrevious}>
//           Previous
//         </button>
//         <div className={styles.spacer}></div>
//         <button className={styles.button} onClick={handleNext}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// const Step3 = ({ formData, setFormData, onPrevious, onSubmit, err }) => {
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     const { contactNumber } = formData;
//     if (!contactNumber) {
//       setErrorMessage("Please fill in your Contact Number!");
//       return;
//     }
//     const contactNumberPattern = /^\d{8}$/;
//     const isValidNumber = contactNumberPattern.test(contactNumber);
//     if (!isValidNumber) {
//       setErrorMessage("Please enter a valid 8-digit phone number.");
//       return;
//     }

//     if (formData.role === Enums.CORPORATE) {
//       const { companyRegistrationId } = formData;
//       if (!companyRegistrationId) {
//         setErrorMessage("Please fill in your UEN Number!");
//         return;
//       }
//       const uenPattern = /^\d{9,10}$/;
//       const isValidUen = uenPattern.test(companyRegistrationId);
//       if (!isValidUen) {
//         setErrorMessage("UEN has to be between 9 - 10 digits long.");
//         return;
//       }
//     }
//     onSubmit(e);
//   };

//   const handlePrevious = () => {
//     onPrevious();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.subTitle}>Additional Information</h2>
//       {errorMessage && <p className={styles.error}>{errorMessage}</p>}
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <div className={styles.inputFields}>
//           <input
//             type="text"
//             name="contactNumber"
//             placeholder="Contact Number"
//             className={styles.input}
//             value={formData.contactNumber}
//             onChange={handleInputChange}
//             required
//           />
//           {formData.role === Enums.CORPORATE && (
//             <input
//               type="text"
//               name="companyRegistrationId"
//               placeholder="UEN"
//               className={styles.input}
//               value={formData.companyRegistrationId}
//               onChange={handleInputChange}
//               required
//             />
//           )}
//         </div>
//         <div className={styles.stepTwoThreeButton}>
//           <button className={styles.previousButton} onClick={handlePrevious}>
//             Previous
//           </button>
//           <div className={styles.spacer}></div>
//           <button className={styles.button}>Register</button>
//         </div>
//       </form>
//     </div>
//   );
// };

const Register = () => {
  const router = useRouter();
  const session = useSession();

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
