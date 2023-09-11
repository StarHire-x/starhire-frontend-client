'use client';
import Link from 'next/link';
import React from 'react';
import styles from './navbar.module.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { signOut, useSession } from 'next-auth/react';

const links = [
  {
    id: 1,
    title: 'Home',
    url: '/',
  },
  {
    id: 2,
    title: 'Portfolio',
    url: '/portfolio',
  },
  {
    id: 3,
    title: 'Manage Job Listings',
    url: '/jobListingManagement',
  },
  {
    id: 4,
    title: 'Blog',
    url: '/blog',
  },
  {
    id: 5,
    title: 'About',
    url: '/about',
  },
  {
    id: 6,
    title: 'Contact',
    url: '/contact',
  },
  {
    id: 7,
    title: 'Dashboard',
    url: '/dashboard',
  },
];

const Navbar = () => {
  const session = useSession();

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        StarHire Client
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />
        {links.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}
        {session.status === 'authenticated' && (
          <>
            <h2> {session.data.user.name} </h2>
            <h3> {session.data.user.role} </h3>
            <button className={styles.logout} onClick={signOut}>
              Logout
            </button>
          </>
        )}
        {session.status === 'unauthenticated' && (
          <button
            className={styles.login}
            onClick={() => (window.location.href = '/login')}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
