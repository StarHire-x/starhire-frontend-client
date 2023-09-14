'use client';
import React from 'react';
import styles from './page.module.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const session = useSession();

  const router = useRouter();

  console.log(session);

  if (session.status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session.status === 'unauthenticated') {
    router?.push('/login');
  }

  if (session.status === 'authenticated') {
    return (
      <h1>
        Welcome back {session.data.user.name}, {session.data.user.email},{' '}
        {session.data.user.image}, {session.data.user.role}, {session.data.user.userId}
      </h1>
    );
  }
};

export default Dashboard;
