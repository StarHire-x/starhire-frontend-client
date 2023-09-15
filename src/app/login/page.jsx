'use client';
import React from 'react';
import styles from './page.module.css';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { headers } from '../../../next.config';
import bcrypt from 'bcryptjs';

const Login = () => {
  const session = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (session.status === 'loading') {
    return <p>Loading ....</p>;
  }

  if (session.status === 'authenticated') {
    router?.push('/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    const role = formData.role;

    if (!email || !password | !role) {
      alert("Please fill in your email, password and your role!");
      return;
    }
 
    const result = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
      role: role,
    });

    if (!result.error) {
      // User signed in successfully
      router.push('/dashboard');
    } else {
      // Handle the error result.error
      alert("Authentication failed! Please try again.");
      console.error(`Login error: ${result.error}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
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
          <p>
            I am a...
          </p>
          <label>
            <input
              type="radio"
              name="role"
              value="Job_Seeker"
              checked={formData.role === 'Job_Seeker'}
              onChange={handleInputChange}
            />
            Job Seeker
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Corporate"
              checked={formData.role === 'Corporate'}
              onChange={handleInputChange}
            />
            Corporate
          </label>
        </div>
        <button className={styles.button}>Login</button>
      </form>
      <Link href="/register">I don&apos;t have an account </Link>
      <Link href="/forgetPassword">Forget Password</Link>
    </div>
  );
};

export default Login;
