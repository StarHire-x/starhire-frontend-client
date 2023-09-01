"use client"
import React from 'react'
import styles from './page.module.css'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const Login = () => {

  const session = useSession();
  const router = useRouter();

  if(session.status === "loading") {
    return <p>Loading ....</p>
  }

  if(session.status === "authenticated") {
    router?.push("/dashboard");
  }

  const handleSubmit = async (e) => {
    const email = e.target[0].value;
    const password = e.target[1].value;
    alert(`Email: ${email}, Password: ${password}`);

    signIn("credentials", { email, password });
  };
  
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="password"
          className={styles.input}
          required
        />
        <button className={styles.button}>Login</button>
      </form>
      <Link href="/register">I don't have an account </Link>
      <button onClick={() => signIn("google")}>Login with Google</button>
    </div>
  )
}

export default Login;